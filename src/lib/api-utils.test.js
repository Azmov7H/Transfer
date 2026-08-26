/**
 * Fetcher regression matrix (FE-TEST-003).
 *
 * Locks the behavior-critical semantics fixed by FE-DATA-001 (dedup),
 * FE-DATA-002 (timeout) and FE-AUTH-001 (single 401 redirect):
 *   - {success,data} envelope unwrapping
 *   - JammazApiError throws carry status/message
 *   - GET requests deduplicate; mutations never do
 *   - timeout aborts into a 408 JammazApiError with isTimeout
 *   - 401 outside /api/auth/* triggers exactly one hard redirect to
 *     /login?expired=1 (module-level guard); 401 on auth endpoints and
 *     all 403s never redirect.
 *
 * The module owns module-level state (dedup map, redirect guard), so every
 * test loads a fresh instance via loadFresh(). CJS style per next/jest SWC.
 */

function loadFresh() {
    jest.resetModules();
    const mod = require('./api-utils');
    return {
        fetcher: mod.fetcher,
        DEFAULT_TIMEOUT_MS: mod.DEFAULT_TIMEOUT_MS,
        JammazApiError: mod.JammazApiError,
        __internals: mod.__internals,
    };
}

function jsonResponse(body, { status = 200 } = {}) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    };
}

function installLocation(pathname = '/dashboard') {
    const replace = jest.fn();
    const { fetcher, __internals } = loadFresh();
    // Redirect + pathname go through the __internals seam (see api-utils.js
    // note) — window.location itself is non-configurable under jsdom.
    __internals.redirectToLogin = (url) => replace(url);
    __internals.currentPathname = () => pathname;
    return { replace, fetcher, restore() { /* fresh module per test — nothing to undo */ } };
}

describe('fetcher — envelope contract', () => {
    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('unwraps a successful envelope and returns data directly', async () => {
        const { fetcher } = loadFresh();
        global.fetch = jest.fn().mockResolvedValue(
            jsonResponse({ success: true, data: { id: 'x' } })
        );

        await expect(fetcher('/api/things')).resolves.toEqual({ id: 'x' });
    });

    it('returns non-envelope payloads untouched', async () => {
        const { fetcher } = loadFresh();
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({ plain: true }));

        await expect(fetcher('/api/plain')).resolves.toEqual({ plain: true });
    });

    it('throws JammazApiError when success is false', async () => {
        const { fetcher, JammazApiError } = loadFresh();
        global.fetch = jest.fn().mockResolvedValue(
            jsonResponse({ success: false, message: 'فشل التحقق' }, { status: 200 })
        );

        await expect(fetcher('/api/things')).rejects.toThrow(JammazApiError);
        await expect(fetcher('/api/things')).rejects.toMatchObject({
            message: 'فشل التحقق',
            status: 200,
        });
    });

    it('survives invalid JSON on ok responses by returning raw body fallback', async () => {
        const { fetcher } = loadFresh();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => { throw new Error('bad json'); },
        });

        // Invalid JSON becomes { success:false, message } → JammazApiError
        await expect(fetcher('/api/weird')).rejects.toMatchObject({
            message: 'Invalid JSON response from server',
        });
    });
});

describe('fetcher — error mapping', () => {
    it('maps non-ok statuses onto JammazApiError with server message', async () => {
        const { fetcher, JammazApiError } = loadFresh();
        global.fetch = jest.fn().mockResolvedValue(
            jsonResponse({ message: 'غير موجود' }, { status: 404 })
        );

        const err = await fetcher('/api/missing').catch((e) => e);
        expect(err).toBeInstanceOf(JammazApiError);
        expect(err.status).toBe(404);
        expect(err.message).toBe('غير موجود');
    });

    it('falls back to the Arabic connection-error message', async () => {
        const { fetcher } = loadFresh();
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, { status: 500 }));

        await expect(fetcher('/api/boom')).rejects.toMatchObject({
            message: 'خطأ في الاتصال بالخادم',
            status: 500,
        });
    });
});

describe('fetcher — deduplication (FE-DATA-001)', () => {
    it('coalesces identical concurrent GETs into one request', async () => {
        const { fetcher } = loadFresh();
        const spy = jest.fn().mockResolvedValue(
            jsonResponse({ success: true, data: { n: 1 } })
        );
        global.fetch = spy;

        const [a, b] = await Promise.all([
            fetcher('/api/list'),
            fetcher('/api/list'),
        ]);
        expect(a).toEqual(b);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('never coalesces mutations even with identical bodies', async () => {
        const { fetcher } = loadFresh();
        const spy = jest.fn().mockResolvedValue(
            jsonResponse({ success: true, data: {} })
        );
        global.fetch = spy;

        const body = JSON.stringify({ qty: 2 });
        await Promise.all([
            fetcher('/api/invoices', { method: 'POST', body }),
            fetcher('/api/invoices', { method: 'POST', body }),
        ]);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('does not share promises across different URLs', async () => {
        const { fetcher } = loadFresh();
        const spy = jest.fn().mockImplementation((url) =>
            Promise.resolve(jsonResponse({ success: true, data: { url } }))
        );
        global.fetch = spy;

        await Promise.all([fetcher('/api/a'), fetcher('/api/b')]);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('skips dedup when an external signal exists', async () => {
        const { fetcher } = loadFresh();
        const spy = jest.fn().mockResolvedValue(
            jsonResponse({ success: true, data: {} })
        );
        global.fetch = spy;

        const signal = new AbortController().signal;
        await Promise.all([
            fetcher('/api/sig', { signal }),
            fetcher('/api/sig', { signal }),
        ]);
        expect(spy).toHaveBeenCalledTimes(2);
    });
});

describe('fetcher — timeout (FE-DATA-002)', () => {
    it('aborts into a 408 JammazApiError flagged isTimeout', async () => {
        jest.useFakeTimers();
        const { fetcher, JammazApiError } = loadFresh();
        global.fetch = jest.fn((_url, init) => new Promise((_resolve, reject) => {
            init.signal.addEventListener('abort', () =>
                reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
            );
        }));

        const pending = fetcher('/api/slow');
        const assertion = expect(pending).rejects.toMatchObject({
            status: 408,
            isTimeout: true,
            name: 'JammazApiError',
        });
        jest.advanceTimersByTime(30000);
        await assertion;
    });
});

describe('fetcher — session expiry redirect (FE-AUTH-001)', () => {
    let restoreLocation;

    afterEach(() => {
        if (restoreLocation) restoreLocation();
        restoreLocation = null;
    });

function freshWithLocation(pathname) {
    const loc = installLocation(pathname);
    restoreLocation = loc.restore;
    // installLocation already loaded the fresh module and wired its seam —
    // do NOT load again (resetModules would discard the patch).
    return { replace: loc.replace, fetcher: loc.fetcher };
}

    it('redirects exactly once on 401 from a protected endpoint', async () => {
        const { replace, fetcher } = freshWithLocation('/dashboard');
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, { status: 401 }));

        await fetcher('/api/customers').catch(() => {});
        expect(replace).toHaveBeenCalledTimes(1);
        expect(replace).toHaveBeenCalledWith('/login?expired=1');
    });

    it('the guard blocks a second redirect within the same session', async () => {
        const { replace, fetcher } = freshWithLocation('/dashboard');
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, { status: 401 }));
        // Same module instance as the previous call in this test:
        global.fetch.mockResolvedValue(jsonResponse({}, { status: 401 }));

        await fetcher('/api/a').catch(() => {});
        await fetcher('/api/b').catch(() => {});
        expect(replace).toHaveBeenCalledTimes(1);
    });

    it('never redirects while already on /login', async () => {
        const { replace, fetcher } = freshWithLocation('/login');
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, { status: 401 }));

        await fetcher('/api/customers').catch(() => {});
        expect(replace).not.toHaveBeenCalled();
    });

    it('never redirects for auth endpoints themselves', async () => {
        const { replace, fetcher } = freshWithLocation('/dashboard');
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, { status: 401 }));

        await fetcher('/api/auth/session').catch(() => {});
        await fetcher('/api/auth/login').catch(() => {});
        expect(replace).not.toHaveBeenCalled();
    });

    it('treats 403 as authorization failure — no redirect', async () => {
        const { replace, fetcher } = freshWithLocation('/dashboard');
        global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, { status: 403 }));

        await fetcher('/api/users').catch(() => {});
        expect(replace).not.toHaveBeenCalled();
    });
});

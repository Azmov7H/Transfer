/**
 * Custom Error class for Jammaz API interactions
 */
export class JammazApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'JammazApiError';
        this.status = status;
        this.data = data;
    }

    get isValidationError() {
        return this.status === 400;
    }

    get isUnauthorized() {
        return this.status === 401 || this.status === 403;
    }
}

// Request deduplication map
const pendingRequests = new Map();

// Session-expiry redirect guard — ensures exactly one redirect per expired session
let isRedirectingToLogin = false;

function handleSessionExpiry() {
    if (typeof window === 'undefined' || isRedirectingToLogin) return;
    if (window.location.pathname.startsWith('/login')) return;
    isRedirectingToLogin = true;
    // Hard navigation: full remount clears the React Query cache along with all client state
    window.location.replace('/login?expired=1');
}

function getRequestKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body || '';
    return `${method}:${url}:${body}`;
}

export const DEFAULT_TIMEOUT_MS = 30000;

export async function fetcher(url, options = {}) {
    const {
        params, // New: Support for query parameters as object
        cache = 'default',
        revalidate = undefined,
        tags = [],
        skipDeduplication = false,
        timeout = DEFAULT_TIMEOUT_MS,
        signal: externalSignal,
        ...fetchOptions
    } = options;

    let finalUrl = url;

    // 1. Handle Query Parameters
    if (params) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, value);
            }
        });
        const queryString = query.toString();
        if (queryString) {
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
        }
    }

    // 2. Base URL & Environment Handling
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (process.env.NODE_ENV !== 'production' && baseUrl.includes(':5050')) {
        baseUrl = '';
    }

    if (baseUrl && url.startsWith('/') && !url.startsWith('//')) {
        finalUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${finalUrl}`;
    }

    // 3. Request Deduplication (GET only — mutations must never be coalesced)
    const requestKey = getRequestKey(finalUrl, fetchOptions);
    const isGet = !fetchOptions.method || fetchOptions.method === 'GET';
    // Never share a deduplicated promise when a caller signal exists — an abort would leak to all waiters
    const shouldDeduplicate = !skipDeduplication && isGet && !externalSignal;

    if (shouldDeduplicate && pendingRequests.has(requestKey)) {
        return pendingRequests.get(requestKey).promise;
    }

    // 4. Headers & Config
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (cache === 'no-store' || revalidate === 0) {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
    }

    const config = {
        ...fetchOptions,
        headers,
        cache,
        credentials: fetchOptions.credentials || 'include',
        next: {
            revalidate,
            tags,
            ...(fetchOptions.next || {})
        }
    };

    // 5. Execution (caller signal + timeout composed into one controller)
    const fetchPromise = (async () => {
        const controller = new AbortController();
        let timedOut = false;

        const onExternalAbort = () => controller.abort(externalSignal.reason);
        if (externalSignal) {
            if (externalSignal.aborted) {
                controller.abort(externalSignal.reason);
            } else {
                externalSignal.addEventListener('abort', onExternalAbort, { once: true });
            }
        }

        const timeoutId = setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, timeout);

        try {
            const res = await fetch(finalUrl, { ...config, signal: controller.signal });

            // Handle Global Session Expiry (401 only — 403 is an authorization issue, not a session one)
            if (res.status === 401 && !url.startsWith('/api/auth')) {
                handleSessionExpiry();
            }

            let response;
            try {
                response = await res.json();
            } catch (e) {
                response = { success: false, message: 'Invalid JSON response from server' };
            }

            if (!res.ok) {
                throw new JammazApiError(
                    response.message || response.error || 'خطأ في الاتصال بالخادم',
                    res.status,
                    response.data
                );
            }

            // Standardize Response Unwrapping
            if (response && typeof response === 'object' && 'success' in response) {
                if (response.success) {
                    return response.data;
                } else {
                    throw new JammazApiError(response.message || 'API Error', res.status, response.data);
                }
            }

            return response;
        } catch (err) {
            if (timedOut || (err && err.name === 'TimeoutError')) {
                throw Object.assign(
                    new JammazApiError('انتهت مهلة الاتصال بالخادم', 408),
                    { isTimeout: true }
                );
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
            if (externalSignal) {
                externalSignal.removeEventListener('abort', onExternalAbort);
            }
            if (shouldDeduplicate) pendingRequests.delete(requestKey);
        }
    })();

    if (shouldDeduplicate) {
        pendingRequests.set(requestKey, { promise: fetchPromise, timestamp: Date.now() });
    }

    return fetchPromise;
}

export const api = {
    get: (url, params, options = {}) => fetcher(url, { ...options, method: 'GET', params }),
    post: (url, body, options = {}) => fetcher(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    }),
    put: (url, body, options = {}) => fetcher(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    }),
    delete: (url, options = {}) => fetcher(url, { ...options, method: 'DELETE' }),
    patch: (url, body, options = {}) => fetcher(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(body),
    }),
};



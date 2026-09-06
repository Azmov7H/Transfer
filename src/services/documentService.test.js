/**
 * documentService unit tests (T-FE-SVC-001 / T-FE-SVC-002).
 *
 * The functions tested here are pure with respect to URL construction
 * and filter compaction; we mock `fetch` to avoid hitting the network.
 */
import {
    DOCUMENT_TYPES,
    OUTPUT_FORMATS,
    getDocumentData,
    exportDocument,
    exportDocumentPost,
    previewDocument,
    downloadBlob,
} from './documentService';

const OID = 'a'.repeat(24);

function makeJsonResponse(body, { status = 200, headers = {} } = {}) {
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: {
            get: (k) => headers[k.toLowerCase()] ?? null,
        },
        json: async () => body,
        blob: async () => new Blob([JSON.stringify(body)], { type: 'application/json' }),
    };
}

describe('documentService — constants', () => {
    test('exposes the 15 document types', () => {
        expect(Object.keys(DOCUMENT_TYPES)).toHaveLength(15);
        expect(DOCUMENT_TYPES.SALE_INVOICE).toBe('SALE_INVOICE');
    });

    test('exposes the 5 output formats', () => {
        expect(Object.values(OUTPUT_FORMATS).sort()).toEqual(
            ['csv', 'html', 'pdf', 'print', 'xlsx']
        );
    });
});

describe('getDocumentData — URL construction', () => {
    let fetchMock;
    beforeEach(() => {
        fetchMock = jest.fn().mockResolvedValue(
            makeJsonResponse({ success: true, data: { type: 'SALE_INVOICE' } })
        );
        global.fetch = fetchMock;
    });
    afterEach(() => { delete global.fetch; });

    test('builds the right path for an id-driven document', async () => {
        await getDocumentData(DOCUMENT_TYPES.SALE_INVOICE, OID);
        const url = fetchMock.mock.calls[0][0];
        expect(url).toContain('/api/documents/SALE_INVOICE/');
        expect(url).toContain(OID);
    });

    test('omits the id for aggregate documents', async () => {
        await getDocumentData(DOCUMENT_TYPES.COMPANY_FINANCIAL_STATEMENT, undefined, { from: '2026-01-01' });
        const url = fetchMock.mock.calls[0][0];
        expect(url).toContain('/api/documents/COMPANY_FINANCIAL_STATEMENT/data?');
        expect(url).not.toContain('/COMPANY_FINANCIAL_STATEMENT/null');
        expect(url).toContain('from=2026-01-01');
    });

    test('compacts empty / null / undefined filters', async () => {
        await getDocumentData(DOCUMENT_TYPES.CUSTOMER_ACCOUNT_STATEMENT, OID, {
            from: '2026-01-01',
            to: '',
            unused: null,
            keep: 'yes',
        });
        const url = fetchMock.mock.calls[0][0];
        expect(url).toContain('from=2026-01-01');
        expect(url).toContain('keep=yes');
        expect(url).not.toContain('to=');
        expect(url).not.toContain('unused=');
    });

    test('accepts an AbortSignal in options (the fetcher composes it internally)', async () => {
        const ac = new AbortController();
        // The shared fetcher (lib/api-utils) wraps the caller's signal with
        // its own timeout controller — we only verify the call doesn't throw
        // when a signal is passed and that the request is issued.
        await expect(
            getDocumentData(
                DOCUMENT_TYPES.SALE_INVOICE,
                OID,
                {},
                { signal: ac.signal }
            )
        ).resolves.toEqual({ type: 'SALE_INVOICE' });
        expect(fetchMock).toHaveBeenCalled();
    });
});

describe('exportDocument — fetch + filename', () => {
    let fetchMock;
    beforeEach(() => {
        fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: {
                get: (k) => {
                    if (k.toLowerCase() === 'content-disposition') {
                        return 'attachment; filename="SALE_INVOICE_aaaa_2026-08-30.pdf"';
                    }
                    return null;
                },
            },
            blob: async () => new Blob(['PDFBIN'], { type: 'application/pdf' }),
        });
        global.fetch = fetchMock;
    });
    afterEach(() => { delete global.fetch; });

    test('returns the blob and the parsed filename', async () => {
        const { blob, filename } = await exportDocument(
            DOCUMENT_TYPES.SALE_INVOICE, OID, OUTPUT_FORMATS.PDF
        );
        expect(blob).toBeInstanceOf(Blob);
        expect(filename).toBe('SALE_INVOICE_aaaa_2026-08-30.pdf');
    });

    test('appends format to the query string', async () => {
        await exportDocument(DOCUMENT_TYPES.SALE_INVOICE, OID, OUTPUT_FORMATS.PDF);
        const url = fetchMock.mock.calls[0][0];
        expect(url).toContain('format=pdf');
    });

    test('falls back to a synthesized filename when Content-Disposition is missing', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => null },
            blob: async () => new Blob(['X']),
        });
        const { filename } = await exportDocument(
            DOCUMENT_TYPES.SALE_INVOICE, OID, OUTPUT_FORMATS.XLSX
        );
        expect(filename).toMatch(/^SALE_INVOICE_[a-f0-9]{24}_\d{4}-\d{2}-\d{2}\.xlsx$/);
    });

    test('throws a friendly Arabic error on failure', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 400,
            headers: { get: () => null },
            json: async () => ({ success: false, message: 'صيغة غير مدعومة' }),
            blob: async () => new Blob(),
        });
        await expect(
            exportDocument(DOCUMENT_TYPES.SALE_INVOICE, OID, 'docx')
        ).rejects.toThrow(/صيغة غير مدعومة/);
    });
});

describe('exportDocumentPost — body-driven filters', () => {
    let fetchMock;
    beforeEach(() => {
        fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            headers: { get: () => 'attachment; filename="X.pdf"' },
            blob: async () => new Blob(['X']),
        });
        global.fetch = fetchMock;
    });
    afterEach(() => { delete global.fetch; });

    test('POSTs JSON body with format + filters', async () => {
        await exportDocumentPost(
            DOCUMENT_TYPES.COMPANY_FINANCIAL_STATEMENT,
            undefined,
            OUTPUT_FORMATS.XLSX,
            { from: '2026-01-01', to: '2026-12-31', type: 'INCOME' }
        );
        const init = fetchMock.mock.calls[0][1];
        expect(init.method).toBe('POST');
        const body = JSON.parse(init.body);
        expect(body.format).toBe('xlsx');
        expect(body.from).toBe('2026-01-01');
        expect(body.to).toBe('2026-12-31');
        expect(body.type).toBe('INCOME');
    });

    test('includes credentials so the JWT cookie is sent', async () => {
        await exportDocumentPost(
            DOCUMENT_TYPES.COMPANY_FINANCIAL_STATEMENT,
            undefined,
            OUTPUT_FORMATS.PDF
        );
        const init = fetchMock.mock.calls[0][1];
        expect(init.credentials).toBe('include');
    });
});

describe('previewDocument — opens the right URL', () => {
    const originalOpen = window.open;
    afterEach(() => { window.open = originalOpen; });

    test('opens the document URL in a new tab', () => {
        const open = jest.fn();
        window.open = open;
        previewDocument(DOCUMENT_TYPES.SALE_INVOICE, OID);
        expect(open).toHaveBeenCalledWith(
            expect.stringContaining('/api/documents/SALE_INVOICE/' + OID),
            '_blank',
            expect.any(String)
        );
    });

    test('appends autoprint=1 when requested', () => {
        const open = jest.fn();
        window.open = open;
        previewDocument(DOCUMENT_TYPES.SALE_INVOICE, OID, {}, { autoPrint: true });
        const url = open.mock.calls[0][0];
        expect(url).toContain('autoprint=1');
    });

    test('appends filters as query string', () => {
        const open = jest.fn();
        window.open = open;
        previewDocument(
            DOCUMENT_TYPES.CUSTOMER_ACCOUNT_STATEMENT,
            OID,
            { from: '2026-01-01', to: '2026-12-31', unused: '' }
        );
        const url = open.mock.calls[0][0];
        expect(url).toContain('from=2026-01-01');
        expect(url).toContain('to=2026-12-31');
        expect(url).not.toContain('unused=');
    });
});

describe('downloadBlob', () => {
    const originalCreate = window.URL.createObjectURL;
    const originalRevoke = window.URL.revokeObjectURL;
    let clickSpy;
    let anchor;
    let createElementSpy;

    beforeEach(() => {
        clickSpy = jest.fn();
        anchor = document.createElement('a');
        jest.spyOn(anchor, 'click').mockImplementation(clickSpy);
        createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
            if (tag === 'a') return anchor;
            return document.createElement.__wrappedFn?.(tag) ?? anchor;
        });

        window.URL.createObjectURL = jest.fn(() => 'blob:mock');
        window.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
        window.URL.createObjectURL = originalCreate;
        window.URL.revokeObjectURL = originalRevoke;
        createElementSpy.mockRestore();
    });

    test('clicks an anchor with the right href + download', () => {
        const blob = new Blob(['X']);
        downloadBlob(blob, 'file.pdf');

        expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
        expect(anchor.href).toBe('blob:mock');
        expect(anchor.download).toBe('file.pdf');
        expect(clickSpy).toHaveBeenCalled();
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
    });
});

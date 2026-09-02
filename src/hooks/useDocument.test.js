/**
 * useDocument hook tests (T-FE-HOOK-001).
 *
 * Locks:
 *  - query is disabled when no id and no non-empty filters
 *  - query is enabled when an id is present
 *  - query is enabled when at least one filter has a value
 *  - the returned `document` is the unwrapped data, not the api envelope
 */
jest.mock('@/services/documentService', () => ({
    getDocumentData: (...args) => mockGetDocumentData(...args),
    DOCUMENT_TYPES: { SALE_INVOICE: 'SALE_INVOICE', COMPANY_FINANCIAL_STATEMENT: 'COMPANY_FINANCIAL_STATEMENT' },
}));

const { renderHook, waitFor } = require('@testing-library/react');
const React = require('react');
const { QueryClientProvider } = require('@tanstack/react-query');
const { useDocument } = require('./useDocument');
const { createTestQueryClient } = require('@/test/utils');

const mockGetDocumentData = jest.fn();
const OID = 'a'.repeat(24);

function hookWithClient(type, id, filters) {
    const client = createTestQueryClient();
    const wrapper = ({ children }) => (
        React.createElement(QueryClientProvider, { client }, children)
    );
    return { ...renderHook(() => useDocument(type, id, filters), { wrapper }), client };
}

describe('useDocument', () => {
    beforeEach(() => {
        mockGetDocumentData.mockReset();
    });

    test('does not fetch when type is missing', async () => {
        hookWithClient(undefined, OID, {});
        await new Promise((r) => setTimeout(r, 30));
        expect(mockGetDocumentData).not.toHaveBeenCalled();
    });

    test('does not fetch when type is given but neither id nor any filter', async () => {
        hookWithClient('SALE_INVOICE', undefined, {});
        await new Promise((r) => setTimeout(r, 30));
        expect(mockGetDocumentData).not.toHaveBeenCalled();
    });

    test('fetches when an id is provided', async () => {
        mockGetDocumentData.mockResolvedValue({ data: { type: 'SALE_INVOICE', number: 'X' } });
        const { result } = hookWithClient('SALE_INVOICE', OID, {});
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetDocumentData).toHaveBeenCalledWith(
            'SALE_INVOICE', OID, {}, expect.any(Object)
        );
        // The `document` field is the unwrapped inner payload.
        expect(result.current.document).toEqual({ type: 'SALE_INVOICE', number: 'X' });
    });

    test('fetches for an aggregate document with at least one filter', async () => {
        mockGetDocumentData.mockResolvedValue({ data: { rows: [] } });
        const { result } = hookWithClient(
            'COMPANY_FINANCIAL_STATEMENT', undefined, { from: '2026-01-01' }
        );
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetDocumentData).toHaveBeenCalledWith(
            'COMPANY_FINANCIAL_STATEMENT', undefined,
            { from: '2026-01-01' }, expect.any(Object)
        );
    });

    test('skips empty / null filters when deciding to fetch', async () => {
        const { result } = hookWithClient(
            'COMPANY_FINANCIAL_STATEMENT', undefined,
            { from: '', to: null, type: undefined }
        );
        await new Promise((r) => setTimeout(r, 30));
        expect(mockGetDocumentData).not.toHaveBeenCalled();
        expect(result.current.isFetching).toBe(false);
    });

    test('surfaces the API error message', async () => {
        mockGetDocumentData.mockRejectedValue(new Error('BANG'));
        const { result } = hookWithClient('SALE_INVOICE', OID, {});
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toBe('BANG');
    });
});

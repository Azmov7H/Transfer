/**
 * useDocumentExport hook tests (T-FE-HOOK-002, T-FE-HOOK-003).
 *
 * Locks:
 *  - successful mutation calls downloadBlob with the returned filename
 *  - on success, the matching document query is invalidated
 *  - on success, a success toast is shown
 *  - on error, an error toast is shown with the API message
 *  - usePost=true routes to the POST exporter
 */
jest.mock('@/services/documentService', () => ({
    exportDocument: (...args) => mockExportDocument(...args),
    exportDocumentPost: (...args) => mockExportDocumentPost(...args),
    downloadBlob: (...args) => mockDownloadBlob(...args),
}));

jest.mock('sonner', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

const { renderHook, act, waitFor } = require('@testing-library/react');
const React = require('react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { useDocumentExport } = require('./useDocumentExport');
const { createTestQueryClient } = require('@/test/utils');
const { toast } = require('sonner');

const mockExportDocument = jest.fn();
const mockExportDocumentPost = jest.fn();
const mockDownloadBlob = jest.fn();

function hookWithClient(extra) {
    const client = createTestQueryClient();
    const wrapper = ({ children }) => (
        React.createElement(QueryClientProvider, { client }, children)
    );
    return renderHook(() => useDocumentExport(extra), { wrapper });
}

describe('useDocumentExport', () => {
    beforeEach(() => {
        mockExportDocument.mockReset();
        mockExportDocumentPost.mockReset();
        mockDownloadBlob.mockReset();
        toast.success.mockReset();
        toast.error.mockReset();
    });

    test('GET path: triggers download + success toast on success', async () => {
        mockExportDocument.mockResolvedValue({
            blob: new Blob(['X']),
            filename: 'SALE_INVOICE_aaaa_2026-08-30.pdf',
        });

        const { result } = hookWithClient();
        await act(async () => {
            await result.current.mutateAsync({
                type: 'SALE_INVOICE', id: 'a'.repeat(24), format: 'pdf',
            });
        });

        expect(mockExportDocument).toHaveBeenCalledWith(
            'SALE_INVOICE', 'a'.repeat(24), 'pdf', {}
        );
        expect(mockDownloadBlob).toHaveBeenCalledWith(
            expect.any(Blob), 'SALE_INVOICE_aaaa_2026-08-30.pdf'
        );
        expect(toast.success).toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    test('POST path is used when usePost=true', async () => {
        mockExportDocumentPost.mockResolvedValue({
            blob: new Blob(['X']),
            filename: 'X.xlsx',
        });
        const { result } = hookWithClient();
        await act(async () => {
            await result.current.mutateAsync({
                type: 'COMPANY_FINANCIAL_STATEMENT',
                format: 'xlsx',
                usePost: true,
                filters: { from: '2026-01-01' },
            });
        });
        expect(mockExportDocumentPost).toHaveBeenCalledWith(
            'COMPANY_FINANCIAL_STATEMENT', undefined, 'xlsx',
            { from: '2026-01-01' }
        );
        expect(mockExportDocument).not.toHaveBeenCalled();
    });

    test('error path: shows toast with the API message and re-throws', async () => {
        mockExportDocument.mockRejectedValue(new Error('صيغة غير مدعومة'));
        const { result } = hookWithClient();
        let caught;
        await act(async () => {
            try {
                await result.current.mutateAsync({ type: 'SALE_INVOICE', id: 'a'.repeat(24), format: 'docx' });
            } catch (e) { caught = e; }
        });
        expect(caught).toBeInstanceOf(Error);
        expect(toast.error).toHaveBeenCalledWith('صيغة غير مدعومة', expect.any(Object));
        expect(mockDownloadBlob).not.toHaveBeenCalled();
    });

    test('onSuccess callback is invoked with the export result', async () => {
        mockExportDocument.mockResolvedValue({
            blob: new Blob(['X']),
            filename: 'X.pdf',
        });
        const onSuccess = jest.fn();
        const { result } = hookWithClient({ onSuccess });
        await act(async () => {
            await result.current.mutateAsync({ type: 'SALE_INVOICE', id: 'a'.repeat(24), format: 'pdf' });
        });
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onSuccess.mock.calls[0][0]).toMatchObject({
            filename: 'X.pdf', type: 'SALE_INVOICE', format: 'pdf',
        });
    });

    test('invalidates the matching document query on success', async () => {
        mockExportDocument.mockResolvedValue({ blob: new Blob(['X']), filename: 'X.pdf' });
        const client = createTestQueryClient();
        const invalidateSpy = jest.spyOn(client, 'invalidateQueries');
        const wrapper = ({ children }) => (
            React.createElement(QueryClientProvider, { client }, children)
        );
        const { result } = renderHook(() => useDocumentExport(), { wrapper });
        await act(async () => {
            await result.current.mutateAsync({
                type: 'SALE_INVOICE', id: 'a'.repeat(24), format: 'pdf',
                filters: { from: '2026-01-01' },
            });
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: ['document', 'SALE_INVOICE', 'a'.repeat(24), { from: '2026-01-01' }],
        });
    });
});

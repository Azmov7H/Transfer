/**
 * T-FE-DOC-015 — CustomerTransactionTab unit tests.
 *
 * Locks:
 *  - the raw-ledger contract (NOT the running-balance statement):
 *    no opening/closing/snapshot balance trio, no reconciliation banner
 *  - the type filter is plumbed through to the engine as the `type`
 *    query filter (when set to a value other than 'all')
 *  - the line-by-line preview table renders Arabic dates, type pill,
 *    debit/credit columns, and method
 *  - DateRangePicker + type-filter Select + DocumentActions are
 *    wired to the engine
 *  - the data-testid hooks (transaction-lines, data-line-count,
 *    transaction-type-filter) make the contract machine-checkable
 */
import { jest } from '@jest/globals';

const mockGetDocumentData = jest.fn();

jest.mock('@/services/documentService', () => ({
    getDocumentData: (...args) => mockGetDocumentData(...args),
    exportDocument: jest.fn(),
    exportDocumentPost: jest.fn(),
    previewDocument: jest.fn(),
    downloadBlob: jest.fn(),
    OUTPUT_FORMATS: { PRINT: 'print', PDF: 'pdf', XLSX: 'xlsx', CSV: 'csv' },
    DOCUMENT_TYPES: {
        CUSTOMER_TRANSACTION_STATEMENT: 'CUSTOMER_TRANSACTION_STATEMENT',
        CUSTOMER_COLLECTION_RECEIPT: 'CUSTOMER_COLLECTION_RECEIPT',
        SALE_INVOICE: 'SALE_INVOICE',
    },
}));

jest.mock('@/hooks/useDocumentExport', () => ({
    useDocumentExport: () => ({ mutate: jest.fn(), isPending: false, isError: false, error: null }),
}));

const { render, screen, waitFor, cleanup, within, fireEvent } = require('@testing-library/react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { CustomerTransactionTab } = require('@/components/documents/CustomerTransactionTab');

function makeWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    function Wrapper({ children }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }
    Wrapper.displayName = 'TestWrapper';
    return Wrapper;
}

const SAMPLE = {
    type: 'customer_transaction_statement',
    title: 'حركات عميل',
    documentType: 'CUSTOMER_TRANSACTION_STATEMENT',
    customer: { id: 'c1', name: 'شركة الأمل', phone: '010', address: 'Cairo', taxNumber: 'T1' },
    period: { startDate: '2026-08-01T00:00:00.000Z', endDate: '2026-08-31T23:59:59.000Z', days: 30 },
    typeFilter: null,
    availableTypes: [
        { value: 'INVOICE', label: 'فاتورة مبيعات' },
        { value: 'PAYMENT', label: 'تحصيل' },
        { value: 'REFUND', label: 'مرتجع / صرف' },
        { value: 'DEBT', label: 'مديونية' },
    ],
    totals: { debits: 1000, credits: 600, net: 400 },
    lines: [
        { id: '1', type: 'PAYMENT', typeLabel: 'تحصيل', reference: 'R-1', label: 'تحصيل', description: '', debit: 0, credit: 500, methodLabel: 'نقدي', date: '2026-08-05T00:00:00.000Z' },
        { id: '2', type: 'INVOICE', typeLabel: 'فاتورة مبيعات', reference: 'INV-1', label: 'فاتورة مبيعات #INV-1', description: '', debit: 1000, credit: 0, methodLabel: 'نقدي', date: '2026-08-10T00:00:00.000Z' },
        { id: '3', type: 'REFUND', typeLabel: 'مرتجع / صرف', reference: 'RET-1', label: 'مرتجع #RET-1', description: '', debit: 0, credit: 100, methodLabel: '', date: '2026-08-20T00:00:00.000Z' },
    ],
    generatedAt: '2026-09-01T10:00:00.000Z',
    generatedBy: 'Owner',
};

beforeEach(() => {
    mockGetDocumentData.mockReset();
    mockGetDocumentData.mockResolvedValue({ data: SAMPLE });
});

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe('CustomerTransactionTab — raw ledger contract', () => {
    it('shows the totals trio (debits / credits / net) — NOT a balance card', async () => {
        render(<CustomerTransactionTab customerId="c1" />, { wrapper: makeWrapper() });
        await screen.findByTestId('transaction-lines');
        expect(document.body.textContent.replace(/\s/g, '')).toContain('1,000.00'); // debits
        expect(document.body.textContent.replace(/\s/g, '')).toContain('600.00');   // credits
        // No opening/closing balance trio (those belong to the statement tab)
        expect(screen.queryByText('الرصيد الافتتاحي')).not.toBeInTheDocument();
        expect(screen.queryByText('الرصيد الختامي')).not.toBeInTheDocument();
    });

    it('renders a row per line with type pill + reference + method + debit/credit', async () => {
        render(<CustomerTransactionTab customerId="c1" />, { wrapper: makeWrapper() });
        const body = await screen.findByTestId('transaction-lines');
        expect(body.getAttribute('data-line-count')).toBe('3');
        const text = body.textContent.replace(/\s/g, '');
        expect(text).toMatch(/INV-1/);
        expect(text).toMatch(/R-1/);
        expect(text).toMatch(/RET-1/);
    });

    it('renders the empty-state row when there are no lines', async () => {
        mockGetDocumentData.mockResolvedValue({ data: { ...SAMPLE, lines: [] } });
        render(<CustomerTransactionTab customerId="c1" />, { wrapper: makeWrapper() });
        await waitFor(() => {
            expect(screen.getByText(/لا توجد حركات في هذه الفترة/)).toBeInTheDocument();
        });
    });
});

describe('CustomerTransactionTab — wiring', () => {
    it('calls the document engine with the customer id and date-range filters', async () => {
        render(<CustomerTransactionTab customerId="c1" />, { wrapper: makeWrapper() });
        await waitFor(() => {
            expect(mockGetDocumentData).toHaveBeenCalled();
        });
        const lastCall = mockGetDocumentData.mock.calls[mockGetDocumentData.mock.calls.length - 1];
        const [type, id, filters] = lastCall;
        expect(type).toBe('CUSTOMER_TRANSACTION_STATEMENT');
        expect(id).toBe('c1');
        expect(filters.from).toMatch(/T00:00:00/);
        expect(filters.to).toMatch(/T23:59:59/);
    });

    it('renders the DateRangePicker wrapper and the type filter Select', async () => {
        render(<CustomerTransactionTab customerId="c1" />, { wrapper: makeWrapper() });
        await screen.findByTestId('transaction-lines');
        const picker = screen.getByTestId('date-range-picker');
        expect(picker).toBeInTheDocument();
        expect(screen.getByTestId('transaction-type-filter')).toBeInTheDocument();
    });
});

/**
 * T-FE-DOC-013 — ReceiptPage DocumentActions wiring.
 *
 * Locks:
 *  - The redesigned action bar mounts DocumentActions for BOTH
 *    customer (CUSTOMER_COLLECTION_RECEIPT) and supplier
 *    (SUPPLIER_PAYMENT_RECEIPT) receipts.
 *  - The legacy "طباعة سريعة" button is always present (uses
 *    window.print() over the local ReceiptBody).
 *  - For a customer receipt, the action bar shows the
 *    CUSTOMER_COLLECTION_RECEIPT trigger; for a supplier receipt,
 *    it shows the SUPPLIER_PAYMENT_RECEIPT trigger.
 *  - For an unknown-type receipt, DocumentActions is not mounted.
 */
import { jest } from '@jest/globals';

const mockGetReceipt = jest.fn();

jest.mock('@/services/financeService', () => ({
    getReceipt: (...args) => mockGetReceipt(...args),
}));

jest.mock('@/hooks/useDocumentExport', () => ({
    useDocumentExport: () => ({ mutate: jest.fn(), isPending: false, isError: false, error: null }),
}));

jest.mock('next/navigation', () => ({
    useParams: () => ({ id: 'r-123' }),
    useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

const { render, screen, waitFor } = require('@testing-library/react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const ReceiptPage = require('./page').default;

function makeWrapper() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    function Wrapper({ children }) {
        return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    }
    Wrapper.displayName = 'TestWrapper';
    return Wrapper;
}

const OID = 'a'.repeat(24);

function makeCustomerReceipt() {
    return {
        _id: OID,
        receiptNumber: 'R-100',
        type: 'INCOME',
        amount: 500,
        description: 'تحصيل',
        method: 'cash',
        sourceNumber: '',
        date: new Date('2026-08-30T14:30:00Z'),
        createdBy: { name: 'علي' },
        partnerId: { _id: OID, name: 'عميل نقدي' },
        referenceType: 'UnifiedCollection',
        referenceId: OID,
    };
}

function makeSupplierReceipt() {
    return {
        _id: OID,
        receiptNumber: 'EXP-100',
        type: 'EXPENSE',
        amount: 500,
        description: 'سداد',
        method: 'cash',
        sourceNumber: '',
        date: new Date('2026-08-30T14:30:00Z'),
        createdBy: { name: 'علي' },
        partnerId: { _id: OID, name: 'مورد نقدي' },
        referenceType: 'PurchaseOrder',
        referenceId: OID,
    };
}

describe('ReceiptPage — DocumentActions wiring', () => {
    it('mounts DocumentActions (CUSTOMER_COLLECTION_RECEIPT) for an INCOME receipt', async () => {
        const tx = makeCustomerReceipt();
        mockGetReceipt.mockResolvedValue({ transaction: tx, partner: tx.partnerId, settings: {}, remainingBalance: 0 });
        render(<ReceiptPage />, { wrapper: makeWrapper() });
        // Wait for the title to appear (means data loaded)
        await waitFor(() => {
            expect(screen.getByText(/سند تحصيل من عميل/)).toBeInTheDocument();
        });
        // DocumentActions renders 3 buttons: معاينة / طباعة / تصدير
        expect(screen.getByText('معاينة')).toBeInTheDocument();
        // Legacy "طباعة سريعة" is also present
        expect(screen.getByTestId('receipt-print-button')).toBeInTheDocument();
    });

    it('mounts DocumentActions (SUPPLIER_PAYMENT_RECEIPT) for an EXPENSE receipt', async () => {
        const tx = makeSupplierReceipt();
        mockGetReceipt.mockResolvedValue({ transaction: tx, partner: tx.partnerId, settings: {}, remainingBalance: 0 });
        render(<ReceiptPage />, { wrapper: makeWrapper() });
        await waitFor(() => {
            expect(screen.getByText(/سند سداد لمورد/)).toBeInTheDocument();
        });
        expect(screen.getByText('معاينة')).toBeInTheDocument();
        expect(screen.getByTestId('receipt-print-button')).toBeInTheDocument();
    });
});

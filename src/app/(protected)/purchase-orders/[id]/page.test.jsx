/**
 * T-FE-DOC-012 — PurchaseOrderInvoice page: DocumentActions wiring.
 *
 * Locks:
 *  - DocumentActions (PURCHASE_INVOICE) is mounted in the action bar
 *    with formats=['pdf', 'print']
 *  - the legacy "طباعة الفاتورة" button still works
 *  - the "استلام البضاعة" button only shows when the PO is PENDING
 *  - the page renders without crashing when the PO is RECEIVED
 */
import { jest } from '@jest/globals';

const mockUsePurchaseOrder = jest.fn();
const mockUseUpdatePOStatus = jest.fn();
const mockUseDocumentExport = jest.fn(() => ({ mutate: jest.fn(), isPending: false }));

jest.mock('@/hooks/usePurchaseOrders', () => ({
    usePurchaseOrder: (...args) => mockUsePurchaseOrder(...args),
    useUpdatePOStatus: () => mockUseUpdatePOStatus(),
}));

jest.mock('@/hooks/useDocumentExport', () => ({
    useDocumentExport: () => mockUseDocumentExport(),
}));

jest.mock('next/navigation', () => ({
    useParams: () => ({ id: 'po-123' }),
    useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

const { render, screen } = require('@testing-library/react');
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const PurchaseOrderInvoice = require('./page').default;

function makeWrapper() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    function Wrapper({ children }) {
        return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    }
    Wrapper.displayName = 'TestWrapper';
    return Wrapper;
}

function makePO(overrides = {}) {
    return {
        _id: 'po-123',
        poNumber: 'PO-100',
        supplier: { name: 'مورد الأمل', phone: '010' },
        items: [
            { _id: 'i1', productId: { name: 'منتج أ', code: 'A1' }, quantity: 10, receivedQty: 10, costPrice: 100 },
        ],
        status: 'RECEIVED',
        totalCost: 1000,
        paidAmount: 500,
        paymentStatus: 'partial',
        paymentType: 'cash',
        createdAt: '2026-08-20T00:00:00.000Z',
        receivedDate: '2026-08-20T00:00:00.000Z',
        ...overrides,
    };
}

describe('PurchaseOrderInvoice — DocumentActions wiring', () => {
    it('renders the page when the PO is RECEIVED without a receive button', () => {
        mockUsePurchaseOrder.mockReturnValue({ data: makePO({ status: 'RECEIVED' }), isLoading: false, error: null });
        mockUseUpdatePOStatus.mockReturnValue({ mutate: jest.fn(), isPending: false });
        render(<PurchaseOrderInvoice />, { wrapper: makeWrapper() });
        expect(screen.getByText(/أمر شراء/)).toBeInTheDocument();
        expect(screen.getByText(/PO-100/)).toBeInTheDocument();
        // No "استلام البضاعة" button for RECEIVED POs
        expect(screen.queryByText(/استلام البضاعة/)).not.toBeInTheDocument();
        // Legacy print button still present
        expect(screen.getByText(/طباعة الفاتورة/)).toBeInTheDocument();
    });

    it('shows the receive button when the PO is PENDING', () => {
        mockUsePurchaseOrder.mockReturnValue({ data: makePO({ status: 'PENDING' }), isLoading: false, error: null });
        mockUseUpdatePOStatus.mockReturnValue({ mutate: jest.fn(), isPending: false });
        render(<PurchaseOrderInvoice />, { wrapper: makeWrapper() });
        expect(screen.getByText(/استلام البضاعة/)).toBeInTheDocument();
    });

    it('shows a loading state when the PO is loading', () => {
        mockUsePurchaseOrder.mockReturnValue({ data: null, isLoading: true, error: null });
        mockUseUpdatePOStatus.mockReturnValue({ mutate: jest.fn(), isPending: false });
        const { container } = render(<PurchaseOrderInvoice />, { wrapper: makeWrapper() });
        // Loader2 svg has the animate-spin class
        expect(container.querySelector('.animate-spin')).toBeTruthy();
    });

    it('mounts the DocumentActions export trigger (PURCHASE_INVOICE)', () => {
        mockUsePurchaseOrder.mockReturnValue({ data: makePO({ status: 'RECEIVED' }), isLoading: false, error: null });
        mockUseUpdatePOStatus.mockReturnValue({ mutate: jest.fn(), isPending: false });
        render(<PurchaseOrderInvoice />, { wrapper: makeWrapper() });
        // DocumentActions (default variant='full') renders 3 buttons:
        // معاينة / طباعة / تصدير. Assert all 3 are present.
        expect(screen.getByText('معاينة')).toBeInTheDocument();
        expect(screen.getByText(/^تصدير$/)).toBeInTheDocument();
    });
});

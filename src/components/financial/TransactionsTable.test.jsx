/**
 * TransactionsTable ACL integration (FE-AUTH-003): the manual-transaction
 * delete action must be owner-only, mirroring backend `DELETE
 * /api/financial/transaction/:id` (`roleMiddleware(['owner'])`).
 *
 * CJS style — required for jest.mock hoisting under next/jest (SWC).
 */
jest.mock('@/hooks/useUserRole', () => ({
    useUserRole: jest.fn(),
}));

const React = require('react');
const { screen, fireEvent } = require('@testing-library/react');
const { ROLES } = require('@/lib/permissions');
const { useUserRole } = require('@/hooks/useUserRole');
const { TransactionsTable } = require('./TransactionsTable');
const { renderWithProviders } = require('@/test/utils');

const manualTx = {
    _id: '64b000000000000000000001',
    type: 'EXPENSE',
    amount: 500,
    description: 'مصاريف',
    method: 'cash',
    sourceNumber: '',
    referenceType: 'Manual',
    date: '2026-08-30T10:00:00.000Z',
};

function renderTable(role) {
    useUserRole.mockReturnValue({ role, loading: false });
    return renderWithProviders(
        React.createElement(TransactionsTable, {
            transactions: [manualTx],
            typeFilter: 'ALL',
            onTypeFilterChange: () => {},
            onTxClick: () => {},
            onDelete: () => {},
            isDeleting: false,
        })
    );
}

describe('TransactionsTable delete ACL', () => {
    it('shows the delete action for owner (backend owner-only DELETE)', () => {
        renderTable(ROLES.OWNER);
        expect(screen.getByLabelText('حذف الحركة')).toBeInTheDocument();
    });

    it('hides the delete action for manager, matching backend 403', () => {
        renderTable(ROLES.MANAGER);
        expect(screen.queryByLabelText('حذف الحركة')).not.toBeInTheDocument();
    });

    it('keeps the details action visible for all roles', () => {
        renderTable(ROLES.MANAGER);
        expect(screen.getByLabelText('تفاصيل الحركة')).toBeInTheDocument();
    });
});

describe('TransactionsTable pagination', () => {
    function renderPaged(props = {}) {
        useUserRole.mockReturnValue({ role: ROLES.OWNER, loading: false });
        return renderWithProviders(
            React.createElement(TransactionsTable, {
                transactions: [manualTx],
                typeFilter: 'ALL',
                onTypeFilterChange: () => {},
                onTxClick: () => {},
                onDelete: () => {},
                isDeleting: false,
                page: 1,
                totalPages: 3,
                total: 250,
                onPageChange: () => {},
                ...props,
            })
        );
    }

    it('shows page position and total, advancing on next', () => {
        const onPageChange = jest.fn();
        renderPaged({ onPageChange });
        expect(screen.getByText(/صفحة 1 من 3/)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /التالي/ }));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('disables previous on the first page and next on the last', () => {
        renderPaged({ page: 1 });
        expect(screen.getByRole('button', { name: /السابق/ })).toBeDisabled();
        expect(screen.getByRole('button', { name: /التالي/ })).not.toBeDisabled();
    });

    it('hides the pager for a single page', () => {
        renderPaged({ totalPages: 1 });
        expect(screen.queryByRole('button', { name: /التالي/ })).not.toBeInTheDocument();
    });
});

describe('TransactionsTable unified collections', () => {
    const ucTx = {
        ...manualTx,
        _id: '64b000000000000000000002',
        type: 'INCOME',
        referenceType: 'UnifiedCollection',
        referenceId: { _id: '64c000000000000000000001', name: 'عميل مجمع' },
        description: 'تحصيل مجمع - عميل مجمع',
    };

    it('links the customer instead of showing ---', () => {
        useUserRole.mockReturnValue({ role: ROLES.MANAGER, loading: false });
        renderWithProviders(
            React.createElement(TransactionsTable, {
                transactions: [ucTx],
                typeFilter: 'ALL',
                onTypeFilterChange: () => {},
                onTxClick: () => {},
                onDelete: () => {},
                isDeleting: false,
            })
        );
        expect(screen.getByRole('link', { name: 'عميل مجمع' })).toHaveAttribute(
            'href',
            '/customers/64c000000000000000000001'
        );
        expect(screen.getAllByText('تحصيل مجمع').length).toBeGreaterThanOrEqual(2);
    });
});

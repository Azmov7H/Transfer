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
const { screen } = require('@testing-library/react');
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

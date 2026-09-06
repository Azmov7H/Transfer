const React = require('react');
const { screen } = require('@testing-library/react');
const { renderWithProviders } = require('@/test/utils');
const { MethodBalancesCard } = require('./MethodBalancesCard');
const { PeriodPerformanceCard } = require('./PeriodPerformanceCard');
const { DebtSnapshotCard } = require('./DebtSnapshotCard');

describe('treasury dashboard panels', () => {
    test('MethodBalancesCard shows every method including negatives', () => {
        renderWithProviders(
            React.createElement(MethodBalancesCard, {
                breakdown: { cash: 1000, bank: -200, wallet: 0, instapay: 300, check: 50 },
                total: 1150,
            })
        );
        for (const label of ['كاش', 'بنك', 'محفظة', 'انستا باي', 'شيك']) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
        expect(screen.getAllByText(/1,150/).length).toBeGreaterThanOrEqual(2);
    });

    test('PeriodPerformanceCard shows the income/expense equation and full split', () => {
        renderWithProviders(
            React.createElement(PeriodPerformanceCard, {
                income: 10000,
                expense: 6000,
                net: 4000,
                supplierPayments: 3000,
                shopExpenses: 2000,
                salesProfit: 3500,
                transactionCount: 42,
            })
        );
        expect(screen.getByText('دفعات موردين')).toBeInTheDocument();
        expect(screen.getByText('مصروفات المتجر')).toBeInTheDocument();
        expect(screen.getByText('مصروفات أخرى')).toBeInTheDocument();
        expect(screen.getByText(/4,000/)).toBeInTheDocument();
    });

    test('DebtSnapshotCard links to the debt center', () => {
        renderWithProviders(React.createElement(DebtSnapshotCard, { totalDebt: 7500 }));
        expect(screen.getByText(/7,500/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'مركز الديون والمستحقات' })).toHaveAttribute(
            'href',
            '/financial/debt-center'
        );
    });

    test('DebtSnapshotCard celebrates a zero balance', () => {
        renderWithProviders(React.createElement(DebtSnapshotCard, { totalDebt: 0 }));
        expect(screen.getByText('لا توجد مستحقات معلقة')).toBeInTheDocument();
    });
});

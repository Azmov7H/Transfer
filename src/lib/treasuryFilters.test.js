import {
    isSupplierPaymentTx,
    isShopExpenseTx,
    matchesTypeFilter,
    exportFiltersFor,
} from './treasuryFilters';

describe('treasuryFilters taxonomy', () => {
    const po = { type: 'EXPENSE', referenceType: 'PurchaseOrder' };
    const supplierDebt = { type: 'EXPENSE', referenceType: 'Debt', referenceId: { debtorType: 'Supplier' } };
    const customerDebtExpense = { type: 'EXPENSE', referenceType: 'Debt', referenceId: { debtorType: 'Customer' } };
    const manualExpense = { type: 'EXPENSE', referenceType: 'Manual' };
    const salesReturn = { type: 'EXPENSE', referenceType: 'SalesReturn' };
    const income = { type: 'INCOME', referenceType: 'Invoice' };

    test('supplier payments: purchase orders + supplier debts only', () => {
        expect(isSupplierPaymentTx(po)).toBe(true);
        expect(isSupplierPaymentTx(supplierDebt)).toBe(true);
        expect(isSupplierPaymentTx(customerDebtExpense)).toBe(false);
        expect(isSupplierPaymentTx(manualExpense)).toBe(false);
        expect(isSupplierPaymentTx(income)).toBe(false);
    });

    test('shop expenses: manual + sales returns only', () => {
        expect(isShopExpenseTx(manualExpense)).toBe(true);
        expect(isShopExpenseTx(salesReturn)).toBe(true);
        expect(isShopExpenseTx(po)).toBe(false);
        expect(isShopExpenseTx(income)).toBe(false);
    });

    test('matchesTypeFilter routes each view', () => {
        expect(matchesTypeFilter(po, 'SUPPLIER_PAYMENTS')).toBe(true);
        expect(matchesTypeFilter(manualExpense, 'SUPPLIER_PAYMENTS')).toBe(false);
        expect(matchesTypeFilter(manualExpense, 'SHOP_EXPENSES')).toBe(true);
        expect(matchesTypeFilter(po, 'SHOP_EXPENSES')).toBe(false);
        expect(matchesTypeFilter(income, 'INCOME')).toBe(true);
        expect(matchesTypeFilter(po, 'INCOME')).toBe(false);
        expect(matchesTypeFilter(po, 'EXPENSE')).toBe(true);
        expect(matchesTypeFilter(income, 'ALL')).toBe(true);
    });

    test('exportFiltersFor never leaks UI-only keys as type', () => {
        const range = { startDate: '2026-08-01', endDate: '2026-08-31' };
        expect(exportFiltersFor('ALL', range)).toEqual(range);
        expect(exportFiltersFor('INCOME', range)).toEqual({ ...range, type: 'INCOME' });
        expect(exportFiltersFor('EXPENSE', range)).toEqual({ ...range, type: 'EXPENSE' });
        expect(exportFiltersFor('SUPPLIER_PAYMENTS', range)).toEqual({ ...range, category: 'supplier_payments' });
        expect(exportFiltersFor('SHOP_EXPENSES', range)).toEqual({ ...range, category: 'shop_expenses' });
    });
});

/**
 * Treasury dashboard taxonomy — single source of truth shared by the
 * transaction table filter, the stat-card subtitles and the CSV export.
 *
 * A transaction is a supplier payment when it is an EXPENSE posted against
 * a purchase order or a Supplier debt; a shop expense when it is an
 * EXPENSE from a manual entry or a sales return. This mirrors the
 * server-side aggregation in TreasuryService.getSummary and the
 * `category` filter in ExportService so every surface always agrees.
 */

export const isSupplierPaymentTx = (tx) =>
    tx.type === 'EXPENSE' &&
    (tx.referenceType === 'PurchaseOrder' ||
        (tx.referenceType === 'Debt' && tx.referenceId?.debtorType === 'Supplier'));

export const isShopExpenseTx = (tx) =>
    tx.type === 'EXPENSE' &&
    (tx.referenceType === 'Manual' || tx.referenceType === 'SalesReturn');

export function matchesTypeFilter(tx, typeFilter) {
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'INCOME') return tx.type === 'INCOME';
    if (typeFilter === 'EXPENSE') return tx.type === 'EXPENSE';
    if (typeFilter === 'SHOP_EXPENSES') return isShopExpenseTx(tx);
    if (typeFilter === 'SUPPLIER_PAYMENTS') return isSupplierPaymentTx(tx);
    return true;
}

/**
 * Map the on-screen table filter to export-service filters.
 * SHOP/SUPPLIER views use the server-side `category` taxonomy (exact
 * row match); plain INCOME/EXPENSE use the `type` column. Sending the
 * raw UI keys as `type` would match zero rows server-side.
 */
export function exportFiltersFor(typeFilter, dateRange = {}) {
    const filters = { ...dateRange };
    if (typeFilter === 'INCOME' || typeFilter === 'EXPENSE') {
        filters.type = typeFilter;
    } else if (typeFilter === 'SUPPLIER_PAYMENTS') {
        filters.category = 'supplier_payments';
    } else if (typeFilter === 'SHOP_EXPENSES') {
        filters.category = 'shop_expenses';
    }
    return filters;
}

/**
 * Accounting Service — owns the /api/accounting endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

export const ACCOUNTS = {
    // Assets
    CASH: 'الخزينة / النقدية',
    BANK: 'البنك / الحساب البنكي',
    INVENTORY: 'المخزون',
    RECEIVABLES: 'ذمم العملاء / المدينون',

    // Liabilities
    PAYABLES: 'ذمم الموردين / الدائنون',

    // Revenue
    SALES_REVENUE: 'إيرادات المبيعات',
    OTHER_INCOME: 'إيرادات أخرى',

    // Expenses
    COGS: 'تكلفة البضاعة المباعة',
    RENT_EXPENSE: 'مصروف الإيجار',
    UTILITIES_EXPENSE: 'مصروف الكهرباء والماء',
    SALARIES_EXPENSE: 'مصروف الرواتب',
    SUPPLIES_EXPENSE: 'مصروف اللوازم',
    OTHER_EXPENSE: 'مصروفات أخرى',
    SHORTAGE_EXPENSE: 'خسائر النواقص',
    SURPLUS_INCOME: 'إيرادات الفوائض',
    SALES_RETURNS: 'مردودات المبيعات',
    WALLET: 'محفظة كاش'
};

/** @param {string|number} limit @param {{signal?: AbortSignal}} [options] @returns {Promise<{data?: *[]}>} */
export const getAccountingEntries = (limit = 500, options) => api.get(`/api/accounting/entries?limit=${limit}`, undefined, options);

/** @param {string} account @param {{signal?: AbortSignal}} [options] @returns {Promise<{data?: *}>} */
export const getLedger = (account, options) => api.get(`/api/accounting/ledger?account=${encodeURIComponent(account)}`, undefined, options);

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<{data?: *}>} */
export const getTrialBalance = (options) => api.get('/api/accounting/trial-balance', undefined, options);

/** Legacy namespace kept for existing consumers. */
export const AccountingService = {
    getLedger,
    getTrialBalance,
    getEntries: getAccountingEntries,
};

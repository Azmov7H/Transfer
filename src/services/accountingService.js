/**
 * Accounting Service — owns the /api/accounting endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 *
 * Response envelope is auto-unwrapped by `api.get`/`api.post` in
 * `lib/api-utils.js`, so functions here return the inner payload
 * directly (e.g. `{ entries, total, page, limit }`).
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

/**
 * Get accounting journal entries.
 * @param {{ startDate?: string, endDate?: string, type?: string, account?: string, page?: number, limit?: number }} [params]
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<{ entries: any[], total: number, page: number, limit: number }>}
 */
export const getAccountingEntries = (params = {}, options) => {
    const query = { ...params };
    if (!query.limit) query.limit = 100;
    return api.get('/api/accounting/entries', query, options);
};

/**
 * Get ledger entries for a given account.
 * @param {string} account
 * @param {{ startDate?: string, endDate?: string }} [params]
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<{ account: string, entries: any[], finalBalance: number }>}
 */
export const getLedger = (account, params = {}, options) => {
    const query = { account, ...(params || {}) };
    return api.get('/api/accounting/ledger', query, options);
};

/**
 * Get trial balance as of a given date.
 * @param {{ date?: string }} [params]
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<{ asOfDate: string, accounts: any[], totalDebit: number, totalCredit: number, difference: number, isBalanced: boolean }>}
 */
export const getTrialBalance = (params = {}, options) =>
    api.get('/api/accounting/trial-balance', params, options);

/** Legacy namespace kept for existing consumers. */
export const AccountingService = {
    getLedger,
    getTrialBalance,
    getEntries: getAccountingEntries,
};

/**
 * Finance Service — owns the /api/financial/* and /api/payments endpoint contracts.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} TreasuryTransaction
 * @property {string} _id
 * @property {'INCOME'|'EXPENSE'} type
 * @property {number} amount
 * @property {string} [description]
 */

/**
 * @typedef {Object} Debt
 * @property {string} _id
 * @property {string} debtorId
 * @property {'Customer'|'Supplier'} debtorType
 * @property {number} amount
 * @property {number} [paidAmount]
 * @property {'active'|'settled'} [status]
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] */
export const getTreasury = (params = {}, options) => api.get('/api/financial/treasury', params, options);

/** @param {object} data @returns {Promise<*>} */
export const addTreasuryTransaction = (data) => api.post('/api/financial/transaction', data);

/** @param {string} id @returns {Promise<*>} */
export const deleteTreasuryTransaction = (id) => api.delete(`/api/financial/transaction/${id}`);

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<{debts?: Debt[]}>} */
export const getDebts = (params = {}, options) => api.get('/api/financial/debts', params, options);

/** @param {object} params @param {{signal?: AbortSignal}} [options] */
export const getDebtors = (params = {}, options) => api.get('/api/financial/debts/debtors', params, options);

/** @param {{signal?: AbortSignal}} [options] */
export const getDebtOverview = (options) => api.get('/api/financial/debts/overview', undefined, options);

/** @param {object} data @returns {Promise<*>} */
export const addPayment = (data) => api.post('/api/financial/payments', data);

/** @param {string} debtId @param {{signal?: AbortSignal}} [options] */
export const getDebtPayments = (debtId, options) => api.get('/api/financial/payments', { debtId }, options);

/** @param {string} debtId @param {{signal?: AbortSignal}} [options] */
export const getDebtInstallments = (debtId, options) => api.get(`/api/financial/debts/${debtId}/installments`, undefined, options);

/** @param {string} debtId @param {object} data @returns {Promise<*>} */
export const createInstallments = (debtId, data) => api.post(`/api/financial/debts/${debtId}/installments`, data);

/** @param {object} params @param {{signal?: AbortSignal}} [options] */
export const getReceivables = (params = {}, options) => api.get('/api/payments', params, options);

/** @param {object} data @returns {Promise<*>} */
export const syncDebts = (data) => api.post('/api/financial/debts/sync', data);

/** @param {string} id @param {object} data @returns {Promise<*>} */
export const updateDebt = (id, data) => api.patch(`/api/financial/debts/${id}`, data);

/** @param {string} customerId @param {object} data @returns {Promise<*>} unified payment distributed across invoices */
export const payCustomerTotal = (customerId, data) => api.post(`/api/customers/${customerId}/pay`, data);

/** @param {string} partnerId @param {object} params @param {{signal?: AbortSignal}} [options] */
export const getPartnerTransactions = (partnerId, params = {}, options) => api.get(`/api/financial/partner/${partnerId}/transactions`, params, options);

/** @param {string} receiptId @param {{signal?: AbortSignal}} [options] */
export const getReceipt = (receiptId, options) => api.get(`/api/financial/receipts/${receiptId}`, undefined, options);

/** Legacy namespace kept for existing consumers. */
export const FinanceService = {
    async recordPayment(data) {
        return addPayment(data);
    },
    async recordCustomerPayment(invoice, amount, method, note, userId) {
        return addPayment({
            type: 'COLLECTION',
            invoiceId: invoice._id,
            amount,
            method,
            note,
            customerId: invoice.customer?._id || invoice.customer
        });
    },
    async recordTotalCustomerPayment(customerId, amount, method, note) {
        return addPayment({
            type: 'UNIFIED_COLLECTION',
            customerId,
            amount,
            method,
            note
        });
    },
};

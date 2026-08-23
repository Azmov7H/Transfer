/**
 * Invoice Service — owns the /api/invoices endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} InvoiceItem
 * @property {string} productId
 * @property {number} qty
 * @property {number} price
 */

/**
 * @typedef {Object} Invoice
 * @property {string} _id
 * @property {string} [customerId]
 * @property {Array<InvoiceItem>} items
 * @property {number} total
 * @property {'cash'|'credit'} paymentType
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<{invoices: Invoice[], pagination?: object}>} */
export const getInvoices = (params = {}, options) => api.get('/api/invoices', params, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<Invoice>} */
export const getInvoiceById = (id, options) => api.get(`/api/invoices/${id}`, undefined, options);

/** @param {Partial<Invoice>} data @returns {Promise<Invoice>} */
export const createInvoice = (data) => api.post('/api/invoices', data);

/** @param {string} id @returns {Promise<*>} */
export const deleteInvoice = (id) => api.delete(`/api/invoices/${id}`);

/** @param {string} invoiceId @param {{signal?: AbortSignal}} [options] @returns {Promise<{data: *}>} */
export const getInvoiceReturns = (invoiceId, options) => api.get(`/api/invoices/${invoiceId}/returns`, undefined, options);

/** Legacy namespace kept for existing consumers. */
export const InvoiceService = {
    getAll: getInvoices,
    getById: getInvoiceById,
    create: createInvoice,
    deleteInvoice,
};

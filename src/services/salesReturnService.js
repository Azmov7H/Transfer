/**
 * Sales Return Service — owns the /api/sales-returns endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} SalesReturn
 * @property {string} _id
 * @property {string} invoiceId
 * @property {Array<{productId: string, qty: number}>} items
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<{data: {returns?: SalesReturn[]}}>} */
export const getSalesReturns = (params = {}, options) => api.get('/api/sales-returns', params, options);

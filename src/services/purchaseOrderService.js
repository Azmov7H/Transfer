/**
 * Purchase Order Service — owns the /api/purchase-orders endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} PurchaseOrder
 * @property {string} _id
 * @property {string} [supplierId]
 * @property {'pending'|'approved'|'received'|'cancelled'} [status]
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<*>} */
export const getPurchaseOrders = (params = {}, options) => api.get('/api/purchase-orders', params, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<PurchaseOrder>} */
export const getPurchaseOrderById = (id, options) => api.get(`/api/purchase-orders/${id}`, undefined, options);

/** @param {Partial<PurchaseOrder>} data @returns {Promise<PurchaseOrder>} */
export const createPurchaseOrder = (data) => api.post('/api/purchase-orders', data);

/** @param {string} id @param {{status?: string, [key: string]: *}} data @returns {Promise<{message?: string}>} */
export const updatePurchaseOrderStatus = (id, data) => api.patch(`/api/purchase-orders/${id}`, data);

/** Legacy namespace kept for existing consumers. */
export const PurchaseOrderService = {
    getAll: getPurchaseOrders,
    getById: getPurchaseOrderById,
    create: createPurchaseOrder,
};

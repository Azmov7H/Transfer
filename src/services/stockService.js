/**
 * Stock Service — owns the /api/stock endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} StockMovement
 * @property {string} _id
 * @property {string|{ _id: string, name?: string, code?: string }} productId
 * @property {number} qty
 * @property {'IN'|'OUT'|'SALE'|'TRANSFER_TO_SHOP'|'TRANSFER_TO_WAREHOUSE'|'ADJUST'} type
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<StockMovement[]>} */
export const getStockMovements = (params = {}, options) => api.get('/api/stock/movements', params, options);

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<*>} stock status per product */
export const getStockStatus = (params = {}, options) => api.get('/api/stock', params, options);

/**
 * Move stock — data is `{ productId, qty, type, ... }` or `{ items: [...] }`.
 * @param {object} data @returns {Promise<*>}
 */
export const moveStock = (data) => api.post('/api/stock/move', data);

/** Legacy namespace kept for existing consumers. */
export const StockService = {
    getMovements: getStockMovements,
    getStockStatus,
    moveStock,
    validateStockAvailability: async (items) => items.map(item => ({ ...item, available: true })),
};

/**
 * Physical Inventory Service — owns the /api/physical-inventory endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} InventoryCount
 * @property {string} _id
 * @property {'draft'|'completed'} [status]
 * @property {string} [location]
 */

/** @param {object} filters @param {{signal?: AbortSignal}} [options] @returns {Promise<{data: InventoryCount[]}>} */
export const getInventoryCounts = (filters = {}, options) => api.get('/api/physical-inventory', filters, options);

/** @param {string} countId @param {{signal?: AbortSignal}} [options] @returns {Promise<{data: InventoryCount}>} */
export const getInventoryCount = (countId, options) => api.get(`/api/physical-inventory/${countId}`, undefined, options);

/** @param {object} data @returns {Promise<*>} */
export const createInventoryCount = (data) => api.post('/api/physical-inventory', data);

/** @param {string} id @param {object} data @returns {Promise<*>} patch count items */
export const updateInventoryCount = (id, data) => api.patch(`/api/physical-inventory/${id}`, data);

/** @param {string} id @returns {Promise<{data: {message?: string}}>} */
export const completeInventoryCount = (id) => api.post(`/api/physical-inventory/${id}/complete`);

/** @param {string} id @param {{password?: string}} [data] @returns {Promise<{data: {message?: string}}>} */
export const unlockInventoryCount = (id, data) => api.post(`/api/physical-inventory/${id}/unlock`, data ?? {});

/** @param {string} countId @param {{signal?: AbortSignal}} [options] */
export const getCountRecentMovements = (countId, options) => api.get(`/api/physical-inventory/${countId}/recent-movements`, undefined, options);

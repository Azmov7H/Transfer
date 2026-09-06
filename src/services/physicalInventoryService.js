/**
 * Physical Inventory Service — owns the /api/physical-inventory endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 *
 * The api client already strips the {success, data} envelope, so every
 * function below works with the bare payload. Shapes are normalized here
 * (tolerating legacy bare-array / {data} wrappers) so consumers always get
 * a predictable value.
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} InventoryCount
 * @property {string} _id
 * @property {'draft'|'completed'|'cancelled'} [status]
 * @property {string} [location]
 */

/** @returns {{counts: InventoryCount[], total: number}} */
function normalizeList(res) {
    if (Array.isArray(res)) return { counts: res, total: res.length };
    const list = res?.counts ?? res?.data ?? [];
    return {
        counts: Array.isArray(list) ? list : [],
        total: Number(res?.total ?? (Array.isArray(list) ? list.length : 0)) || 0
    };
}

/**
 * @param {{status?: string, location?: string}} [filters]
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<{counts: InventoryCount[], total: number}>}
 */
export const getInventoryCounts = async (filters = {}, options) => {
    const params = {};
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.location && filters.location !== 'all') params.location = filters.location;
    const res = await api.get('/api/physical-inventory', params, options);
    return normalizeList(res);
};

/**
 * @param {string} countId
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<InventoryCount|null>}
 */
export const getInventoryCount = async (countId, options) => {
    const res = await api.get(`/api/physical-inventory/${countId}`, undefined, options);
    return res ?? null;
};

/**
 * @param {{location: string, category?: string|null, isBlind?: boolean}} data
 * @returns {Promise<InventoryCount>}
 */
export const createInventoryCount = (data) => api.post('/api/physical-inventory', data);

/**
 * @param {string} id
 * @param {{items: Array<{productId: string, actualQty: number, reason?: string, justification?: string}>}} data
 * @returns {Promise<InventoryCount>}
 */
export const updateInventoryCount = (id, data) => api.patch(`/api/physical-inventory/${id}`, data);

/**
 * @param {string} id
 * @returns {Promise<{count: InventoryCount, adjustments: unknown[], totalAdjustments: number}>}
 */
export const completeInventoryCount = (id) => api.post(`/api/physical-inventory/${id}/complete`);

/**
 * @param {string} id
 * @param {{password?: string}} [data]
 * @returns {Promise<InventoryCount>}
 */
export const unlockInventoryCount = (id, data) => api.post(`/api/physical-inventory/${id}/unlock`, data ?? {});

/** @param {string} id @returns {Promise<{success: boolean}>} delete a draft count */
export const deleteInventoryCount = (id) => api.delete(`/api/physical-inventory/${id}`);

/**
 * @param {string} countId
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<{movements: Array}>}
 */
export const getCountRecentMovements = async (countId, options) => {
    const res = await api.get(`/api/physical-inventory/${countId}/recent-movements`, undefined, options);
    const movements = Array.isArray(res) ? res : (res?.movements ?? res?.data ?? []);
    return { movements: Array.isArray(movements) ? movements : [] };
};

/**
 * Supplier Service — owns the /api/suppliers endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} Supplier
 * @property {string} _id
 * @property {string} name
 * @property {string} [phone]
 * @property {*} [data]
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<{suppliers?: Supplier[]}>} */
export const getSuppliers = (params = {}, options) => api.get('/api/suppliers', params, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<{supplier: Supplier}>} */
export const getSupplierById = (id, options) => api.get(`/api/suppliers/${id}`, undefined, options);

/** @param {Partial<Supplier>} data @returns {Promise<Supplier>} */
export const createSupplier = (data) => api.post('/api/suppliers', data);

/** @param {string} id @param {Partial<Supplier>} data @returns {Promise<Supplier>} */
export const updateSupplier = (id, data) => api.put(`/api/suppliers/${id}`, data);

/** @param {string} id @returns {Promise<*>} */
export const deleteSupplier = (id) => api.delete(`/api/suppliers/${id}`);

/** Legacy namespace kept for existing consumers. */
export const SupplierService = {
    getAll: getSuppliers,
    getById: getSupplierById,
    create: createSupplier,
    update: updateSupplier,
    delete: deleteSupplier,
};

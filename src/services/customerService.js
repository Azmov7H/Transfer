/**
 * Customer Service — owns the /api/customers endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} Customer
 * @property {string} _id
 * @property {string} name
 * @property {string} [phone]
 * @property {string} [priceType] - pricing tier ('retail' | 'wholesale' | custom)
 * @property {*} [data]
 */

/**
 * @typedef {Object} PaginatedResult
 * @property {Array<Customer>} [customers]
 * @property {{ total: number, pages: number, page: number, limit: number }} [pagination]
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<PaginatedResult|Customer[]>} */
export const getCustomers = (params = {}, options) => api.get('/api/customers', params, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<{data: Customer}>} */
export const getCustomerById = (id, options) => api.get(`/api/customers/${id}`, undefined, options);

/** @param {Partial<Customer>} data @returns {Promise<Customer>} */
export const createCustomer = (data) => api.post('/api/customers', data);

/** @param {string} id @param {Partial<Customer>} data @returns {Promise<Customer>} */
export const updateCustomer = (id, data) => api.put(`/api/customers/${id}`, data);

/** @param {string} id @returns {Promise<*>} */
export const deleteCustomer = (id) => api.delete(`/api/customers/${id}`);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<{data?: *}>} custom per-product pricing */
export const getCustomerPricing = (id, options) => api.get(`/api/customers/${id}/pricing`, undefined, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<{data?: *}>} financial statement */
export const getCustomerStatement = (id, options) => api.get(`/api/customers/${id}/statement`, undefined, options);

/** Legacy namespace kept for existing consumers. */
export const CustomerService = {
    getAll: getCustomers,
    getById: getCustomerById,
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
};

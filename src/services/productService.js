/**
 * Product Service — owns the /api/products endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} [code]
 * @property {number} [purchasePrice]
 * @property {{ shop?: number, warehouse?: number }} [stock]
 * @property {*} [data]
 */

/** @param {object} params @param {{signal?: AbortSignal}} [options] @returns {Promise<{products: Product[], pagination?: object}>} */
export const getProducts = (params = {}, options) => api.get('/api/products', params, options);

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<object>} metadata for categories/units/etc. */
export const getProductMetadata = (options) => api.get('/api/products/metadata', undefined, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<Product>} */
export const getProductById = (id, options) => api.get(`/api/products/${id}`, undefined, options);

/** @param {Partial<Product>} data @returns {Promise<Product>} */
export const createProduct = (data) => api.post('/api/products', data);

/** @param {string} id @param {Partial<Product>} data @returns {Promise<Product>} */
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);

/** @param {string} id @returns {Promise<*>} */
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

/** Legacy namespace kept for existing consumers. */
export const ProductService = {
    getAll: getProducts,
    getMetadata: getProductMetadata,
    getById: getProductById,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
};

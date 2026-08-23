/**
 * User Service — owns the /api/users endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<{users: User[]}>} */
export const getUsers = (options) => api.get('/api/users', undefined, options);

/** @param {string} id @param {{signal?: AbortSignal}} [options] @returns {Promise<User>} */
export const getUserById = (id, options) => api.get(`/api/users/${id}`, undefined, options);

/** @param {Partial<User>} data @returns {Promise<User>} */
export const createUser = (data) => api.post('/api/users', data);

/** @param {string} id @param {Partial<User>} data @returns {Promise<User>} */
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);

/** @param {string} id @returns {Promise<*>} */
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

/** Legacy namespace kept for existing consumers. */
export const UserService = {
    getAll: getUsers,
    getById: getUserById,
    create: createUser,
    update: updateUser,
    delete: deleteUser,
};

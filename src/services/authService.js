/**
 * Auth Service — owns the /api/auth endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} SessionUser
 * @property {string} _id
 * @property {string} name
 * @property {string} role
 */

/** @param {{email: string, password: string}} credentials @returns {Promise<SessionUser>} */
export const login = ({ email, password }) => api.post('/api/auth/login', { email, password });

/** @returns {Promise<*>} */
export const logout = () => api.post('/api/auth/logout');

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<SessionUser|null>} unwrapped session user */
export const getSession = (options) => api.get('/api/auth/session', undefined, options);

/** Legacy namespace kept for existing consumers. */
export const AuthService = {
    login,
    logout,
    getSession: async () => {
        try {
            return await getSession();
        } catch {
            return null;
        }
    },
};

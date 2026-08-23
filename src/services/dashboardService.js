/**
 * Dashboard Service — owns the /api/dashboard endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} DashboardData
 * @property {{ sales?: number, invoices?: number, customers?: number }} [stats]
 * @property {*} [data]
 */

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<DashboardData>} */
export const getDashboard = (options) => api.get('/api/dashboard', undefined, options);

/** Legacy namespace kept for existing consumers. */
export const DashboardService = {
    getUnifiedData: getDashboard,
};

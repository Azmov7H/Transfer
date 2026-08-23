/**
 * Daily Sales Service — owns the /api/daily-sales and /api/reports/sales endpoint contracts.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/** @param {string} date @param {{signal?: AbortSignal}} [options] */
export const getDailySales = (date, options) => api.get(`/api/daily-sales?date=${date}`, undefined, options);

/** @param {string|Date} startDate @param {string|Date} endDate @param {{signal?: AbortSignal}} [options] */
export const getSalesSummary = (startDate, endDate, options) => {
    const start = startDate instanceof Date ? startDate.toISOString() : startDate;
    const end = endDate instanceof Date ? endDate.toISOString() : endDate;
    return api.get(`/api/reports/sales?startDate=${start}&endDate=${end}`, undefined, options);
};

/** @param {string|Date} startDate @param {string|Date} endDate @param {number} [limit] @param {{signal?: AbortSignal}} [options] */
export const getBestSellers = (startDate, endDate, limit = 10, options) => {
    const start = startDate instanceof Date ? startDate.toISOString() : startDate;
    const end = endDate instanceof Date ? endDate.toISOString() : endDate;
    return api.get(`/api/daily-sales/best-sellers?startDate=${start}&endDate=${end}&limit=${limit}`, undefined, options);
};

/** Legacy namespace kept for existing consumers. */
export const DailySalesService = {
    getDailySales,
    getSalesSummary,
    getBestSellers,
};

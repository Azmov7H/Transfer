/**
 * Reports Service — owns the /api/reports endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/** @param {string} startDate @param {string} endDate @param {{signal?: AbortSignal}} [options] */
export const getFinancialReport = (startDate, endDate, options) =>
    api.get(`/api/reports/financial?startDate=${startDate}&endDate=${endDate}`, undefined, options);

/** @param {string} startDate @param {string} endDate @param {{signal?: AbortSignal}} [options] */
export const getCustomerProfitReport = (startDate, endDate, options) =>
    api.get(`/api/reports/customer-profit?startDate=${startDate}&endDate=${endDate}`, undefined, options);

/** @param {string} [status] @param {{signal?: AbortSignal}} [options] */
export const getShortageReports = (status = 'ALL', options) =>
    api.get(`/api/reports/shortage?status=${status}`, undefined, options);

/** @param {{signal?: AbortSignal}} [options] */
export const getInventoryReport = (options) => api.get('/api/reports/inventory', undefined, options);

/** @param {{signal?: AbortSignal}} [options] */
export const getAllPriceHistory = (options) => api.get('/api/reports/price-history', undefined, options);

/** @param {string} productId @param {{signal?: AbortSignal}} [options] */
export const getPriceHistory = (productId, options) => api.get(`/api/reports/price-history/${productId}`, undefined, options);

/** Legacy namespace kept for existing consumers. */
export const ReportService = {
    getFinancialReport,
    getCustomerProfit: getCustomerProfitReport,
    getShortageReports,
    getInventoryReport,
    getAllPriceHistory,
    getPriceHistory,
};

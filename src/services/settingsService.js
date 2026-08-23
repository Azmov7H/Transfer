'use client';

import { api } from '@/lib/api-utils';

/**
 * GET /api/settings/invoice-design
 * @returns {Promise<object>} full envelope (non-standard: { status, data })
 */
export async function getInvoiceDesign(options = {}) {
    return api.get('/api/settings/invoice-design', undefined, options);
}

/**
 * PUT /api/settings/invoice-design
 * @param {object} settings
 */
export async function updateInvoiceDesign(settings, options = {}) {
    return api.put('/api/settings/invoice-design', settings, options);
}

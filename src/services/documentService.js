/**
 * Document Service — owns the /api/documents endpoint contract.
 *
 * Mirrors the conventions in services/invoiceService.js (FE-DATA-005):
 *   - Uses the shared `api` from @/lib/api-utils
 *   - JSDoc-typed entry points
 *   - Accepts an optional `signal` for React Query cancellation
 *
 * Two entry points:
 *   - getDocumentData(type, id?, filters?)  — fetch the shaped DocumentData
 *   - exportDocument(type, id?, format, filters?)  — fetch a file blob
 *
 * Companion component: components/documents/DocumentActions.jsx
 *   wraps exportDocument with loading / error / success UX.
 */
import { api } from '@/lib/api-utils';

export const DOCUMENT_TYPES = Object.freeze({
    SALE_INVOICE: 'SALE_INVOICE',
    CUSTOMER_COLLECTION_RECEIPT: 'CUSTOMER_COLLECTION_RECEIPT',
    CUSTOMER_ACCOUNT_STATEMENT: 'CUSTOMER_ACCOUNT_STATEMENT',
    CUSTOMER_TRANSACTION_STATEMENT: 'CUSTOMER_TRANSACTION_STATEMENT',
    CUSTOMER_FINANCIAL_SUMMARY: 'CUSTOMER_FINANCIAL_SUMMARY',
    PURCHASE_INVOICE: 'PURCHASE_INVOICE',
    SUPPLIER_PAYMENT_RECEIPT: 'SUPPLIER_PAYMENT_RECEIPT',
    SUPPLIER_ACCOUNT_STATEMENT: 'SUPPLIER_ACCOUNT_STATEMENT',
    SUPPLIER_TRANSACTION_STATEMENT: 'SUPPLIER_TRANSACTION_STATEMENT',
    SUPPLIER_FINANCIAL_SUMMARY: 'SUPPLIER_FINANCIAL_SUMMARY',
    COMPANY_FINANCIAL_STATEMENT: 'COMPANY_FINANCIAL_STATEMENT',
    TREASURY_STATEMENT: 'TREASURY_STATEMENT',
    FINANCIAL_MOVEMENT_REPORT: 'FINANCIAL_MOVEMENT_REPORT',
    DATE_RANGE_REPORT: 'DATE_RANGE_REPORT',
    PAYMENT_METHOD_REPORT: 'PAYMENT_METHOD_REPORT',
});

export const OUTPUT_FORMATS = Object.freeze({
    PDF: 'pdf',
    XLSX: 'xlsx',
    CSV: 'csv',
    HTML: 'html',
    PRINT: 'print',
});

/**
 * Build the path segment for a document type. Single-record types use
 * /:type/:id; aggregate types (no id) use /:type.
 */
function pathFor(type, id) {
    if (id) return `/api/documents/${type}/${id}`;
    return `/api/documents/${type}`;
}

/**
 * Strip falsy/empty values from a filter object so URL strings stay clean.
 * - `null`, `undefined`, `''` are dropped
 * - everything else is passed through (including `0` and `false`)
 */
function compactFilters(filters) {
    if (!filters || typeof filters !== 'object') return {};
    const out = {};
    for (const [k, v] of Object.entries(filters)) {
        if (v === null || v === undefined) continue;
        if (typeof v === 'string' && v.trim() === '') continue;
        out[k] = v;
    }
    return out;
}

/**
 * Fetch the shaped DocumentData for a document.
 *
 * @param {string} type               one of DOCUMENT_TYPES
 * @param {string} [id]               record id (omit for aggregate docs)
 * @param {object} [filters]          allowed filter keys per type
 * @param {{signal?: AbortSignal}} [options]
 * @returns {Promise<object>}         the DocumentData
 */
export async function getDocumentData(type, id, filters = {}, options) {
    const params = compactFilters(filters);
    // NOTE: the JSON read model lives under /data — the bare
    // /:type/:id route serves preview HTML (fetching it as JSON
    // fails with "Invalid JSON response from server").
    return api.get(pathFor(type, id) + '/data', params, options);
}

/**
 * Export a document in the requested format and return the Blob
 * (with the suggested filename parsed from the Content-Disposition
 * header — falls back to a sensible default).
 *
 * @param {string} type
 * @param {string} [id]
 * @param {string} format             one of OUTPUT_FORMATS (PDF/XLSX/CSV/HTML/PRINT)
 * @param {object} [filters]
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function exportDocument(type, id, format, filters = {}) {
    const params = new URLSearchParams();
    params.set('format', format);
    for (const [k, v] of Object.entries(compactFilters(filters))) {
        params.set(k, String(v));
    }
    const url = pathFor(type, id) + '/export?' + params.toString();
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: '*/*' },
    });
    if (!res.ok) {
        // Best-effort error extraction; falls back to status code.
        let message = `فشل التصدير (${res.status})`;
        try {
            const body = await res.json();
            if (body?.message) message = body.message;
        } catch { /* ignore */ }
        throw new Error(message);
    }
    const blob = await res.blob();
    const filename = parseFilename(res, type, id, format);
    return { blob, filename };
}

/**
 * POST variant — used when filters are too long for a URL.
 * Mirrors GET semantically (the backend routes both to the same handler).
 */
export async function exportDocumentPost(type, id, format, filters = {}) {
    const url = pathFor(type, id) + '/export';
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
        },
        body: JSON.stringify({ format, ...compactFilters(filters) }),
    });
    if (!res.ok) {
        let message = `فشل التصدير (${res.status})`;
        try {
            const body = await res.json();
            if (body?.message) message = body.message;
        } catch { /* ignore */ }
        throw new Error(message);
    }
    const blob = await res.blob();
    const filename = parseFilename(res, type, id, format);
    return { blob, filename };
}

/**
 * Extract the suggested filename from the Content-Disposition header.
 * Falls back to a stable name based on type + id + today.
 */
function parseFilename(res, type, id, format) {
    const cd = res.headers.get('Content-Disposition') || '';
    const m = cd.match(/filename="?([^";]+)"?/);
    if (m && m[1]) return m[1];
    const idPart = id ? `_${id}` : '';
    const today = new Date().toISOString().slice(0, 10);
    return `${type}${idPart}_${today}.${format}`;
}

/**
 * Trigger a browser download for an arbitrary Blob.
 * Same UX as lib/exportCsv.downloadCsv but for any MIME type.
 */
export function downloadBlob(blob, filename) {
    if (typeof window === 'undefined') return;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

/**
 * Open an HTML preview in a new tab.
 * The page renders the document and (optionally) auto-triggers print().
 */
export function previewDocument(type, id, filters = {}, { autoPrint = false } = {}) {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (autoPrint) params.set('autoprint', '1');
    for (const [k, v] of Object.entries(compactFilters(filters))) {
        params.set(k, String(v));
    }
    const qs = params.toString();
    const url = pathFor(type, id) + (qs ? `?${qs}` : '');
    window.open(url, '_blank', 'noopener,noreferrer');
}

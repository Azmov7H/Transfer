'use client';

import { useQuery } from '@tanstack/react-query';
import { getDocumentData } from '@/services/documentService';

/**
 * DOC-SHARED-009 — Fetch shaped DocumentData for a given type/id/filters.
 *
 * @param {string} documentType    one of DOCUMENT_TYPES
 * @param {string} [id]            record id (omit for aggregate docs)
 * @param {object} [filters]       allowed filter keys per type
 * @param {object} [options]       forwarded to useQuery
 *
 * @returns React Query result enriched with `document` (= data?.data ?? data).
 */
export function useDocument(documentType, id, filters = {}, options = {}) {
    const hasKey = Boolean(documentType) && (Boolean(id) || isAggregateFilters(filters));
    const query = useQuery({
        queryKey: ['document', documentType, id, filters],
        queryFn: ({ signal }) => getDocumentData(documentType, id, filters, { signal }),
        enabled: hasKey,
        staleTime: 60 * 1000, // 1 min — financial data is read-mostly
        ...options,
    });

    // The backend wraps the payload in { success, data } (api.get unwraps
    // to data). Some responses may also already be a flat DocumentData.
    // Treat both as valid.
    const document = query.data
        ? (query.data.data && typeof query.data.data === 'object' ? query.data.data : query.data)
        : null;

    return {
        ...query,
        document,
    };
}

/**
 * Aggregate documents (e.g. COMPANY_FINANCIAL_STATEMENT) don't take an
 * id, but they DO need to fire as long as the user has applied at least
 * one filter. For now we treat a non-empty filter set as "active enough"
 * to fetch; the user can also opt-in by passing enabled:true.
 */
function isAggregateFilters(filters) {
    if (!filters || typeof filters !== 'object') return false;
    for (const v of Object.values(filters)) {
        if (v == null) continue;
        if (typeof v === 'string' && v.trim() === '') continue;
        return true;
    }
    return false;
}

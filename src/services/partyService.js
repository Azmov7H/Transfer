/**
 * Party Service — owns the /api/parties endpoint contract.
 * Customer/Supplier duplicate detection and unification (backend Sprint 7).
 */
import { api } from '@/lib/api-utils';

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<{total: number, candidates: Array<*>}>} */
export const detectDuplicateParties = (options) => api.post('/api/parties/detect-duplicates', {}, options);

/** @param {{sourceType: 'Customer'|'Supplier', sourceId: string, targetId: string}} input @returns {Promise<{linked: boolean, alreadyLinked: boolean}>} */
export const linkParties = ({ sourceType, sourceId, targetId }) => api.post('/api/parties/link', { sourceType, sourceId, targetId });

/** @param {{sourceType: 'Customer'|'Supplier', sourceId: string}} input @returns {Promise<*>} */
export const unlinkParty = ({ sourceType, sourceId }) => api.post('/api/parties/unlink', { sourceType, sourceId });
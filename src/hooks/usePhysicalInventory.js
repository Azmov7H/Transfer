import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import {
    getInventoryCounts,
    getInventoryCount,
    createInventoryCount,
    updateInventoryCount,
    completeInventoryCount,
    unlockInventoryCount,
    deleteInventoryCount,
    getCountRecentMovements
} from '@/services/physicalInventoryService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

/** Prefix key — invalidating ['physical-inventory'] refreshes list + detail + movements. */
const BASE_KEY = ['physical-inventory'];

function invalidateAll(queryClient, id) {
    queryClient.invalidateQueries({ queryKey: BASE_KEY });
    if (id) queryClient.invalidateQueries({ queryKey: [...BASE_KEY, 'detail', id] });
}

/** Paginated count sessions. Returns {counts, total} — never an array. */
export function useInventoryCounts(filters = {}, options = {}) {
    const params = {
        ...(filters.status && filters.status !== 'all' ? { status: filters.status } : {}),
        ...(filters.location && filters.location !== 'all' ? { location: filters.location } : {})
    };
    return useQuery({
        queryKey: [...BASE_KEY, 'list', params],
        queryFn: ({ signal }) => getInventoryCounts(params, { signal }),
        placeholderData: keepPreviousData,
        enabled: options.enabled !== false
    });
}

/** Single count session with items. Returns the document or null. */
export function useInventoryCount(countId, options = {}) {
    return useQuery({
        queryKey: [...BASE_KEY, 'detail', countId],
        queryFn: ({ signal }) => getInventoryCount(countId, { signal }),
        enabled: !!countId && options.enabled !== false
    });
}

export function useCreateInventoryCount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createInventoryCount(data),
        ...withMutationFeedback({
            successMessage: 'تم بدء عملية الجرد بنجاح',
            fallbackErrorMessage: 'فشل بدء الجرد',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: [...BASE_KEY, 'list'] })
        })
    });
}

export function useUpdateInventoryCount(countId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateInventoryCount(countId, data),
        ...withMutationFeedback({
            successMessage: 'تم حفظ التغييرات بنجاح',
            fallbackErrorMessage: 'فشل الحفظ',
            afterSuccess: () => invalidateAll(queryClient, countId)
        })
    });
}

export function useCompleteInventoryCount(countId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => completeInventoryCount(countId),
        ...withMutationFeedback({
            successMessage: (res) => {
                const n = Number(res?.totalAdjustments) || 0;
                return n > 0 ? `تم اعتماد الجرد (${n} تعديل مخزني)` : 'تم اعتماد الجرد بنجاح';
            },
            fallbackErrorMessage: 'فشل الاعتماد',
            afterSuccess: () => invalidateAll(queryClient, countId)
        })
    });
}

export function useUnlockInventoryCount(countId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (password) => unlockInventoryCount(countId, { password }),
        ...withMutationFeedback({
            successMessage: 'تم فتح الجرد للتعديل',
            fallbackErrorMessage: 'فشل فتح الجرد',
            afterSuccess: () => invalidateAll(queryClient, countId)
        })
    });
}

export function useDeleteInventoryCount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteInventoryCount(id),
        ...withMutationFeedback({
            successMessage: 'تم حذف مسودة الجرد',
            fallbackErrorMessage: 'فشل حذف الجرد',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: [...BASE_KEY, 'list'] })
        })
    });
}

/**
 * Movements recorded after the count snapshot, normalized to a lookup map
 * keyed by string productId: { [productId]: movement }. The table uses it
 * to flag products that moved mid-count.
 */
export function useCountRecentMovements(countId, options = {}) {
    return useQuery({
        queryKey: [...BASE_KEY, 'movements', countId],
        queryFn: async ({ signal }) => {
            const { movements } = await getCountRecentMovements(countId, { signal });
            const map = {};
            for (const m of movements) {
                const pid = m?.productId?._id || m?.productId;
                if (pid && !map[pid]) map[pid] = m;
            }
            return map;
        },
        enabled: !!countId && options.enabled !== false
    });
}

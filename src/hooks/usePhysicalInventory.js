import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getInventoryCounts,
    getInventoryCount,
    createInventoryCount,
    updateInventoryCount,
    completeInventoryCount,
    unlockInventoryCount,
    getCountRecentMovements
} from '@/services/physicalInventoryService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

/**
 * Hook for Physical Inventory operations
 */
export function usePhysicalInventory(id = null) {
    const queryClient = useQueryClient();

    // 1. Fetch List
    const useCounts = (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters.location && filters.location !== 'all') params.append('location', filters.location);

        return useQuery({
            queryKey: ['physical-inventory', filters],
            queryFn: async ({ signal }) => {
                const res = await getInventoryCounts(Object.fromEntries(params), { signal });
                // The backend returns an array directly wrapped by routeHandler
                // So res (from api-utils) is { success, data: [...] }
                return res.data || [];
            }
        });
    };

    // 2. Fetch Detail
    const useCount = (countId) => {
        return useQuery({
            queryKey: ['physical-inventory', countId],
            queryFn: async ({ signal }) => {
                const res = await getInventoryCount(countId, { signal });
                // The backend returns the count object directly
                return res.data || null;
            },
            enabled: !!countId
        });
    };

    // 3. Create Mutation
    const createMutation = useMutation({
        mutationFn: (data) => createInventoryCount(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['physical-inventory']);
        }
    });

    // 4. Update Mutation (Patch Items)
    const updateMutation = useMutation({
        mutationFn: (data) => updateInventoryCount(id, data),
        ...withMutationFeedback({
            successMessage: 'تم حفظ التغييرات بنجاح',
            fallbackErrorMessage: 'فشل الحفظ',
            afterSuccess: () => queryClient.invalidateQueries(['physical-inventory', id])
        })
    });

    // 5. Complete Mutation
    const completeMutation = useMutation({
        mutationFn: () => completeInventoryCount(id),
        ...withMutationFeedback({
            successMessage: (res) => res.data.message || 'تم اعتماد الجرد بنجاح',
            fallbackErrorMessage: 'فشل الاعتماد',
            afterSuccess: () => queryClient.invalidateQueries(['physical-inventory'])
        })
    });

    // 6. Unlock Mutation
    const unlockMutation = useMutation({
        mutationFn: (password) => unlockInventoryCount(id, { password }),
        ...withMutationFeedback({
            successMessage: (res) => res.data.message || 'تم فتح الجرد للتعديل',
            fallbackErrorMessage: 'فشل فتح الجرد',
            afterSuccess: () => queryClient.invalidateQueries(['physical-inventory', id])
        })
    });

    // 7. Recent Movements
    const useRecentMovements = (countId) => {
        return useQuery({
            queryKey: ['physical-inventory', countId, 'movements'],
            queryFn: async ({ signal }) => {
                const res = await getCountRecentMovements(countId, { signal });
                return res.data.movements;
            },
            enabled: !!countId
        });
    };

    return {
        useCounts,
        useCount,
        createMutation,
        updateMutation,
        completeMutation,
        unlockMutation,
        useRecentMovements
    };
}

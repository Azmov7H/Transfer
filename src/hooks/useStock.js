import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useStockMovements(params = {}) {
    return useQuery({
        queryKey: ['stock-movements', params],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/stock/movements?${searchParams.toString()}`, undefined, { signal });
        }
    });
}

export function useStockStatus(params = {}) {
    return useQuery({
        queryKey: ['stock-status', params],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/stock?${searchParams.toString()}`, undefined, { signal });
        }
    });
}

export function useAddStockMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post('/api/stock/move', data),
        ...withMutationFeedback({
            successMessage: 'تم تسجيل الحركة بنجاح',
            fallbackErrorMessage: 'فشل تسجيل الحركة',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
        })
    });
}

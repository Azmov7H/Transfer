import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function usePurchaseOrders(params = {}) {
    return useQuery({
        queryKey: ['purchase-orders', params],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/purchase-orders?${searchParams.toString()}`, undefined, { signal });
        }
    });
}

export function usePurchaseOrder(id) {
    return useQuery({
        queryKey: ['purchase-orders', id],
        queryFn: async ({ signal }) => {
            return await api.get(`/api/purchase-orders/${id}`, undefined, { signal });
        },
        enabled: !!id
    });
}

export function useCreatePO() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post('/api/purchase-orders', data),
        ...withMutationFeedback({
            successMessage: 'تم إنشاء طلب الشراء بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
        })
    });
}

export function useUpdatePOStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => api.patch(`/api/purchase-orders/${id}`, data),
        ...withMutationFeedback({
            successMessage: (res) => res.message || 'تم تحديث الحالة',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
                // Stock might have changed
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
        })
    });
}

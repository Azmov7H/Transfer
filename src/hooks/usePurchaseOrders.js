import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPurchaseOrders,
    getPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrderStatus
} from '@/services/purchaseOrderService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function usePurchaseOrders(params = {}) {
    return useQuery({
        queryKey: ['purchase-orders', params],
        queryFn: async ({ signal }) => {
            return await getPurchaseOrders(params, { signal });
        }
    });
}

export function usePurchaseOrder(id) {
    return useQuery({
        queryKey: ['purchase-orders', id],
        queryFn: async ({ signal }) => {
            return await getPurchaseOrderById(id, { signal });
        },
        enabled: !!id
    });
}

export function useCreatePO() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createPurchaseOrder(data),
        ...withMutationFeedback({
            successMessage: 'تم إنشاء طلب الشراء بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
        })
    });
}

export function useUpdatePOStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updatePurchaseOrderStatus(id, data),
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

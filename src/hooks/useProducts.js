import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProducts,
    getProductMetadata,
    createProduct,
    updateProduct,
    deleteProduct
} from '@/services/productService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useProducts(params = {}, options = {}) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async ({ signal }) => {
            return await getProducts(params, { signal });
        },
        placeholderData: (previousData) => previousData,
        ...options
    });
}

export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createProduct(data),
        ...withMutationFeedback({
            successMessage: 'تم إضافة المنتج بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
        })
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateProduct(data._id, data),
        ...withMutationFeedback({
            successMessage: 'تم تعديل المنتج بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
        })
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteProduct(id),
        ...withMutationFeedback({
            successMessage: 'تم حذف المنتج بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
        })
    });
}

export function useProductMetadata() {
    return useQuery({
        queryKey: ['products-metadata'],
        queryFn: ({ signal }) => getProductMetadata({ signal }),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}

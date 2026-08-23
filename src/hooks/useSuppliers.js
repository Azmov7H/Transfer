import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useSuppliers(params = {}) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['suppliers', params],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams();
            if (params.search) searchParams.append('search', params.search);
            if (params.page) searchParams.append('page', params.page);
            if (params.limit) searchParams.append('limit', params.limit);

            return await api.get(`/api/suppliers?${searchParams.toString()}`, undefined, { signal });
        }
    });

    const addMutation = useMutation({
        mutationFn: (data) => api.post('/api/suppliers', data),
        ...withMutationFeedback({
            successMessage: 'تم إضافة المورد بنجاح',
            fallbackErrorMessage: 'فشل إضافة المورد',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/api/suppliers/${id}`, data),
        ...withMutationFeedback({
            successMessage: 'تم تحديث بيانات المورد',
            fallbackErrorMessage: 'فشل تحديث البيانات',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        })
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/suppliers/${id}`),
        ...withMutationFeedback({
            successMessage: 'تم حذف المورد بنجاح',
            fallbackErrorMessage: 'فشل الحذف',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        })
    });

    return {
        ...query,
        addMutation,
        updateMutation,
        deleteMutation
    };
}

export function useSupplier(id) {
    return useQuery({
        queryKey: ['suppliers', id],
        queryFn: async ({ signal }) => {
            const res = await api.get(`/api/suppliers/${id}`, undefined, { signal });
            return res.supplier;
        },
        enabled: !!id
    });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';
import { useFilters } from './useFilters';

export function useCustomers() {
    const queryClient = useQueryClient();
    const {
        search, setSearch,
        page, setPage,
        limit, setLimit,
        queryContext,
        handleSearch
    } = useFilters(50);

    const query = useQuery({
        queryKey: ['customers', queryContext],
        queryFn: ({ signal }) => api.get('/api/customers', queryContext, { signal })
    });

    const addMutation = useMutation({
        mutationFn: (data) => api.post('/api/customers', data),
        ...withMutationFeedback({
            successMessage: 'تمت إضافة العميل بنجاح',
            fallbackErrorMessage: 'فشل في إضافة العميل',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] })
        })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/api/customers/${id}`, data),
        ...withMutationFeedback({
            successMessage: 'تم تحديث بيانات العميل',
            fallbackErrorMessage: 'فشل في تحديث العميل',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] })
        })
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/customers/${id}`),
        ...withMutationFeedback({
            successMessage: 'تم تعطيل حساب العميل',
            fallbackErrorMessage: 'فشل في حذف العميل',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] })
        })
    });

    return {
        ...query,
        addMutation,
        updateMutation,
        deleteMutation,
        // Filter state
        search, setSearch,
        page, setPage,
        limit, setLimit,
        handleSearch
    };
}


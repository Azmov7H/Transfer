import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from '@/services/supplierService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useSuppliers(params = {}) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['suppliers', params],
        queryFn: async ({ signal }) => {
            return await getSuppliers(params, { signal });
        }
    });

    const addMutation = useMutation({
        mutationFn: (data) => createSupplier(data),
        ...withMutationFeedback({
            successMessage: 'تم إضافة المورد بنجاح',
            fallbackErrorMessage: 'فشل إضافة المورد',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateSupplier(id, data),
        ...withMutationFeedback({
            successMessage: 'تم تحديث بيانات المورد',
            fallbackErrorMessage: 'فشل تحديث البيانات',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        })
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteSupplier(id),
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
            const res = await getSupplierById(id, { signal });
            return res.supplier;
        },
        enabled: !!id
    });
}

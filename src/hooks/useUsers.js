import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useUsers() {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: async ({ signal }) => {
            return await api.get('/api/users', undefined, { signal });
        },
    });

    const createUserMutation = useMutation({
        mutationFn: (data) => api.post('/api/users', data),
        ...withMutationFeedback({
            successMessage: 'تم إضافة المستخدم بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
        })
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/api/users/${id}`, data),
        ...withMutationFeedback({
            successMessage: 'تم تحديث المستخدم بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
        })
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/users/${id}`),
        ...withMutationFeedback({
            successMessage: 'تم حذف المستخدم بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
        })
    });

    return {
        users: usersQuery.data?.users || [],
        isLoading: usersQuery.isLoading,
        createUser: createUserMutation,
        updateUser: updateUserMutation,
        deleteUser: deleteUserMutation
    };
}

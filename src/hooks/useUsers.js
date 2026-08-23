import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/userService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useUsers() {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: ({ signal }) => getUsers({ signal }),
    });

    const createUserMutation = useMutation({
        mutationFn: (data) => createUser(data),
        ...withMutationFeedback({
            successMessage: 'تم إضافة المستخدم بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
        })
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        ...withMutationFeedback({
            successMessage: 'تم تحديث المستخدم بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
        })
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id) => deleteUser(id),
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

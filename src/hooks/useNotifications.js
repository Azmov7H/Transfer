'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';
import { useUserRole } from './useUserRole';

export function useNotifications() {
    const queryClient = useQueryClient();
    const { user } = useUserRole();

    const { data: listData, isLoading, refetch } = useQuery({
        queryKey: ['notifications', 'list'],
        queryFn: async ({ signal }) => {
            return await api.get('/api/notifications?limit=20', undefined, { signal });
        },
        // Shares the ['user-session'] cache — no extra session requests.
        // Polling only runs for authenticated sessions (stops 401 churn on /login and post-logout).
        enabled: !!user,
        refetchInterval: 30000,
        refetchIntervalInBackground: false // Stop polling when tab is hidden
    });

    const notifications = listData?.notifications || [];
    const unreadCount = listData?.unreadCount || 0;

    const readMutation = useMutation({
        mutationFn: (ids = 'all') => api.patch('/api/notifications/mark-read', { ids }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/notifications/${id}`),
        ...withMutationFeedback({
            successMessage: 'تم الحذف',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
        })
    });

    return {
        notifications,
        unreadCount,
        isLoading,
        refetch,
        readMutation,
        deleteMutation
    };
}

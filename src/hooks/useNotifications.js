'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNotifications,
    markNotificationsRead,
    deleteNotification
} from '@/services/notificationService';
import { withMutationFeedback } from '@/lib/mutation-feedback';
import { useUserRole } from './useUserRole';

export function useNotifications() {
    const queryClient = useQueryClient();
    const { user } = useUserRole();

    const { data: listData, isLoading, refetch } = useQuery({
        queryKey: ['notifications', 'list'],
        queryFn: ({ signal }) => getNotifications({ signal }),
        // Shares the ['user-session'] cache — no extra session requests.
        // Polling only runs for authenticated sessions (stops 401 churn on /login and post-logout).
        enabled: !!user,
        refetchInterval: 30000,
        refetchIntervalInBackground: false // Stop polling when tab is hidden
    });

    const notifications = listData?.notifications || [];
    const unreadCount = listData?.unreadCount || 0;

    const readMutation = useMutation({
        mutationFn: (ids) => markNotificationsRead(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteNotification(id),
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

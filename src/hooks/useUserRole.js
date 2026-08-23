import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';

export function useUserRole() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['user-session'],
        queryFn: ({ signal }) => api.get('/api/auth/session', undefined, { signal }),
        // Session deviates from global defaults deliberately: longer staleness avoids
        // redundant /api/auth/session calls, and focus refetch revalidates the session
        // when the user returns to the tab.
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: true
    });

    // api-utils already unwraps the { success, data } envelope, so `data` IS the user object
    const user = data ?? null;
    const role = user?.role || null;

    const isLoggedOut = !isLoading && !user && !isError;

    return {
        role,
        user,
        loading: isLoading,
        isError,
        isLoggedOut,
        refetch
    };
}

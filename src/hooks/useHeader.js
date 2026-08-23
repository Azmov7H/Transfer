import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSidebar } from '@/providers/SidebarProvider';
import { useUserRole } from '@/hooks/useUserRole';
import { logout as logoutApi } from '@/services/authService';

export function useHeader() {
    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useSidebar();
    const { user, role, loading } = useUserRole();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutApi();
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed:', err);
            // Fallback redirect
            window.location.href = '/login';
        }
    };

    return {
        theme,
        setTheme,
        toggleSidebar,
        user,
        role,
        loading,
        scrolled,
        mounted,
        handleLogout
    };
}

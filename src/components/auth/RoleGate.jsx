'use client';

import { Loader2, ShieldAlert } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { can, hasRole, ROLES } from '@/lib/permissions';

const DEFAULT_ROLES = Object.values(ROLES);

export function RoleGate({ permission, roles, fallback, children }) {
    const { role, loading } = useUserRole();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const allowedByRole = roles ? hasRole(role, roles) : hasRole(role, DEFAULT_ROLES);
    const allowedByPermission = permission ? can(role, permission) : true;

    if (!allowedByRole || !allowedByPermission) {
        return (
            fallback ?? (
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="text-center space-y-3">
                        <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h1 className="text-xl font-bold text-foreground">ليس لديك صلاحية</h1>
                        <p className="text-sm text-muted-foreground">
                            لا تملك الصلاحيات اللازمة للوصول إلى هذه الصفحة
                        </p>
                    </div>
                </div>
            )
        );
    }

    return children;
}

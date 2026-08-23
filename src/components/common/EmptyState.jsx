'use client';

import * as React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

/**
 * Unified Empty State Component
 * Use this for consistent "no data" displays.
 *
 * Props:
 * - icon: Lucide icon component (default PackageOpen)
 * - title: primary Arabic headline
 * - hint: optional secondary line
 * - action: optional { label, onClick, icon? } CTA
 */
export function EmptyState({
    icon: Icon = PackageOpen,
    title = 'لا توجد بيانات',
    hint,
    action,
    className,
    children
}) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center gap-3 py-12 text-center",
            className
        )}>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-1">
                <Icon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{title}</h3>
                {hint && <p className="text-muted-foreground text-sm max-w-xs mx-auto">{hint}</p>}
            </div>

            {children}

            {action && (
                <Button variant="outline" size="sm" onClick={action.onClick} className="gap-2 mt-2">
                    {action.icon}
                    {action.label}
                </Button>
            )}
        </div>
    );
}

/**
 * Table Empty State - for use inside table bodies
 */
export function TableEmptyState({
    colSpan = 6,
    title,
    hint,
    action,
    icon
}) {
    return (
        <tr>
            <td colSpan={colSpan} className="h-64 text-center border-none">
                <EmptyState icon={icon} title={title} hint={hint} action={action} />
            </td>
        </tr>
    );
}

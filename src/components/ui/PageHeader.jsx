'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Single canonical page header (UX-032).
 * One H1 per page; optional breadcrumb trail (RTL-aware); actions slot on the far edge.
 */
export function PageHeader({
    title,
    subtitle,
    icon: Icon,
    actions,
    breadcrumbs = [],
    className
}) {
    return (
        <header className={cn("flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6", className)}>
            <div className="min-w-0">
                {breadcrumbs.length > 0 && (
                    <nav aria-label="مسار التنقل" className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                        {breadcrumbs.map((crumb, i) => {
                            const isLast = i === breadcrumbs.length - 1;
                            return (
                                <span key={i} className="flex items-center gap-1">
                                    {crumb.href && !isLast ? (
                                        <Link href={crumb.href} className="hover:text-foreground transition-colors">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-foreground font-medium' : undefined}>
                                            {crumb.label}
                                        </span>
                                    )}
                                    {!isLast && <ChevronLeft size={12} aria-hidden="true" />}
                                </span>
                            );
                        })}
                    </nav>
                )}
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {actions && (
                <div className="flex flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </header>
    );
}

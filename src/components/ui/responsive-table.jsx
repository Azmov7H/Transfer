'use client';

import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils';

/**
 * Shared responsive table pattern (FE-RWD-001).
 * Renders the standard table on md+ screens and stacked cards below md.
 * One shared implementation for all high-traffic lists — no per-page copies.
 *
 * Props:
 * - columns: [{ label: string, headerClassName?: string }] — desktop column headers
 * - data: array of items
 * - isPending / isError / onRetry — content-state wiring (D11)
 * - renderDesktopRow(item): full <TableRow> used on md+
 * - renderMobileCard(item): stacked card used below md
 * - getKey?(item): React key (defaults to item._id)
 * - loadingMessage / emptyTitle / emptyHint / emptyAction — state copy (Arabic)
 */
export function ResponsiveTable({
    columns,
    data = [],
    isPending = false,
    isError = false,
    onRetry,
    renderDesktopRow,
    renderMobileCard,
    getKey,
    loadingMessage = 'جاري التحميل...',
    emptyTitle = 'لا توجد بيانات',
    emptyHint,
    emptyAction,
    className
}) {
    const colSpan = columns.length;
    const stateType = isPending ? 'loading' : isError ? 'error' : data.length === 0 ? 'empty' : null;

    return (
        <React.Fragment>
            {/* Desktop: standard table (md+) */}
            <div className={cn('hidden md:block', className)}>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/5 h-16 bg-white/[0.01]">
                            {columns.map((col) => (
                                <TableHead key={col.label} className={col.headerClassName}>
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stateType === 'loading' && (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="h-64 text-center border-none">
                                    <LoadingState message={loadingMessage} />
                                </TableCell>
                            </TableRow>
                        )}
                        {stateType === 'error' && (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="h-64 text-center border-none">
                                    <ErrorState onRetry={onRetry} />
                                </TableCell>
                            </TableRow>
                        )}
                        {stateType === 'empty' && (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="h-64 text-center border-none">
                                    <EmptyState title={emptyTitle} hint={emptyHint} action={emptyAction} />
                                </TableCell>
                            </TableRow>
                        )}
                        {!stateType && data.map((item, index) => (
                            <React.Fragment key={getKey ? getKey(item) : (item._id ?? index)}>
                                {renderDesktopRow(item)}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile: stacked cards (<md) */}
            <div className="md:hidden">
                {stateType === 'loading' && <LoadingState message={loadingMessage} />}
                {stateType === 'error' && <ErrorState onRetry={onRetry} />}
                {stateType === 'empty' && (
                    <EmptyState title={emptyTitle} hint={emptyHint} action={emptyAction} />
                )}
                {!stateType && (
                    <div className="flex flex-col gap-3 p-4">
                        {data.map((item, index) => (
                            <React.Fragment key={getKey ? getKey(item) : (item._id ?? index)}>
                                {renderMobileCard(item)}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

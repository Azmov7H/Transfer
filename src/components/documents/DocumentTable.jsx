'use client';

import * as React from 'react';
import { cn } from '@/utils';
import { EmptyState } from '@/components/common/EmptyState';

/**
 * DOC-SHARED-007 — Reusable, print-safe document table.
 *
 * The single table component every document uses for its line items,
 * statement rows, and report rows. Handles:
 *  - per-column width / alignment
 *  - optional `render` per cell (for badges, formatted currency, etc.)
 *  - clickable rows
 *  - an empty state
 *  - an optional `totals` row (rendered as <tfoot>)
 *  - RTL by default
 *  - print-friendly: thead repeats on every page (see DocumentPrintStyles)
 *
 * Props:
 *  - columns        : Array<{ key, header, width?, align?, render?, headerRender? }>
 *  - rows           : Array<object>
 *  - totals         : object | null   (key → value, rendered in <tfoot>)
 *  - onRowClick     : (row) => void
 *  - emptyMessage   : string
 *  - caption        : string          (rendered as <caption>; improves a11y)
 *  - rowKey         : (row) => string  (defaults to row.id || index)
 *  - className
 *  - compact        : boolean         (smaller font + padding)
 */
export function DocumentTable({
    columns = [],
    rows = [],
    totals = null,
    onRowClick,
    emptyMessage = 'لا توجد بيانات لعرضها',
    caption,
    rowKey,
    className,
    compact = false,
}) {
    const safeColumns = Array.isArray(columns) ? columns : [];
    const safeRows = Array.isArray(rows) ? rows : [];

    return (
        <div
            dir="rtl"
            className={cn('rounded-xl overflow-hidden border bg-white', className)}
        >
            <table className="w-full border-collapse" data-testid="document-table">
                {caption && <caption className="sr-only">{caption}</caption>}
                <thead
                    className={cn(
                        'text-white text-sm',
                        compact ? 'text-xs' : 'text-sm'
                    )}
                    style={{ backgroundColor: 'var(--doc-table-header, #1B3C73)' }}
                >
                    <tr>
                        {safeColumns.map((c) => (
                            <th
                                key={c.key}
                                style={c.width ? { width: c.width } : undefined}
                                className={cn(
                                    'px-3 py-3 font-bold',
                                    alignClass(c.align)
                                )}
                            >
                                {c.headerRender ? c.headerRender() : c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={cn('text-foreground', compact ? 'text-xs' : 'text-sm')}>
                    {safeRows.length === 0 ? (
                        <tr>
                            <td colSpan={safeColumns.length} className="p-0">
                                <div className="py-10">
                                    <EmptyState title={emptyMessage} />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        safeRows.map((row, i) => (
                            <tr
                                key={rowKey ? rowKey(row) : (row.id ?? i)}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={cn(
                                    'border-b border-border last:border-0',
                                                    onRowClick && 'cursor-pointer hover:bg-muted/40'
                                )}
                            >
                                {safeColumns.map((c) => (
                                    <td
                                        key={c.key}
                                        className={cn('px-3 py-3', alignClass(c.align))}
                                    >
                                        {c.render ? c.render(row) : row[c.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
                {totals && (
                    <tfoot
                        className={cn(
                            'bg-muted/40 font-bold border-t-2',
                            compact ? 'text-xs' : 'text-sm'
                        )}
                    >
                        <tr>
                            {safeColumns.map((c, i) => {
                                const value = totals[c.key];
                                return (
                                    <td
                                        key={c.key}
                                        className={cn('px-3 py-3', alignClass(c.align))}
                                    >
                                        {i === 0 && (totals.__label || 'الإجمالي')}
                                        {i !== 0 && (value != null ? value : '')}
                                    </td>
                                );
                            })}
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}

function alignClass(align) {
    if (align === 'center') return 'text-center';
    if (align === 'left') return 'text-left';
    return 'text-right'; // RTL default
}

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/utils';

/**
 * DOC-SHARED-004 — Branded document footer.
 *
 * Every document ends with the same footer block: the company's
 * custom message, the page info, the applied filters (when relevant),
 * and the generation meta. The footer is hidden from the printable
 * page (no `print:hidden` here — the caller controls that).
 *
 * Props:
 *  - branding       : BrandingData
 *  - filters        : object | null     (applied filters; pretty-printed)
 *  - pageInfo       : { current, total } | null
 *  - generatedBy    : { name, role? }   (default: 'النظام')
 *  - generatedAt    : Date              (default: now)
 *  - className
 *  - hideFilters    : boolean           (suppress the filters strip on receipts)
 */
export function DocumentFooter({
    branding,
    filters,
    pageInfo,
    generatedBy,
    generatedAt,
    className,
    hideFilters = false,
}) {
    const at = generatedAt instanceof Date ? generatedAt : new Date();
    const prettyAt = (() => {
        try {
            return format(at, 'dd MMMM yyyy — HH:mm', { locale: ar });
        } catch {
            return at.toISOString();
        }
    })();

    const filterEntries = filters && typeof filters === 'object'
        ? Object.entries(filters).filter(([, v]) => v != null && v !== '')
        : [];

    return (
        <div
            dir="rtl"
            className={cn(
                'mt-12 pt-6 border-t text-center space-y-3',
                className
            )}
            style={{ borderColor: branding?.primaryColor || '#1B3C73' }}
            data-testid="document-footer"
        >
            {branding?.footerText && (
                <p
                    className="font-bold text-base"
                    style={{ color: branding?.primaryColor || '#1B3C73' }}
                >
                    {branding.footerText}
                </p>
            )}

            {!hideFilters && filterEntries.length > 0 && (
                <div className="text-xs text-muted-foreground" data-testid="document-footer-filters">
                    <span className="font-bold">الفلاتر المطبقة: </span>
                    {filterEntries
                        .map(([k, v]) => `${k}=${formatFilterValue(v)}`)
                        .join('، ')}
                </div>
            )}

            {pageInfo && (pageInfo.current || pageInfo.total) && (
                <div className="text-xs text-muted-foreground font-mono">
                    {pageInfo.current && pageInfo.total
                        ? `صفحة ${pageInfo.current} من ${pageInfo.total}`
                        : pageInfo.current
                            ? `صفحة ${pageInfo.current}`
                            : `إجمالي ${pageInfo.total} صفحة`}
                </div>
            )}

            <div className="text-xs text-muted-foreground">
                <span>تم الإصدار بواسطة: </span>
                <span className="font-bold">{generatedBy?.name || 'النظام'}</span>
                <span> — </span>
                <span>{prettyAt}</span>
            </div>
        </div>
    );
}

function formatFilterValue(v) {
    if (v instanceof Date) {
        try {
            return format(v, 'yyyy-MM-dd');
        } catch {
            return v.toISOString();
        }
    }
    if (typeof v === 'object') {
        try { return JSON.stringify(v); } catch { return String(v); }
    }
    return String(v);
}

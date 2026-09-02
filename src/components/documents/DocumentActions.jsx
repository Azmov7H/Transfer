'use client';

import * as React from 'react';
import {
    Eye,
    Printer,
    FileDown,
    FileSpreadsheet,
    FileText,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDocumentExport } from '@/hooks/useDocumentExport';
import { previewDocument } from '@/services/documentService';
import { OUTPUT_FORMATS } from '@/services/documentService';

/**
 * DOC-SHARED-011 / DOC-UX-001 — DocumentActions.
 *
 * The single action bar mounted on every document page. Renders the
 * Preview / Print / PDF / Excel / CSV buttons that the user can act on
 * (only the ones the document supports per its registry entry).
 *
 * Props:
 *  - documentType : string  (one of DOCUMENT_TYPES)
 *  - documentId   : string  (omit for aggregate docs)
 *  - formats      : Array<'pdf'|'xlsx'|'csv'|'print'>  (subset of OUTPUT_FORMATS to expose)
 *  - filters      : object  (passed verbatim to the backend)
 *  - onPreview    : (url) => void  (override the default window.open)
 *  - className
 *  - size         : 'sm' | 'default' (default 'default')
 *  - variant      : 'full' | 'compact' (full = labels + icons; compact = icons only)
 *
 * Loading / error / empty / success states are owned by useDocumentExport
 * (toast on success + error). The action bar itself only renders the
 * buttons; a per-button spinner shows while a request is in flight.
 */
export function DocumentActions({
    documentType,
    documentId,
    formats,
    filters = {},
    onPreview,
    className,
    size = 'default',
    variant = 'full',
}) {
    const exportMutation = useDocumentExport();

    const requestedFormats = Array.isArray(formats) ? formats : [];
    // The export dropdown shows only the file-producing formats.
    const exportableFormats = requestedFormats.filter(
        (f) => f === 'pdf' || f === 'xlsx' || f === 'csv'
    );
    // The "Print" button is its own thing — driven by the same prop.
    const supportsPrint = requestedFormats.includes(OUTPUT_FORMATS.PRINT);

    const hasFilters = hasMeaningfulFilters(filters);
    const exportLabel = hasFilters ? 'تصدير (مع الفلاتر)' : 'تصدير';

    const handleExport = (format) => {
        if (exportMutation.isPending) return;
        exportMutation.mutate({
            type: documentType,
            id: documentId,
            format,
            filters,
        });
    };

    const handlePreview = () => {
        if (onPreview) {
            onPreview({ type: documentType, id: documentId, filters });
            return;
        }
        previewDocument(documentType, documentId, filters);
    };

    const handlePrint = () => {
        previewDocument(documentType, documentId, filters, { autoPrint: true });
    };

    const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
    const isExporting = exportMutation.isPending;

    return (
        <div
            dir="rtl"
            data-testid="document-actions"
            className={cn('flex flex-wrap items-center gap-2', className)}
        >
            <Button
                type="button"
                variant="outline"
                size={size}
                onClick={handlePreview}
                disabled={!documentType}
                className="gap-2 font-bold"
                data-testid="document-action-preview"
            >
                <Eye className={iconSize} />
                {variant === 'full' && 'معاينة'}
            </Button>

            {supportsPrint && (
                <Button
                    type="button"
                    variant="outline"
                    size={size}
                    onClick={handlePrint}
                    disabled={!documentType}
                    className="gap-2 font-bold"
                    data-testid="document-action-print"
                >
                    <Printer className={iconSize} />
                    {variant === 'full' && 'طباعة'}
                </Button>
            )}

            {exportableFormats.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            size={size}
                            disabled={!documentType || isExporting}
                            data-testid="document-action-export-trigger"
                            className="gap-2 font-bold"
                        >
                            {isExporting ? (
                                <Loader2 className={cn(iconSize, 'animate-spin')} />
                            ) : (
                                <FileDown className={iconSize} />
                            )}
                            {variant === 'full' && (isExporting ? 'جارٍ التصدير…' : exportLabel)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel className="text-xs">
                            تصدير المستند
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {exportableFormats.includes(OUTPUT_FORMATS.PDF) && (
                            <DropdownMenuItem
                                onClick={() => handleExport('pdf')}
                                className="gap-2 cursor-pointer"
                                data-testid="document-action-export-pdf"
                            >
                                <FileText className="h-4 w-4 text-rose-600" />
                                <span>PDF</span>
                            </DropdownMenuItem>
                        )}
                        {exportableFormats.includes(OUTPUT_FORMATS.XLSX) && (
                            <DropdownMenuItem
                                onClick={() => handleExport('xlsx')}
                                className="gap-2 cursor-pointer"
                                data-testid="document-action-export-xlsx"
                            >
                                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                                <span>Excel</span>
                            </DropdownMenuItem>
                        )}
                        {exportableFormats.includes(OUTPUT_FORMATS.CSV) && (
                            <DropdownMenuItem
                                onClick={() => handleExport('csv')}
                                className="gap-2 cursor-pointer"
                                data-testid="document-action-export-csv"
                            >
                                <FileText className="h-4 w-4 text-sky-600" />
                                <span>CSV</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

/**
 * Pure helper: returns true when the filter object carries at least
 * one value worth sending to the backend. Empty strings / nulls / undefined
 * are ignored so the export label doesn't flip on cosmetic inputs.
 */
function hasMeaningfulFilters(filters) {
    if (!filters || typeof filters !== 'object') return false;
    for (const v of Object.values(filters)) {
        if (v == null) continue;
        if (typeof v === 'string' && v.trim() === '') continue;
        return true;
    }
    return false;
}

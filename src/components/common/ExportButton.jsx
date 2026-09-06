'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { buildCsv, downloadCsv } from '@/lib/exportCsv';

const SUPPORTED_TYPES = new Set([
    'customers',
    'suppliers',
    'products',
    'invoices',
    'purchaseOrders',
    'treasuryTransactions',
]);

export function ExportButton({ type, filters = {}, data = [], columns = [], pdfTitle = 'Report' }) {
    const [isLoading, setIsLoading] = useState(false);

    const postExport = async (format) => {
        const res = await fetch('/api/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, format, filters })
        });

        if (!res.ok) {
            let message = 'حدث خطأ أثناء التصدير';
            try {
                const err = await res.json();
                if (err?.message) message = err.message;
            } catch { /* ignore parse errors */ }
            throw new Error(message);
        }
        return res.blob();
    };

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const stamp = () => new Date().toISOString().split('T')[0];

    const handleCsvExport = async () => {
        try {
            setIsLoading(true);

            // Client-side variant for types the backend export endpoint
            // doesn't support (e.g. users), still producing a CSV download.
            if (data.length > 0 && columns.length > 0 && !SUPPORTED_TYPES.has(type)) {
                const headers = columns.map(c => c.header);
                const rows = data.map(item => columns.map(c => item[c.key] ?? ''));
                const csv = buildCsv(rows, headers);

                // Informational notice on an empty result (only header row).
                if (rows.length === 0) toast('لا توجد نتائج مطابقة للفلاتر');

                downloadCsv(`${type}_export.csv`, csv);
                toast.success('تم تصدير ملف Excel بنجاح');
                return;
            }

            const blob = await postExport('csv');

            // Empty detection: read the blob text once; if it carries no data
            // rows beyond the header + BOM, warn (still allows the download).
            const emptyHint = await blob.text().then((text) => {
                const body = text.replace(/^\uFEFF/, '');
                const lines = body.split(/\r?\n/).filter((l) => l.trim() !== '');
                return lines.length <= 1;
            }).catch(() => false);
            if (emptyHint) toast('لا توجد نتائج مطابقة للفلاتر');

            downloadBlob(blob, `${type}_report_${stamp()}.csv`);
            toast.success('تم تصدير ملف Excel بنجاح');
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'حدث خطأ أثناء التصدير', {
                action: { label: 'إعادة المحاولة', onClick: () => handleCsvExport() }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePdfExport = async () => {
        try {
            setIsLoading(true);
            const blob = await postExport('pdf');
            downloadBlob(blob, `${type}_report_${stamp()}.pdf`);
            toast.success('تم تصدير ملف PDF بنجاح');
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'حدث خطأ أثناء التصدير', {
                action: { label: 'إعادة المحاولة', onClick: () => handlePdfExport() }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const hasFilters = Object.values(filters || {}).some((v) => v != null && String(v).trim() !== '');

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {hasFilters ? 'تصدير (مع الفلاتر)' : 'تصدير'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleCsvExport} className="gap-2 cursor-pointer">
                                <FileSpreadsheet className="w-4 h-4 text-success" />
                                تصدير CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePdfExport} className="gap-2 cursor-pointer">
                                <FileText className="w-4 h-4 text-destructive" />
                                تصدير PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipTrigger>
                {isLoading && (
                    <TooltipContent>جارٍ التصدير… قد يستغرق بعض الوقت</TooltipContent>
                )}
            </Tooltip>
        </>
    );
}

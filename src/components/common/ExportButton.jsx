'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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

    const handleExcelExport = async () => {
        try {
            setIsLoading(true);

            // Client-side variant for types the backend export endpoint
            // doesn't support (e.g. users), still producing a CSV download.
            if (data.length > 0 && columns.length > 0 && !SUPPORTED_TYPES.has(type)) {
                const headers = columns.map(c => c.header);
                const rows = data.map(item => columns.map(c => item[c.key] ?? ''));
                downloadCsv(`${type}_export.csv`, buildCsv(rows, headers));
                toast.success('تم تصدير ملف Excel بنجاح');
                return;
            }

            const res = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, format: 'csv', filters })
            });

            if (!res.ok) {
                let message = 'حدث خطأ أثناء التصدير';
                try {
                    const err = await res.json();
                    if (err?.message) message = err.message;
                } catch { /* ignore parse errors */ }
                throw new Error(message);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success('تم تصدير ملف Excel بنجاح');
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'حدث خطأ أثناء التصدير');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    تصدير
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExcelExport} className="gap-2 cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 text-success" />
                    Excel / CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuItem disabled className="gap-2 cursor-not-allowed">
                            <FileText className="w-4 h-4 text-destructive" />
                            PDF
                        </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>
                        تصدير PDF غير متاح حاليًا (النص العربي)
                    </TooltipContent>
                </Tooltip>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowRight, Package, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SupplierStatementTab } from '@/components/documents/SupplierStatementTab';
import { getSupplierById } from '@/services/supplierService';

/**
 * DOC-SSTMT-002 — Supplier detail page.
 *
 * Hosts the redesigned SupplierStatementTab. The page is intentionally
 * thin — the supplier data is fetched once for the header block, and
 * the tab does its own date-range window via the document engine.
 */
export default function SupplierDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: supplier, isLoading, error } = useQuery({
        queryKey: ['supplier', id],
        queryFn: ({ signal }) => getSupplierById(id, { signal }),
        enabled: Boolean(id)
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-primary" />
            </div>
        );
    }

    if (error || !supplier) {
        return (
            <div className="p-10 text-center text-destructive">حدث خطأ أثناء تحميل المورد.</div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowRight className="h-4 w-4" /> العودة
                </Button>
            </div>

            <Card className="max-w-5xl mx-auto mb-6 border-none shadow-2xl bg-card/30 backdrop-blur-md rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Package className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl font-bold tracking-tight">{supplier.name}</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium mt-1 flex flex-wrap items-center gap-4">
                                {supplier.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> {supplier.phone}
                                    </span>
                                )}
                                {supplier.address && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {supplier.address}
                                    </span>
                                )}
                            </CardDescription>
                        </div>
                        <div className="text-end">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">الرصيد الحالي</div>
                            <div className="text-3xl font-extrabold font-mono text-destructive mt-1" data-testid="supplier-balance">
                                {Number(supplier.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-muted-foreground font-sans">ج.م</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="max-w-5xl mx-auto">
                <SupplierStatementTab supplierId={id} />
            </div>
        </div>
    );
}

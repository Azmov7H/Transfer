'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowRight, ArrowRightLeft, Printer, Trash2, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { InvoiceReturnDialog } from '@/components/invoices/InvoiceReturnDialog';
import { InvoicePrintView } from '@/components/invoices/InvoicePrintView';

export default function InvoiceDetailPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [invoice, setInvoice] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [returnItems, setReturnItems] = useState({});
    const [refundMethod, setRefundMethod] = useState('cash');
    const [isReturning, setIsReturning] = useState(false);
    const [returns, setReturns] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use Promise.allSettled to allow partial success (e.g. if settings fail, still show invoice)
                const results = await Promise.allSettled([
                    fetch(`/api/invoices/${id}`),
                    fetch(`/api/settings/invoice-design`),
                    fetch(`/api/invoices/${id}/returns`)
                ]);

                const [invRes, setRes, retRes] = results;

                // Process Invoice
                if (invRes.status === 'fulfilled' && invRes.value.ok) {
                    const invData = await invRes.value.json();
                    // The backend returns { success: true, data: { ...invoice } }
                    // So invData.data is the invoice object itself.
                    setInvoice(invData.data || invData);
                } else {
                    console.error('Failed to load invoice', invRes);
                    toast.error('تعذر تحميل بيانات الفاتورة');
                }

                // Process Settings (Optional)
                if (setRes.status === 'fulfilled' && setRes.value.ok) {
                    try {
                        const setData = await setRes.value.json();
                        setSettings(setData.data || setData);
                    } catch (e) {
                        console.error('Settings parse error', e);
                    }
                }

                // Process Returns (Optional)
                if (retRes.status === 'fulfilled' && retRes.value.ok) {
                    try {
                        const retData = await retRes.value.json();
                        setReturns(retData.data?.returns || retData.returns || []);
                    } catch (e) {
                        console.error('Returns parse error', e);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error('خطأ غير متوقع');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleReturnSubmit = async () => {
        setIsReturning(true);
        try {
            const itemsToReturn = Object.entries(returnItems)
                .filter(([_, qty]) => qty > 0)
                .map(([invoiceItemId, qty]) => ({ invoiceItemId, qty }));

            if (itemsToReturn.length === 0) {
                toast.error('يجب تحديد كمية واحدة على الأقل');
                setIsReturning(false);
                return;
            }

            const res = await fetch(`/api/invoices/${id}/return`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: itemsToReturn,
                    refundMethod: refundMethod
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('تم استرجاع المنتجات بنجاح');
                setShowReturnDialog(false);
                window.location.reload();
            } else {
                toast.error(data.error || 'حدث خطأ أثناء الارتجاع');
            }
        } catch (error) {
            console.error(error);
            toast.error('خطأ في الاتصال');
        } finally {
            setIsReturning(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('تم حذف الفاتورة بنجاح');
                router.push('/invoices');
            } else {
                toast.error('حدث خطأ أثناء الحذف');
            }
        } catch (error) {
            console.error(error);
            toast.error('خطأ في الاتصال');
        }
    };

    if (loading) return <div className="text-center py-20">جاري تحميل الفاتورة...</div>;
    if (!invoice) return <div className="text-center py-20 text-red-500">الفاتورة غير موجودة</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto pb-20">
            {/* Action Bar (Hidden in Print) */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <Button variant="outline" onClick={() => router.back()} className="gap-2">
                    <ArrowRight size={16} /> العودة
                </Button>

                <div className="flex gap-2">
                    <InvoiceReturnDialog
                        invoice={invoice}
                        open={showReturnDialog}
                        onOpenChange={setShowReturnDialog}
                        returnItems={returnItems}
                        setReturnItems={setReturnItems}
                        refundMethod={refundMethod}
                        setRefundMethod={setRefundMethod}
                        onSubmit={handleReturnSubmit}
                        isReturning={isReturning}
                    />

                    <Button onClick={handlePrint} className="gap-2 bg-primary">
                        <Printer size={16} /> طباعة / PDF
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg">
                        <Trash2 size={16} /> حذف
                    </Button>
                </div>
            </div>

            {/* Invoice Container */}
            <InvoicePrintView invoice={invoice} settings={settings} returns={returns} />

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="حذف الفاتورة"
                description="هل أنت متأكد من حذف هذه الفاتورة نهائياً؟ سيتم استرجاع الكميات."
                confirmLabel="حذف نهائي"
                onConfirm={handleDelete}
            />
        </div>
    );
}

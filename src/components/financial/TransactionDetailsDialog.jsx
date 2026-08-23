'use client';

import Link from "next/link";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, User, Clock, Tag, ExternalLink, Eye, Wallet, ReceiptCent } from 'lucide-react';

export function TransactionDetailsDialog({ transaction, open, onOpenChange }) {
    const selectedTx = transaction;
    return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent dir="rtl" className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Info className="text-primary" />
                            تفاصيل العملية المالية
                        </DialogTitle>
                    </DialogHeader>

                    {selectedTx && (
                        <div className="space-y-6 py-4">
                            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">المبلغ</p>
                                    <p className={`text-2xl font-bold ${selectedTx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedTx.amount.toLocaleString()} ج.م
                                    </p>
                                </div>
                                <Badge variant={selectedTx.type === 'INCOME' ? 'default' : 'destructive'} className="h-8 px-4 text-sm">
                                    {selectedTx.type === 'INCOME' ? 'وارد' : 'صادر'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Tag size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">الوصف</p>
                                        <p className="text-base">{selectedTx.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <User size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">المسؤول عن العملية</p>
                                        <p className="text-base font-semibold">{selectedTx.createdBy?.name || 'غير معروف'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Clock size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">وقت وتاريخ العملية</p>
                                        <p className="text-base">{format(new Date(selectedTx.date || selectedTx.createdAt), 'PPPP p', { locale: ar })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Wallet size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">وسيلة المعاملة</p>
                                        <p className="text-base">
                                            {selectedTx.method === 'bank' ? 'تحويل بنكي' :
                                                selectedTx.method === 'wallet' ? 'محفظة إلكترونية' : 'نقداً (كاش)'}
                                        </p>
                                    </div>
                                </div>

                                {(selectedTx.referenceType === 'Invoice' || selectedTx.referenceType === 'PurchaseOrder' || selectedTx.referenceType === 'Debt') && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <ExternalLink size={18} />
                                        </div>
                                        <div className="space-y-1 w-full">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {selectedTx.referenceType === 'Invoice' ? 'إلى العميل' :
                                                    selectedTx.referenceType === 'PurchaseOrder' ? 'من المورد' : 'جهة المديونية'}
                                            </p>
                                            <div className="flex flex-col gap-1">
                                                {selectedTx.referenceType === 'Invoice' && (
                                                    <>
                                                        <p className="font-semibold text-lg">
                                                            {selectedTx.referenceId?.customer?.name ||
                                                                selectedTx.referenceId?.customerName ||
                                                                (selectedTx.description.includes('رصيد افتتاحي') ? 'عميل (رصيد سابق)' : 'عميل نقدي')}
                                                        </p>
                                                        {selectedTx.referenceId?.number && <Badge variant="outline" className="w-fit">فاتورة #{selectedTx.referenceId.number}</Badge>}
                                                    </>
                                                )}
                                                {selectedTx.referenceType === 'PurchaseOrder' && (
                                                    <>
                                                        <p className="font-semibold text-lg">{selectedTx.referenceId?.supplier?.name || 'مورد'}</p>
                                                        {selectedTx.referenceId?.poNumber && <Badge variant="outline" className="w-fit">أمر شراء #{selectedTx.referenceId.poNumber}</Badge>}
                                                    </>
                                                )}
                                                {selectedTx.referenceType === 'Debt' && (
                                                    <>
                                                        <p className="font-semibold text-lg">{selectedTx.referenceId?.debtorId?.name || 'غير معروف'}</p>
                                                        <Badge variant="outline" className="w-fit">معاملة دين</Badge>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Info size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">مرجع النظام</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className="capitalize">
                                                {selectedTx.referenceType === 'Manual' ? 'إدخال يدوي' :
                                                    selectedTx.referenceType === 'Invoice' ? 'نظام المبيعات' :
                                                        selectedTx.referenceType === 'PurchaseOrder' ? 'نظام المشتريات' :
                                                            selectedTx.referenceType === 'Debt' ? 'نظام الديون والمديونيات' :
                                                                selectedTx.referenceType === 'UnifiedCollection' ? 'تحصيل مجمع' : selectedTx.referenceType}
                                            </Badge>

                                            {/* Action Links in Dialog */}
                                            {selectedTx.referenceType === 'Invoice' && selectedTx.referenceId?._id && (
                                                <Link href={`/invoices/${selectedTx.referenceId._id}`} className="w-full sm:w-auto">
                                                    <Button size="sm" variant="outline" className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/10">
                                                        <Eye size={14} /> فـاتحة الفاتورة
                                                    </Button>
                                                </Link>
                                            )}
                                            {selectedTx.referenceType === 'PurchaseOrder' && selectedTx.referenceId?._id && (
                                                <Link href={`/purchase-orders/${selectedTx.referenceId._id}`} className="w-full sm:w-auto">
                                                    <Button size="sm" variant="outline" className="w-full gap-2 border-orange-500/20 text-orange-600 hover:bg-orange-50">
                                                        <Eye size={14} /> فتح أمر الشراء
                                                    </Button>
                                                </Link>
                                            )}
                                            {(selectedTx.type === 'INCOME' || selectedTx.referenceType === 'UnifiedCollection') && (
                                                <Link href={`/financial/receipts/${selectedTx._id}`} className="w-full sm:w-auto">
                                                    <Button size="sm" variant="outline" className="w-full gap-2 border-green-600/20 text-green-600 hover:bg-green-50">
                                                        <ReceiptCent size={14} /> عرض سند التحصيل
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button className="w-full" onClick={() => onOpenChange(false)}>إغلاق</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    );
}

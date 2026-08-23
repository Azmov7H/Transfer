'use client';

import Link from "next/link";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Info, Trash2, Eye, ReceiptCent } from 'lucide-react';

export function TransactionsTable({ transactions, typeFilter, onTypeFilterChange, onTxClick, onDelete, isDeleting }) {
    return (
        <>
                            <Card className="border shadow-sm">
                    <CardHeader className="border-b py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle className="text-lg md:text-xl">سجل المعاملات ({filteredTransactions.length})</CardTitle>

                        {/* Type Filter */}
                        <div className="flex flex-wrap items-center gap-2 bg-muted p-1 rounded-lg">
                            <Button
                                variant={typeFilter === 'ALL' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setTypeFilter('ALL')}
                                className="text-xs h-7 px-3"
                            >الكل</Button>
                            <Button
                                variant={typeFilter === 'INCOME' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setTypeFilter('INCOME')}
                                className="text-xs h-7 px-3 text-green-600"
                            >إيرادات</Button>
                            <Button
                                variant={typeFilter === 'SUPPLIER_PAYMENTS' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setTypeFilter('SUPPLIER_PAYMENTS')}
                                className="text-xs h-7 px-3 text-orange-600"
                            >دفعات موردين</Button>
                            <Button
                                variant={typeFilter === 'SHOP_EXPENSES' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setTypeFilter('SHOP_EXPENSES')}
                                className="text-xs h-7 px-3 text-red-600"
                            >مصروفات</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">نوع المعاملة</TableHead>
                                        <TableHead className="text-right">الجهة / الطرف</TableHead>
                                        <TableHead className="text-right">المبلغ</TableHead>
                                        <TableHead className="text-right">الوسيلة</TableHead>
                                        <TableHead className="text-right hidden md:table-cell">الوصف</TableHead>
                                        <TableHead className="text-right hidden lg:table-cell">التاريخ</TableHead>
                                        <TableHead className="text-right">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                لا توجد معاملات مسجلة في هذه الفترة للفلتر المختار
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTransactions.map((tx) => (
                                            <TableRow
                                                key={tx._id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => handleTxClick(tx)}
                                            >
                                                <TableCell>
                                                    <Badge variant={tx.type === 'INCOME' ? 'default' : 'destructive'} className="gap-1 min-w-[70px] justify-center">
                                                        {tx.type === 'INCOME' ? 'وارد' : 'صادر'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {tx.referenceType === 'Invoice' ? (
                                                                tx.referenceId?.customer?._id ? (
                                                                    <Link
                                                                        href={`/customers/${tx.referenceId.customer._id}`}
                                                                        className="hover:text-primary underline-offset-4 hover:underline"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {tx.referenceId?.customer?.name || tx.referenceId?.customerName || 'عميل نقدي'}
                                                                    </Link>
                                                                ) : (tx.referenceId?.customerName || 'عميل نقدي')
                                                            ) : tx.referenceType === 'PurchaseOrder' ? (
                                                                tx.referenceId?.supplier?._id ? (
                                                                    <Link
                                                                        href={`/suppliers/${tx.referenceId.supplier._id}`}
                                                                        className="hover:text-primary underline-offset-4 hover:underline"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {tx.referenceId?.supplier?.name || 'مورد'}
                                                                    </Link>
                                                                ) : (tx.referenceId?.supplierName || 'مورد')
                                                            ) : tx.referenceType === 'Debt' ? (
                                                                tx.referenceId?.debtorId?._id ? (
                                                                    <Link
                                                                        href={tx.referenceId?.debtorType === 'Supplier' ? `/suppliers/${tx.referenceId.debtorId._id}` : `/customers/${tx.referenceId.debtorId._id}`}
                                                                        className="hover:text-primary underline-offset-4 hover:underline"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {tx.referenceId?.debtorId?.name || 'طرف مديون'}
                                                                    </Link>
                                                                ) : (tx.referenceId?.debtorId?.name || 'طرف مديون')
                                                            ) : '---'}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {tx.referenceType === 'Invoice' ? `فاتورة #${tx.referenceId?.number || ''}` :
                                                                tx.referenceType === 'PurchaseOrder' ? `أمر شراء #${tx.referenceId?.poNumber || ''}` :
                                                                    tx.referenceType === 'Debt' ? `دين / مطالبات` : ''}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`font-bold text-base ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.amount.toLocaleString()} ج.م
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] bg-muted/30">
                                                        {tx.method === 'bank' ? 'بنك' : tx.method === 'wallet' ? 'محفظة' : 'نقدي'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex flex-col">
                                                        <span>{tx.description}</span>
                                                        <Badge variant="outline" className="text-[10px] w-fit mt-1 opacity-70">
                                                            {tx.type === 'INCOME' ?
                                                                (tx.referenceType === 'Invoice' ? 'مبيعات' : 'إيداع إضافي') :
                                                                (tx.referenceType === 'PurchaseOrder' || (tx.referenceType === 'Debt' && tx.referenceId?.debtorType === 'Supplier') ? 'دفعة مورد' :
                                                                    tx.referenceType === 'SalesReturn' ? 'مرتجع مبيعات' : 'مصاريف عامة')
                                                            }
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-xs hidden lg:table-cell">
                                                    {format(new Date(tx.date || tx.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground hover:text-primary h-8 w-8"
                                                            onClick={() => handleTxClick(tx)}
                                                        >
                                                            <Info size={16} />
                                                        </Button>

                                                        {/* Quick Access Buttons */}
                                                        {tx.referenceType === 'Invoice' && tx.referenceId?._id && (
                                                            <Link href={`/invoices/${tx.referenceId._id}`} onClick={(e) => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500 h-8 w-8">
                                                                    <Eye size={16} />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {tx.referenceType === 'PurchaseOrder' && tx.referenceId?._id && (
                                                            <Link href={`/purchase-orders/${tx.referenceId._id}`} onClick={(e) => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-orange-500 h-8 w-8">
                                                                    <Eye size={16} />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {(tx.type === 'INCOME' || tx.referenceType === 'UnifiedCollection') && (
                                                            <Link href={`/financial/receipts/${tx._id}`} onClick={(e) => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-green-500 h-8 w-8">
                                                                    <ReceiptCent size={16} />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {tx.referenceType === 'Manual' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                                                onClick={() => handleDelete(tx._id)}
                                                                disabled={isDeleting}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
        </>
    );
}
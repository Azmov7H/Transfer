'use client';

import * as React from 'react';
import {
    TableCell,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Phone,
    MapPin,
    Wallet,
    Trash2,
    FileEdit,
    History,
    GripHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils';

export const CustomerRow = React.memo(({
    customer,
    customerDebts,
    onEdit,
    onDelete,
    onRowClick,
    onHistory,
    router
}) => {
    // Calculate inactivity
    const lastPurchase = customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate) : null;
    const daysSinceLast = lastPurchase ? Math.floor((new Date() - lastPurchase) / (1000 * 60 * 60 * 24)) : null;
    const isInactive = daysSinceLast !== null && daysSinceLast > 30;

    // Calculate debt statistics for this customer
    const customerDebtsList = customerDebts.filter(d =>
        d.debtorId?._id === customer._id || d.debtorId === customer._id
    );
    const totalDebtAmount = customerDebtsList.reduce((sum, d) => sum + (d.remainingAmount || 0), 0);
    const activeDebtsCount = customerDebtsList.filter(d => d.status !== 'settled' && d.status !== 'written-off').length;
    const overdueDebts = customerDebtsList.filter(d => {
        if (!d.dueDate || d.status === 'settled') return false;
        return new Date(d.dueDate) < new Date();
    });
    const hasOverdueDebt = overdueDebts.length > 0;
    const totalOriginalDebt = customerDebtsList.reduce((sum, d) => sum + (d.originalAmount || 0), 0);
    const totalCollectedAmount = totalOriginalDebt - totalDebtAmount;

    return (
        <TableRow
            className="group border-white/5 hover:bg-white/[0.04] transition-all duration-300 cursor-default h-24"
            onClick={() => onRowClick(customer)}
        >
            <TableCell className="px-8">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/20 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500">
                    <GripHorizontal size={18} />
                </div>
            </TableCell>

            <TableCell className="px-8">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-inner overflow-hidden">
                        {customer.image ? (
                            <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-black text-xl">{customer.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Link
                            href={`/customers/${customer._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-black text-lg leading-tight text-foreground group-hover:text-primary transition-colors tracking-tight"
                        >
                            {customer.name}
                        </Link>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={customer.isActive ? "secondary" : "destructive"}
                                className={cn(
                                    "text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                    customer.isActive ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"
                                )}
                            >
                                {customer.isActive ? 'نشط' : 'متوقف'}
                            </Badge>
                            {isInactive && (
                                <Badge variant="destructive" className="bg-warning/10 text-warning border-warning/20 text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                    غير نشط منذ {daysSinceLast} يوم
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="px-8">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-black text-white/40 group-hover:text-white transition-colors">
                        <div className="p-1.5 bg-white/5 rounded-lg">
                            <Phone size={12} className="text-primary" />
                        </div>
                        <span className="font-mono tracking-tighter">{customer.phone}</span>
                    </div>
                    {customer.address && (
                        <div className="flex items-center gap-2 text-xs text-white/20 font-bold">
                            <MapPin size={10} />
                            <span className="truncate max-w-[200px]">{customer.address}</span>
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell className="px-8 text-center">
                <Badge
                    variant="outline"
                    className={cn(
                        "font-black py-1.5 px-4 rounded-xl border transition-all text-xs uppercase tracking-widest shadow-lg",
                        customer.priceType === 'wholesale' && "bg-info/100/10 text-info border-info/20 shadow-blue-500/5",
                        customer.priceType === 'special' && "bg-info/100/10 text-info border-info/20 shadow-purple-500/5",
                        customer.priceType === 'retail' && "bg-success/10 text-success border-success/20 shadow-success/5"
                    )}
                >
                    {customer.priceType === 'wholesale' ? '⚡ جملة' :
                        customer.priceType === 'special' ? '💎 خاص' : '🛍️ قطاعي'}
                </Badge>
            </TableCell>

            <TableCell className="px-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    {customer.balance > 0 ? (
                        <div className={cn(
                            "flex items-center gap-3 font-black px-4 py-2 rounded-2xl border transition-all shadow-xl group/debt",
                            hasOverdueDebt
                                ? "text-destructive bg-destructive/5 border-destructive/20 shadow-destructive/5"
                                : "text-warning bg-warning/5 border-warning/20 shadow-warning/5"
                        )}>
                            <div className="flex flex-col items-end">
                                <span className="font-black text-lg tracking-tighter tabular-nums">{customer.balance.toLocaleString()}</span>
                                <span className="text-xs font-black opacity-40 uppercase tracking-[0.2em]">المتبقي المطلوب ({activeDebtsCount} ديون)</span>
                            </div>
                            <Wallet size={16} className="opacity-40 group-hover/debt:scale-110 transition-transform" />
                        </div>
                    ) : customer.creditBalance > 0 ? (
                        <div className="flex items-center gap-3 font-black text-success bg-success/5 px-4 py-2 rounded-2xl border border-success/20 shadow-xl">
                            <span className="font-black text-lg tracking-tighter tabular-nums">{customer.creditBalance?.toLocaleString()}</span>
                            <span className="text-xs font-black opacity-40 uppercase tracking-widest">رصيد دائن</span>
                        </div>
                    ) : (
                        <Badge variant="outline" className="opacity-10 font-black border-dashed px-4 py-1.5 rounded-xl uppercase tracking-widest text-xs">خالي من الديون</Badge>
                    )}
                </div>
            </TableCell>

            <TableCell className="px-8 text-center">
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="تعديل العميل"
                        onClick={(e) => { e.stopPropagation(); onEdit(customer); }}
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary text-white/20 border border-white/5 transition-all"
                    >
                        <FileEdit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-info/100/20 hover:text-info text-white/20 border border-white/5 transition-all"
                        onClick={(e) => { e.stopPropagation(); router.push(`/receivables?customerId=${customer._id}`); }}
                        aria-label="عرض المستحقات"
                        title="المستحقات"
                    >
                        <Wallet size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-success/20 hover:text-success text-white/20 border border-white/5 transition-all"
                        onClick={(e) => { e.stopPropagation(); onHistory && onHistory(customer); }}
                        aria-label="سجل المعاملات"
                        title="سجل المعاملات"
                    >
                        <History size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="حذف العميل"
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-destructive/20 hover:text-destructive text-white/20 border border-white/5 transition-all md:opacity-0 md:group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); onDelete(customer._id); }}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
});

CustomerRow.displayName = 'CustomerRow';

'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Phone,
    MapPin,
    Wallet,
    Trash2,
    FileEdit,
    History
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils';

/**
 * Mobile card fallback for the customers list (FE-RWD-001).
 * Mirrors CustomerRow fields with one-handed inline actions (≥44px targets).
 */
export const CustomerCard = React.memo(({
    customer,
    customerDebts,
    onEdit,
    onDelete,
    onRowClick,
    onHistory,
    router
}) => {
    const lastPurchase = customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate) : null;
    const daysSinceLast = lastPurchase ? Math.floor((new Date() - lastPurchase) / (1000 * 60 * 60 * 24)) : null;
    const isInactive = daysSinceLast !== null && daysSinceLast > 30;

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

    return (
        <div
            className="glass-card border border-white/10 rounded-3xl p-4 bg-white/[0.02] transition-all duration-300 cursor-default"
            onClick={() => onRowClick(customer)}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary overflow-hidden">
                        {customer.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-black text-lg">{customer.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <Link
                            href={`/customers/${customer._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-black text-base leading-tight text-foreground truncate"
                        >
                            {customer.name}
                        </Link>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge
                                variant={customer.isActive ? "secondary" : "destructive"}
                                className={cn(
                                    "text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                    customer.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                )}
                            >
                                {customer.isActive ? 'نشط' : 'متوقف'}
                            </Badge>
                            {isInactive && (
                                <Badge variant="destructive" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                    غير نشط منذ {daysSinceLast} يوم
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "shrink-0 font-black py-1 px-2.5 rounded-xl border text-xs uppercase tracking-widest",
                        customer.priceType === 'wholesale' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        customer.priceType === 'special' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                        customer.priceType === 'retail' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}
                >
                    {customer.priceType === 'wholesale' ? '⚡ جملة' :
                        customer.priceType === 'special' ? '💎 خاص' : '🛍️ قطاعي'}
                </Badge>
            </div>

            <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-black text-white/50">
                    <Phone size={12} className="text-primary shrink-0" />
                    <span className="font-mono tracking-tighter" dir="ltr">{customer.phone}</span>
                </div>
                {customer.address && (
                    <div className="flex items-center gap-2 text-xs text-white/30 font-bold">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">{customer.address}</span>
                    </div>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
                {customer.balance > 0 ? (
                    <div className={cn(
                        "flex items-center gap-2 font-black px-3 py-1.5 rounded-2xl border text-sm",
                        hasOverdueDebt
                            ? "text-rose-500 bg-rose-500/5 border-rose-500/20"
                            : "text-amber-500 bg-amber-500/5 border-amber-500/20"
                    )}>
                        <Wallet size={14} />
                        <span className="tabular-nums">{customer.balance.toLocaleString()}</span>
                        <span className="text-xs font-black opacity-40">({activeDebtsCount} ديون)</span>
                    </div>
                ) : customer.creditBalance > 0 ? (
                    <div className="flex items-center gap-2 font-black text-emerald-500 bg-emerald-500/5 px-3 py-1.5 rounded-2xl border border-emerald-500/20 text-sm">
                        <span className="tabular-nums">{customer.creditBalance?.toLocaleString()}</span>
                        <span className="text-xs font-black opacity-40">رصيد دائن</span>
                    </div>
                ) : (
                    <Badge variant="outline" className="opacity-40 font-black border-dashed px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest">خالي من الديون</Badge>
                )}

                <div className="flex items-center gap-1.5 -m-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="تعديل العميل"
                        onClick={(e) => { e.stopPropagation(); onEdit(customer); }}
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary text-white/40 border border-white/5 transition-all"
                    >
                        <FileEdit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-white/40 border border-white/5 transition-all"
                        onClick={(e) => { e.stopPropagation(); router.push(`/receivables?customerId=${customer._id}`); }}
                        aria-label="عرض المستحقات"
                        title="المستحقات"
                    >
                        <Wallet size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 text-white/40 border border-white/5 transition-all"
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
                        className="h-11 w-11 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 text-white/40 border border-white/5 transition-all"
                        onClick={(e) => { e.stopPropagation(); onDelete(customer._id); }}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
});

CustomerCard.displayName = 'CustomerCard';

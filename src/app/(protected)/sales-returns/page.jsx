'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useMemo } from 'react';
import { useSalesReturns } from '@/hooks/useSalesReturns';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
    History,
    Search,
    RotateCcw,
    TrendingDown,
    Calendar,
    ArrowLeftRight,
    Loader2,
    DollarSign,
    User,
    FileText,
    Package
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function SalesReturnsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading } = useSalesReturns();

    const returns = data?.returns || [];

    const stats = useMemo(() => {
        const totalRefunded = returns.reduce((sum, ret) => sum + ret.totalRefund, 0);
        const returnsCount = returns.length;
        const cashRefunds = returns.filter(ret => ret.refundMethod === 'cash').length;
        const balanceRefunds = returns.filter(ret => ret.refundMethod === 'customerBalance').length;

        return { totalRefunded, returnsCount, cashRefunds, balanceRefunds };
    }, [returns]);

    const filteredReturns = useMemo(() => {
        return returns.filter(ret =>
            ret.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.originalInvoice?.number?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [returns, searchTerm]);

    return (
        <div className="space-y-8 animate-fade-in-up" dir="rtl">
            {/* Header */}
            <PageHeader
                title="مرتجع المبيعات"
                subtitle="سجل وإدارة عمليات استرجاع المنتجات من العملاء"
                icon={History}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="إجمالي المبالغ المستردة"
                    value={stats.totalRefunded.toLocaleString()}
                    unit=" ج.م"
                    icon={TrendingDown}
                    variant="warning"
                />
                <KPICard
                    title="عدد عمليات الإرجاع"
                    value={stats.returnsCount}
                    unit=" عملية"
                    icon={RotateCcw}
                    variant="primary"
                />
                <KPICard
                    title="استرداد نقدي"
                    value={stats.cashRefunds}
                    unit=" عملية"
                    icon={DollarSign}
                    variant="success"
                />
                <KPICard
                    title="رصيد محفظة"
                    value={stats.balanceRefunds}
                    unit=" عملية"
                    icon={User}
                    variant="secondary"
                />
            </div>

            {/* Search Bar */}
            <div className="bg-card/50 backdrop-blur-xl p-3 border border-white/5 rounded-[2rem] shadow-custom-xl flex flex-col md:flex-row gap-4 sticky top-24 z-20">
                <div className="relative flex-1 group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-warning transition-colors h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="بحث برقم المرتجع أو رقم الفاتورة..."
                        className="h-12 pr-12 text-lg bg-background border-white/5 focus-visible:ring-warning/20 rounded-xl transition-all font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-warning w-10 h-10" /></div>
            ) : filteredReturns.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <RotateCcw className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold">لا توجد عمليات مرتجع</h3>
                    <p>لم يتم العثور على مرتجعات مطابقة للبحث</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredReturns.map((ret) => (
                            <motion.div
                                key={ret._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group"
                            >
                                <Card className="bg-card border-white/5 rounded-[2rem] p-6 shadow-custom-md hover:shadow-custom-xl hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-warning/40 transition-all duration-500 group-hover:w-3" />

                                    {/* Number & Date */}
                                    <div className="flex items-center gap-5">
                                        <div className="h-16 w-16 rounded-2xl bg-warning/10 flex items-center justify-center font-black text-warning border border-warning/20 shadow-inner">
                                            <span className="text-xs">#{ret.returnNumber.split('-')[1]?.slice(-5) || ret.returnNumber.slice(-5)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-xs font-black uppercase tracking-wider">
                                                    {format(new Date(ret.createdAt), 'cccc, d MMMM yyyy (p)', { locale: ar })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-warning/10 text-warning border-warning/20 px-3 py-1 rounded-full font-black text-xs uppercase">
                                                    مرتجع مبيعات
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items & Invoice */}
                                    <div className="flex-1 min-w-0 pr-4 border-r border-white/5 space-y-2">
                                        <Link href={`/invoices/${ret.originalInvoice?._id}`} className="flex items-center gap-2 text-primary hover:underline group/inv">
                                            <FileText className="w-4 h-4" />
                                            <span className="font-bold">الفاتورة الأصلية: #{ret.originalInvoice?.number}</span>
                                        </Link>
                                        <div className="flex flex-wrap gap-2">
                                            {ret.items.map((it, i) => (
                                                <div key={i} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-xs font-bold">
                                                    <Package className="w-3 h-3 text-muted-foreground" />
                                                    <span>{it.productId?.name || it.productName || 'منتج'}</span>
                                                    <span className="text-warning">×{it.qty}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount & Method */}
                                    <div className="flex items-center justify-between md:justify-end gap-8 md:pl-4">
                                        <div className="text-left">
                                            <div className="flex items-baseline gap-2 justify-end">
                                                <span className="text-2xl md:text-3xl font-black text-warning tracking-tighter">
                                                    -{ret.totalRefund?.toLocaleString()}
                                                </span>
                                                <span className="text-xs font-black text-muted-foreground uppercase">EGP</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs font-bold py-0 h-5">
                                                    {ret.refundMethod === 'cash' ? '💵 نقدي' : '💳 محفظة'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-warning group-hover:text-white transition-all shadow-xl">
                                            <ArrowLeftRight className="w-5 h-5 rotate-180" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

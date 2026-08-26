'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useDebtOverview } from '@/hooks/useFinancial';
import {
    TrendingUp, DollarSign, Package,
    AlertTriangle, ShoppingCart,
    ArrowUpRight, Wallet, Activity,
    Box, FileText, RefreshCcw,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { format } from 'date-fns';

export default function DashboardPage() {
    const {
        kpis,
        recentActivity,
        lowStockProducts,
        chartData,
        strategy,
        isLoading,
        refetch
    } = useDashboard();

    const { data: debtOverview } = useDebtOverview();
    const overdueAmount = debtOverview?.receivables?.overdue || 0;

    if (isLoading) return <DashboardSkeleton />;

    const attentionItems = [
        ...(overdueAmount > 0 ? [{
            key: 'overdue',
            severity: 'destructive',
            icon: AlertTriangle,
            label: 'ديون متأخرة',
            value: `${overdueAmount.toLocaleString()} ج.م`,
            href: '/financial/debt-center'
        }] : []),
        ...lowStockProducts.slice(0, 5).map((p) => ({
            key: p._id,
            severity: 'warning',
            icon: Package,
            label: p.name,
            value: `المتبقي: ${p.stockQty}`,
            href: '/products'
        }))
    ];

    return (
        <div className="space-y-6 animate-fade-in" dir="rtl">
            {/* Header */}
            <PageHeader
                title="لوحة التحكم"
                subtitle={`نظرة على أداء اليوم — ${format(new Date(), 'EEEE d MMMM yyyy')}`}
                actions={
                    <>
                        <Button variant="outline" size="icon" aria-label="تحديث البيانات" onClick={() => refetch()}>
                            <RefreshCcw className="w-4 h-4" />
                        </Button>
                        <Button asChild>
                            <Link href="/invoices/new">
                                <Plus className="w-4 h-4 ml-2" />
                                فاتورة جديدة
                            </Link>
                        </Button>
                    </>
                }
            />

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <KPICard
                    title="مبيعات اليوم"
                    value={kpis.todaySales?.toLocaleString() || 0}
                    unit=" ج.م"
                    icon={DollarSign}
                    variant="primary"
                    subtitle={`${kpis.todayInvoices || 0} فاتورة اليوم`}
                />
                <KPICard
                    title="صافي ربح اليوم"
                    value={kpis.todayProfit?.toLocaleString() || 0}
                    unit=" ج.م"
                    icon={TrendingUp}
                    variant="success"
                    subtitle="بعد خصم المصروفات"
                />
                <KPICard
                    title="رصيد الخزينة"
                    value={kpis.cashBalance?.toLocaleString() || 0}
                    unit=" ج.م"
                    icon={Wallet}
                    variant="warning"
                />
                <KPICard
                    title="قيمة المخزون"
                    value={kpis.totalStockValue?.toLocaleString() || 0}
                    unit=" ج.م"
                    icon={Box}
                    variant="secondary"
                />
            </div>

            {/* Needs Attention */}
            <section aria-label="يحتاج انتباهك" className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        يحتاج انتباهك
                    </h2>
                    {attentionItems.length > 0 && (
                        <Badge variant="outline">{attentionItems.length}</Badge>
                    )}
                </div>
                {attentionItems.length === 0 ? (
                    <EmptyState
                        title="لا يوجد ما يستدعي الانتباه"
                        hint="الديون والمخزون في حالة جيدة"
                    />
                ) : (
                    <ul className="divide-y divide-border">
                        {attentionItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                                >
                                    <span className="flex items-center gap-3 min-w-0">
                                        <item.icon className={`w-4 h-4 shrink-0 ${item.severity === 'destructive' ? 'text-destructive' : 'text-warning'}`} />
                                        <span className="text-sm font-medium truncate">{item.label}</span>
                                    </span>
                                    <span className={`text-sm tabular-nums shrink-0 font-medium ${item.severity === 'destructive' ? 'text-destructive' : 'text-warning'}`}>
                                        {item.value}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Chart + Recent Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart data={chartData} />
                </div>

                <div className="space-y-6">
                    {/* Smart Suggestions (collapsed by default) */}
                    {strategy.suggestions.length > 0 && (
                        <details className="rounded-xl border border-border bg-card">
                            <summary className="cursor-pointer select-none px-4 py-3 text-base font-semibold flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Activity className="w-4 h-4 text-primary" />
                                توصيات ذكية ({strategy.suggestions.length})
                            </summary>
                            <ul className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                                {strategy.suggestions.map((s, i) => (
                                    <li key={i} className="flex items-start justify-between gap-2">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            <span className="font-semibold text-foreground">{s.title}: </span>
                                            {s.desc}
                                        </p>
                                        <Badge variant={s.impact === 'عالي' ? 'destructive' : 'secondary'}>أثر {s.impact}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}

                    {/* Recent Invoices */}
                    <div className="rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h2 className="text-lg font-semibold">آخر المبيعات</h2>
                            <Button asChild variant="ghost" size="sm" className="gap-1">
                                <Link href="/invoices">
                                    عرض الكل
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                        <ul className="divide-y divide-border">
                            {recentActivity.slice(0, 5).map((invoice) => (
                                <li key={invoice._id}>
                                    <Link
                                        href={`/invoices/${invoice._id}`}
                                        className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                                    >
                                        <span className="flex items-center gap-3 min-w-0">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <ShoppingCart className="w-4 h-4" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm font-medium truncate">#{invoice.number}</span>
                                                <span className="block text-xs text-muted-foreground">{format(new Date(invoice.date), 'hh:mm a')}</span>
                                            </span>
                                        </span>
                                        <span className="text-sm font-semibold tabular-nums shrink-0">{invoice.total?.toLocaleString()} ج.م</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse" dir="rtl">
            <div className="h-10 w-48 bg-muted rounded-lg mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-48 bg-muted rounded-xl" />
                </div>
                <div className="h-96 bg-muted rounded-xl" />
            </div>
        </div>
    );
}

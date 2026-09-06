'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartColumn } from 'lucide-react';
import { cn } from '@/utils';

export function PeriodPerformanceCard({
    income = 0,
    expense = 0,
    net = 0,
    supplierPayments = 0,
    shopExpenses = 0,
    salesProfit = 0,
    transactionCount = 0,
    className,
}) {
    const otherExpenses = Math.max(0, expense - supplierPayments - shopExpenses);
    const splits = [
        { label: 'دفعات موردين', value: supplierPayments, bar: 'bg-warning' },
        { label: 'مصروفات المتجر', value: shopExpenses, bar: 'bg-destructive' },
        { label: 'مصروفات أخرى', value: otherExpenses, bar: 'bg-muted-foreground' },
    ];

    return (
        <Card className={cn('glass-card border-white/5 shadow-xl overflow-hidden', className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-success/10 text-success">
                        <ChartColumn className="h-5 w-5" />
                    </span>
                    أداء الفترة
                    <span className="text-xs font-medium text-muted-foreground">من قاعدة البيانات — كامل النطاق</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-5">
                <div className="grid grid-cols-3 gap-3 text-center" dir="ltr">
                    <div className="rounded-2xl bg-success/10 border border-success/20 p-3">
                        <p className="text-[11px] font-bold text-success">إيرادات</p>
                        <p className="text-xl font-bold tabular-nums text-success">+{income.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3">
                        <p className="text-[11px] font-bold text-destructive">مصروفات</p>
                        <p className="text-xl font-bold tabular-nums text-destructive">−{expense.toLocaleString()}</p>
                    </div>
                    <div className={cn('rounded-2xl border p-3', net >= 0 ? 'bg-info/10 border-info/20' : 'bg-destructive/10 border-destructive/20')}>
                        <p className={cn('text-[11px] font-bold', net >= 0 ? 'text-info' : 'text-destructive')}>الصافي</p>
                        <p className={cn('text-xl font-bold tabular-nums', net >= 0 ? 'text-info' : 'text-destructive')}>
                            {net.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground">تفصيل المصروفات ({expense.toLocaleString()} ج.م)</p>
                    {splits.map((s) => (
                        <div key={s.label} className="flex items-center gap-2">
                            <span className="text-xs font-bold w-24 shrink-0">{s.label}</span>
                            <div className="h-2 flex-1 rounded-full bg-muted/60 overflow-hidden" dir="ltr">
                                <div
                                    className={cn('h-full rounded-full', s.bar)}
                                    style={{ width: `${expense > 0 ? (s.value / expense) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold tabular-nums w-20 text-left" dir="ltr">
                                {s.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs font-bold text-muted-foreground">
                    <span>أرباح مبيعات الفترة: <span className="text-foreground">{salesProfit.toLocaleString()} ج.م</span></span>
                    <span>عدد المعاملات: <span className="text-foreground">{transactionCount.toLocaleString()}</span></span>
                </div>
            </CardContent>
        </Card>
    );
}

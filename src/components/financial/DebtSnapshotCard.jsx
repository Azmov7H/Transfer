'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandCoins } from 'lucide-react';
import { cn } from '@/utils';

export function DebtSnapshotCard({ totalDebt = 0, className }) {
    return (
        <Card className={cn('glass-card border-warning/20 shadow-xl overflow-hidden', className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-warning/10 text-warning">
                        <HandCoins className="h-5 w-5" />
                    </span>
                    المستحقات
                    <span className="text-xs font-medium text-muted-foreground">لحظي</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
                <div>
                    <p className="text-[11px] font-bold text-muted-foreground">ديون العملاء النشطة والمتأخرة</p>
                    <p className="text-3xl font-bold tabular-nums" dir="ltr">
                        {totalDebt.toLocaleString()} <span className="text-sm text-muted-foreground">ج.م</span>
                    </p>
                    {totalDebt === 0 && (
                        <p className="text-xs font-bold text-success mt-1">لا توجد مستحقات معلقة</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <Button asChild size="sm" className="w-full">
                        <Link href="/financial/debt-center">مركز الديون والمستحقات</Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/receivables">المستحقات</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/reports/financial">التقارير</Link>
                        </Button>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="w-full text-xs">
                        <Link href="/accounting">العرض المحاسبي</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

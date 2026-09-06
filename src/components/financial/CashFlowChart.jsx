'use client';

import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/utils';

const CashFlowChartContent = dynamic(
    () => import('./CashFlowChartContent').then(mod => mod.CashFlowChartContent),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-xl animate-pulse" />
            </div>
        )
    }
);

export function CashFlowChart({ data, className }) {
    return (
        <Card className={cn("glass-card border-white/5 shadow-xl overflow-hidden", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-success/10 text-success">
                        <TrendingUp className="h-5 w-5" />
                    </span>
                    التدفق النقدي
                    <span className="text-xs font-medium text-muted-foreground">إيرادات مقابل مصروفات</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] w-full pt-2">
                {data?.length ? (
                    <CashFlowChartContent data={data} />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                        لا توجد حركات لعرضها في هذه الفترة
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

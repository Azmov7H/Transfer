'use client';

import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from 'lucide-react';
import { cn } from '@/utils';

const BalanceBreakdownContent = dynamic(
    () => import('./BalanceBreakdownContent').then(mod => mod.BalanceBreakdownContent),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-xl animate-pulse" />
            </div>
        )
    }
);

export function BalanceBreakdownChart({ breakdown, className }) {
    return (
        <Card className={cn("glass-card border-white/5 shadow-xl overflow-hidden", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Wallet className="h-5 w-5" />
                    </span>
                    توزيع الرصيد
                    <span className="text-xs font-medium text-muted-foreground">حسب طريقة الدفع</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] w-full pt-2">
                <BalanceBreakdownContent breakdown={breakdown} />
            </CardContent>
        </Card>
    );
}

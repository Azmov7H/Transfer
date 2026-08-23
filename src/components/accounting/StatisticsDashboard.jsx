'use client';

import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

export function StatisticsDashboard({ entries = [] }) {
    const stats = useMemo(() => {
        const totalDebit = entries.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalCredit = entries.reduce((sum, e) => sum + (e.amount || 0), 0);
        return {
            totalEntries: entries.length,
            totalDebit,
            totalCredit,
            isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
        };
    }, [entries]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="إجمالي القيود"
                value={stats.totalEntries}
                icon={Receipt}
                variant="primary"
                subtitle="عمليات مسجلة"
            />
            <StatCard
                title="إجمالي المدين"
                value={stats.totalDebit.toLocaleString()}
                unit="ج.م"
                icon={ArrowUpRight}
                variant="info"
                subtitle="أرصدة مدينة"
            />
            <StatCard
                title="إجمالي الدائن"
                value={stats.totalCredit.toLocaleString()}
                unit="ج.م"
                icon={ArrowDownRight}
                variant="success"
                subtitle="أرصدة دائنة"
            />
            <StatCard
                title="حالة التوازن"
                value={stats.isBalanced ? 'متوازن' : 'غير متوازن'}
                icon={stats.isBalanced ? CheckCircle2 : AlertCircle}
                variant={stats.isBalanced ? 'success' : 'destructive'}
                subtitle={stats.isBalanced ? "ميزان مطابق" : "ميزان غير مطابق"}
            />
        </div>
    );
}

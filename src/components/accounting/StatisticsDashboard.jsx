'use client';

import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle, Receipt, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

const safeNumber = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

export function StatisticsDashboard({ entries = [], isLoading = false }) {
    const stats = useMemo(() => {
        // Each entry is a journal entry with one debit account and one credit
        // account — they sum to the same amount by construction (double-entry).
        // We aggregate total movements by side, not by summing `amount` twice.
        let totalDebit = 0;
        let totalCredit = 0;
        for (const e of entries) {
            const amt = safeNumber(e.amount);
            if (e.debitAccount) totalDebit += amt;
            if (e.creditAccount) totalCredit += amt;
        }
        return {
            totalEntries: entries.length,
            totalDebit,
            totalCredit,
            isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
        };
    }, [entries]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 flex items-center justify-center h-32">
                        <Loader2 className="animate-spin w-6 h-6 text-primary opacity-40" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="إجمالي القيود"
                value={stats.totalEntries.toLocaleString()}
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
                subtitle={stats.isBalanced ? 'ميزان مطابق' : 'ميزان غير مطابق'}
            />
        </div>
    );
}

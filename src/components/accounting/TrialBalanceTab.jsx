'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';
import { getTrialBalance } from '@/services/accountingService';

export function TrialBalanceTab() {
    const { data: trialBalance, isLoading } = useQuery({
        queryKey: ['trial-balance'],
        queryFn: async ({ signal }) => {
            const res = await getTrialBalance({ signal });
            return { trialBalance: res.data };
        }
    });

    if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    const data = trialBalance?.trialBalance;

    return (
        <div className="space-y-6">
            <div className={cn(
                "glass-card p-6 rounded-[2rem] border relative overflow-hidden flex items-center justify-between",
                data?.isBalanced ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
            )}>
                <div className="relative z-10 flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl", data?.isBalanced ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive")}>
                        {data?.isBalanced ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                    </div>
                    <div>
                        <h3 className={cn("text-xl font-bold", data?.isBalanced ? "text-success" : "text-destructive")}>
                            {data?.isBalanced ? "ميزان المراجعة متوازن" : "تحذير: الميزان غير متوازن"}
                        </h3>
                        <p className="text-sm font-medium opacity-80">
                            {data?.isBalanced
                                ? "جميع الحسابات مطابقة والعمليات المحاسبية صحيحة."
                                : "يوجد فرق بين إجمالي المدين والدائن، يرجى المراجعة."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden rounded-[2rem] border border-white/5">
                <div className="grid grid-cols-4 bg-white/5 p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                    <div className="text-right pr-4">اسم الحساب</div>
                    <div>مدين</div>
                    <div>دائن</div>
                    <div>الرصيد</div>
                </div>
                <div className="divide-y divide-white/5">
                    {data?.accounts?.map((acc) => (
                        <div key={acc.account} className="grid grid-cols-4 p-4 hover:bg-white/5 transition-colors items-center text-center">
                            <div className="text-right font-bold pr-4 truncate" title={acc.account}>{acc.account}</div>
                            <div className="font-mono text-sm text-info/80">{acc.debit > 0 ? acc.debit.toLocaleString() : '-'}</div>
                            <div className="font-mono text-sm text-success/80">{acc.credit > 0 ? acc.credit.toLocaleString() : '-'}</div>
                            <div className={cn("font-mono font-bold text-sm", acc.balance > 0 ? "text-info" : acc.balance < 0 ? "text-success" : "text-muted-foreground")}>
                                {Math.abs(acc.balance).toLocaleString()} {acc.balance !== 0 && (acc.balance > 0 ? 'M' : 'D')}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-4 bg-white/5 p-4 font-bold text-sm text-center border-t border-white/10">
                    <div className="text-right pr-4">الإجمالي</div>
                    <div className="font-mono text-info">{data?.totalDebit.toLocaleString()}</div>
                    <div className="font-mono text-success">{data?.totalCredit.toLocaleString()}</div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

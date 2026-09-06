'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { getTrialBalance } from '@/services/accountingService';

const safeNumber = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

export function TrialBalanceTab() {
    const { data: trialBalance, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['trial-balance'],
        queryFn: async ({ signal }) => {
            // trialBalance is the unwrapped payload: { asOfDate, accounts, totalDebit, totalCredit, difference, isBalanced }
            return await getTrialBalance({}, { signal });
        }
    });

    if (isLoading) {
        return (
            <div className="p-12 flex justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="glass-card rounded-[2rem] border border-destructive/30 p-12 text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-4 text-destructive" />
                <p className="font-bold text-destructive mb-4">تعذّر تحميل ميزان المراجعة</p>
                <Button onClick={() => refetch()} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                </Button>
            </div>
        );
    }

    const data = trialBalance;
    const hasAccounts = data?.accounts?.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="gap-2"
                    aria-label="تحديث"
                >
                    <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                    تحديث
                </Button>
            </div>

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

            {hasAccounts ? (
                <div className="glass-card overflow-hidden rounded-[2rem] border border-white/5">
                    <div className="grid grid-cols-4 bg-white/5 p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                        <div className="text-right pr-4">اسم الحساب</div>
                        <div>مدين</div>
                        <div>دائن</div>
                        <div>الرصيد</div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {data.accounts.map((acc) => (
                            <div key={acc.account} className="grid grid-cols-4 p-4 hover:bg-white/5 transition-colors items-center text-center">
                                <div className="text-right font-bold pr-4 truncate" title={acc.account}>{acc.account}</div>
                                <div className="font-mono text-sm text-info/80">{safeNumber(acc.debit) > 0 ? safeNumber(acc.debit).toLocaleString() : '-'}</div>
                                <div className="font-mono text-sm text-success/80">{safeNumber(acc.credit) > 0 ? safeNumber(acc.credit).toLocaleString() : '-'}</div>
                                <div className={cn("font-mono font-bold text-sm", acc.balance > 0 ? "text-info" : acc.balance < 0 ? "text-success" : "text-muted-foreground")}>
                                    {Math.abs(safeNumber(acc.balance)).toLocaleString()} {acc.balance !== 0 && (acc.balance > 0 ? 'M' : 'D')}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 bg-white/5 p-4 font-bold text-sm text-center border-t border-white/10">
                        <div className="text-right pr-4">الإجمالي</div>
                        <div className="font-mono text-info">{safeNumber(data.totalDebit).toLocaleString()}</div>
                        <div className="font-mono text-success">{safeNumber(data.totalCredit).toLocaleString()}</div>
                        <div></div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-12 glass-card rounded-[2rem] border-dashed border-2 border-white/10">
                    <p className="font-bold text-muted-foreground">لا توجد بيانات لميزان المراجعة</p>
                    <p className="text-sm text-muted-foreground/60 mt-2">سيتم احتساب الميزان تلقائياً عند تسجيل القيود المحاسبية.</p>
                </div>
            )}
        </div>
    );
}

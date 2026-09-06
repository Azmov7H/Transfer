'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Building2, Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils';
import { getLedger } from '@/services/accountingService';

const safeNumber = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

const pickDefaultAccount = (chartOfAccounts) => {
    if (!chartOfAccounts?.length) return '';
    const cashAcc = chartOfAccounts.find(a => a.includes('خزينة'));
    return cashAcc || chartOfAccounts[0];
};

export function LedgerTab({ chartOfAccounts }) {
    // Derived state: if nothing is picked yet, fall back to the default
    // account from the chart. No useEffect needed — this stays a pure
    // derivation, so there are no cascading renders.
    const [picked, setPicked] = useState('');
    const selectedAccount = picked || pickDefaultAccount(chartOfAccounts);

    const { data: ledger, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['ledger', selectedAccount],
        queryFn: async ({ signal }) => {
            if (!selectedAccount) return null;
            // ledger is the unwrapped payload: { account, entries, finalBalance }
            return await getLedger(selectedAccount, {}, { signal });
        },
        enabled: !!selectedAccount
    });

    return (
        <div className="space-y-6">
            <div className="glass-card p-2 rounded-[1.5rem] border border-white/10 bg-black/20">
                <Select value={selectedAccount} onValueChange={setPicked}>
                    <SelectTrigger className="h-14 border-none bg-transparent text-lg font-bold">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <SelectValue placeholder="اختر الحساب..." />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        <ScrollArea className="h-full">
                            {chartOfAccounts?.length ? (
                                chartOfAccounts.map((account) => (
                                    <SelectItem key={account} value={account} className="font-medium text-right" dir="rtl">{account}</SelectItem>
                                ))
                            ) : (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    لا توجد حسابات بعد. أنشئ قيوداً محاسبية لتظهر هنا.
                                </div>
                            )}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin w-8 h-8 text-primary" />
                </div>
            ) : isError ? (
                <div className="glass-card rounded-[2rem] border border-destructive/30 p-12 text-center">
                    <AlertCircle className="w-10 h-10 mx-auto mb-4 text-destructive" />
                    <p className="font-bold text-destructive mb-4">تعذّر تحميل دفتر الأستاذ</p>
                    <Button onClick={() => refetch()} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                    </Button>
                </div>
            ) : !selectedAccount ? (
                <div className="text-center p-12 glass-card rounded-[2rem] border-dashed border-2 border-white/10">
                    <p className="font-bold text-muted-foreground">اختر حساباً لعرض دفتر الأستاذ</p>
                </div>
            ) : !ledger || !ledger.entries?.length ? (
                <div className="text-center p-12 glass-card rounded-[2rem] border-dashed border-2 border-white/10">
                    <p className="font-bold text-muted-foreground">لا توجد حركات على هذا الحساب</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-x-10 -translate-y-10" />
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-primary/80 mb-1">الرصيد النهائي للحساب</p>
                                <h3 className="text-4xl font-bold tabular-nums">
                                    {safeNumber(ledger.finalBalance).toLocaleString()}
                                </h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    aria-label="تحديث"
                                    className="text-primary hover:bg-primary/10"
                                >
                                    <RefreshCw className={cn("w-5 h-5", isFetching && "animate-spin")} />
                                </Button>
                                <div className="p-4 bg-primary/20 rounded-2xl text-primary backdrop-blur-md">
                                    <Wallet className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {ledger.entries.map((item) => (
                            <div
                                key={item._id}
                                className="glass-card p-4 rounded-[1.25rem] border border-white/5 hover:bg-white/5 flex items-center justify-between group animate-in fade-in slide-in-from-right-2 duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/5 shrink-0">
                                        <span className="text-xs font-bold text-muted-foreground">{format(new Date(item.date), 'dd')}</span>
                                        <span className="text-xs uppercase text-muted-foreground/60">{format(new Date(item.date), 'MMM')}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm mb-0.5">{item.description}</p>
                                        <div className="flex items-center gap-3 text-xs font-medium">
                                            {safeNumber(item.debit) > 0 && (
                                                <span className="text-info">مدين: {safeNumber(item.debit).toLocaleString()}</span>
                                            )}
                                            {safeNumber(item.credit) > 0 && (
                                                <span className="text-success">دائن: {safeNumber(item.credit).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left pl-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase opacity-50 mb-0.5">الرصيد</p>
                                    <p className="font-mono font-bold text-lg tabular-nums">
                                        {safeNumber(item.balance).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

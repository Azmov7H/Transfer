'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Calendar, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/utils';
import { getAccountingEntries } from '@/services/accountingService';

export function JournalEntriesTab({ filters }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { data, isLoading } = useQuery({
        queryKey: ['accounting-entries', filters],
        queryFn: async ({ signal }) => {
            const res = await getAccountingEntries(500, { signal });
            return { entries: res.data || [] };
        }
    });

    const filteredEntries = useMemo(() => {
        if (!data?.entries) return [];
        return data.entries.filter(entry => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (!entry.description?.toLowerCase().includes(searchLower) &&
                    !entry.entryNumber?.toString().includes(searchLower)) return false;
            }
            if (filters.type && filters.type !== 'all' && entry.type !== filters.type) return false;
            if (filters.dateFrom && new Date(entry.date) < new Date(filters.dateFrom)) return false;
            if (filters.dateTo && new Date(entry.date) > new Date(filters.dateTo)) return false;
            return true;
        });
    }, [data?.entries, filters]);

    const totalPages = Math.ceil(filteredEntries.length / pageSize);
    const paginatedEntries = useMemo(() => {
        return filteredEntries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [filteredEntries, currentPage, pageSize]);

    const paginatedGroupedEntries = useMemo(() => {
        const groups = {};
        paginatedEntries.forEach(entry => {
            const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(entry);
        });
        return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [paginatedEntries]);

    if (isLoading) return <div className="p-32 flex justify-center"><Loader2 className="animate-spin text-primary w-12 h-12 opacity-20" /></div>;

    if (filteredEntries.length === 0) {
        return (
            <div className="text-center p-24 glass-card rounded-[3rem] border-dashed border border-white/10">
                <Activity className="w-20 h-20 mx-auto mb-6 text-muted-foreground/10" />
                <h3 className="font-black text-2xl text-white/20 mb-2 uppercase tracking-widest">لا توجد قيود حالياً</h3>
                <p className="text-sm text-white/5 font-bold uppercase tracking-widest">تحقق من معايير البحث أو التاريخ</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card px-8 py-4 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                    <span>المعروض: {paginatedEntries.length} قيد من {filteredEntries.length}</span>
                    <div className="h-4 w-px bg-white/10" />
                    <Select value={pageSize.toString()} onValueChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}>
                        <SelectTrigger className="h-8 w-20 bg-white/5 border-none font-black text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/10">
                            {[10, 20, 50, 100].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="الصفحة السابقة"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-xl"
                    >
                        <ChevronRight />
                    </Button>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let p = i + 1;
                            if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
                            if (p > totalPages) return null;
                            return (
                                <Button
                                    key={i}
                                    variant={currentPage === p ? "default" : "ghost"}
                                    onClick={() => setCurrentPage(p)}
                                    className={cn("w-10 h-10 rounded-xl font-black transition-all", currentPage === p && "shadow-lg shadow-primary/20")}
                                >
                                    {p}
                                </Button>
                            )
                        })}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="الصفحة التالية"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-xl"
                    >
                        <ChevronLeft />
                    </Button>
                </div>
            </div>

            {paginatedGroupedEntries.map(([date, entries]) => (
                <div key={date} className="space-y-4">
                    <div className="flex items-center gap-4 px-4 group">
                        <div className="flex items-center gap-3 px-6 py-2 glass-card rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-black text-xs uppercase tracking-widest">
                                {format(new Date(date), 'dd MMMM yyyy', { locale: ar })}
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-white/10 text-xs font-black opacity-30 group-hover:opacity-100 transition-opacity">
                            {entries.length} عمليات
                        </Badge>
                    </div>

                    <div className="grid gap-4">
                        {entries.map((entry, i) => (
                            <div
                                key={entry._id}
                                className="glass-card hover:bg-white/[0.04] p-6 rounded-[2.5rem] border border-white/5 transition-all duration-500 group shadow-xl"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 font-black text-xs text-white/20 group-hover:text-primary group-hover:border-primary/30 transition-all">
                                        #{entry.entryNumber}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-black uppercase tracking-widest px-3 py-1">
                                                {entry.type}
                                            </Badge>
                                            <h4 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors truncate">{entry.description}</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="text-xs font-bold text-white/40 tracking-tight">{entry.debitAccount}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-xs font-bold text-white/40 tracking-tight">{entry.creditAccount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-6 pl-6 border-r border-white/5">
                                        <div className="text-right">
                                            <div className="text-2xl font-black tracking-tighter tabular-nums">{entry.amount.toLocaleString()}</div>
                                            <div className="text-xs font-black text-emerald-500 uppercase tracking-widest opacity-50">EGP</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

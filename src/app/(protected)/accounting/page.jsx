'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccountingEntries } from '@/services/accountingService';
import {
    FileText, List, Layers,
    Briefcase, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatisticsDashboard } from '@/components/accounting/StatisticsDashboard';
import { FiltersBar } from '@/components/accounting/FiltersBar';
import { JournalEntriesTab } from '@/components/accounting/JournalEntriesTab';
import { LedgerTab } from '@/components/accounting/LedgerTab';
import { TrialBalanceTab } from '@/components/accounting/TrialBalanceTab';

const exportToCSV = (entries) => {
    const headers = ['رقم القيد', 'التاريخ', 'النوع', 'الوصف', 'الحساب المدين', 'الحساب الدائن', 'المبلغ'];
    const rows = entries.map(e => [
        e.entryNumber,
        format(new Date(e.date), 'yyyy-MM-dd'),
        e.type,
        e.description,
        e.debitAccount,
        e.creditAccount,
        e.amount
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `accounting-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
};

export default function AccountingPage() {
    const [activeTab, setActiveTab] = useState('entries');
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        dateFrom: '',
        dateTo: ''
    });

    const { data: allEntriesData } = useQuery({
        queryKey: ['accounting-entries-stats'],
        queryFn: async ({ signal }) => {
            const res = await getAccountingEntries(500, { signal });
            return { entries: res.data || [] };
        }
    });

    // Get chart of accounts
    const { data: chartData } = useQuery({
        queryKey: ['chart-of-accounts'],
        queryFn: async ({ signal }) => {
            const res = await getAccountingEntries(500, { signal });
            const entries = res.data || [];
            const accounts = new Set();
            entries.forEach(e => {
                if (e.debitAccount) accounts.add(e.debitAccount);
                if (e.creditAccount) accounts.add(e.creditAccount);
            });
            return { chartOfAccounts: Array.from(accounts) };
        }
    });

    const resetFilters = () => {
        setFilters({
            search: '',
            type: 'all',
            dateFrom: '',
            dateTo: ''
        });
    };

    const handleExport = () => {
        if (allEntriesData?.entries) {
            exportToCSV(allEntriesData.entries);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // / to focus search
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder*="ابحث"]');
                if (searchInput) searchInput.focus();
            }
            // Escape to clear filters
            if (e.key === 'Escape') {
                resetFilters();
                document.activeElement?.blur();
            }
            // Ctrl/Cmd + E to export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                handleExport();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    return (
        <div className="min-h-screen bg-foreground/1020 space-y-8 p-4 md:p-8 rounded-[2rem]" dir="rtl">
            {/* Ambient Background Effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-info/100/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Header Section */}
            <PageHeader
                title="النظام المحاسبي الذكي"
                subtitle="مركز التحكم المالي والتقارير العامة للمنشأة"
                icon={Briefcase}
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleExport}
                            className="h-14 px-8 rounded-2xl font-black text-lg gap-3 bg-success hover:bg-success text-white shadow-2xl shadow-success/20"
                        >
                            <Download size={24} />
                            تصدير البيانات
                        </Button>
                    </div>
                }
            />

            {/* Statistics Dashboard */}
            <StatisticsDashboard entries={allEntriesData?.entries || []} />

            {/* Filters Bar */}
            {activeTab === 'entries' && (
                <FiltersBar
                    filters={filters}
                    setFilters={setFilters}
                    onReset={resetFilters}
                    onExport={handleExport}
                    totalEntries={allEntriesData?.entries?.length || 0}
                />
            )}

            {/* Tab Navigation */}
            <div className="flex p-1 bg-white/5 rounded-2xl w-full md:w-fit backdrop-blur-md border border-white/5">
                {[
                    { id: 'entries', label: 'قيود اليومية', icon: List },
                    { id: 'ledger', label: 'دفتر الأستاذ', icon: FileText },
                    { id: 'trial-balance', label: 'ميزان المراجعة', icon: Layers },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "relative px-6 py-3 rounded-xl font-black text-sm transition-all duration-300",
                            activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </span>
                        {activeTab === tab.id && (
                            <div className="absolute inset-0 bg-primary shadow-lg shadow-primary/25 rounded-xl -z-10" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'entries' && <JournalEntriesTab filters={filters} />}
                {activeTab === 'ledger' && <LedgerTab chartOfAccounts={chartData?.chartOfAccounts || []} />}
                {activeTab === 'trial-balance' && <TrialBalanceTab />}
            </div>
        </div >
    );
}

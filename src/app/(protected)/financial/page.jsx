'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTreasury, useTreasuryTransactions, useCashFlow, useAddTransaction, useDeleteTransaction, useSupplierPayment } from '@/hooks/useFinancial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { TransactionsTable } from '@/components/financial/TransactionsTable';
import { TransactionDetailsDialog } from '@/components/financial/TransactionDetailsDialog';
import { AddTransactionDialog } from '@/components/financial/AddTransactionDialog';
import { CashFlowChart } from '@/components/financial/CashFlowChart';
import { MethodBalancesCard } from '@/components/financial/MethodBalancesCard';
import { PeriodPerformanceCard } from '@/components/financial/PeriodPerformanceCard';
import { DebtSnapshotCard } from '@/components/financial/DebtSnapshotCard';
import { labelCashFlowBuckets } from '@/components/financial/cashFlowUtils';
import { matchesTypeFilter, exportFiltersFor } from '@/lib/treasuryFilters';
import { ExportButton } from '@/components/common/ExportButton';

const EMPTY_TX_FORM = {
    amount: '',
    description: '',
    type: 'INCOME',
    category: 'other',
    supplierId: '',
    method: 'cash',
    sourceNumber: ''
};

const PERIODS = [
    { id: 'TODAY', label: 'اليوم' },
    { id: 'MONTH', label: 'هذا الشهر' },
    { id: 'YEAR', label: 'هذه السنة' },
    { id: 'CUSTOM', label: 'مخصص' },
];

function SectionHeading({ title, scope }) {
    return (
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            {scope && (
                <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {scope}
                </span>
            )}
        </div>
    );
}

export default function FinancialPage() {
    const [period, setPeriod] = useState('MONTH');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [customDates, setCustomDates] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const queryClient = useQueryClient();
    const { data: suppliers } = useSuppliers({ limit: 100 });

    const getDateRange = useCallback(() => {
        const end = new Date();
        const start = new Date();

        if (period === 'TODAY') {
            start.setHours(0, 0, 0, 0);
        } else if (period === 'MONTH') {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
        } else if (period === 'YEAR') {
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
        } else if (period === 'CUSTOM') {
            return {
                startDate: customDates.startDate,
                endDate: customDates.endDate
            };
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    }, [period, customDates]);

    const { data: treasuryData, isLoading, dataUpdatedAt: treasuryUpdatedAt } = useTreasury(getDateRange());
    const { mutate: addTransaction, isPending } = useAddTransaction();
    const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();
    const { mutate: paySupplier, isPending: isPayingSupplier } = useSupplierPayment();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [formData, setFormData] = useState(EMPTY_TX_FORM);

    const dateRange = getDateRange();
    const {
        data: allTransactions = [],
        isFetching: isTransactionsFetching,
        isError: isTransactionsError,
        error: transactionsError,
        refetch: refetchTransactions
    } = useTreasuryTransactions(dateRange);

    // Full-period chart buckets, aggregated server-side so the chart always
    // covers the same window as the stat cards (the ledger above is capped
    // to the latest page and must not feed period figures).
    const { data: cashFlow } = useCashFlow(dateRange);
    const cashFlowData = useMemo(
        () => labelCashFlowBuckets(cashFlow?.buckets, cashFlow?.granularity),
        [cashFlow]
    );

    const resetForm = useCallback(() => setFormData(EMPTY_TX_FORM), []);

    const handleSubmit = async () => {
        if (!formData.amount || !formData.description) return;

        if (formData.type === 'EXPENSE' && formData.category === 'supplier') {
            if (!formData.supplierId) {
                toast.error('يرجى اختيار مورد');
                return;
            }

            paySupplier({
                supplierId: formData.supplierId,
                amount: parseFloat(formData.amount),
                method: formData.method,
                note: formData.description
            }, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    resetForm();
                }
            });
            return;
        }

        addTransaction(formData, {
            onSuccess: () => {
                setIsDialogOpen(false);
                resetForm();
            }
        });
    };

    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const filteredTransactions = useMemo(
        () => allTransactions.filter(tx => matchesTypeFilter(tx, typeFilter)),
        [allTransactions, typeFilter]
    );

    const handleDelete = (id) => {
        setDeleteTargetId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteTargetId) {
            deleteTransaction(deleteTargetId);
        }
        setDeleteTargetId(null);
    };

    const balance = treasuryData?.balance || 0;

    const handleTxClick = (tx) => {
        setSelectedTx(tx);
        setIsDetailsOpen(true);
    };

    // Period aggregates come from the server summary (same DB window as the
    // stat cards) — never recomputed over the page-capped ledger list.
    const periodStats = {
        income: treasuryData?.totalIncome || 0,
        expense: treasuryData?.totalExpense || 0,
        supplierPayments: treasuryData?.supplierPayments || 0,
        shopExpenses: treasuryData?.shopExpenses || 0,
        salesProfit: treasuryData?.salesProfit || 0,
        totalDebt: treasuryData?.totalOutstandingDebt || 0,
        net: treasuryData?.periodBalance || 0,
        transactionCount: treasuryData?.transactionCount || 0
    };

    const refreshAll = () => {
        refetchTransactions();
        queryClient.invalidateQueries({ queryKey: ['treasury'] });
        queryClient.invalidateQueries({ queryKey: ['treasury-cashflow'] });
    };

    const lastUpdated = useMemo(() => {
        if (!treasuryUpdatedAt) return null;
        return new Date(treasuryUpdatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, [treasuryUpdatedAt]);

    const periodLabel = PERIODS.find((p) => p.id === period)?.label || 'مخصص';
    const liveSubtitle = lastUpdated
        ? `تحديث تلقائي كل 30 ثانية — آخر تحديث ${lastUpdated}`
        : 'تحديث تلقائي كل 30 ثانية';

    return (
        <div className="space-y-6" dir="rtl">
            <PageHeader
                title="الخزينة"
                subtitle={liveSubtitle}
                icon={Wallet}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshAll}
                            disabled={isTransactionsFetching}
                            className="gap-2"
                            aria-label="تحديث"
                        >
                            <RefreshCcw className={cn("h-4 w-4", isTransactionsFetching && "animate-spin")} />
                            تحديث
                        </Button>
                        <ExportButton
                            type="treasuryTransactions"
                            filters={exportFiltersFor(typeFilter, getDateRange())}
                        />
                        <AddTransactionDialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            isPending={isPending || isPayingSupplier}
                            suppliers={suppliers}
                        />
                    </div>
                }
            />

            <Card className="p-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground px-2">
                    نطاق الفترة — للأداء والتدفق والسجل فقط (الوضع النقدي والمستحقات لحظية دائمًا)
                </span>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    {PERIODS.map(p => (
                        <Button
                            key={p.id}
                            variant={period === p.id ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setPeriod(p.id)}
                            className="text-xs h-8"
                        >
                            {p.label}
                        </Button>
                    ))}
                </div>
                {period === 'CUSTOM' ? (
                    <div className="flex flex-wrap items-end gap-3 px-2">
                        <div className="space-y-1">
                            <Label className="text-xs">من تاريخ</Label>
                            <Input
                                type="date"
                                className="h-9 w-40"
                                value={customDates.startDate}
                                onChange={e => setCustomDates({ ...customDates, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">إلى تاريخ</Label>
                            <Input
                                type="date"
                                className="h-9 w-40"
                                value={customDates.endDate}
                                onChange={e => setCustomDates({ ...customDates, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-2">
                        <Label className="text-xs text-muted-foreground">تاريخ محدد:</Label>
                        <Input
                            type="date"
                            className="h-8 w-36 text-xs"
                            value={customDates.startDate}
                            onChange={e => {
                                setCustomDates({ startDate: e.target.value, endDate: e.target.value });
                                setPeriod('CUSTOM');
                            }}
                        />
                    </div>
                )}
            </Card>

            <section aria-label="الوضع النقدي الحالي" className="space-y-3">
                <SectionHeading title="الوضع النقدي الحالي" scope="لحظي" />
                {isLoading ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <Skeleton className="h-64 rounded-3xl" />
                        <Skeleton className="h-64 rounded-3xl xl:col-span-2" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <StatCard
                            title="الرصيد الكلي"
                            value={balance.toLocaleString()}
                            unit="ج.م"
                            icon={Wallet}
                            variant="primary"
                            subtitle="الصندوق والبنك والمحافظ والشيكات"
                        />
                        <MethodBalancesCard
                            breakdown={treasuryData?.breakdown}
                            total={balance}
                            className="xl:col-span-2"
                        />
                    </div>
                )}
            </section>

            <section aria-label="أداء الفترة" className="space-y-3">
                <SectionHeading title="أداء الفترة" scope={periodLabel} />
                {isLoading ? (
                    <Skeleton className="h-64 rounded-3xl" />
                ) : (
                    <PeriodPerformanceCard
                        income={periodStats.income}
                        expense={periodStats.expense}
                        net={periodStats.net}
                        supplierPayments={periodStats.supplierPayments}
                        shopExpenses={periodStats.shopExpenses}
                        salesProfit={periodStats.salesProfit}
                        transactionCount={periodStats.transactionCount}
                    />
                )}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <CashFlowChart data={cashFlowData} className="xl:col-span-2" />
                <DebtSnapshotCard totalDebt={periodStats.totalDebt} />
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <SectionHeading title="سجل المعاملات" scope="أحدث 100" />
                        {isTransactionsFetching && (
                            <span className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" /> جاري التحديث…
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground font-medium">
                            ({periodStats.transactionCount > allTransactions.length
                                ? `أحدث ${allTransactions.length} من أصل ${periodStats.transactionCount}`
                                : `${allTransactions.length}`} معاملة)
                        </span>
                    </div>
                </div>

                {isTransactionsError ? (
                    <Card className="p-8 border border-destructive/20 bg-destructive/5">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                            <div>
                                <h3 className="font-bold text-destructive">تعذر تحميل المعاملات</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {transactionsError?.message || 'حدث خطأ أثناء جلب البيانات'}
                                </p>
                            </div>
                            <Button onClick={refreshAll} variant="outline" className="gap-2">
                                <RefreshCcw className="h-4 w-4" /> إعادة المحاولة
                            </Button>
                        </div>
                    </Card>
                ) : allTransactions.length === 0 && !isTransactionsFetching ? (
                    <Card className="p-8 border-dashed">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Wallet className="h-10 w-10 text-muted-foreground/40" />
                            <h3 className="font-bold">لا توجد معاملات في هذه الفترة</h3>
                            <p className="text-sm text-muted-foreground">
                                جرّب توسيع نطاق التاريخ أو أضف معاملة جديدة.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <TransactionsTable
                        transactions={filteredTransactions}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        onTxClick={handleTxClick}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                )}
            </div>

            <TransactionDetailsDialog
                transaction={selectedTx}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />

            <ConfirmDialog
                open={deleteTargetId !== null}
                onOpenChange={(open) => !open && setDeleteTargetId(null)}
                title="التراجع عن المعاملة"
                description="هل أنت متأكد من التراجع عن هذه المعاملة؟ لا يمكن التراجع عن هذا الإجراء."
                confirmLabel="تراجع"
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

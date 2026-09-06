'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTreasury, useTreasuryTransactions, useAddTransaction, useDeleteTransaction, useSupplierPayment } from '@/hooks/useFinancial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Wallet, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/utils';
import { TreasuryStatsCards } from '@/components/financial/TreasuryStatsCards';
import { TransactionsTable } from '@/components/financial/TransactionsTable';
import { TransactionDetailsDialog } from '@/components/financial/TransactionDetailsDialog';
import { AddTransactionDialog } from '@/components/financial/AddTransactionDialog';
import { ExportButton } from '@/components/common/ExportButton';

const isSupplierPaymentTx = (tx) =>
    tx.type === 'EXPENSE' &&
    (tx.referenceType === 'PurchaseOrder' ||
        (tx.referenceType === 'Debt' && tx.referenceId?.debtorType === 'Supplier'));

const isShopExpenseTx = (tx) =>
    tx.type === 'EXPENSE' &&
    (tx.referenceType === 'Manual' || tx.referenceType === 'SalesReturn');

const matchesTypeFilter = (tx, typeFilter) => {
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'INCOME') return tx.type === 'INCOME';
    if (typeFilter === 'EXPENSE') return tx.type === 'EXPENSE';
    if (typeFilter === 'SHOP_EXPENSES') return isShopExpenseTx(tx);
    if (typeFilter === 'SUPPLIER_PAYMENTS') return isSupplierPaymentTx(tx);
    return true;
};

const EMPTY_TX_FORM = {
    amount: '',
    description: '',
    type: 'INCOME',
    category: 'other',
    supplierId: '',
    method: 'cash',
    sourceNumber: ''
};

export default function FinancialPage() {
    const [period, setPeriod] = useState('TODAY'); // TODAY, MONTH, YEAR, CUSTOM
    const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, INCOME, EXPENSE, EXPENSES (Manual), SUPPLIER_PAYMENTS
    const [customDates, setCustomDates] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const queryClient = useQueryClient();
    const { data: suppliers } = useSuppliers({ limit: 100 });

    // Calculate actual dates based on period.
    // NOTE: declared with useCallback so the object identity is stable
    // across renders (it's a dependency of the useQuery below).
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

    const { data: treasuryData, isLoading } = useTreasury(getDateRange());
    const { mutate: addTransaction, isPending } = useAddTransaction();
    const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();
    const { mutate: paySupplier, isPending: isPayingSupplier } = useSupplierPayment();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [formData, setFormData] = useState(EMPTY_TX_FORM);

    // T-PERF-03 contract: `/api/financial/treasury` only returns the most
    // recent 20 rows. The full history table reads the dedicated
    // `/api/treasury/transactions` ledger endpoint instead.
    // All hooks below MUST stay above any early-return (Rules of Hooks).
    const dateRange = getDateRange();
    const {
        data: allTransactions = [],
        isFetching: isTransactionsFetching,
        isError: isTransactionsError,
        error: transactionsError,
        refetch: refetchTransactions
    } = useTreasuryTransactions(dateRange);

    const resetForm = useCallback(() => setFormData(EMPTY_TX_FORM), []);

    const handleSubmit = async () => {
        if (!formData.amount || !formData.description) return;

        // Supplier expense goes through the counterparty payments dispatcher
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

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const balance = treasuryData?.balance || 0;

    const handleTxClick = (tx) => {
        setSelectedTx(tx);
        setIsDetailsOpen(true);
    };

    const supplierPaymentsAmt = allTransactions
        .filter(isSupplierPaymentTx)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const shopExpensesAmt = allTransactions
        .filter(isShopExpenseTx)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const periodStats = {
        income: treasuryData?.totalIncome || 0,
        expense: treasuryData?.totalExpense || 0,
        supplierPayments: supplierPaymentsAmt,
        shopExpenses: shopExpensesAmt,
        salesProfit: treasuryData?.salesProfit || 0,
        totalDebt: treasuryData?.totalOutstandingDebt || 0,
        net: treasuryData?.periodBalance || 0
    };

    const refreshAll = () => {
        refetchTransactions();
        queryClient.invalidateQueries({ queryKey: ['treasury'] });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">الخزينة (النظام المالي)</h1>
                </div>

                {/* Reachability links for surfaces outside the sidebar (UX-100 interim) */}
                <nav aria-label="أقسام مالية أخرى" className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href="/financial/debt-center">مركز الديون والمستحقات</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href="/receivables">المستحقات</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href="/accounting">العرض المحاسبي</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href="/reports/financial">التقارير المالية</Link>
                    </Button>
                    <ExportButton
                        type="treasuryTransactions"
                        filters={{
                            ...getDateRange(),
                            type: typeFilter === 'ALL' ? undefined : typeFilter
                        }}
                    />
                </nav>

                {/* Period Filter */}
                <div className="flex flex-wrap items-center gap-2 bg-muted p-1 rounded-lg">
                    <Button
                        variant={period === 'TODAY' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPeriod('TODAY')}
                        className="text-xs h-8"
                    >اليوم</Button>
                    <div className="flex items-center gap-1 glass-card px-2 h-8 rounded-md bg-white/5 border border-white/10">
                        <Label className="text-xs text-muted-foreground mr-1">تاريخ محدد:</Label>
                        <Input
                            type="date"
                            className="h-6 w-32 text-xs bg-transparent border-none p-0 focus-visible:ring-0"
                            value={customDates.startDate}
                            onChange={e => {
                                setCustomDates({ startDate: e.target.value, endDate: e.target.value });
                                setPeriod('CUSTOM');
                            }}
                        />
                    </div>
                    <Button
                        variant={period === 'MONTH' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPeriod('MONTH')}
                        className="text-xs h-8"
                    >هذا الشهر</Button>
                    <Button
                        variant={period === 'YEAR' ? 'default' : 'ghost'}
                        onClick={() => setPeriod('YEAR')}
                        className="text-xs h-8"
                    >هذه السنة</Button>
                    <Button
                        variant={period === 'CUSTOM' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPeriod('CUSTOM')}
                        className="text-xs h-8"
                    >مخصص</Button>
                </div>
            </div>

            {/* Custom Date Range Picker (Visible only if filter is CUSTOM) */}
            {period === 'CUSTOM' && (
                <Card className="p-4 bg-muted/30 border-dashed">
                    <div className="flex flex-wrap items-end gap-4">
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
                </Card>
            )}

            {/* Balance and Period Stats Cards */}
            <TreasuryStatsCards balance={balance} treasuryData={treasuryData} periodStats={periodStats} />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4">
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

                {/* Transactions History */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold tracking-tight">سجل المعاملات</h2>
                            {isTransactionsFetching && (
                                <span className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> جاري التحديث…
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground font-medium">
                                ({allTransactions.length} معاملة)
                            </span>
                        </div>
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
            </div>

            {/* Transaction Details Dialog */}
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

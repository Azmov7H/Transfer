'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTreasury, useAddTransaction, useDeleteTransaction } from '@/hooks/useFinancial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { addPayment as addPaymentApi } from '@/services/financeService';
import { useQueryClient } from '@tanstack/react-query';
import { TreasuryStatsCards } from '@/components/financial/TreasuryStatsCards';
import { TransactionsTable } from '@/components/financial/TransactionsTable';
import { TransactionDetailsDialog } from '@/components/financial/TransactionDetailsDialog';
import { AddTransactionDialog } from '@/components/financial/AddTransactionDialog';

export default function FinancialPage() {
    const [period, setPeriod] = useState('TODAY'); // TODAY, MONTH, YEAR, CUSTOM
    const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, INCOME, EXPENSE, EXPENSES (Manual), SUPPLIER_PAYMENTS
    const [customDates, setCustomDates] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const queryClient = useQueryClient();
    const { data: treasuryData, isLoading } = useTreasury(getDateRange());
    const { mutate: addTransaction, isPending } = useAddTransaction();
    const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        type: 'INCOME',
        category: 'other',
        supplierId: '',
        method: 'cash',
        sourceNumber: ''
    });

    const { data: suppliers } = useSuppliers({ limit: 100 });

    // Calculate actual dates based on period
    function getDateRange() {
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
    }

    const handleSubmit = async () => {
        if (!formData.amount || !formData.description) return;

        // If it's an expense and category is 'supplier', we use the generic payments API
        if (formData.type === 'EXPENSE' && formData.category === 'supplier') {
            if (!formData.supplierId) {
                toast.error('يرجى اختيار مورد');
                return;
            }

            const paymentData = {
                supplierId: formData.supplierId,
                amount: parseFloat(formData.amount),
                method: formData.method,
                note: formData.description
            };

            addPaymentApi(paymentData).then(() => {
                queryClient.invalidateQueries({ queryKey: ['treasury'] });
                setIsDialogOpen(false);
                setFormData({ amount: '', description: '', type: 'INCOME', category: 'other', supplierId: '', method: 'cash', sourceNumber: '' });
            }).catch(err => {
                console.error(err);
                toast.error(err.message || 'فشل تسجيل الدفعة للمورد');
            });
            return;
        }

        addTransaction(formData, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setFormData({ amount: '', description: '', type: 'INCOME', category: 'other', supplierId: '', method: 'cash', sourceNumber: '' });
            }
        });
    };

    const [deleteTargetId, setDeleteTargetId] = useState(null);

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

    // Client-side filtering and stats calculation
    const allTransactions = treasuryData?.transactions || [];

    const supplierPaymentsAmt = allTransactions
        .filter(tx => tx.type === 'EXPENSE' && (tx.referenceType === 'PurchaseOrder' || (tx.referenceType === 'Debt' && tx.referenceId?.debtorType === 'Supplier')))
        .reduce((sum, tx) => sum + tx.amount, 0);

    const shopExpensesAmt = allTransactions
        .filter(tx => tx.type === 'EXPENSE' && (tx.referenceType === 'Manual' || tx.referenceType === 'SalesReturn'))
        .reduce((sum, tx) => sum + tx.amount, 0);

    const filteredTransactions = allTransactions.filter(tx => {
        if (typeFilter === 'ALL') return true;
        if (typeFilter === 'INCOME') return tx.type === 'INCOME';
        if (typeFilter === 'EXPENSE') return tx.type === 'EXPENSE';
        if (typeFilter === 'SHOP_EXPENSES') return tx.type === 'EXPENSE' && (tx.referenceType === 'Manual' || tx.referenceType === 'SalesReturn');
        if (typeFilter === 'SUPPLIER_PAYMENTS') return tx.type === 'EXPENSE' && (tx.referenceType === 'PurchaseOrder' || (tx.referenceType === 'Debt' && tx.referenceId?.debtorType === 'Supplier'));
        return true;
    });

    const periodStats = {
        income: treasuryData?.totalIncome || 0,
        expense: treasuryData?.totalExpense || 0,
        supplierPayments: supplierPaymentsAmt,
        shopExpenses: shopExpensesAmt,
        salesProfit: treasuryData?.salesProfit || 0,
        totalDebt: treasuryData?.totalOutstandingDebt || 0,
        net: treasuryData?.periodBalance || 0
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
                        isPending={isPending}
                        suppliers={suppliers}
                    />
                </div>

                {/* Transactions History */}
                <TransactionsTable
                    transactions={filteredTransactions}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                    onTxClick={handleTxClick}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
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

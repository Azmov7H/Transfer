// Financial hooks for treasury and debts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getTreasury,
    addTreasuryTransaction,
    deleteTreasuryTransaction,
    getDebts,
    getDebtors,
    getDebtOverview,
    addPayment,
    getDebtInstallments,
    createInstallments,
    getReceivables,
    syncDebts,
    updateDebt,
    payCustomerTotal,
    getPartnerTransactions
} from '@/services/financeService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useTreasury(params = {}) {
    return useQuery({
        queryKey: ['treasury', params],
        queryFn: ({ signal }) => getTreasury(params, { signal })
    });
}

export function useAddTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => addTreasuryTransaction(data),
        ...withMutationFeedback({
            successMessage: 'تم تسجيل المعاملة بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['treasury'] })
        })
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteTreasuryTransaction(id),
        ...withMutationFeedback({
            successMessage: 'تم التراجع عن المعاملة بنجاح',
            fallbackErrorMessage: 'فشل التراجع عن المعاملة',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['treasury'] })
        })
    });
}

export function useDebts(params = {}) {
    return useQuery({
        queryKey: ['debts', params],
        queryFn: ({ signal }) => getDebts(params, { signal })
    });
}

export function useDebtors(params = {}) {
    return useQuery({
        queryKey: ['debtors', params],
        queryFn: ({ signal }) => getDebtors(params, { signal })
    });
}

export function useDebtOverview() {
    return useQuery({
        queryKey: ['debt-overview'],
        queryFn: ({ signal }) => getDebtOverview({ signal })
    });
}

export function useAddPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => addPayment(data),
        ...withMutationFeedback({
            successMessage: 'تم تسجيل الدفعة بنجاح',
            fallbackErrorMessage: 'فشل تسجيل الدفعة',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['debts'] });
                queryClient.invalidateQueries({ queryKey: ['debt-overview'] });
            }
        })
    });
}

export function useDebtInstallments(debtId) {
    return useQuery({
        queryKey: ['debt-installments', debtId],
        queryFn: ({ signal }) => getDebtInstallments(debtId, { signal }),
        enabled: !!debtId
    });
}

export function useCreateInstallments() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ debtId, data }) => createInstallments(debtId, data),
        ...withMutationFeedback({
            successMessage: 'تم جدولة المديونية بنجاح',
            fallbackErrorMessage: 'فشل جدولة المديونية',
            afterSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: ['debts'] });
                queryClient.invalidateQueries({ queryKey: ['debt-installments', variables.debtId] });
            }
        })
    });
}

export function useReceivables(params = {}) {
    return useQuery({
        queryKey: ['receivables', params],
        queryFn: ({ signal }) => getReceivables(params, { signal })
    });
}

export function useSyncDebts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await syncDebts(data);
        },
        ...withMutationFeedback({
            successMessage: 'تمت مزامنة المديونيات بنجاح',
            fallbackErrorMessage: 'فشل مزامنة المديونيات',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['debts'] });
                queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            }
        })
    });
}

export function useUpdateDebt() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateDebt(id, data),
        ...withMutationFeedback({
            successMessage: 'تم تحديث بيانات الدين بنجاح',
            fallbackErrorMessage: 'فشل تحديث بيانات الدين',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['debts'] });
                queryClient.invalidateQueries({ queryKey: ['debt-overview'] });
            }
        })
    });
}

export function useCustomerTotalPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ customerId, data }) => payCustomerTotal(customerId, data),
        ...withMutationFeedback({
            successMessage: 'تم تحصيل الدفعة بنجاح وتوزيعها على الفواتير',
            fallbackErrorMessage: 'فشل تحصيل الدفعة',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['debts'] });
                queryClient.invalidateQueries({ queryKey: ['debt-overview'] });
                queryClient.invalidateQueries({ queryKey: ['customer'] });
                queryClient.invalidateQueries({ queryKey: ['customer-statement'] });
                queryClient.invalidateQueries({ queryKey: ['treasury'] });
            }
        })
    });
}
export function usePartnerTransactions(partnerId, params = {}) {
    return useQuery({
        queryKey: ['partner-transactions', partnerId, params],
        queryFn: ({ signal }) => getPartnerTransactions(partnerId, params, { signal }),
        enabled: !!partnerId
    });
}

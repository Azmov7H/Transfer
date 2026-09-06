// Financial hooks for treasury and debts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import {
    getTreasury,
    getTreasuryTransactions,
    getCashFlow,
    addTreasuryTransaction,
    deleteTreasuryTransaction,
    getDebts,
    getDebtors,
    getDebtOverview,
    addPayment,
    addSupplierPayment,
    getDebtInstallments,
    createInstallments,
    getReceivables,
    syncDebts,
    updateDebt,
    payCustomerTotal,
    getPartnerTransactions
} from '@/services/financeService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

/**
 * Treasury dashboard live options: the /financial page must reflect sales,
 * purchases and collections recorded elsewhere, so its queries poll every
 * 30s and refetch on focus (the app default disables focus refetch).
 */
const TREASURY_LIVE_OPTIONS = {
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
};

export function useTreasury(params = {}) {
    return useQuery({
        queryKey: ['treasury', params],
        queryFn: ({ signal }) => getTreasury(params, { signal }),
        placeholderData: keepPreviousData,
        ...TREASURY_LIVE_OPTIONS,
    });
}

/**
 * Full transaction ledger for a date range. Normalizes the bare-array
 * response (tolerating legacy `{ transactions }` / `{ data }` wrappers)
 * so consumers always get an array.
 */
export function useTreasuryTransactions(dateRange = {}, options = {}) {
    return useQuery({
        queryKey: ['treasury-transactions', dateRange],
        queryFn: async ({ signal }) => {
            const res = await getTreasuryTransactions(dateRange, { signal });
            if (Array.isArray(res)) return res;
            if (res?.transactions && Array.isArray(res.transactions)) return res.transactions;
            if (res?.data && Array.isArray(res.data)) return res.data;
            return [];
        },
        placeholderData: keepPreviousData,
        enabled: options.enabled !== false,
        ...TREASURY_LIVE_OPTIONS,
    });
}

/**
 * Full-period cash-flow buckets for the treasury chart (server-aggregated).
 */
export function useCashFlow(dateRange = {}, options = {}) {
    return useQuery({
        queryKey: ['treasury-cashflow', dateRange],
        queryFn: ({ signal }) => getCashFlow(dateRange, { signal }),
        placeholderData: keepPreviousData,
        enabled: options.enabled !== false,
        ...TREASURY_LIVE_OPTIONS,
    });
}

/** Supplier payment (manager+) with treasury + receivables invalidation. */
export function useSupplierPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => addSupplierPayment(data),
        ...withMutationFeedback({
            successMessage: 'تم تسجيل الدفعة للمورد بنجاح',
            fallbackErrorMessage: 'فشل تسجيل الدفعة للمورد',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['treasury'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-transactions'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-cashflow'] });
            }
        })
    });
}

export function useAddTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => addTreasuryTransaction(data),
        ...withMutationFeedback({
            successMessage: 'تم تسجيل المعاملة بنجاح',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['treasury'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-transactions'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-cashflow'] });
            }
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
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['treasury'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-transactions'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-cashflow'] });
            }
        })
    });
}

export function useDebts(params = {}, options = {}) {
    return useQuery({
        queryKey: ['debts', params],
        queryFn: ({ signal }) => getDebts(params, { signal }),
        enabled: options.enabled !== false
    });
}

export function useDebtors(params = {}) {
    return useQuery({
        queryKey: ['debtors', params],
        queryFn: ({ signal }) => getDebtors(params, { signal })
    });
}

export function useDebtOverview(options = {}) {
    return useQuery({
        queryKey: ['debt-overview'],
        queryFn: ({ signal }) => getDebtOverview({ signal }),
        enabled: options.enabled !== false
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
                queryClient.invalidateQueries({ queryKey: ['treasury'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-cashflow'] });
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

export function useReceivables(params = {}, options = {}) {
    return useQuery({
        queryKey: ['receivables', params],
        queryFn: ({ signal }) => getReceivables(params, { signal }),
        enabled: options.enabled !== false
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
                queryClient.invalidateQueries({ queryKey: ['treasury-transactions'] });
                queryClient.invalidateQueries({ queryKey: ['treasury-cashflow'] });
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

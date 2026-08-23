// Financial hooks for treasury and debts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-utils';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useTreasury(params = {}) {
    return useQuery({
        queryKey: ['treasury', params],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/financial/treasury?${searchParams}`, undefined, { signal });
        }
    });
}

export function useAddTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post('/api/financial/transaction', data),
        ...withMutationFeedback({
            successMessage: 'تم تسجيل المعاملة بنجاح',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['treasury'] })
        })
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/api/financial/transaction/${id}`),
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
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/financial/debts?${searchParams}`, undefined, { signal });
        }
    });
}

export function useDebtors(params = {}) {
    return useQuery({
        queryKey: ['debtors', params],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/financial/debtors?${searchParams}`, undefined, { signal });
        }
    });
}

export function useDebtOverview() {
    return useQuery({
        queryKey: ['debt-overview'],
        queryFn: async ({ signal }) => {
            return await api.get('/api/financial/debt-overview', undefined, { signal });
        }
    });
}

export function useAddPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post('/api/financial/payments', data),
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
        queryFn: async ({ signal }) => {
            return await api.get(`/api/financial/debts/${debtId}/installments`, undefined, { signal });
        },
        enabled: !!debtId
    });
}

export function useCreateInstallments() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ debtId, data }) => api.post(`/api/financial/debts/${debtId}/installments`, data),
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
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/payments?${searchParams}`, undefined, { signal });
        }
    });
}

export function useSyncDebts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await api.post('/api/financial/debts/sync', data);
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
        mutationFn: ({ id, data }) => api.patch(`/api/financial/debts/${id}`, data),
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
        mutationFn: ({ customerId, data }) => api.post(`/api/customers/${customerId}/pay`, data),
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
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams(params);
            return await api.get(`/api/financial/partner/${partnerId}/transactions?${searchParams}`, undefined, { signal });
        },
        enabled: !!partnerId
    });
}

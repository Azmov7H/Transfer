import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoices, createInvoice, deleteInvoice } from '@/services/invoiceService';
import { withMutationFeedback } from '@/lib/mutation-feedback';
import { useFilters } from './useFilters';

/**
 * Base hook to fetch invoices with optional filters
 */
export function useInvoices(params = {}) {
    return useQuery({
        queryKey: ['invoices', params],
        queryFn: ({ signal }) => getInvoices(params, { signal })
    });
}

/**
 * mutation for creating a new invoice
 */
export function useCreateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await createInvoice(data);
        },
        ...withMutationFeedback({
            fallbackErrorMessage: 'فشل في إنشاء الفاتورة',
            errorOptions: { duration: 5000, important: true },
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['invoices'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
        })
    });
}

/**
 * mutation for deleting an invoice
 */
export function useDeleteInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteInvoice(id),
        ...withMutationFeedback({
            successMessage: 'تم حذف الفاتورة بنجاح',
            fallbackErrorMessage: 'فشل في حذف الفاتورة',
            afterSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['invoices'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
            }
        })
    });
}

/**
 * Integrated hook for the Invoices Page (Consolidated from useInvoicesPage.js)
 */
export function useInvoicesPageManager() {
    const {
        search, setSearch,
        filter, setFilter,
        page, setPage,
        limit,
        queryContext,
        handleSearch
    } = useFilters(15);

    const { data: invoicesData, isLoading, isError, refetch } = useInvoices(queryContext);

    const invoices = invoicesData?.invoices || [];
    const pagination = invoicesData?.pagination || { total: 0, pages: 1, page: 1, limit };
    const deleteMutation = useDeleteInvoice();

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            if (filter === 'all') return true;
            const type = inv.paymentType || 'cash';
            if (filter === 'cash') return ['cash', 'bank', 'wallet', 'check'].includes(type);
            if (filter === 'credit') return type === 'credit';
            return true;
        });
    }, [invoices, filter]);

    const stats = useMemo(() => {
        const totalSales = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
        const invoicesCount = filteredInvoices.length;
        const immediatePayments = ['cash', 'bank', 'wallet', 'check'];
        const cashInvoices = filteredInvoices.filter(inv => immediatePayments.includes(inv.paymentType || 'cash')).length;
        const creditInvoices = filteredInvoices.filter(inv => (inv.paymentType || 'cash') === 'credit').length;

        return { totalSales, invoicesCount, cashInvoices, creditInvoices };
    }, [filteredInvoices]);

    return {
        searchTerm: search, // Keep name for compatibility
        filterType: filter, setFilterType: setFilter,
        handleSearch,
        handleDelete,
        filteredInvoices,
        isLoading,
        isError,
        refetch,
        stats,
        page,
        setPage,
        pagination
    };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSalesReturns } from '@/services/salesReturnService';
import { getInvoiceReturns } from '@/services/invoiceService';

export function useSalesReturns(params = {}) {
    return useQuery({
        queryKey: ['sales-returns', params],
        queryFn: async ({ signal }) => {
            const res = await getSalesReturns(params, { signal });
            return res.data;
        }
    });
}

export function useInvoiceReturns(invoiceId) {
    return useQuery({
        queryKey: ['invoice-returns', invoiceId],
        queryFn: async ({ signal }) => {
            if (!invoiceId) return { returns: [] };
            const res = await getInvoiceReturns(invoiceId, { signal });
            return res.data;
        },
        enabled: !!invoiceId
    });
}


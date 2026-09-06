import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSalesReturns } from '@/services/salesReturnService';
import { getInvoiceReturns } from '@/services/invoiceService';

export function useSalesReturns(params = {}) {
    return useQuery({
        queryKey: ['sales-returns', params],
        queryFn: async ({ signal }) => {
            // api.get already unwraps the {success,data} envelope — the
            // body itself is {returns,count,page,limit}.
            return await getSalesReturns(params, { signal });
        }
    });
}

export function useInvoiceReturns(invoiceId) {
    return useQuery({
        queryKey: ['invoice-returns', invoiceId],
        queryFn: async ({ signal }) => {
            if (!invoiceId) return { returns: [] };
            const res = await getInvoiceReturns(invoiceId, { signal });
            return Array.isArray(res) ? { returns: res } : res;
        },
        enabled: !!invoiceId
    });
}


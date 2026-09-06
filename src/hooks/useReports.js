import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { getFinancialReport } from '@/services/reportService';

/**
 * Income-statement report for a date range. Keeps the previous period
 * visible while the new one loads so changing dates never flashes a
 * full-page spinner.
 */
export function useFinancialReport(startDate, endDate, options = {}) {
    const ready = Boolean(startDate && endDate);
    return useQuery({
        queryKey: ['financial-report', startDate, endDate],
        queryFn: ({ signal }) => getFinancialReport(startDate, endDate, { signal }),
        placeholderData: keepPreviousData,
        enabled: ready && options.enabled !== false
    });
}

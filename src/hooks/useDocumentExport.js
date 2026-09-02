'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { exportDocument, exportDocumentPost, downloadBlob } from '@/services/documentService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

/**
 * DOC-SHARED-009 — Document export hook.
 *
 * Wraps the server-side export endpoint with a React Query mutation
 * that:
 *   - sends the format + filters as a query string (GET) or body (POST)
 *   - receives the file blob
 *   - triggers a browser download
 *   - invalidates the matching document query so a subsequent preview
 *     fetches fresh data
 *   - shows a single success / error toast
 *
 * Use this from DocumentActions; it owns the entire UX.
 */
export function useDocumentExport({ onSuccess, invalidateQueryKey } = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ type, id, format, filters = {}, usePost = false }) => {
            const exporter = usePost ? exportDocumentPost : exportDocument;
            const { blob, filename } = await exporter(type, id, format, filters);
            downloadBlob(blob, filename);
            return { blob, filename, type, id, format, filters };
        },
        ...withMutationFeedback({
            successMessage: (data) => `تم تنزيل ${filenameArabic(data.filename)}`,
            fallbackErrorMessage: 'فشل التصدير',
            errorOptions: { duration: 5000, important: true },
            afterSuccess: (data) => {
                onSuccess?.(data);
                if (invalidateQueryKey) {
                    queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
                } else {
                    // Default: invalidate the matching document cache.
                    queryClient.invalidateQueries({
                        queryKey: ['document', data.type, data.id, data.filters],
                    });
                }
            },
        }),
    });
}

/**
 * Best-effort Arabic label for a downloaded filename. Falls back to the
 * raw filename when no Arabic match is found.
 */
function filenameArabic(filename) {
    if (!filename) return 'الملف';
    return filename;
}

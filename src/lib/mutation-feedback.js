/**
 * Unified mutation feedback policy (FE-DATA-003).
 *
 * All mutation success/error surfacing goes through here so toast anatomy
 * is identical across domains:
 * - Success: optional Arabic message (string, or function of the response)
 *   followed by any cache side effects (`afterSuccess`).
 * - Error: server-provided `error.message` (JammazApiError) with a
 *   domain-specific Arabic fallback.
 *
 * Spread into useMutation options:
 *   useMutation({
 *       mutationFn: (data) => api.post('/api/customers', data),
 *       ...withMutationFeedback({
 *           successMessage: 'تمت إضافة العميل بنجاح',
 *           fallbackErrorMessage: 'فشل في إضافة العميل',
 *           afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] })
 *       })
 *   });
 */

export const DEFAULT_ERROR_MESSAGE = 'حدث خطأ غير متوقع';

export function withMutationFeedback({
    successMessage,
    fallbackErrorMessage = DEFAULT_ERROR_MESSAGE,
    afterSuccess,
    errorOptions
} = {}) {
    return {
        onSuccess: (data, variables) => {
            const message = typeof successMessage === 'function'
                ? successMessage(data, variables)
                : successMessage;
            if (message) toast.success(message);
            afterSuccess?.(data, variables);
        },
        onError: (error) => {
            toast.error(error?.message || fallbackErrorMessage, errorOptions);
        }
    };
}

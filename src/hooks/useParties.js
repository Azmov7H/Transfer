import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { detectDuplicateParties, linkParties } from '@/services/partyService';
import { withMutationFeedback } from '@/lib/mutation-feedback';

export function useParties() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['parties-duplicates'],
        queryFn: async () => {
            const res = await detectDuplicateParties();
            return res?.data ?? res;
        }
    });

    const linkMutation = useMutation({
        mutationFn: ({ sourceType, sourceId, targetId }) => linkParties({ sourceType, sourceId, targetId }),
        ...withMutationFeedback({
            successMessage: (data) => (data?.alreadyLinked ? 'الأطراف مرتبطة بالفعل' : 'تم ربط الأطراف بنجاح'),
            fallbackErrorMessage: 'فشل ربط الأطراف',
            afterSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties-duplicates'] })
        })
    });

    return {
        ...query,
        linkMutation
    };
}
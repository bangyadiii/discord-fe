import { axiosInstance } from "@/lib/axios";
import { ConversationWithRelation } from "@/types";
import { useQuery } from "react-query";

export const queryKey = "conversationsQueryKey";

// react query mutation hook for post conversation
export function useConversationsQuery(initialData?: {
    message?: string;
    data?: ConversationWithRelation[];
    error?: any;
}) {
    return useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            const res = await axiosInstance.get<{
                message?: string;
                data?: ConversationWithRelation[];
                error?: any;
            }>("/conversations");
            return res.data;
        },
        initialData,
    });
}

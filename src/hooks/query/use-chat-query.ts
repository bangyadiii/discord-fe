import { axiosInstance } from "@/lib/axios";
import { DirectMessageWithRelation, MessageWithRelation } from "@/types";
import queryString from "query-string";
import { useInfiniteQuery } from "react-query";

type ParamKey = "channelId" | "conversationId";

interface ChatContext {
    queryKey: string;
    apiUrl: string;
    paramKey: ParamKey;
    paramValue: string;
}

export default function useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatContext) {
    const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
        const url = queryString.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    cursor: pageParam,
                    [paramKey]: paramValue,
                },
            },
            { skipNull: true }
        );

        const res = await axiosInstance.get<{
            message?: string;
            data: MessageWithRelation[] | DirectMessageWithRelation[];
            nextCursor: string | null;
        }>(url);
        return res.data;
    };

    return useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: false,
    });
}

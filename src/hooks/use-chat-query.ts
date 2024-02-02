import { useSocket } from "@/components/providers/socket-provider";
import { Message } from "@prisma/client";
import axios from "axios";
import { useParams } from "next/navigation";
import queryString from "query-string";
import { useInfiniteQuery } from "react-query";

interface ChatContext {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "opponentUserId";
    paramValue: string;
}

export default function useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
}: ChatContext) {
    const { isConnected } = useSocket();
    const params = useParams();

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

        const res = await axios.get<{
            message?: string;
            data: Message[];
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

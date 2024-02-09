import { axiosInstance } from "@/lib/axios";
import {
    DirectMessageWithRelation,
    MemberWithRelation,
    MessageWithRelation,
} from "@/types";
import { User } from "@prisma/client";
import { find } from "lodash";
import queryString from "query-string";
import { useMutation, useQueryClient } from "react-query";


export default function useChatMutation({
    queryKey,
    apiURL,
    query,
}: {
    queryKey: string;
    apiURL: string;
    query: Record<string, any>;
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newMessage: {
            content: string;
            id: string;
            fileUrl?: string;
            member?: MemberWithRelation;
            user?: Partial<User>;
        }) => {
            const url = queryString.stringifyUrl({
                url: apiURL,
                query,
            });
            return axiosInstance.post<{
                message?: string;
                data?: DirectMessageWithRelation | MessageWithRelation;
            }>(url, newMessage);
        },
        onMutate: async (newMessage) => {
            const prevMessages = queryClient.getQueryData([queryKey]);
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }
                const newPages = oldData.pages.map((page: any) => {
                    if (!page.data) return page;
                    if (find(page.data, { id: newMessage.id })) return page;
                    const newData = [newMessage, ...page.data];
                    return {
                        ...page,
                        data: newData,
                    };
                });
                return {
                    ...oldData,
                    pages: newPages,
                };
            });
            return { prevMessages };
        },
    });
}

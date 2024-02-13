import { axiosInstance } from "@/lib/axios";
import {
    DirectMessageWithRelation,
    MemberWithRelation,
    MessageWithRelation,
} from "@/types";
import { User } from "@prisma/client";
import queryString from "query-string";
import { MutationKey, useMutation, useQueryClient } from "react-query";

const postChatFn = (endpoint: string, query: Record<string, any>) => {
    return (newMessage: {
        content: string;
        id: string;
        fileUrl?: string;
        member?: MemberWithRelation;
        user?: Partial<User>;
    }) => {
        const url = queryString.stringifyUrl({
            url: endpoint,
            query,
        });
        return axiosInstance.post<{
            message?: string;
            data?: DirectMessageWithRelation | MessageWithRelation;
        }>(url, newMessage);
    };
};

export default function usePostChatMutation({
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
        mutationKey: [queryKey],
        mutationFn: postChatFn(apiURL, query),
        onMutate: async (newMessage) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] });
            const prevMessages = queryClient.getQueryData([queryKey]);
            queryClient.setQueryData([queryKey], (oldData: any) => {
                const newPages = oldData.pages.map((page: any) => {
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
        onError: (error, variables, context) => {
            queryClient.setQueryData([queryKey], context?.prevMessages);
        },
    });
}

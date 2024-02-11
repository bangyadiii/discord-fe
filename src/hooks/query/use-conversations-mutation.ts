import { axiosInstance } from "@/lib/axios";
import { ConversationWithRelation } from "@/types";
import { useMutation, useQueryClient } from "react-query";
import { queryKey } from "./use-conversations-query";
import { useToast } from "@/components/ui/use-toast";

const mutationKey = "conversations";

interface PostConversationResponse {
    message?: string;
    data?: ConversationWithRelation;
    error?: any;
}

const postConversation = async (userIds: string[]) => {
    const response = await axiosInstance.post<PostConversationResponse>(
        "/conversations",
        { userIds }
    );
    return response.data;
};

// react query mutation hook for post conversation
export function useCreateConversationMutation() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationKey: mutationKey,
        mutationFn: postConversation,
        onError: () => {
            toast.toast({
                title: "Failed to create conversation",
                description: "An error occurred",
                variant: "destructive",
            });
        },
        onSettled: async (data, error, variables, context) => {
            if (data?.error) {
                toast.toast({
                    title: "Failed to create conversation",
                    description: data.message ?? "An error occurred",
                    variant: "destructive",
                });
            }
            if (error || !data?.data) return;

            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.data)) return oldData;
                // search existing conversation, if found, update it
                const existingConversation = oldData?.data?.find(
                    (conversation: ConversationWithRelation) =>
                        conversation.id === data.data?.id
                );
                if (existingConversation) {
                    return {
                        data: oldData?.data?.map(
                            (conversation: ConversationWithRelation) =>
                                conversation.id === data?.data?.id
                                    ? data?.data
                                    : conversation
                        ),
                    };
                }
                // if not found, add it to the list
                return {
                    data: [data?.data, ...oldData?.data],
                };
            });
        },
    });
}

const deleteConversation = (id: string) => {
    return axiosInstance.delete<{
        message?: string;
        data?: ConversationWithRelation;
        error?: any;
    }>(`/conversations/${id}`);
};

// delete conversation mutation
export function useDeleteConversationMutation() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationKey: [mutationKey],
        mutationFn: deleteConversation,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] });
            const previousData = queryClient.getQueryData<{
                message?: string | undefined;
                data?: ConversationWithRelation[] | undefined;
                error?: any;
            }>([queryKey]);

            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !Array.isArray(oldData.data)) return oldData;
                return {
                    data: oldData?.data?.filter(
                        (conversation: ConversationWithRelation) =>
                            conversation.id !== id
                    ),
                };
            });
            return { previousData, id };
        },
        onError: (err, _, context) => {
            queryClient.setQueryData([queryKey], context?.previousData);
            toast.toast({
                title: "Failed to delete conversation",
                description: "An error occurred",
                variant: "destructive",
            });
        },
        onSettled: async (_) => {
            await queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
        retry: 1,
    });
}

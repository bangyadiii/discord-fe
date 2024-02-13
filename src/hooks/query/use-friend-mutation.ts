import { axiosInstance } from "@/lib/axios";
import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { pendingKey } from "./use-friends-query";
import { FriendWithRelation } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const mutationKey = "friend";

const requestFriend = async (username: string) => {
    const res = await axiosInstance.post<{
        message?: string;
        data?: User;
        error?: any;
    }>("/friends/request", { username });
    return res.data;
};

export function useFriendMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: mutationKey,
        mutationFn: requestFriend,
        onSettled: async (data, err, variables, context) => {
            if (err) return;
            await queryClient.invalidateQueries(pendingKey);
        },
    });
}

const updateUpcomingRequest = async (friend: FriendWithRelation) => {
    const res = await axiosInstance.put<{
        message?: string;
        data?: FriendWithRelation;
        error?: any;
    }>("/friends/request", { id: friend.id, status: friend.status });
    return res.data;
};

export function useUpdateFriendMutation() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationKey: mutationKey,
        mutationFn: updateUpcomingRequest,
        onError: (err, variables, context) => {
            toast.toast({
                title: "Something went wrong",
            });
        },
        onSettled: async (data, err, variables, context) => {
            await queryClient.invalidateQueries(pendingKey);
        },
    });
}

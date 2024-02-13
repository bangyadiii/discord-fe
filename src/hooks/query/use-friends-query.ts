import { axiosInstance } from "@/lib/axios";
import { FriendWithRelation, UserWithRelation } from "@/types";
import { useQuery } from "react-query";

export const AllKey = "all";
export const pendingKey = "pending";

const fetchAllFriends = async () => {
    const res = await axiosInstance.get<{
        message?: string;
        data?: UserWithRelation[];
        error?: any;
    }>("/friends");
    return res.data;
};

const fetchPendingFriends = async () => {
    const res = await axiosInstance.get<{
        message?: string;
        data?: FriendWithRelation[];
        error?: any;
    }>("/friends/request");
    return res.data;
};

export function useFriendsQuery() {
    return useQuery({
        queryKey: AllKey,
        queryFn: fetchAllFriends,
        cacheTime: 1000 * 60 * 60 * 1,
        refetchInterval: 1000 * 60 * 60 * 1,
    });
}

export function usePendingFriendQuery() {
    return useQuery({
        queryKey: pendingKey,
        queryFn: fetchPendingFriends,
        cacheTime: 1000 * 60 * 60 * 1,
        refetchInterval: 1000 * 60 * 60 * 1,
    });
}

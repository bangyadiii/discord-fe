import { axiosInstance } from "@/lib/axios";
import { User } from "@prisma/client";
import { useQuery } from "react-query";

const queryKey = "friends";

export default function useFriendsQuery() {
    const fetchFriends = async () => {
        const res = await axiosInstance.get<{
            message?: string;
            data?: User[]; // @TODO: fake friend. Change the type later
            error?: any;
        }>("/friends");
        return res.data;
    };

    return useQuery({
        queryKey: [queryKey],
        queryFn: fetchFriends,
        cacheTime: 1000 * 60 * 60 * 1,
        refetchInterval: 1000 * 60 * 60 * 1,
    });
}

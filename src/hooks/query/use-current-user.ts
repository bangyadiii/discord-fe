// get current user with react query

import { axiosInstance } from "@/lib/axios";
import { User } from "@prisma/client";
import { useQuery } from "react-query";

export default function useCurrentUserQuery() {
    const fetchUser = async () => {
        const res = await axiosInstance.get<{
            message?: string;
            data?: User;
            error?: any;
        }>("/me");
        return res.data;
    };
    return useQuery({
        queryKey: ["current-user"],
        queryFn: fetchUser,
        refetchInterval: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24,
    });
}

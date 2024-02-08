import { axiosInstance } from "@/lib/axios";
import { ServerWithRelation } from "@/types";
import queryString from "query-string";
import { useQuery } from "react-query";

interface ServerQueryParam {
    apiUrl: string;
    initialData?: ServerWithRelation;
    queryKey?: string;
}

const QUERY_KEY = 'currentServer';

export function useServerQuery({
    queryKey = QUERY_KEY,
    apiUrl,
    initialData,
}: ServerQueryParam) {
    const initialPayload = {
        data: initialData,
    };
    const fetchCurrentServer = async () => {
        const url = queryString.stringifyUrl(
            {
                url: apiUrl,
            },
            { skipNull: true }
        );

        const res = await axiosInstance.get<{
            message?: string;
            data?: ServerWithRelation;
        }>(url);
        return res.data;
    };

    return useQuery({
        queryKey: [queryKey],
        queryFn: fetchCurrentServer,
        refetchInterval: false,
        initialData: initialPayload,
        staleTime: 1000 * 60 * 10,
    });
}

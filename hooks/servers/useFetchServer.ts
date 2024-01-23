import { useQuery } from "react-query";
import { axiosInstance } from "@/lib/axios";

interface FetchServerParam {
    id: string;
    name: string;
    ownerId: string;
    inviteCode: string;
}

function useFetchUser(data: FetchServerParam) {
    const server = useQuery("server", async () => {
        // fetch user with axios
        return await axiosInstance.get("/servers");
    });

    return {
        data: server.data?.data,
        isLoading: server.isLoading,
    };
}

export default useFetchUser;

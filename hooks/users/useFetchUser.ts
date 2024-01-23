import { useMutation } from "react-query";
import { axiosInstance } from "@/lib/axios";

interface FetchUserParam {
    id: string;
    email: string;
    userId: string;
}

function useFetchUser(data: FetchUserParam) {
    const user = useMutation("users", async () => {
        // fetch user with axios
        return await axiosInstance.post("/users", {
            data,
        });
    });

    return {
        data: user.data?.data,
        isLoading: user.isLoading,
        mutate: user.mutateAsync,
    };
}

export default useFetchUser;

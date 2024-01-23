// axios instance
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
    timeout: 5000, // 5 detik
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

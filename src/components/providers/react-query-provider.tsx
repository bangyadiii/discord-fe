"use client";

import { useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

export default function ReactQueryProvider({ children }: any) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60 * 5,
                    },
                    mutations: {
                        retry: true,
                        retryDelay: 1500,
                    },
                },
            })
    );
    return (
        <QueryClientProvider client={queryClient} contextSharing={true}>
            {children}
        </QueryClientProvider>
    );
}

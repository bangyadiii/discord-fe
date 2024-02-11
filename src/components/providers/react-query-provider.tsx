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
                        retry: 10,
                        retryDelay(failureCount, error: any) {
                            if (error?.response?.status === 429) {
                                return 1000 * 60 * 2;
                            }
                            // incrementally increase the delay between retries
                            return Math.min(
                                1000 ** failureCount,
                                1000 * 60 * 5
                            );
                        },
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

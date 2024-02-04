"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

export default function ReactQueryProvider({ children }: any) {
    const [queryClient] = React.useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5,
            },
        },
    }));
    return (
        <QueryClientProvider client={queryClient} contextSharing={true}>
            {children}
        </QueryClientProvider>
    );
}

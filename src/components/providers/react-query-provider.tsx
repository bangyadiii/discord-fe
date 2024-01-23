"use client";

import { QueryClientProvider, QueryClient } from "react-query";

export default function ReactQueryProvider({ children }: any) {
    return (
        <QueryClientProvider client={new QueryClient()}>
            {children}
        </QueryClientProvider>
    );
}

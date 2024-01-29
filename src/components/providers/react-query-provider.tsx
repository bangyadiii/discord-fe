"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

export default function ReactQueryProvider({ children }: any) {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

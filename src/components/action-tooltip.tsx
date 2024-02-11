"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface ActionTooltipProps {
    label: string;
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
}

export const ActionTooltip = ({
    label,
    children,
    side = "bottom",
    align = "center",
}: ActionTooltipProps) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted)
        return <Skeleton className="w-4 h-4 rounded-full bg-secondary" />;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="cursor-pointer" asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} className="bg-primary text-primary-foreground">
                    <p className="font-semibold text-sm capitalize">
                        {label.toLocaleLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

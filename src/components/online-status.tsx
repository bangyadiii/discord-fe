"use client";
import React, { useEffect } from "react";
import { ActionTooltip } from "./action-tooltip";
import { cn } from "@/lib/utils";
import { useSocket } from "./providers/socket-provider";
import { Skeleton } from "./ui/skeleton";

interface OnlineStatusProps {
    className?: string;
    side?: "left" | "right" | "top" | "bottom";
}

export default function OnlineStatus({
    className,
    side = "left",
}: OnlineStatusProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    const socket = useSocket();
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <Skeleton className="rounded-full w-2 h-2" />;

    return (
        <ActionTooltip
            label={socket.isConnected ? "Online" : "Offline"}
            side={side}
        >
            <div
                className={cn(
                    "rounded-full w-2 h-2 inline-block",
                    className,
                    socket.isConnected
                        ? "bg-green-500"
                        : "bg-zinc-400"
                )}
            ></div>
        </ActionTooltip>
    );
}

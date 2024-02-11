"use client";

import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import OnlineStatus from "@/components/online-status";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserInformation() {
    const { user, isLoaded } = useUser();
    const isConnected = true;

    if (!isLoaded) {
        return (
            <div className="w-full dark:bg-[#1E1F22] bg-zinc-200 p-3 flex gap-x-3">
                <div className="relative w-10 h-10">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex flex-col gap-y-1">
                    <Skeleton className="w-20 h-4 rounded-md" />
                    <Skeleton className="w-15 h-3 rounded-md" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full dark:bg-[#1E1F22] bg-zinc-200 p-[10px] flex gap-x-3">
            <div className="relative w-10 h-10">
                <UserAvatar src={user?.imageUrl!} className="w-4 h-4" />
                <OnlineStatus
                    className="w-[11px] h-[11px] absolute bottom-1 right-0 ring-4 ring-zinc-200 dark:ring-[#1E1F22]"
                    side="right"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-primary-foreground text-sm">
                    {user?.fullName}
                </span>
                <span className="text-xs dark:text-zinc-400">
                    {isConnected ? "Online" : "Offline"}
                </span>
            </div>
        </div>
    );
}

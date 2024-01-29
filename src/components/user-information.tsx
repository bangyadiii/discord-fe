"use client";

import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import OnlineStatus from "@/components/online-status";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserInformation() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="w-full dark:bg-[#1E1F22] bg-slate-300 p-3 flex gap-x-3">
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
        <div className="w-full dark:bg-[#1E1F22] bg-slate-300 p-3 flex gap-x-3">
            <div className="relative w-10 h-10">
                <UserAvatar src={user?.imageUrl!} className="w-6 h-6" />
                <OnlineStatus
                    className="w-[10px] h-[10px] absolute bottom-0 right-0 border-3 border-slate-300 dark:border-[#1E1F22]"
                    side="right"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-primary-foreground text-sm">
                    {user?.fullName}
                </span>
                <span className="text-xs dark:text-zinc-400">Online</span>
            </div>
        </div>
    );
}

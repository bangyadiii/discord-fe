"use client";

import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import OnlineStatus from "@/components/online-status";
import { useParams, useRouter } from "next/navigation";
import { ConversationWithRelation } from "@/types";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface DMItemProps {
    conversation: ConversationWithRelation;
}

export default function DMItem({ conversation }: DMItemProps) {
    const router = useRouter();
    const params = useParams();
    const user = useUser().user;
    const partner = conversation.users.find((u) => u.id !== user?.id);
    if (!partner) return null;

    const handleOnClick = () => {
        router.push(`/home/dm/${conversation.id}`);
    };

    return (
        <button
            className={cn(
                "group w-full flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all p-2 rounded-md cursor-pointer",
                params?.conversationId === conversation.id
                    ? "bg-zinc-700/10 dark:bg-zinc-700/50"
                    : ""
            )}
            onClick={handleOnClick}
        >
            <div className="relative">
                <UserAvatar
                    src={partner.profileUrl}
                    className="w-[30px] h-[30px] md:h-[30px] md:w-[30px]"
                />
                <OnlineStatus className="ring-4 ring-secondary absolute bottom-0 right-0" />
            </div>

            <span
                className={cn(
                    "text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-200",
                    params?.conversationId === conversation.id
                        ? "text-zinc-700 dark:text-zinc-200"
                        : ""
                )}
            >
                {partner.name}
            </span>
        </button>
    );
}

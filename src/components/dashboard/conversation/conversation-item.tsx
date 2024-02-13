"use client";

import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import OnlineStatus from "@/components/online-status";
import { useParams, useRouter } from "next/navigation";
import { ConversationWithRelation } from "@/types";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useDeleteConversationMutation } from "@/hooks/query/use-conversations-mutation";

interface ConversationItemProps {
    conversation: ConversationWithRelation;
}

export default function ConversationItem({ conversation }: ConversationItemProps) {
    const mutation = useDeleteConversationMutation();
    const router = useRouter();
    const params = useParams();
    const user = useUser().user;

    const handleOnClick = () => {
        router.push(`/home/dm/${conversation.id}`);
    };

    const handleDeleteConversation = (e: React.MouseEvent) => {
        e.stopPropagation();
        mutation.mutate(conversation.id);
        if (params?.conversationId === conversation.id) {
            router.push("/home?tab=online");
        }
    };

    if (conversation.isGroup) {
        const groupName = conversation.conversationToUsers
            ?.filter((convUser) => convUser.user?.id !== user?.id)
            .map((convUser) => convUser.user?.name)
            .join(", ");

        return (
            <button
                className={cn(
                    "group w-full flex justify-start gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all p-2 rounded-md cursor-pointer",
                    params?.conversationId === conversation.id
                        ? "bg-zinc-700/10 dark:bg-zinc-700/50"
                        : ""
                )}
                onClick={handleOnClick}
            >
                <UserAvatar
                    src={
                        "https://utfs.io/f/f80780dc-4a3a-4182-942a-0e4bdd6f060a-1mpytb.webp"
                    }
                    className="w-[30px] h-[30px] md:h-[30px] md:w-[30px]"
                />
                <p
                    className={cn(
                        "text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-200",
                        params?.conversationId === conversation.id
                            ? "text-zinc-700 dark:text-zinc-200"
                            : ""
                    )}
                >
                    {groupName?.length! > 40
                        ? groupName?.slice(0, 40) + "..."
                        : groupName}
                </p>

                <X
                    className="ml-auto w-4 h-4  flex-shrink-0 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-200 p-1 box-content"
                    onClick={handleDeleteConversation}
                />
            </button>
        );
    }
    const partner = conversation.conversationToUsers?.find(
        (c) => c.user?.id !== user?.id
    )?.user;
    if (!partner) return null;

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

            <X
                className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-200 p-1 box-content"
                onClick={handleDeleteConversation}
                aria-disabled={mutation.isLoading}
            />
        </button>
    );
}

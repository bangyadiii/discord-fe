"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import OnlineStatus from "@/components/online-status";
import { UserAvatar } from "@/components/user-avatar";
import { useCreateConversationMutation } from "@/hooks/query/use-conversations-mutation";
import { cn } from "@/lib/utils";
import { UserWithRelation } from "@/types";
import { MessageCircleMore, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

type FriendItemProps = {
    friend: UserWithRelation;
};

export function FriendItem({ friend }: FriendItemProps) {
    const mutation = useCreateConversationMutation();
    const router = useRouter();

    const handleChat = () => {
        mutation.mutate([friend.id]);
        router.push(`/home/dm/${mutation.data?.data.data?.id}`);
    };

    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-between gap-x-3">
                <div className="relative">
                    <UserAvatar
                        src={friend?.profileUrl!}
                        className="w-[30px] h-[30px] md:h-[30px] md:w-[30px]"
                    />
                    <OnlineStatus className="ring-4 ring-secondary absolute bottom-0 right-0" />
                </div>

                <span
                    className={cn(
                        "text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-200"
                    )}
                >
                    {friend?.name}
                </span>
            </div>

            <div className="decoration flex gap-x-3">
                <ActionTooltip label="Send Message" side="top">
                    <button
                        className="flex items-center justify-center rounded-md"
                        onClick={handleChat}
                    >
                        <MessageCircleMore className="w-6 h-6  text-zinc-300 hover:text-zinc-400 dark:text-zinc-500 hover:dark:text-zinc-400" />
                    </button>
                </ActionTooltip>

                <ActionTooltip label="More Options" side="top">
                    <button
                        className="flex items-center justify-center rounded-md "
                        aria-label="More Options"
                    >
                        <MoreVertical className="w-6 h-6  text-zinc-300 hover:text-zinc-400 dark:text-zinc-500 hover:dark:text-zinc-400" />
                    </button>
                </ActionTooltip>
            </div>
        </div>
    );
}

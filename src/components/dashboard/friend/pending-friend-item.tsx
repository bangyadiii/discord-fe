"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import OnlineStatus from "@/components/online-status";
import { UserAvatar } from "@/components/user-avatar";
import { useUpdateFriendMutation } from "@/hooks/query/use-friend-mutation";
import { cn } from "@/lib/utils";
import { FriendWithRelation, UserWithRelation } from "@/types";
import { RequestStatus } from "@prisma/client";
import { Ban, Check, X } from "lucide-react";

type PendingFriendItemProps = {
    friend: FriendWithRelation;
    sessionId: string;
};

export function PendingFriendItem({
    sessionId: userId,
    friend,
}: PendingFriendItemProps) {
    const updateMutation = useUpdateFriendMutation();
    const friendUser =
        friend.receiverId === userId ? friend.sender : friend.receiver;

    const handleAcceptFriendRequest = async (status: RequestStatus) => {
        const update = {
            ...friend,
            status,
        };
        await updateMutation.mutateAsync(update);
    };

    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-between gap-x-3">
                <div className="relative">
                    <UserAvatar
                        src={friendUser?.profileUrl!}
                        className="w-[30px] h-[30px] md:h-[30px] md:w-[30px]"
                    />
                    <OnlineStatus className="ring-4 ring-secondary absolute bottom-0 right-0" />
                </div>

                <span
                    className={cn(
                        "text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-200"
                    )}
                >
                    {friendUser?.name}
                </span>
            </div>

            <div className="decoration flex gap-x-3">
                <>
                    {friend.receiverId == userId && (
                        <ActionTooltip label="Accept" side="top">
                            <button
                                className="flex items-center justify-center rounded-md"
                                aria-label="Accept Action"
                                onClick={() =>
                                    handleAcceptFriendRequest(
                                        RequestStatus.ACCEPTED
                                    )
                                }
                            >
                                <Check className="w-6 h-6  text-zinc-300 hover:text-zinc-400 dark:text-zinc-500 hover:dark:text-zinc-400" />
                            </button>
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Remove/Decline" side="top">
                        <button
                            onClick={() =>
                                handleAcceptFriendRequest(
                                    RequestStatus.REJECTED
                                )
                            }
                            className="flex items-center justify-center rounded-md text-zinc-300 hover:text-zinc-400 dark:text-zinc-500 hover:dark:text-zinc-400"
                        >
                            <X className="w-6 h-6 " />
                        </button>
                    </ActionTooltip>
                    {friend.receiverId == userId && (
                        <ActionTooltip label="Block" side="top">
                            <button
                                className="flex items-center justify-center rounded-md"
                                aria-label="Block"
                                onClick={() => alert('Not implemented')}
                            >
                                <Ban className="w-6 h-6 text-zinc-300 hover:text-zinc-400 dark:text-zinc-500 hover:dark:text-zinc-400" />
                            </button>
                        </ActionTooltip>
                    )}
                </>
            </div>
        </div>
    );
}

"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import ChatWelcome from "@/components/chat/chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { ArrowDown, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import ChatMessagesSkeleton from "./chat-messages-skeleton";
import { Channel, User } from "@prisma/client";

interface ChatMessagesProps {
    apiUrl: string;
    paramKey: "channelId" | "receiverUserId";
    paramValue: string;
    type: "channel" | "directMessage";
    partner?: User;
    channel?: Channel;
    className?: string;
}

export default function ChatMessages({
    partner,
    channel,
    apiUrl,
    paramKey,
    paramValue,
    type,
    className,
}: ChatMessagesProps) {
    const queryKey = `chat:${type}:${type === "channel" ? channel?.id : partner?.id}`;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
        });

    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    if (status == "loading" && !data)
        return (
            <div className="flex-1">
                <ChatMessagesSkeleton />
            </div>
        );
    if (status === "error")
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-md text-zinc-400 dark:text-zinc-500">
                <ServerCrash className="w-8 h-8 mb-3" />
                Something went wrong
            </div>
        );
    return (
        <div
            className={cn(
                "relative flex-1 flex flex-col-reverse overflow-y-auto px-5",
                className
            )}
        >
            <div ref={scrollDownRef} />
            {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.data?.map((message) => (
                        <ChatItem key={message.id} data={message} />
                    ))}
                </React.Fragment>
            ))}
            {isFetchingNextPage && (
                 <ChatMessagesSkeleton />
            )}

            <ChatWelcome type={type} name={type !== 'channel' ? partner?.name! : channel?.name!} />
        </div>
    );
}

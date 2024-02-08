"use client";

import React, { useEffect, useRef } from "react";
import { cn, toPusherKey } from "@/lib/utils";
import ChatWelcome from "@/components/chat/chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import ChatMessagesSkeleton from "./chat-messages-skeleton";
import { Channel, User } from "@prisma/client";
import { ChatType } from "@/types";
import { useQueryClient } from "react-query";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import useChatSocket from "@/hooks/use-chat-socket";

interface ChatMessagesProps {
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: ChatType;
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
    const queryKey = `chat:${type}:${paramValue}`;
    const queryClient = useQueryClient();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
        });

    const chatRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useChatSocket({ queryClient, queryKey });

    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.data?.length ?? 0,
    });

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
            ref={chatRef}
            className={cn(
                "relative flex-1 flex flex-col-reverse overflow-y-auto px-5",
                className
            )}
        >
            <div ref={bottomRef} />
            {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.data?.map((message) => (
                        <ChatItem key={message.id} data={message} />
                    ))}
                </React.Fragment>
            ))}
            {hasNextPage && isFetchingNextPage && <ChatMessagesSkeleton />}

            {!hasNextPage && (
                <ChatWelcome
                    type={type}
                    name={type !== "channel" ? partner?.name! : channel?.name!}
                />
            )}
        </div>
    );
}

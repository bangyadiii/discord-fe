"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ChatWelcome from "@/components/chat/chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import ChatMessagesSkeleton from "./chat-messages-skeleton";

interface ChatMessagesProps {
    name: string;
    chatId: string;
    apiUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "receiverUserId";
    paramValue: string;
    type: "channel" | "directMessage";
    className?: string;
}

export default function ChatMessages({
    name,
    chatId,
    apiUrl,
    paramKey,
    paramValue,
    type,
    className,
}: ChatMessagesProps) {
    const queryKey = `chat:${chatId}`;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
        });
    if (status == "loading")
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
                "flex-1 flex flex-col overflow-y-auto px-5",
                className
            )}
        >
            <div className="flex-1" />
            <ChatWelcome type={type} name={name} />
            {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.data.map((message) => (
                        <ChatItem key={message.id} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}

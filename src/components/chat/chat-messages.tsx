"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ChatWelcome from "@/components/chat/chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
    name: string;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "userId";
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
    if (status === "loading")
        return (
            <div className="flex flex-1 items-center justify-center">
                <Loader2 />
                Loading..
            </div>
        );
    return (
        <div className={cn("flex-1 flex flex-col overflow-y-auto", className)}>
            <div className="flex-1" />
            <ChatWelcome type={type} name={name} />
        </div>
    );
}

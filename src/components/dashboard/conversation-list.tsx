"use client";

import React from "react";
import ConversationItem from "./conversation/conversation-item";
import { ConversationWithRelation } from "@/types";
import { useConversationsQuery } from "@/hooks/query/use-conversations-query";

interface ConversationListProps {
    conversations?: ConversationWithRelation[];
}

function ConversationList({
    conversations: initialData,
}: ConversationListProps) {
    const { data } = useConversationsQuery({ data: initialData });
    if (!data?.data || data?.data?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <span className="text-primary-foreground text-sm font-semibold">
                    No conversations
                </span>
                <span className="text-primary-foreground text-sm">
                    Start a conversation with a friend!
                </span>
            </div>
        );
    }

    return data?.data?.map((conversation) => {
        return (
            <ConversationItem
                key={`conversation-${conversation.id}`}
                conversation={conversation}
            />
        );
    });
}

export default ConversationList;

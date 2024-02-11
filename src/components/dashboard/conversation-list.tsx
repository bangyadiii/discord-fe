"use client";

import React from "react";
import DMItem from "./dm/dm-item";
import { ConversationWithRelation } from "@/types";
import { useConversationsQuery } from "@/hooks/query/use-conversations-query";

interface ConversationListProps {
    conversations: ConversationWithRelation[];
}

function ConversationList({
    conversations: initialData,
}: ConversationListProps) {
    const { data } = useConversationsQuery({ data: initialData });

    return data?.data?.map((conversation) => {
        return (
            <DMItem
                key={`conversation-${conversation.id}`}
                conversation={conversation}
            />
        );
    });
}

export default ConversationList;

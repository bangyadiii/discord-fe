import React from "react";
import ChatInput from "./chat-input";
import { Channel, User } from "@prisma/client";
import ChatMessages from "./chat-messages";

interface ChatSectionProps {
    currentChat: string;
    chatType: "channel" | "directMessage";
    data?: {
        channel?: Channel;
        receiverUser?: User;
    };
    messageApiUrl?: string;
    pushMessageUrl?: string;
}

export default function ChatSection({
    currentChat,
    chatType,
    data,
    messageApiUrl = "/api/messages",
    pushMessageUrl = "/messages",
}: ChatSectionProps) {
    let paramKey: "channelId" | "receiverUserId" = "channelId";
    if (chatType == "channel" && !data?.channel) return null;
    if (chatType == "directMessage" && !data?.receiverUser) return null;
    if (chatType == "directMessage") {
        paramKey = "receiverUserId";
    }
    return (
        <div className="h-full w-full flex flex-col justify-between">
            <ChatMessages
                chatId={data?.channel?.id!}
                type={chatType}
                apiUrl={messageApiUrl}
                name={currentChat}
                socketQuery={{
                    channelId: data?.channel?.id!,
                    serverId: data?.channel?.serverId!,
                }}
                paramKey={paramKey}
                paramValue={
                    paramKey == "channelId"
                        ? data?.channel?.id!
                        : data?.receiverUser?.id!
                }
            />

            <div className="h-[80px] w-full flex justify-center items-start">
                <ChatInput
                    name={data?.receiverUser?.name!}
                    type={chatType}
                    apiURL={pushMessageUrl}
                    query={
                        chatType === "channel"
                            ? { channelId: data?.channel?.id }
                            : { receiverUserId: data?.receiverUser?.id }
                    }
                />
            </div>
        </div>
    );
}

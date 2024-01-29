import React from "react";
import ChatInput from "./chat-input";
import { Channel } from "@prisma/client";
import ChatMessages from "./chat-messages";

interface ChatSectionProps {
    currentChat: string;
    chatType: "channel" | "directMessage";
    data?: {
        channel?: Channel;
    };
}

export default function ChatSection({
    currentChat,
    chatType,
    data,
}: ChatSectionProps) {
    if (chatType == "channel" && !data?.channel) return null;
    return (
        <div className="h-full w-full flex flex-col justify-between">
            <ChatMessages
                chatId={data?.channel?.id!}
                type="channel"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                name={data?.channel?.name!}
                socketQuery={{
                    channelId: data?.channel?.id!,
                    serverId: data?.channel?.serverId!,
                }}
                paramKey="channelId"
                paramValue={data?.channel?.id!}
            />

            <div className="h-[80px] w-full flex justify-center items-start">
                <ChatInput
                    name={currentChat}
                    type={chatType}
                    apiURL="/sockets/messages"
                    query={{
                        channelId: data?.channel?.id,
                        serverId: data?.channel?.serverId,
                    }}
                />
            </div>
        </div>
    );
}

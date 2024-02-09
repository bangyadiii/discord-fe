import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { useCurrentConversation } from "@/hooks/store/use-current-conversation-store";
import { auth } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { ChatType } from "@/types";

interface ChatSectionProps {
    chatType: ChatType;
    messageApiUrl?: string;
    pushMessageUrl?: string;
}

export default function ChatSection({
    chatType,
    messageApiUrl = "/messages",
    pushMessageUrl = "/messages",
}: ChatSectionProps) {
    let paramKey: "channelId" | "conversationId" =
        chatType === "channel" ? "channelId" : "conversationId";
    const user = auth();
    const data = useCurrentConversation.getState();
    const partner = data?.conversation?.users.find(
        (u) => u.id !== user?.userId
    ) as User;

    return (
        <div className="h-full w-full flex flex-col justify-between">
            <ChatMessages
                partner={partner}
                channel={data?.currentChannel}
                type={chatType}
                apiUrl={messageApiUrl}
                paramKey={paramKey}
                paramValue={
                    chatType == "channel"
                        ? data?.currentChannel?.id!
                        : data?.conversation?.id!
                }
            />

            <div className="h-[80px] w-full flex justify-center items-start px-8">
                <ChatInput
                    name={
                        chatType === "channel"
                            ? data?.currentChannel?.name!
                            : partner?.name!
                    }
                    type={chatType}
                    apiURL={pushMessageUrl}
                    query={
                        chatType === "channel"
                            ? { channelId: data?.currentChannel?.id }
                            : { conversationId: data?.conversation?.id }
                    }
                />
            </div>
        </div>
    );
}

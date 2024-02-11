import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { useCurrentConversation } from "@/hooks/store/use-current-conversation-store";
import { auth } from "@clerk/nextjs";
import { ChatType } from "@/types";
import { getConversationTitle } from "@/lib/utils";

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
    if (!user) return null;

    let title = data.currentChannel?.name ?? "Unknown";
    if (chatType === "directMessage") {
        title = getConversationTitle(data.conversation!, user.userId!);
    }

    return (
        <div className="h-full w-full flex flex-col justify-between">
            <ChatMessages
                title={title}
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
                    title={title}
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

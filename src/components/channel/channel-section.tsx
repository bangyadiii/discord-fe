import ChatSection from "@/components/chat/chat-section";
import MemberSection from "./member-section";
import VideoSection from "@/components/video/video-section";
import { useCurrentConversation } from "@/hooks/store/use-current-conversation-store";

export default function ChannelSection() {
    const data = useCurrentConversation.getState();

    return (
        <div className="flex h-full">
            <div className={"h-full flex-1"}>
                {data?.currentChannel?.type === "TEXT" ? (
                    <ChatSection
                        chatType="channel"
                        messageApiUrl="/messages"
                        pushMessageUrl="/messages"
                    />
                ) : (
                    <VideoSection />
                )}
            </div>
            {data?.currentChannel?.type === "TEXT" && (
                <div className="w-[320px] hidden lg:block h-full">
                    <MemberSection server={data?.currentChannel.server} />
                </div>
            )}
        </div>
    );
}

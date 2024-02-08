import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
import PartnerDetail from "@/components/dm/partner-detail";
import { MESSAGES_BATCH } from "@/config/app";
import { useCurrentConversation } from "@/hooks/use-current-conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { notFound } from "next/navigation";

interface ConversationPageProps {
    params?: {
        conversationId?: string;
    };
}

export default async function ConversationPage({
    params,
}: ConversationPageProps) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();
    if (!params?.conversationId) return notFound();
    const conversation = await getData(params.conversationId);

    if (!conversation) return notFound();
    useCurrentConversation.setState({
        conversation,
    });

    const partner = conversation.users.find((u) => u.id !== user.id);
    if (!partner) return notFound();

    return (
        <div className="flex flex-col h-full">
            <div className="h-[50px]">
                <ChatHeader label={partner.name} type="directMessage" imageUrl={partner.profileUrl}/>
            </div>
            <div className="h-[calc(100%-50px)]">
                <div className="flex h-full">
                    <div className="h-full flex-1">
                        <ChatSection
                            chatType="directMessage"
                            messageApiUrl="/dm"
                            pushMessageUrl="/dm"
                        />
                    </div>
                    <div className="md:w-[320px] hidden md:block h-full bg-secondary text-secondary-foreground">
                        <PartnerDetail />
                    </div>
                </div>
            </div>
        </div>
    );
}

async function getData(conversationId: string) {
    const conversations = await db.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            users: true,
            directMessages: {
                take: MESSAGES_BATCH,
                include: {
                    sender: true,
                },
            },
        },
    });
    return conversations;
}

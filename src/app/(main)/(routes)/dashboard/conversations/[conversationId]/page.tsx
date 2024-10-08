import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
import PartnerDetail from "@/components/dashboard/conversation/partner-detail";
import { MESSAGES_BATCH } from "@/config/app";
import { useCurrentConversation } from "@/hooks/store/use-current-conversation-store";
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

  const partner = conversation.conversationToUsers
    .map((c) => c.user)
    .find((u) => u.id !== user.id);
  if (!partner) return notFound();

  const groupName = conversation.conversationToUsers
    .filter((convUser) => convUser.user?.id !== user?.id)
    .map((convUser) => convUser.user?.name)
    .join(", ");

  return (
    <div className="flex flex-col h-full">
      <div className="h-[50px]">
        <ChatHeader
          label={conversation.isGroup ? groupName : partner.name}
          type="directMessage"
          imageUrl={
            conversation.isGroup
              ? "https://utfs.io/f/f80780dc-4a3a-4182-942a-0e4bdd6f060a-1mpytb.webp"
              : partner.profileUrl
          }
        />
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
          <div className="w-[320px] hidden lg:block h-full bg-secondary text-secondary-foreground">
            {conversation.isGroup ? "member group" : <PartnerDetail />}
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
      conversationToUsers: {
        include: {
          user: true,
        },
      },
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

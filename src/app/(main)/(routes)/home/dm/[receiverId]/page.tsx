import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
import UserDetail from "@/components/dm/user-detail";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ConversationPageProps {
    params?: {
        receiverId?: string;
    };
}

export default async function ConversationPage({
    params,
}: ConversationPageProps) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();
    if (!params?.receiverId) return redirect("/");
    const { receiver, conversations } = await getData(params?.receiverId,user.id);

    const conversationPartnerIds = conversations.map((conversation) => conversation.conversation_partner_id);
    const partners = await db.user.findMany({
        where: {
            id: {
                in: conversationPartnerIds,
            },
        },
    });
    if (!receiver) return redirect("/");

    return (
        <div className="flex flex-col h-full">
            <div className="h-[50px]">
                <ChatHeader
                    label={receiver.name}
                    type="directMessage"
                    data={{
                        partners,
                    }}
                />
            </div>
            <div className="h-[calc(100%-50px)]">
                <div className="flex h-full">
                    <div className="h-full flex-1">
                        <ChatSection
                            currentChat={receiver.name}
                            chatType="directMessage"
                            data={{
                                receiverUser: receiver,
                            }}
                            messageApiUrl="/dm"
                            pushMessageUrl="/dm"
                        />
                    </div>
                    <div className="md:w-[320px] hidden md:block h-full bg-secondary text-secondary-foreground">
                        <UserDetail receiverUser={receiver} />
                    </div>
                </div>
            </div>
        </div>
    );
}

async function getData(receiverId: string, userId: string) {
    const receiverPromise = db.user.findFirst({
        where: {
            id: receiverId,
        },
    });
    const conversationPromise = db.$queryRawUnsafe<
        {
            conversation_partner_id: string;
            last_message_time: string;
        }[]
    >(`
        SELECT
            CASE
                WHEN sender_id = '${userId}' THEN receiver_id
                ELSE sender_id
            END AS conversation_partner_id,
            MAX(created_at) AS last_message_time
        FROM
            direct_messages
        WHERE
            sender_id = '${userId}' OR receiver_id = '${userId}'
        GROUP BY
            conversation_partner_id
        ORDER BY
            last_message_time DESC;
    `);
    const [receiver, conversations] = await Promise.all([
        receiverPromise,
        conversationPromise,
    ]);
    return { receiver, conversations };
}


import ChatHeader from "@/components/chat/chat-header";
import ChatSection from "@/components/chat/chat-section";
import UserDetail from "@/components/dm/user-detail";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

interface ConversationPageProps {
    params?: {
        receiverId?: string;
    };
}

export default async function ConversationPage({
    params,
}: ConversationPageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const opponentUser = await db.user.findFirst({
        where: {
            id: params?.receiverId,
        },
    });
    if (!opponentUser) return redirect("/");

    return (
        <div className="flex flex-col h-full">
            <div className="h-[50px]">
                <ChatHeader
                    label={opponentUser.name}
                    type="directMessage"
                    data={{
                        opponentUser: opponentUser,
                    }}
                />
            </div>
            <div className="h-[calc(100%-50px)]">
                <div className="flex h-full">
                    <div className="h-full flex-1">
                        <ChatSection
                            currentChat={opponentUser.name}
                            chatType="directMessage"
                            data={{
                                opponentUser: opponentUser,
                            }}
                            messageApiUrl="/api/dm"
                            pushMessageUrl="/dm"
                        />
                    </div>
                    <div className="md:w-[320px] hidden md:block h-full bg-secondary text-secondary-foreground">
                        <UserDetail opponentUser={opponentUser} />
                    </div>
                </div>
            </div>
        </div>
    );
}

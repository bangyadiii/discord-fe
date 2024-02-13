import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { MESSAGES_BATCH } from "@/config/app";
import { useConversations } from "@/hooks/store/use-conversations-store";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ConversationWithRelation } from "@/types";
import { redirectToSignIn } from "@clerk/nextjs";
import { User } from "@prisma/client";
import React from "react";

export default async function DMLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();

    const conversations = await getConversations(user);
    useConversations.setState({
        conversations,
    });

    return (
        <div className="h-screen flex overflow-hidden">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
                <DashboardSidebar />
            </div>

            <div className="h-full flex-1 md:pl-60">{children}</div>
        </div>
    );
}

async function getConversations(
    user: User
): Promise<ConversationWithRelation[]> {
    return await db.conversation.findMany({
        where: {
            conversationToUsers: {
                some: {
                    userId: user.id,
                    leftAt: null,
                },
            },
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
}

import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import ChannelSection from "@/components/channel/channel-section";
import { useCurrentConversation } from "@/hooks/store/use-current-conversation-store";
import { ChannelWithRelation } from "@/types";
import { MESSAGES_BATCH } from "@/config/app";

interface ChannelPageProps {
    params?: {
        serverId?: string;
        channelId?: string;
    };
}

async function getCurrentChannel(
    serverId: string,
    channelId: string
): Promise<ChannelWithRelation | null> {
    return await db.channel.findUnique({
        where: {
            id: channelId,
            serverId: serverId,
        },
        include: {
            server: {
                include: {
                    members: {
                        where:{
                            leftAt: null,
                        },
                        include: {
                            user: true,
                        },
                    },
                    channels: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                    channelCategories: {
                        orderBy: {
                            createdAt: "asc",
                        },
                        include: {
                            channels: true,
                        },
                    },
                },
            },
            messages: {
                take: MESSAGES_BATCH,
            },
        },
    });
}

async function ChannelPage({ params }: Readonly<ChannelPageProps>) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    if (!params?.serverId || !params?.channelId) return redirect("/");

    const channel = await getCurrentChannel(
        params?.serverId,
        params?.channelId
    );

    const member = await db.member.findFirst({
        where: {
            serverId: params?.serverId,
            userId: profile.id,
        },
    });

    if (!channel || !member) return redirect("/");
    useCurrentConversation.setState({ currentChannel: channel });

    return (
        <div className="flex flex-col h-full">
            <div className="h-[50px]">
                <ChatHeader label={channel.name} type="channel" />
            </div>
            <div className="h-[calc(100%-50px)]">
                <ChannelSection />
            </div>
        </div>
    );
}

export default ChannelPage;

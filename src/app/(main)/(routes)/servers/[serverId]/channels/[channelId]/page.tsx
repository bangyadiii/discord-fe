import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { ServerWithRelation } from "@/types";
import ChannelSection from "@/components/channel/channel-section";

interface ChannelPageProps {
    params?: {
        serverId?: string;
        channelId?: string;
    };
}

async function ChannelPage({ params }: ChannelPageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    const channel = await db.channel.findUnique({
        where: {
            id: params?.channelId,
            serverId: params?.serverId,
        },
        include: {
            server: {
                include: {
                    members: {
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
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params?.serverId,
            userId: profile.id,
        },
    });

    if (!channel || !member) return redirect("/");
    const server: ServerWithRelation = channel.server as ServerWithRelation;

    return (
        <div className="flex flex-col h-full">
            <div className="h-[50px]">
                <ChatHeader
                    label={channel.name}
                    type="channel"
                    data={{
                        server,
                    }}
                />
            </div>
            <div className="h-[calc(100%-50px)]">
                <ChannelSection channel={channel} />
            </div>
        </div>
    );
}

export default ChannelPage;

import React from "react";
import ChatSection from "../chat/chat-section";
import MemberSection from "./member-section";
import { Channel } from "@prisma/client";
import { ServerWithRelation } from "../../types";
import VideoSection from "../video/video-section";

interface ChannelSectionProps {
    channel: Channel & {
        server: ServerWithRelation;
    };
}

export default function ChannelSection({ channel }: ChannelSectionProps) {
    return (
        <div className="flex h-full">
            <div className={"h-full flex-1"}>
                {channel.type === "TEXT" ? (
                    <ChatSection
                        currentChat={channel.name}
                        chatType="channel"
                        data={{
                            channel: channel,
                        }}
                        messageApiUrl="/api/messages"
                        pushMessageUrl="/sockets/messages"
                    />
                ) : (
                    <VideoSection />
                )}
            </div>
            {channel.type === "TEXT" && (
                <div className="md:w-[320px] hidden md:block h-full">
                    <MemberSection server={channel?.server} />
                </div>
            )}
        </div>
    );
}

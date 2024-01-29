import React from "react";
import ChatSection from "../chat/chat-section";
import MemberSection from "./member-section";
import { Channel } from "@prisma/client";
import { ServerWithRelation } from "../../types";

interface ChannelSectionProps {
    channel: Channel & {
        server: ServerWithRelation;
    };
}

export default function ChannelSection({ channel }: ChannelSectionProps) {
    return (
        <div className="flex h-full">
            <div className="w-full md:w-5/6 h-full">
                <ChatSection
                    currentChat={channel.name}
                    chatType="channel"
                    data={{
                        channel: channel,
                    }}
                />
            </div>
            <div className="w-1/6 hidden md:block h-full">
                <MemberSection server={channel?.server} />
            </div>
        </div>
    );
}

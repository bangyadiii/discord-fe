"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType } from "@prisma/client";
import { Hash, Mic, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useModal } from "@/hooks/store/use-modal-store";

interface ChannelItemProps {
    channel: Channel;
}
const channelIconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.VOICE]: Mic,
};

function ChannelItem({ channel }: ChannelItemProps) {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
    const Icon = channelIconMap[channel.type];

    const handleClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
    };

    return (
        <button
            className={cn(
                "group px-2 py-2 w-full hover:bg-background rounded-md flex items-center cursor-pointer gap-x-2 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300",
                params?.channelId === channel.id &&
                    "text-zinc-600 dark:text-zinc-300"
            )}
            onClick={handleClick}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="">{channel.name}</span>
            <Settings
                className="w-4 h-4 ml-auto hidden group-hover:block"
                onClick={(e) => {
                    e.preventDefault();
                    onOpen("settingChannel", { channel });
                }}
            />
        </button>
    );
}

export default ChannelItem;

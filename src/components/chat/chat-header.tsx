import React from "react";
import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import { ServerWithRelation } from "@/types";
import { User } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";

interface ChatHeaderProps {
    label: string;
    type: "channel" | "directMessage";
    channelId?: string;
    imageUrl?: string;
    data: {
        server?: ServerWithRelation;
        partners?: User[];
    };
}

export default function ChatHeader({ label, type, data }: ChatHeaderProps) {
    return (
        <div className="text-md font-semibold p-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2 z-31">
            <MobileToggle type={type} data={data} />
            {type === "channel" ? (
                <Hash className="mr-2 w-6 h-6 text-zinc-500 dark:text-zinc-400" />
            ): (
                <UserAvatar src={data.partners![0].profileUrl} className="w-[22px] h-[22px] md:w-[22px] md:h-[22px] mr-2" />
            )}
            {label}
        </div>
    );
}

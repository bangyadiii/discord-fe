import React from "react";
import { Hash, Menu } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import { DirectMessageWithRelation, ServerWithRelation } from "@/types";
import { User } from "@prisma/client";

interface ChatHeaderProps {
    label: string;
    type: "channel" | "directMessage";
    channelId?: string;
    imageUrl?: string;
    data: {
        server?: ServerWithRelation;
        opponentUser?: User;
        conversations?: DirectMessageWithRelation[];
    };
}

export default function ChatHeader({ label, type, data }: ChatHeaderProps) {
    return (
        <div className="text-md font-semibold p-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle type={type} data={data} />
            {type === "channel" && (
                <Hash className="mr-2 w-6 h-6 text-zinc-500 dark:text-zinc-400" />
            )}
            {label}
        </div>
    );
}

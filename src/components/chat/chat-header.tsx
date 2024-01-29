import React from "react";
import { Hash, Menu } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import { ServerWithRelation } from "@/types";

interface ChatHeaderProps {
    label: string;
    type: "channel" | "conversation";
    server: ServerWithRelation;
    channelId?: string;
    imageUrl?: string;
}

export default function ChatHeader({
    label,
    type,
    imageUrl,
    server,
}: ChatHeaderProps) {
    return (
        <div className="text-md font-semibold p-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle server={server} />
            {type === "channel" && (
                <Hash className="mr-2 w-6 h-6 text-zinc-500 dark:text-zinc-400" />
            )}
            {label}
        </div>
    );
}

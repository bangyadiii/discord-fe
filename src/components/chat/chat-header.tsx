import React from "react";
import { Hash } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import ServerMobileSidebar from "@/components/server/server-mobile-sidebar";
import DashboardMobileSidebar from "../dashboard/dashboard-mobile-sidebar";

interface ChatHeaderProps {
    label: string;
    type: "channel" | "directMessage";
    channelId?: string;
    imageUrl?: string;
}

export default function ChatHeader({ label, type, imageUrl }: ChatHeaderProps) {
    return (
        <div className="text-md font-semibold p-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2 z-31">
            <div className="block md:hidden">
                {type === "channel" ? (
                    <ServerMobileSidebar />
                ) : (
                    <DashboardMobileSidebar />
                )}
            </div>

            {type === "channel" ? (
                <Hash className="mr-2 w-6 h-6 text-zinc-500 dark:text-zinc-400" />
            ) : (
                <UserAvatar
                    src={imageUrl!}
                    className="w-[22px] h-[22px] md:w-[22px] md:h-[22px] mr-2"
                />
            )}
            {label}
        </div>
    );
}

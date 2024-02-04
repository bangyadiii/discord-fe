import React from "react";
import DMSideBarHeader from "./dm-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import UserInformation from "@/components/user-information";
import DMItem from "./dm-item";
import { ActionTooltip } from "@/components/action-tooltip";
import { User } from "@prisma/client";

interface DMSideBarProps {
    partners: User[];
}

export default function DMSideBar({
    partners
}: DMSideBarProps) {
    return (
        <div className="flex flex-col h-full w-full bg-secondary">
            <DMSideBarHeader />
            <ScrollArea className="flex-1 px-3">
                <div className="flex justify-between items-center">
                    <span className="inline-flex uppercase text-xs my-4 text-zinc-300 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300">
                        DIRECT MESSAGE
                    </span>
                    <ActionTooltip label="Create DM" side="top" align="center">
                        <button>
                            <Plus className="w-3 h-3" />
                        </button>
                    </ActionTooltip>
                </div>
                {!partners || partners?.length! === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-primary-foreground text-sm font-semibold">
                            No conversations
                        </span>
                        <span className="text-primary-foreground text-sm">
                            Start a conversation with a friend!
                        </span>
                    </div>
                ) : (
                    partners.map((partner) => {
                        return (
                            <DMItem
                                key={`dm-${partner.id}`}
                                partner={partner}
                            />
                        );
                    })
                )}
            </ScrollArea>
            <div className="">
                <UserInformation />
            </div>
        </div>
    );
}

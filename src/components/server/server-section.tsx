"use client";

import {
    Channel,
    ChannelCategory,
    ChannelType,
    MembershipRole,
} from "@prisma/client";
import React from "react";
import { ServerWithRelation } from "../../../types";
import { ActionTooltip } from "../action-tooltip";
import { ChevronDown, Edit, Plus } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import ChannelItem from "../channel/channel-item";
import { cn } from "@/lib/utils";
import { useModal } from "../../../hooks/use-modal-store";

interface ServerSectionProps {
    label?: string;
    role?: MembershipRole;
    channelType: ChannelType;
    sectionType?: "channel" | "member";
    server: ServerWithRelation;
    category?: ChannelCategory & {
        channels: Channel[] | null;
    };
}

function ServerSection({
    label,
    role,
    channelType,
    sectionType,
    server,
    category,
}: ServerSectionProps) {
    const { onOpen, isOpen } = useModal();
    const [open, setOpen] = React.useState(false);
    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="w-full flex justify-between items-center">
                {label && (
                    <span className="flex-1 flex items-center gap-x-1">
                        <ChevronDown
                            className={cn(
                                "h-3 w-3 transition",
                                open ? "rotate-0" : "-rotate-90"
                            )}
                        />
                        <span className="text-[0.7rem] uppercase font-semibold text-zinc-500 dark:text-zinc-300">
                            {label}
                        </span>
                    </span>
                )}
                {category &&
                    role !== MembershipRole.GUEST &&
                    role !== MembershipRole.MEMBER &&
                    sectionType === "channel" && (
                        <ActionTooltip label="Create Channel" side="top">
                            <button
                                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onOpen("createChannel", {
                                        channelCategoryId: category.id,
                                    });
                                }}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </ActionTooltip>
                    )}
            </CollapsibleTrigger>
            <CollapsibleContent>
                {category?.channels?.map((channel) => (
                    <ChannelItem key={channel.id} channel={channel} />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

export default ServerSection;

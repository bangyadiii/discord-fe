"use client";

import Image from "next/image";
import { ActionTooltip } from "../action-tooltip";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function NavigationDM({
    user,
}: {
    user?: {
        id: string;
    };
}) {
    const params = useParams();
    return (
        <ActionTooltip label="Direct Message" align="center" side="right">
            <button
                onClick={() => {}}
                className="group relative flex items-center"
            >
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        // params.userId !== user?.id && "group-hover:h-[20px]",
                        // params.userId === user?.id ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[15px] transition-all overflow-hidden",
                        // params?.userId === user?.id &&
                            // "bg-primary/10 text-primary rounded-[16px]"
                    )}
                >
                    <Image
                        fill
                        src="/assets/discord-icon.svg"
                        alt="Discord ICON"
                    />
                </div>
            </button>
        </ActionTooltip>
    );
}

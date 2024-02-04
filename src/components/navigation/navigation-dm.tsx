"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { default as DiscordIcon } from "@/../public/discord-icon.svg";

export default function NavigationDM() {
    const router = useRouter();
    const pathname = usePathname();

    const handleOnClick = () => {
        router.push(`/home`);
    };
    const isCurrentPath = pathname.includes("/home");
    return (
        <ActionTooltip label="Direct Message" align="center" side="right">
            <button
                onClick={handleOnClick}
                className="group relative flex items-center"
            >
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        isCurrentPath && "group-hover:h-[20px]",
                        isCurrentPath ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[15px] transition-all overflow-hidden items-center justify-center group-hover:bg-primary bg-background",
                        isCurrentPath && "bg-primary rounded-[16px]"
                    )}
                >
                    <DiscordIcon
                        className={cn(
                            "w-7 h-7 text-primary dark:text-slate-200 group-hover:text-white transition",
                            isCurrentPath && "text-white"
                        )}
                    />
                </div>
            </button>
        </ActionTooltip>
    );
}

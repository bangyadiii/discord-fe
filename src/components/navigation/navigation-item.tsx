"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ActionTooltip } from "../action-tooltip";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface NavigationItemProps {
    id: string;
    name: string;
    imageUrl: string;
}
export default function NavigationItem({
    id,
    name,
    imageUrl,
}: NavigationItemProps) {
    const router = useRouter();
    const params = useParams();
    const onClick = () => {
        router.push(`/servers/${id}`);
    };

    return (
        <ActionTooltip label={name} align="center" side="right">
            <button
                onClick={() => {
                    onClick();
                }}
                className="group relative flex items-center"
            >
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        params?.serverId !== id && "group-hover:h-[20px]",
                        params?.serverId === id ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[15px] transition-all overflow-hidden",
                        params?.serverId === id &&
                            "bg-primary/10 text-primary rounded-[16px]"
                    )}
                >
                    <Image fill src={imageUrl} alt={name} />
                </div>
            </button>
        </ActionTooltip>
    );
}
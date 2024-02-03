"use client";

import React from "react";
import { UserAvatar } from "../user-avatar";
import OnlineStatus from "../online-status";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface DMItemProps {
    partner: User;
}

export default function DMItem({ partner }: DMItemProps) {
    const router = useRouter();

    const handleOnClick = () => {
        router.push(
            `/home/dm/${partner.id}`
        );
    };

    return (
        <button
            className="w-full flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all p-2 rounded-md cursor-pointer"
            onClick={handleOnClick}
        >
            <div className="relative">
                <UserAvatar
                    src={partner.profileUrl}
                    className="w-[30px] h-[30px] md:h-[30px] md:w-[30px]"
                />
                <OnlineStatus className="ring-4 ring-secondary absolute bottom-0 right-0" />
            </div>

            <span className="text-sm">
                {partner.name}
            </span>
        </button>
    );
}

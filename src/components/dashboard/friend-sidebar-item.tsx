"use client";

import { cn } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FriendSidebarItem() {
    const pathname = usePathname();

    return (
        <Link
            href={"/home?tab=online"}
            className={cn(
                "w-full flex items-center group gap-x-2 transition-all px-3 py-2 rounded-md text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 hover:dark:text-zinc-200",
                pathname === "/home" ? "bg-zinc-700/10 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-200" : ""
            )}
        >
            <UsersRound className="w-5 h-5" />
            Friends
        </Link>
    );
}

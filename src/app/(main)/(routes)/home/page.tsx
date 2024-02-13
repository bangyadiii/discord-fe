"use client";

import DashboardMobileSidebar from "@/components/dashboard/dashboard-mobile-sidebar";
import FriendSection from "@/components/dashboard/friend/friend-section";
import { Separator } from "@/components/ui/separator";
import { useFriendsQuery } from "@/hooks/query/use-friends-query";
import { cn } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import { useSearchParams } from "next/navigation";

const Links = [
    {
        href: {
            pathname: "/home",
            query: { tab: "online" },
        },
        label: "Online",
    },
    {
        href: {
            pathname: "/home",
            query: { tab: "all" },
        },
        label: "All",
    },
    {
        href: {
            pathname: "/home",
            query: { tab: "pending" },
        },
        label: "Pending",
    },
    {
        href: {
            pathname: "/home",
            query: { tab: "blocked" },
        },
        label: "Blocked",
    },
];

export default function DMPage() {
    const searchParams = useSearchParams();
    useFriendsQuery();

    // update tab query
    if (typeof window !== "undefined" && !searchParams?.get("tab")) {
        window?.history.pushState(null, "", `?tab=online`);
    }

    const updateTabQuery = (tab: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("tab", tab);
        window.history.pushState(null, "", `?${params.toString()}`);
    };

    return (
        <div className="h-full">
            {/* header */}
            <div className="text-md font-semibold p-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2">
                <div className="block md:hidden">
                    <DashboardMobileSidebar />
                </div>
                <div className="flex gap-x-3">
                    <UsersRound className="w-6 h-6 text-zinc-600 dark:text-zinc-400 " />
                    <span className="">Friends</span>
                </div>
                <Separator orientation="vertical" className="mx-3" />
                <div className="flex gap-x-2 text-sm">
                    {Links.map((link, index) => (
                        <button
                            key={"links" + index}
                            onClick={() => {
                                updateTabQuery(link.href.query.tab);
                            }}
                            className={cn(
                                "text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 hover:dark:bg-zinc-300/75 rounded-md dark:hover:text-zinc-600 transition-all cursor-pointer px-2 py-1",
                                searchParams?.get("tab") === link.href.query.tab
                                    ? "bg-zinc-300/10 dark:bg-zinc-300/50 text-zinc-600 dark:text-zinc-300"
                                    : ""
                            )}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            updateTabQuery("addFriend");
                        }}
                        className={cn(
                            "ml-4 h-fit px-2 py-1 rounded-md",
                            searchParams?.get("tab") === "addFriend"
                                ? "bg-transparent text-emerald-500"
                                : "bg-emerald-600 "
                        )}
                    >
                        Add Friend
                    </button>
                </div>
            </div>

            {/* content */}
            <div className="flex w-full h-[calc(100%-50px)] ">
                <div className="flex-1">
                    <FriendSection />
                    <Separator className="mx-3 my-4" />
                </div>
                <div className="hidden lg:w-[300px] bg-secondary text-secondary-foreground p-3">
                    <h3>User Activity</h3>
                </div>
            </div>
        </div>
    );
}

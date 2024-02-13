"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import React, { useEffect, useMemo, useState } from "react";
import DashboardFriendList from "./dashboard-friend-list";
import { Loader2, Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useFriendsQuery } from "@/hooks/query/use-friends-query";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useCreateConversationMutation } from "@/hooks/query/use-conversations-mutation";
import { useRouter } from "next/navigation";

export default function MakeConversation() {
    const [isMounted, setIsMounted] = React.useState(false);
    const { data, isLoading } = useFriendsQuery();
    const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const mutation = useCreateConversationMutation();

    const conversations = useMemo(() => {
        return data?.data;
    }, [data?.data]);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (!isMounted) return null;

    const isDesktop = window.innerWidth > 768;

    const handleCreateConversation = () => {
        const ids = selectedFriends.map((friend) => friend.id);
        mutation.mutate(ids);
        setOpen((prev) => !prev);
        setSelectedFriends([]);
        router.push(`/dashboard/conversations/${mutation.data?.data.data?.id}`);
    };

    const renderPopover = () => {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                    <ActionTooltip
                        label="Make Conversation"
                        side="top"
                        align="center"
                    >
                        <button>
                            <Plus className="w-3 h-3" />
                        </button>
                    </ActionTooltip>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    side="right"
                    className="w-[400px] flex flex-col"
                >
                    <h3 className="text-secondary-foreground text-xl font-semibold">
                        Select Friends
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        You can add {10 - selectedFriends.length} more friends
                    </p>
                    {isLoading && (
                        <Loader2 className="w-5 h-5 text-zinc-600 animate-spin dark:text-zinc-500 self-center" />
                    )}
                    {!isLoading && (
                        <DashboardFriendList
                            friends={conversations}
                            selectedFriends={selectedFriends}
                            setSelectedFriends={setSelectedFriends}
                        />
                    )}
                    <Button
                        className="mt-3 w-full"
                        onClick={handleCreateConversation}
                        disabled={
                            selectedFriends.length === 0 || mutation.isLoading
                        }
                    >
                        {mutation.isLoading ? (
                            <Loader2 className="w-5 h-5 text-zinc-700 animate-spin dark:text-zinc-500 self-center" />
                        ) : (
                            "Create"
                        )}
                    </Button>
                </PopoverContent>
            </Popover>
        );
    };

    const renderDrawer = () => {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger>
                    <ActionTooltip
                        label="Make Conversation"
                        side="top"
                        align="center"
                    >
                        <button>
                            <Plus className="w-3 h-3" />
                        </button>
                    </ActionTooltip>
                </DrawerTrigger>
                <DrawerContent className="p-3">
                    <h3 className="text-secondary-foreground text-xl font-semibold">
                        Select Friends
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        You can add 10 friend total
                    </p>
                    {isLoading && (
                        <Loader2 className="w-5 h-5 text-zinc-600 animate-spin dark:text-zinc-500 self-center" />
                    )}
                    {!isLoading && (
                        <DashboardFriendList
                            friends={conversations}
                            selectedFriends={selectedFriends}
                            setSelectedFriends={setSelectedFriends}
                        />
                    )}
                    <Button
                        className="mt-3 w-full"
                        onClick={handleCreateConversation}
                    >
                        {mutation.isLoading ? (
                            <Loader2 className="w-5 h-5 text-zinc-600 animate-spin dark:text-zinc-500 self-center" />
                        ) : (
                            "Create"
                        )}
                    </Button>
                </DrawerContent>
            </Drawer>
        );
    };

    return isDesktop ? renderPopover() : renderDrawer();
}

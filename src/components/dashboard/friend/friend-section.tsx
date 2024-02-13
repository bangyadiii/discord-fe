"use client";

import { useSearchParams } from "next/navigation";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    useFriendsQuery,
    usePendingFriendQuery,
} from "@/hooks/query/use-friends-query";
import { FriendWithRelation, UserWithRelation } from "@/types";
import { FriendItem } from "./friend-item";
import { PendingFriendItem } from "./pending-friend-item";
import { useUser } from "@clerk/nextjs";
import AddFriendSection from "./add-friend-section";

function FriendSection() {
    const session = useUser().user;
    const { data: friends, isLoading } = useFriendsQuery();
    const { data: pendingFriends } = usePendingFriendQuery();

    const searchParams = useSearchParams();
    const isAll = searchParams?.get("tab") === "all";
    const isOnline = searchParams?.get("tab") === "online";
    const isPending = searchParams?.get("tab") === "pending";
    const isBlocked = searchParams?.get("tab") === "blocked";

    const isAddFriend = searchParams?.get("tab") === "addFriend";
    if (!session) return null;

    if (isAddFriend) {
        return <AddFriendSection />;
    }
    
    const heading = isAll
        ? "All"
        : isOnline
        ? "Online"
        : isPending
        ? "Pending"
        : isAddFriend
        ? "Add Friend"
        : "Blocked";
    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="px-4 py-2">
            <Command className="bg-inherit w-full">
                <div className="bg-secondary">
                    <CommandInput placeholder="Search Friend" />
                </div>
                <CommandList>
                    <CommandGroup
                        heading={heading}
                    >
                        {(isAll || isOnline) &&
                            friends?.data &&
                            friends?.data?.length > 0 &&
                            friends?.data?.map((friend: UserWithRelation) => (
                                <CommandItem
                                    key={friend.id}
                                    className="group w-full flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all p-2 rounded-md cursor-pointer"
                                >
                                    <FriendItem friend={friend} />
                                </CommandItem>
                            ))}
                        {isPending &&
                            pendingFriends?.data &&
                            pendingFriends?.data?.length > 0 &&
                            pendingFriends?.data?.map(
                                (friend: FriendWithRelation) => (
                                    <CommandItem
                                        key={friend.id}
                                        className="group w-full flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all p-2 rounded-md cursor-pointer"
                                    >
                                        <PendingFriendItem
                                            friend={friend}
                                            sessionId={session.id}
                                        />
                                    </CommandItem>
                                )
                            )}
                    </CommandGroup>
                    <CommandEmpty>No results found.</CommandEmpty>
                </CommandList>
            </Command>
        </div>
    );
}

export default FriendSection;

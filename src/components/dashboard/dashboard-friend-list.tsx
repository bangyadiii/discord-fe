"use client";

import useFriendsQuery from "@/hooks/query/use-friends-query";
import { Loader2, X } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { CommandEmpty } from "cmdk";
import { User } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import React from "react";

interface DashboardFriendListProps {
    selectedFriends: User[];
    setSelectedFriends: React.Dispatch<React.SetStateAction<User[]>>;
    friends?: User[];
}

export default function DashboardFriendList({
    selectedFriends,
    setSelectedFriends,
    friends,
}: DashboardFriendListProps) {
    const toggleSelectedFriend = (friend: User) => {
        if(selectedFriends.length > 10) return;
        if (selectedFriends.includes(friend)) {
            setSelectedFriends((prev) =>
                prev.filter((selectedFriend) => selectedFriend.id !== friend.id)
            );
        } else {
            setSelectedFriends((prev) => [...prev, friend]);
        }
    };
    return (
        <div className="max-h-[350px] w-full flex flex-col space-y-2">
            <Command className="flex flex-col overflow-y-auto space-y-2">
                <CommandInput placeholder="Add friends..." />
                {/* selected item with remove icon */}
                <div className="flex flex-wrap space-x-1 gap-y-1">
                    {selectedFriends.map((friend) => {
                        return (
                            <div
                                key={friend.id}
                                className="flex items-center space-x-2 bg-secondary px-2 py-1 rounded-sm"
                            >
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    {friend.name}
                                </span>
                                <button
                                    onClick={() => {
                                        toggleSelectedFriend(friend);
                                    }}
                                >
                                    <X className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                <CommandList>
                    <CommandEmpty>No friends found.</CommandEmpty>
                    <CommandGroup>
                        {friends &&
                            friends.map((friend) => {
                                return (
                                    <CommandItem
                                        key={friend.id}
                                        className="group flex items-center justify-between space-x-2 w-full"
                                        onSelect={() => {
                                            toggleSelectedFriend(friend);
                                        }}
                                        disabled={selectedFriends.length > 10}
                                    >
                                        <div className="flex space-x-1">
                                            <UserAvatar
                                                src={friend.profileUrl}
                                                className="w-6 h-6 md:w-6 md:h-6"
                                            />
                                            <span className="text-zinc-600 dark:text-zinc-400">
                                                {friend.name}
                                            </span>
                                        </div>

                                        <Checkbox
                                            checked={selectedFriends.some(
                                                (selectedFriend) =>
                                                    selectedFriend.id ===
                                                    friend.id
                                            )}
                                            className="justify-self-end border-secondary-foreground"
                                        />
                                    </CommandItem>
                                );
                            })}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}

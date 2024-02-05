import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@prisma/client";
import OnlineStatus from "@/components/online-status";
import { Separator } from "@/components/ui/separator";

interface UserDetailProps {
    receiverUser: User;
}

export default function UserDetail({ receiverUser }: UserDetailProps) {
    return (
        <div className="flex flex-col gap-y-1 ">
            <div className="relative h-32">
                <div
                    className={`absolute bg-primary h-1/2 w-full top-0 left-0 right-0`}
                ></div>
                <div className="px-6 py-4 relative w-14 h-14 md:h-20 md:w-20">
                    <UserAvatar
                        src={receiverUser.profileUrl!!}
                        className="w-14 h-14 md:h-20 md:w-20 ring-[6px] ring-secondary"
                    />
                    <OnlineStatus className="absolute -bottom-3 -right-5 w-4 h-4 ring-[6px] ring-secondary" />
                </div>
            </div>
            <div className="bg-zinc-300 dark:bg-zinc-900 mx-4 mb-4 rounded-md p-3 flex flex-col gap-y-1">
                <span className="font-semibold text-primary-foreground">{receiverUser?.name!}</span>
                <Separator />
                <p className="text-[10px] text-bold text-primary-foreground">MEMBER SINCE</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                    {new Date(receiverUser?.createdAt!!).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

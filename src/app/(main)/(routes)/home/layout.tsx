import DMSideBar from "@/components/dm/dm-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import React from "react";

export default async function DMLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        userId: string;
    };
}) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();

    const messages = await db.directMessage.findMany({
        where: {
            OR: [
                {
                    senderId: user.id,
                },
                {
                    receiverId: user.id,
                },
            ],
        },
        include: {
            sender: true,
            receiver: true,
        },
    });
    let opponentUser: any;
    if (!messages) {
        opponentUser = null;
    } else {
        opponentUser =
            messages?.[0]?.senderId === user.id
                ? messages[0].receiver
                : messages?.[0]?.sender;
    }

    return (
        <div className="h-screen flex overflow-hidden">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
                <DMSideBar
                    conversations={messages}
                    opponentUser={opponentUser}
                />
            </div>

            <div className="h-full flex-1 md:pl-60">{children}</div>
        </div>
    );
}

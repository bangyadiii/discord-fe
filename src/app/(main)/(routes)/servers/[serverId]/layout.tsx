import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import React from "react";
import { db } from "@/lib/db";
import { ServerWithRelation } from "@/types";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerSideBar from "@/components/server/server-sidebar";

export default async function ServerIDLayout({
    children,
    params: { serverId },
}: {
    children: React.ReactNode;
    params: {
        serverId: string;
    };
}) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    const server = await getServer(profile, serverId);
    if (!server) return redirect("/");
    return (
        <div className="h-screen flex overflow-hidden">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
                <ServerSideBar server={server} />
            </div>
            <div className="h-full flex-1 md:pl-60">{children}</div>
        </div>
    );
}

async function getServer(
    profile: User,
    serverId: string
): Promise<ServerWithRelation | null> {
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    userId: profile.id,
                },
            },
        },
        include: {
            members: {
                include: {
                    user: true,
                },
                orderBy: {
                    role: "asc",
                },
            },
            channels: {
                orderBy: {
                    order: "asc",
                },
            },
            channelCategories: {
                orderBy: {
                    createdAt: "asc",
                },
                include: {
                    channels: true,
                },
            },
        },
    });
    return server;
}

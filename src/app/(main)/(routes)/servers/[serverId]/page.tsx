import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerWithRelation } from "@/types";
import { redirectToSignIn } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { useCurrentServer } from "@/hooks/store/use-current-server";

interface ServerPageProps {
    params?: {
        serverId?: string;
    };
}

async function getCurrentServer(
    serverId: string,
    userId: string
): Promise<ServerWithRelation | null> {
    return await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    userId: userId,
                    leftAt: null,
                },
            },
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: true,
            channelCategories: true,
        },
    });
}

export default async function ServerPage({ params }: ServerPageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    if (!params?.serverId) return redirect("/");
    const server = await getCurrentServer(params?.serverId, profile.id);
    if (!server) return notFound();

    const initialChannel = server?.channels?.find(
        (channel) => channel.type === "TEXT"
    );
    useCurrentServer.setState({
        server: server,
    });

    return redirect(
        `/servers/${params?.serverId}/channels/${initialChannel?.id}`
    );
}

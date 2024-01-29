import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerPageProps {
    params?: {
        serverId?: string;
    };
}

export default async function ServerPage({ params }: ServerPageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: params?.serverId,
            members: {
                some: {
                    userId: profile.id,
                },
            },
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!server) return <div>Channel not found</div>;
    const initialChannel = server?.channels.find((channel) => channel.type === "TEXT");

    return redirect(
        `/servers/${params?.serverId}/channels/${initialChannel?.id}`
    );
}

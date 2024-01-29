import ServerSideBar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ServerIDLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        serverId: string;
    };
}) {
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
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
                    createdAt: "asc",
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

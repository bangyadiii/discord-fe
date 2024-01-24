import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InvitePageProps {
    params: {
        inviteCode: string;
    };
}
export default async function InvitePage({ params }: InvitePageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    if (!params.inviteCode) return redirect("/");

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    userId: profile.id,
                },
            },
        },
    });
    if (existingServer) return redirect(`/servers/${existingServer.id}`);
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: {
                    userId: profile.id,
                },
            },
        },
    });
    if (!server) return null;

    return redirect(`/servers/${server.id}`);
}

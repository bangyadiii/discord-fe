import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );

        if (!params.serverId)
            return NextResponse.json(
                { message: "Server ID missing" },
                { status: 400 }
            );

        const server = await db.server.findUnique({
            where: {
                id: params.serverId,
            },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if(!server) return NextResponse.json({ message: "Server not found" }, { status: 404 });

        const member = server?.members?.find(
            (member) => member.userId === profile.id
        );
        if (!member)
            return NextResponse.json(
                { message: "You are not a member of this server." },
                { status: 400 }
            );
        const updatedMember = await db.member.update({
            where: {
                id: member.id,
            },
            data: {
                leftAt: new Date(),
            },
        });

        if (!updatedMember)
            return NextResponse.json(
                {
                    message:
                        "You are the owner of this server. You cannot leave it.",
                },
                { status: 400 }
            );

        return NextResponse.json({ data: server }, { status: 200 });
    } catch (error) {
        console.log("[SERVER_PUT]", error);

        return NextResponse.json(
            { message: "Something went wrong.", error: error },
            { status: 500 }
        );
    }
}

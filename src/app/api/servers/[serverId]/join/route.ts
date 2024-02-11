import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    {
        params,
    }: {
        params: {
            serverId: string;
        };
    }
) {
    try {
        const user = await currentProfile();
        if (!user)
            return NextResponse.json(
                {
                    message: "Unauthenticated",
                },
                { status: 401 }
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

        if (!server)
            return NextResponse.json(
                { message: "Server not found" },
                { status: 404 }
            );
        const memberPernahJoin = server.members.find(
            (member) => member.userId === user.id
        );
        if (memberPernahJoin?.leftAt == null)
            return NextResponse.json(
                { message: "You have already joined this server" },
                { status: 400 }
            );
        const updated = await db.member.update({
            where: {
                id: memberPernahJoin.id,
            },
            data: {
                leftAt: null,
            },
        });
        return NextResponse.json({
            message: "You have joined the server",
            member: updated,
        });
    } catch (error) {
        console.log("JOIN SERVER POST", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error },
            { status: 500 }
        );
    }
}

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MembershipRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// edit channel
export async function PATCH(
    req: NextRequest,
    { params }: { params: { channelId: string } }
) {
    try {
        const user = await currentProfile();
        const { name, type } = await req.json();

        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        const channel = await db.channel.findUnique({
            where: {
                id: params.channelId,
                AND: {
                    server: {
                        members: {
                            some: {
                                userId: user.id,
                                role: {
                                    in: [
                                        MembershipRole.ADMIN,
                                        MembershipRole.OWNER,
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!channel)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        const uppdated = await db.channel.update({
            where: {
                id: params.channelId,
            },
            data: {
                name,
                type,
            },
        });

        return NextResponse.json(
            {
                message: "Channel updated",
                data: uppdated,
            },
            { status: 200 }
        );
    } catch (e: any) {
        console.log("[PATCH_CHANNEL]", e);

        return NextResponse.json(
            {
                message: "Something went wrong",
                error: e.message,
            },
            { status: 500 }
        );
    }
}

// delete channel
export async function DELETE(
    req: NextRequest,
    { params }: { params: { channelId: string } }
) {
    try {
        const user = await currentProfile();

        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        const channel = await db.channel.findUnique({
            where: {
                id: params.channelId,
                AND: {
                    server: {
                        members: {
                            some: {
                                userId: user.id,
                                role: {
                                    in: [
                                        MembershipRole.ADMIN,
                                        MembershipRole.OWNER,
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!channel)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        await db.channel.delete({
            where: {
                id: params.channelId,
            },
        });

        return NextResponse.json(
            {
                message: "Channel deleted",
            },
            { status: 200 }
        );
    } catch (e: any) {
        console.log("[DELETE_CHANNEL]", e);

        return NextResponse.json(
            {
                message: "Something went wrong",
                error: e.message,
            },
            { status: 500 }
        );
    }
}

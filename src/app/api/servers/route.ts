import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MembershipRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const user = await currentProfile();
        const { name, imageUrl } = await req.json();

        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        let server = await db.server.create({
            data: {
                name,
                imageUrl,
                ownerId: user.id,
                inviteCode: crypto.randomUUID(),
                channelCategories: {
                    create: [
                        {
                            name: "General",
                        },
                    ],
                },
                members: {
                    create: [
                        {
                            userId: user.id,
                            role: MembershipRole.OWNER,
                        },
                    ],
                },
            },
            include: {
                channelCategories: true,
            },
        });
        server = await db.server.update({
            where: {
                id: server.id,
            },
            data: {
                channels: {
                    create: [
                        {
                            name: "general",
                            type: ChannelType.TEXT,
                            categoryId: server.channelCategories[0].id,
                        },
                        {
                            name: "general",
                            type: ChannelType.VOICE,
                            categoryId: server.channelCategories[0].id,
                        },
                    ],
                },
            },
            include: {
                channelCategories: {
                    include: {
                        channels: true,
                    },
                },
                members: {
                    include: {
                        user: true,
                    },
                },
                channels: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        return NextResponse.json({ data: server }, { status: 201 });
    } catch (error: any) {
        console.error("[SERVER_POST]", error);
        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

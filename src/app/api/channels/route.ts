import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MembershipRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await currentProfile();
        const categoryId = req.nextUrl.searchParams.get("categoryId");
        const { name, type, serverId } = await req.json();

        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        const server = await db.server.findUnique({
            where: {
                id: serverId,
                AND: {
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
        });
        if (!server)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        if (categoryId) {
            const category = await db.channelCategory.findUnique({
                where: {
                    id: categoryId,
                    serverId: serverId,
                },
            });
            if (!category) {
                return NextResponse.json(
                    { message: "Category Not Found" },
                    { status: 404 }
                );
            }
        }

        const channel = await db.channel.create({
            data: {
                name,
                type,
                serverId: serverId,
                categoryId,
            },
        });

        return NextResponse.json({ data: channel }, { status: 201 });
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

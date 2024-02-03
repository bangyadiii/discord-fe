import { MESSAGES_BATCH } from "@/config/app";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        if (!channelId) {
            return NextResponse.json(
                { message: "Channel ID required" },
                { status: 400 }
            );
        }
        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }
        return NextResponse.json({
            data: messages,
            nextCursor,
        });
    } catch (error) {
        console.log("MESSAGE_GET_ERROR: ", error);
        return NextResponse.json(
            { message: "Internal Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    console.log("test");
    try {
        const user = await currentProfile();
        const { content, fileUrl } = await req.json();
        const qs = new URL(req.url).searchParams;
        const serverId = qs.get("serverId");
        const channelId = qs.get("channelId");

        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (!serverId) {
            return NextResponse.json(
                {
                    message: "Server ID required",
                },
                { status: 400 }
            );
        }
        if (!channelId) {
            return NextResponse.json(
                {
                    message: "Channel ID required",
                },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                { error: "Content missing" },
                { status: 400 }
            );
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        userId: user.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });
        if (!server) {
            return NextResponse.json(
                { message: "Server not found" },
                { status: 404 }
            );
        }
        const member = server.members.find((m) => m.userId === user.id);
        if (!member) {
            return NextResponse.json(
                { message: "Member invalid" },
                { status: 404 }
            );
        }
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });
        if (!channel) {
            return NextResponse.json(
                { message: "Channel not found" },
                { status: 404 }
            );
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return NextResponse.json({ data: message }, { status: 201 });
    } catch (error: any) {
        console.log("SOCKET_ERROR: ", error);
        return NextResponse.json(
            {
                message: error.message || "Internal Error",
            },
            { status: 500 }
        );
    }
}

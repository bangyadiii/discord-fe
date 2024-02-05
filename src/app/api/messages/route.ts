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
                    deletedAt: null,
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
                    deletedAt: null,
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
    try {
        const user = await currentProfile();
        const { content, fileUrl } = await req.json();
        const qs = new URL(req.url).searchParams;
        const channelId = qs.get("channelId");

        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
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

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
            },
            include: {
                server: {
                    include: {
                        members: true,
                    },
                },
            },
        });

        if (!channel) {
            return NextResponse.json(
                { message: "Channel not found" },
                { status: 404 }
            );
        }

        const member = channel.server.members.find(
            (member) => member.userId == user.id
        );
        if (!member) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId,
                memberId: member.id,
            },
        });

        return NextResponse.json({ data: message }, { status: 201 });
    } catch (error: any) {
        console.log("POST_MESSAGE", error);
        return NextResponse.json(
            {
                message: error.message || "Internal Error",
            },
            { status: 500 }
        );
    }
}

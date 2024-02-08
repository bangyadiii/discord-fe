import { MESSAGES_BATCH } from "@/config/app";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { DirectMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// get all direct messages
export async function GET(req: NextRequest) {
    try {
        const user = await currentProfile();
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        const qs = new URL(req.url).searchParams;
        const conversationId = qs.get("conversationId");
        const cursor = qs.get("cursor");

        if (!conversationId)
            return NextResponse.json(
                { message: "conversation id is required" },
                { status: 400 }
            );

        let messages: DirectMessage[] = [];
        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId,
                    deletedAt: null,
                },
                include: {
                    sender: true,
                    conversation: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId,
                    deletedAt: null,
                },
                include: {
                    sender: true,
                    conversation: true,
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
    } catch (error: any) {
        console.log("[GET_DM]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// push new direct message
export async function POST(req: NextRequest) {
    try {
        const user = await currentProfile();
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        const { content } = await req.json();
        const qs = new URL(req.url).searchParams;

        if (!content)
            return NextResponse.json(
                { message: "Content is required" },
                { status: 400 }
            );

        const conversationId = qs.get("conversationId");
        if (!conversationId)
            return NextResponse.json(
                { message: "conversation ID is required" },
                { status: 400 }
            );

        const dm = await db.directMessage.create({
            data: {
                content: content,
                senderId: user.id,
                conversationId,
            },
            include: {
                sender: true,
            },
        });

        await pusherServer.trigger(
            toPusherKey(`chat:directMessage:${conversationId}`),
            toPusherKey("directMessage:new"),
            {
                data: dm,
            }
        );

        return NextResponse.json({ data: dm }, { status: 201 });
    } catch (error: any) {
        console.log("[POST_DM]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

import { MESSAGES_BATCH } from "@/config/app";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
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
        const receiverUserId = qs.get("receiverUserId");
        const cursor = qs.get("cursor");

        if (!receiverUserId)
            return NextResponse.json(
                { message: "Opponent user id is required" },
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
                    OR: [
                        {
                            senderId: user.id,
                            receiverId: receiverUserId,
                        },
                        {
                            senderId: receiverUserId,
                            receiverId: user.id,
                        },
                    ],
                    deletedAt: null,
                },
                include: {
                    sender: true,
                    receiver: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    OR: [
                        {
                            senderId: user.id,
                            receiverId: receiverUserId,
                        },
                        {
                            senderId: receiverUserId,
                            receiverId: user.id,
                        },
                    ],
                    deletedAt: null,
                },
                include: {
                    sender: true,
                    receiver: true,
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

        if (!qs.has("receiverUserId"))
            return NextResponse.json(
                { message: "Receiver ID is required" },
                { status: 400 }
            );

        const dm = await db.directMessage.create({
            data: {
                content: content,
                senderId: user.id,
                receiverId: qs.get("receiverUserId")!,
            },
            include: {
                sender: true,
                receiver: true,
            },
        });

        return NextResponse.json({ data: dm }, { status: 201 });
    } catch (error: any) {
        console.log("[POST_DM]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

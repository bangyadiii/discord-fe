import { MESSAGES_BATCH } from "@/config/app";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET OR CREATE CONVERSATION BY USER IDs
export async function POST(req: NextRequest) {
    try {
        const user = await currentProfile();
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        let { userIds } = await req.json();
        if (!userIds || !Array.isArray(userIds) || userIds.length <= 0) {
            throw new Error("userIds is required");
        }

        userIds.push(user.id);
        // userIds is an array of user ids that are part of the conversation
        // userIds.length should be 2 for a direct message conversation
        // and more than 2 for a group conversation
        if (userIds.length < 2) throw new Error("userIds must be at least 2");

        let condition = [];
        for (const id of userIds) {
            condition.push({
                conversationToUsers: {
                    some: {
                        userId: id,
                    },
                },
            });
        }

        // check if conversation already exists
        const conversation = await db.conversation.findFirst({
            where: {
                isGroup: userIds.length > 2,
                AND: condition,
            },
            include: {
                conversationToUsers: {
                    include: {
                        user: true,
                    },
                },
                directMessages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: MESSAGES_BATCH,
                },
            },
        });

        if (conversation) return NextResponse.json({ data: conversation });
        const newConversation = await db.conversation.create({
            data: {
                isGroup: userIds.length > 2,
                conversationToUsers: {
                    createMany: {
                        data: userIds.map((id) => ({
                            userId: id,
                        })),
                    },
                },
            },
            include: {
                conversationToUsers: {
                    include: {
                        user: true,
                    },
                },
                directMessages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: MESSAGES_BATCH,
                },
            },
        });
        return NextResponse.json({ data: newConversation }, { status: 201 });
    } catch (error: any) {
        console.log("[GET_OR_CREATE_CONVERSATION_BY_USER_IDS]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await currentProfile();
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        const conversations = await db.conversation.findMany({
            where: {
                conversationToUsers: {
                    some: {
                        userId: user.id,
                        leftAt: null,
                    },
                },
            },
            include: {
                conversationToUsers:{
                    include: {
                        user: true,
                    },
                },
                directMessages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: MESSAGES_BATCH,
                },
            },
        });
        return NextResponse.json({ data: conversations });
    } catch (error: any) {
        console.log("[GET_CONVERSATION_BY_ID]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

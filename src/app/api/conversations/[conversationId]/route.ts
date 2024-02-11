import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    {
        params,
    }: {
        params?: { conversationId?: string };
    }
) {
    try {
        const session = await currentProfile();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        if (!params?.conversationId) {
            return NextResponse.json(
                { message: "Invalid conversation id" },
                { status: 400 }
            );
        }

        // get conversation by id and check if the current user is still in the conversation
        const conversation = await db.conversation.findUnique({
            where: {
                id: params.conversationId,
                conversationToUsers: {
                    some: { userId: session.id, leftAt: null },
                },
            },
            include: {
                conversationToUsers: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!conversation) {
            return NextResponse.json(
                { message: "Conversation not found" },
                { status: 404 }
            );
        }

        const atLeast2UsersStillInConversation =
            conversation.conversationToUsers.filter((c) => c.leftAt == null)
                .length >= 2;

        if (!atLeast2UsersStillInConversation) {
            // delete the conversation
            const deleted = await db.conversation.delete({
                where: {
                    id: params.conversationId,
                },
            });
            if (!deleted) throw new Error("Error deleting conversation");

            return NextResponse.json(
                { message: "Conversation deleted", data: deleted },
                { status: 200 }
            );
        }

        // if conversation has more than 2 users (group conversation) and the current user (session) leftAt == null, just leave the conversation (mark leftAt as now)
        // if conversation has only 2 users, delete the conversation
        if (conversation.isGroup) {
            // leave the conversation (update leftAt to now)
            const updated = await db.conversationToUser.update({
                where: {
                    conversationId_userId: {
                        conversationId: params.conversationId,
                        userId: session.id,
                    },
                },
                data: {
                    leftAt: new Date(),
                },
            });
            if (!updated) {
                return NextResponse.json(
                    { message: "Error leaving conversation" },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { message: "Conversation left", data: updated },
                { status: 200 }
            );
        }

        // one on one conversation and no one left the conversation, 
        // update current user leftAt to now
        const updated = await db.conversationToUser.update({
            where: {
                conversationId_userId: {
                    conversationId: params.conversationId,
                    userId: session.id,
                },
            },
            data: {
                leftAt: new Date(),
            },
        });
        if (!updated) throw new Error("Error leaving conversation");

        return NextResponse.json(
            { message: "Conversation left", data: updated },
            { status: 200 }
        );
    } catch (error) {
        console.log(`CONVERSATIONS_DELETE: ${error}`);
        return NextResponse.json(
            { message: "Error deleting conversation", error },
            { status: 500 }
        );
    }
}

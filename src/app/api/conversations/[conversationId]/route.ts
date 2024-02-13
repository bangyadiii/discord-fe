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

        const atLeast2UsersInChat =
            conversation.conversationToUsers.filter((c) => c.leftAt == null)
                .length >= 2;

        if (conversation.isGroup && !atLeast2UsersInChat) {
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
    } catch (error) {
        console.log(`CONVERSATIONS_DELETE: ${error}`);
        return NextResponse.json(
            { message: "Error deleting conversation", error },
            { status: 500 }
        );
    }
}

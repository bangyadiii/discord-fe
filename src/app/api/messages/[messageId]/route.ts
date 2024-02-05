import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// delete message by id
export async function DELETE(
    req: NextRequest,
    { params }: { params: { messageId: string } }
) {
    try {
        const user = await currentProfile();
        const messageId = params.messageId;

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        if (!messageId) {
            return NextResponse.json(
                { message: "Message ID required" },
                { status: 400 }
            );
        }
        const message = await db.message.findUnique({
            where: {
                id: messageId,
            },
            include: {
                member: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!message) {
            return NextResponse.json(
                { message: "Message not found" },
                { status: 404 }
            );
        }
        if (message.member.userId !== user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        await db.message.delete({
            where: {
                id: messageId,
            },
        });
        return NextResponse.json(
            {
                message: "Message has been deleted",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("[DELETE_MESSAGE]", error);
        return NextResponse.json(
            {
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}

// edit message content (only content) by id
export async function PATCH(
    req: NextRequest,
    { params }: { params: { messageId: string } }
) {
    try {
        const user = await currentProfile();
        const { content } = await req.json();
        const { messageId } = params;

        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (!messageId) {
            return NextResponse.json(
                {
                    message: "Message ID required",
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

        const message = await db.message.findUnique({
            where: {
                id: messageId as string,
            },
            include: {
                member: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!message) {
            return NextResponse.json(
                { message: "Message not found" },
                { status: 404 }
            );
        }

        if (message.member.userId !== user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await db.message.update({
            where: {
                id: messageId as string,
            },
            data: {
                content,
            },
        });

        return NextResponse.json(
            {
                message: "Message has been updated",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("[EDIT_MESSAGE]", error);
        return NextResponse.json(
            {
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
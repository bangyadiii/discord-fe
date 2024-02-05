import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// delete directMessage by Id
export async function DELETE(
    req: NextRequest,
    { params }: { params: { dmId: string } }
) {
    try {
        const user = await currentProfile();
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        const message = await db.directMessage.findUnique({
            where: {
                id: params.dmId,
                senderId: user.id,
            },
        });
        if (!message || message.senderId !== user.id) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 403 }
            );
        }
        await db.directMessage.delete({
            where: {
                id: message.id,
            },
        });
        return NextResponse.json({
            message: "Delete DM successfully.",
        });
    } catch (error) {
        console.log(`DELETE_DM`, error);
        return NextResponse.json(
            {
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

// edit directMessage content by ID
export async function PATCH(
    req: NextRequest,
    {
        params,
    }: {
        params: {
            dmId: string;
        };
    }
) {
    try {
        const user = await currentProfile();
        if (!user) return new NextResponse("Unauthenticated", { status: 401 });
        const { content } = await req.json();

        // edit content
        const dm = await db.directMessage.findFirst({
            where: {
                id: params.dmId,
            },
        });
        if (!dm || dm.senderId != user.id) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 403 }
            );
        }
        const updatedDM = await db.directMessage.update({
            data: {
                content,
            },
            where: {
                id: dm.id,
            },
        });
        return NextResponse.json({
            message: 'updated',
            data: updatedDM,
        });
    } catch (error: any) {
        console.log(`EDIT_DM`, error);
        return NextResponse.json(
            {
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
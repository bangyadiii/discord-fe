import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MembershipRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const user = await currentProfile();

        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        const server = await db.server.update({
            where: {
                id: params.serverId,
                members: {
                    some: {
                        userId: user.id,
                        role: {
                            in: [MembershipRole.ADMIN, MembershipRole.OWNER],
                        },
                    },
                },
            },
            data: {
                inviteCode: crypto.randomUUID(),
            },
        });
        return NextResponse.json({ data: server }, { status: 200 });
    } catch (error: any) {
        console.error("[SERVER_PATCH]", error);
        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

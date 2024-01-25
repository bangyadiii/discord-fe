import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        const { name, imageUrl } = await req.json();

        const server = await db.server.update({
            where: { id: params.serverId },
            data: {
                name: name,
                imageUrl: imageUrl,
            },
        });

        if (!server) return new NextResponse(null, { status: 404 });

        return NextResponse.json({ data: server }, { status: 200 });
    } catch (error) {
        console.log("[SERVER_PUT]", error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

// delete server
export async function DELETE(
    req: NextRequest,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        const server = await db.server.delete({
            where: { id: params.serverId, ownerId: profile.id },
        });

        if (!server)
            return NextResponse.json({ message: "Not Found" }, { status: 404 });

        return NextResponse.json(
            { message: "Server has been deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.log("[SERVER_DELETE]", error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

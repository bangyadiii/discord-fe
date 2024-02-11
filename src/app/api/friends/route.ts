import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await currentProfile();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthenticated" },
                { status: 401 }
            );
        }
        // fake friends because we don't have a friends table
        // @TODO: implement friends table
        const friends = await db.user.findMany({
            where: {
                NOT: {
                    id: session.id,
                },
            },
            take: 20,
        });
        return NextResponse.json({ data: friends });
    } catch (error) {
        console.log(`Error: ${error}`);
        NextResponse.json(
            { message: "Something went wrong", error },
            { status: 500 }
        );
    }
}

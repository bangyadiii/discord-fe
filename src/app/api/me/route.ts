import { currentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
    try {
        const user = await currentProfile();
        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }
        return NextResponse.json(
            {
                data: user,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(`GET ME ERROR: ${error}`);
        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
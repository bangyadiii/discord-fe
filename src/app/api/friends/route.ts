import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RequestStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await currentProfile();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const friendList = await db.friend.findMany({
      where: {
        status: RequestStatus.ACCEPTED,
        OR: [
          {
            senderId: session.id,
          },
          {
            receiverId: session.id,
          },
        ],
      },
    });

    const friends = await db.user.findMany({
      where: {
        AND: [
          {
            id: {
              in: friendList.map((friend) =>
                friend.senderId === session.id
                  ? friend.receiverId
                  : friend.senderId
              ),
            },
          },
          {
            NOT: {
              id: session.id,
            },
          },
        ],
      },
    });

    return NextResponse.json({ data: friends });
  } catch (error) {
    console.error(`Error: ${error}`);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

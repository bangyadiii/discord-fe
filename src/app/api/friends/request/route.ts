import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// send friend request
export async function POST(req: NextRequest) {
    try {
        const session = await currentProfile();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthenticated" },
                { status: 401 }
            );
        }
        const { username } = await req.json();
        if (!username) {
            return NextResponse.json(
                { message: "Username is required" },
                { status: 400 }
            );
        }
        const friendProm = db.friend.findFirst({
            where: {
                OR: [
                    {
                        senderId: session.id,
                        receiver: {
                            username,
                        },
                    },
                    {
                        receiverId: session.id,
                        sender: {
                            username,
                        },
                    },
                ],
            },
        });
        const userProm = db.user.findUnique({
            where: {
                username,
            },
            include: {
                blockedUsers: true,
            },
        });
        const [friend, receiver] = await Promise.all([friendProm, userProm]);

        if (friend && friend.status === "PENDING") {
            return NextResponse.json(
                {
                    message: "You already sent a friend request to this user",
                },
                { status: 400 }
            );
        }
        if (friend && friend.status === "ACCEPTED") {
            return NextResponse.json(
                {
                    message: "You are already friends with this user",
                },
                { status: 400 }
            );
        }
        if (!receiver) {
            return NextResponse.json(
                { message: "Username not found" },
                { status: 404 }
            );
        }
        if (receiver.id === session.id) {
            return NextResponse.json(
                { message: "You can't send a friend request to yourself" },
                { status: 400 }
            );
        }
        // check if the receiver has blocked the sender
        if (receiver.blockedUsers.some((u) => u.blockedId === session.id)) {
            return NextResponse.json(
                { message: "You can't send a friend request to this user" },
                { status: 400 }
            );
        }

        const friendRequest = await db.friend.create({
            data: {
                senderId: session.id,
                status: "PENDING",
                receiverId: receiver.id,
            },
        });

        return NextResponse.json({ data: friendRequest });
    } catch (error) {
        console.log(`Error: ${error}`);
        NextResponse.json(
            { message: "Something went wrong", error },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await currentProfile();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthenticated" },
                { status: 401 }
            );
        }
        const { id, status } = await req.json();
        if (!id || !status) {
            return NextResponse.json(
                { message: "Id and status are required" },
                { status: 400 }
            );
        }
        const friend = await db.friend.findFirst({
            where: {
                id,
                receiverId: session.id,
            },
        });
        if (!friend) {
            return NextResponse.json(
                { message: "Friend request not found" },
                { status: 404 }
            );
        }
        if (friend.status === "ACCEPTED") {
            return NextResponse.json(
                { message: "You are already friends with this user" },
                { status: 400 }
            );
        }

        const updatedFriend = await db.friend.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        return NextResponse.json({ data: updatedFriend });
    } catch (error) {
        console.log(`Error: ${error}`);
        NextResponse.json(
            { message: "Something went wrong", error },
            { status: 500 }
        );
    }
}

// get friend request for the current user, both sent and received
export async function GET(req: NextRequest) {
    try {
        const session = await currentProfile();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthenticated" },
                { status: 401 }
            );
        }
        const friends = await db.friend.findMany({
            where: {
                OR: [
                    {
                        senderId: session.id,
                    },
                    {
                        receiverId: session.id,
                    },
                ],
                status: "PENDING",
            },
            include: {
                sender: true,
                receiver: true,
            },
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
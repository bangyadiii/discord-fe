import { currentProfile } from "@/lib/current-profile-pages";
import { pusherServer } from "@/lib/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { UserChannelData } from "pusher";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const user = await currentProfile(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const socketId = req.body.socket_id as string;
        const data: UserChannelData = {
            id: user.id,
        };
        const response = pusherServer.authenticateUser(socketId, data);
        return res.send(response);
    } catch (error) {
        console.log(`PUSHER AUTH ERROR: ${error}`);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO
) {
    console.log(req.method);
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed",
        });
    }
    try {
        const user = await currentProfile(req);
        const { content, fileUrl } = req.body;
        const { channelId, serverId } = req.query;
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!serverId) {
            return res.status(400).json({
                message: "Server ID required",
            });
        }
        if (!channelId) {
            return res.status(400).json({
                message: "Channel ID required",
            });
        }

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        userId: user.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: user.id,
            },
            include: {
                member: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const channelKey = `chat:${channelId}:messages`;
        // res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(201).json({ data: message });
    } catch (error) {
        console.log("SOCKET_ERROR: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

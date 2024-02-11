import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import {
    extractChatType,
    getConversationIdOrChannelId,
    removeChannelType,
    revertKey,
} from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { PresenceChannelData } from "pusher";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const user = await currentProfile(req);
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const body = req.body;
        const socketId = req.body.socket_id as string;

        const key = revertKey(removeChannelType(body.channel_name));
        const type = extractChatType(key);
        const id = getConversationIdOrChannelId(key);
        if (type == "channel") {
            const channel = await db.channel.findUnique({
                where: {
                    id,
                },
                include: {
                    server: {
                        include: {
                            members: {
                                where: {
                                    leftAt: null,
                                },
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });
            
            if (
                !channel ||
                !channel?.server?.members.find((member) => member.userId === user.id)
            ) {
                return res.status(403).json({ message: "Unauthorized" });
            }
        }
        else if(type === 'directMessage') {
            const conversation = await db.conversation.findUnique({
                where: {
                    id,
                },
                include: {
                    conversationToUsers: {
                        where: {
                            userId: user.id,
                            leftAt: null,
                        },
                    },
                },
            });
            if (!conversation) {
                return res.status(403).json({ message: "Unauthorized" });
            }
        }

        const data: PresenceChannelData = {
            user_id: user.id,
            user_info: {
                watchlist: [], // TODO: add watchlist to user
            },
        };

        const response = pusherServer.authorizeChannel(
            socketId,
            body.channel_name,
            data
        );
        return res.send(response);
    } catch (error) {
        console.log(`PUSHER AUTH ERROR: ${error}`);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

import { db } from "./db";

export function getChannelChat({ channelId }: any) {
    const chat = db.message.findMany({
        where: {
            channelId: channelId,
            deletedAt: null,
        },
        include: {
            member: true,
        },
    });
}

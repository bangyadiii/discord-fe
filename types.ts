import { Channel, ChannelCategory, Member, Server, User } from "@prisma/client";

export type ServerWithRelation = Server & {
    members: (Member & { user?: User })[] | null;
    channels: (Channel & { category?: ChannelCategory })[] | null;
    channelCategories:
        | (ChannelCategory & { channels: Channel[] | null })[]
        | null;
};

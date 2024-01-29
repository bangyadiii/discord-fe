import { Channel, ChannelCategory, Member, Server, User } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type ServerWithRelation = Server & {
    members: (Member & { user?: User })[] | null;
    channels: (Channel & { category?: ChannelCategory })[] | null;
    channelCategories:
        | (ChannelCategory & { channels: Channel[] | null })[]
        | null;
};

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io?: SocketIOServer;
        };
    };
};

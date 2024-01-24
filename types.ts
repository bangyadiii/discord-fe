import { Channel, Member, Server, User } from "@prisma/client";

export type ServerWithRelation = Server & {
    members: (Member & { user?: User })[] | null;
    channels: Channel[] | null;
};

import {
    Channel,
    ChannelCategory,
    Conversation,
    DirectMessage,
    Member,
    Message,
    Server,
    User,
} from "@prisma/client";

export type ServerWithRelation = Server & {
    members: (Member & { user?: User })[] | null;
    channels:
        | (Channel & { messages?: Channel[]; category?: ChannelCategory })[]
        | null;
    channelCategories:
        | (ChannelCategory & { channels: Channel[] | null })[]
        | null;
};

export type DirectMessageWithRelation = DirectMessage & {
    sender?: User;
    receiver?: User;
};

export type MessageWithRelation = Message & {
    member?: Member & { user?: User };
    channel?: Channel;
};

export type ConversationWithRelation = Conversation & {
    users: User[];
    directMessages: DirectMessageWithRelation[];
};

export type ChannelWithRelation = Channel & {
    server?: ServerWithRelation;
    messages?: MessageWithRelation[];
}

export type ChatType = "channel" | "directMessage";
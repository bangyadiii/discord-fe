import {
    Channel,
    ChannelCategory,
    Conversation,
    DirectMessage,
    Member,
    MembershipRole,
    Message,
    Server,
    User,
} from "@prisma/client";

export type MemberWithRelation = Member & {
    user?: User;
    role?: MembershipRole;
};

export type ServerWithRelation = Server & {
    members?: MemberWithRelation[];
    channels?:
        | (Channel & { messages?: Channel[]; category?: ChannelCategory })[];
    channelCategories?: (ChannelCategory & { channels?: Channel[] | null })[];
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
};

export type ChatType = "channel" | "directMessage";

export type ConversationId = string;

export type ChannelId = string;

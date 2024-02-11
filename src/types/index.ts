import {
    Channel,
    ChannelCategory,
    Conversation,
    ConversationToUser,
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
    channels?: ChannelWithRelation[];
    channelCategories?: CategoryWithRelation[];
};

export type DirectMessageWithRelation = DirectMessage & {
    sender?: User;
    receiver?: User;
};

export type MessageWithRelation = Message & {
    member?: Member & { user?: User };
    channel?: Channel;
};

export type ConversationToUserWithRelation = ConversationToUser & {
    user?: User;
    conversation?: ConversationWithRelation;
}

export type ConversationWithRelation = Conversation & {
    conversationToUsers?: ConversationToUserWithRelation[];
    directMessages?: DirectMessageWithRelation[];
};

export type ChannelWithRelation = Channel & {
    server?: ServerWithRelation;
    messages?: MessageWithRelation[];
    category?: CategoryWithRelation;
};

export type CategoryWithRelation = ChannelCategory & {
    channels?: Channel[];
    server?: ServerWithRelation;
};

export type ChatType = "channel" | "directMessage";

export type ConversationId = string;

export type ChannelId = string;

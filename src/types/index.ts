import {
    Channel,
    ChannelCategory,
    Conversation,
    ConversationToUser,
    DirectMessage,
    Friend,
    Member,
    MembershipRole,
    Message,
    Server,
    User,
} from "@prisma/client";

export type UserWithRelation = User & {
    member?: MemberWithRelation;
    friendRequestsSent?: FriendWithRelation[];
    friendRequestsReceived?: FriendWithRelation[];
    conversations?: ConversationWithRelation[];
};

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
    member?: MemberWithRelation;
    channel?: ChannelWithRelation;
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
    channels?: ChannelWithRelation[];
    server?: ServerWithRelation;
};

export type FriendWithRelation = Friend & {
    sender?: User;
    receiver?: User;
} 

export type ChatType = "channel" | "directMessage";

export type ConversationId = string;

export type ChannelId = string;

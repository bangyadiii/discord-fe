// store current conversation state with zustand
import { create } from "zustand";
import { ChannelWithRelation, ConversationWithRelation } from "@/types";

interface CurrentChatStore {
    conversation?: ConversationWithRelation;
    setCurrentConversation: (conversation: ConversationWithRelation) => void;

    currentChannel?: ChannelWithRelation;
    setCurrentChannel: (channel: ChannelWithRelation) => void;
}

export const useCurrentConversation = create<CurrentChatStore>((set) => ({
    conversation: undefined,
    setCurrentConversation: (conversation) => set({ conversation }),
    currentChannel: undefined,
    setCurrentChannel: (channel) => set({ currentChannel: channel }),
}));

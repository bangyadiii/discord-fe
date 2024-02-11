// store current conversation state with zustand
import { create } from "zustand";
import { ConversationWithRelation } from "@/types";

interface ConversationsStore {
    conversations?: ConversationWithRelation[];
    setConversations: (conversations: ConversationWithRelation[]) => void;
}

export const useConversations = create<ConversationsStore>((set) => ({
    conversations: undefined,
    setConversations: (conversations) => set({ conversations }),
}));

// current server state with zustand
import { create } from "zustand";
import { MemberWithRelation, ServerWithRelation } from "@/types";

interface CurrentServerStore {
    server?: ServerWithRelation;
    setCurrentServer?: (server: ServerWithRelation) => void;

    sessionMember?: MemberWithRelation;
    setCurrentMember?: (member: MemberWithRelation) => void;
}

export const useCurrentServer = create<CurrentServerStore>((set) => ({
    server: undefined,
    setCurrentServer: (server) => set({ server }),

    sessionMember: undefined,
    setCurrentMember: (member: MemberWithRelation) => set({ sessionMember: member }),
}));

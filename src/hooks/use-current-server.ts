// current server state with zustand
import { create } from "zustand";
import { ServerWithRelation } from "../types";

interface CurrentServerStore {
    server?: ServerWithRelation;
    setCurrentServer: (server: ServerWithRelation) => void;
}

export const useCurrentServer = create<CurrentServerStore>((set) => ({
    server: undefined,
    setCurrentServer: (server) => set({ server }),
}));

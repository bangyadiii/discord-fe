import { ServerWithRelation } from "@/types";
import { create } from "zustand";

interface ServerStore {
    servers?: ServerWithRelation[];
    setServers: (servers: ServerWithRelation[]) => void;
}

export const useServersStore = create<ServerStore>((set) => ({
    servers: undefined,
    setServers: (servers) => set({ servers }),
}));

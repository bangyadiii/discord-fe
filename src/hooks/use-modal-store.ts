import { Channel, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
    | "createServer"
    | "invite"
    | "editServer"
    | "manageMembers"
    | "createChannel"
    | "settingChannel"
    | "createChannelCategory"
    | "settingChannelCategory"
    | "leaveServer"
    | "deleteServer"
    | "msgFile" 
    | "deleteMessage"
    | "imageChat";

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelCategoryId?: string;
    imageUrl?: string;
}
interface ModalStore {
    type: ModalType | null;
    data?: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));

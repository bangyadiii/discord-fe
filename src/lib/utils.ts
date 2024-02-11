import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday } from "date-fns";
import { ChannelId, ChatType, ConversationId } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const DateTimeFormat = "MM/dd/yyyy hh:mm a";
const TimeFormat = "hh:mm a";

export function formatTimeForHuman(timestamp: string | number | Date) {
    const time = new Date(timestamp);

    if (isToday(time)) {
        return "Today at " + format(time, TimeFormat);
    }
    if (isYesterday(time)) {
        return "Yesterday at " + format(time, TimeFormat);
    }

    return format(time, DateTimeFormat);
}

export function getConversationTitle(
    conversation: {
        isGroup: boolean;
        conversationToUsers?: {
            userId: string;
            user?: { name: string };
            leftAt: Date | null;
        }[];
    },
    userId: string
): string {
    let title: string = "";
    if (conversation?.isGroup) {
        title =
            conversation?.conversationToUsers
                ?.filter(
                    (convUser) =>
                        convUser.userId !== userId && convUser.leftAt == null
                )
                .map((convUser) => convUser.user?.name)
                .join(", ") ?? "Unknown";
    } else {
        title =
            conversation?.conversationToUsers?.find(
                (convUser) => convUser.userId !== userId
            )?.user?.name ?? "Unknown";
    }
    return title;
}

export function toPusherKey(key: string) {
    return key.replace(/:/g, "__");
}

export function extractChatType(key: string): ChatType {
    const extract = key.split(":");
    if (extract.length !== 3 || extract[0] !== "chat") {
        throw new Error("Invalid query key");
    }
    return extract[1] as ChatType;
}

export function getConversationIdOrChannelId(
    key: string
): ChannelId | ConversationId {
    const type = extractChatType(key);
    if (type === "channel") {
        return key.split(":")[2] as ChannelId;
    }

    return key.split(":")[2] as ConversationId;
}

export function toPrivateKey(key: string) {
    return "private-" + key;
}

const channelType = ["presence", "private"];

export function removeChannelType(key: string): string {
    for (let type of channelType) {
        if (key.includes(type)) {
            key = key.replace(type + "-", "");
        }
    }
    return key;
}

export function revertKey(key: string) {
    return key.replace(/__/g, ":");
}

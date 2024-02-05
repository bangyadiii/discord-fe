import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday } from "date-fns";

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

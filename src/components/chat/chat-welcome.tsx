import { Hash } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "directMessage";
}

export default function ChatWelcome({ name, type }: ChatWelcomeProps) {
    return (
        <div className="space-y-2 mb-8">
            {type === "channel" && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white dark:text-zinc-400" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? `Welcome to #${name}` : name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel"
                    ? `This is the start of #${name} channel`
                    : `This is the start of your direct message history with ${name}`}
            </p>
        </div>
    );
}

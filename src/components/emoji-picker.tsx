"use client";
import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (emoji: string) => void;
}

export default function EmojiPicker({ onChange }: EmojiPickerProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    const { resolvedTheme } = useTheme();
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted)
        return (
            <Smile className="fill-zinc-500 dark:fill-zinc-400 hover:fill-zinc-600 dark:hover:fill-zinc-300 transition rounded-full text-white dark:text-input h-[24px] w-[24px]" />
        );

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="fill-zinc-500 dark:fill-zinc-400 hover:fill-zinc-600 dark:hover:fill-zinc-300 transition rounded-full text-white dark:text-input h-[24px] w-[24px]" />
            </PopoverTrigger>
            <PopoverContent
                side="right"
                sideOffset={40}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker
                    theme={resolvedTheme}
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                        onChange(emoji.native);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

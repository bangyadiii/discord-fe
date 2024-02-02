"use client";

import { DirectMessageWithRelation, ServerWithRelation } from "../../types";

import { Search } from "lucide-react";
import { useModal } from "../../hooks/use-modal-store";
import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";


export default function DMSideBarHeader() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleOnClick = () => {
        console.log("hello world");
        return;
    };

    return (
        <div className="w-full px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 ">
            <button
                onClick={() => {
                    setOpen(true);
                }}
                className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition" />
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto hidden md:inline-flex">
                    <span className="text-xs">ctrl</span> + K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels or members" />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                </CommandList>
            </CommandDialog>
        </div>
    );
}

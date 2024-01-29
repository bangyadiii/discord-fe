"use client";

import { Search } from "lucide-react";
import React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data:
            | {
                  icon: React.ReactNode;
                  name: string;
                  id: string;
              }[]
            | undefined;
    }[];
}

export default function ServerSearch(props: ServerSearchProps) {
    const router = useRouter();
    const params = useParams();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleOnClick = ({
        id,
        type,
    }: {
        id: string;
        type: "channel" | "member";
    }) => {
        setOpen(false);
        if (type === "member") {
            return router.push(
                `/servers/${params?.serverId}/conversation/${id}`
            );
        } else if (type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    };

    return (
        <>
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
                    {props?.data?.map(({ data, label, type }) => {
                        if (data?.length === 0) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map((item) => {
                                    return (
                                        <CommandItem
                                            key={item.id}
                                            className="gap-x-2"
                                            onSelect={() =>
                                                handleOnClick({
                                                    id: item.id,
                                                    type,
                                                })
                                            }
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
}

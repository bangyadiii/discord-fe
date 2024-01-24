"use client";

import { MembershipRole, Server } from "@prisma/client";
import { ServerWithRelation } from "../../../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    ChevronDown,
    LogOut,
    PlusCircle,
    Settings,
    Trash,
    UserPlus,
    UserRoundPlus,
} from "lucide-react";
import { useModal } from "../../../hooks/use-modal-store";

interface ServerSideBarHeaderProps {
    server: ServerWithRelation;
    role?: MembershipRole;
}
export default function ServerSideBarHeader({
    server,
    role,
}: ServerSideBarHeaderProps) {
    const { onOpen } = useModal();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="text-foreground w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-primary dark:text-neutral-400 space-y-[2px]">
                <DropdownMenuItem
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    onClick={() => {
                        onOpen("invite", { server });
                    }}
                >
                    Invite People
                    <UserRoundPlus className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
                    Settings
                    <Settings className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
                    Create Channel
                    <PlusCircle className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-red-500">
                    Leave Server
                    <LogOut className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-red-500">
                    Delete Server
                    <Trash className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

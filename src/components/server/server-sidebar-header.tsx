"use client";

import { MembershipRole } from "@prisma/client";
import { ServerWithRelation } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronDown,
    FolderPlus,
    LogOut,
    PlusCircle,
    Settings,
    Trash,
    UserRoundPlus,
    Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSideBarHeaderProps {
    server: ServerWithRelation;
    role?: MembershipRole;
}
export default function ServerSideBarHeader({
    server,
    role,
}: ServerSideBarHeaderProps) {
    const { onOpen } = useModal();
    const owner = server.members?.find((member) => member.role === "OWNER");
    const admins = server.members?.filter((member) => member.role === "ADMIN");
    const members = server.members?.filter(
        (member) => member.role === "MEMBER"
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium  space-y-[2px]">
                <DropdownMenuItem
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    onClick={() => {
                        onOpen("invite", { server });
                    }}
                >
                    Invite People
                    <UserRoundPlus className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>

                {(role === "OWNER" || role === "ADMIN") && (
                    <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => {
                            onOpen("editServer", { server });
                        }}
                    >
                        Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {(role === "OWNER" || role === "ADMIN") && (
                    <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => {
                            onOpen("manageMembers", { server });
                        }}
                    >
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {(role === "OWNER" || role === "ADMIN") && (
                    <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => {
                            onOpen("createChannel", { server });
                        }}
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {(role === "OWNER" || role === "ADMIN") && (
                    <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => {
                            onOpen("createChannelCategory", { server });
                        }}
                    >
                        Create Category
                        <FolderPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer text-red-500"
                    onClick={() => {
                        onOpen("leaveServer", { server });
                    }}
                >
                    Leave Server
                    <LogOut className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                {role === "OWNER" && (
                    <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer text-red-500"
                        onClick={() => {
                            onOpen("deleteServer", { server });
                        }}
                    >
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

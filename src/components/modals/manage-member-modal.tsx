"use client";

import { useForm } from "react-hook-form";
import {
    Crown,
    LoaderIcon,
    ShieldAlert,
    ShieldCheck,
    User,
} from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import React from "react";
import { useModal } from "../../hooks/use-modal-store";
import { ServerWithRelation } from "../../types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { MembershipRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { inputServerValidator } from "@/lib/validations";

export default function ManageMember() {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "manageMembers";
    const { server } = data as { server: ServerWithRelation };

    const form = useForm({
        resolver: zodResolver(inputServerValidator),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const iconRoleList: Record<MembershipRole, React.ReactElement | null> = {
        OWNER: <Crown className="h-4 w-4 text-amber-600" />,
        ADMIN: <ShieldAlert className="h-4 w-4 text-red-500" />,
        MEMBER: <User className="h-4 w-4 text-primary" />,
        GUEST: null,
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className=" overflow-hidden">
                <DialogHeader className="">
                    <DialogTitle className="text-2xl px-6 text-center font-bold">
                        Manage Member
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[450px pr-6]">
                    {server?.members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center px-4 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all"
                        >
                            <UserAvatar src={member.user?.profileUrl!!} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    <span className="px-1">
                                        {member.user?.name}
                                    </span>
                                    <ActionTooltip
                                        label={member.role}
                                        align="center"
                                        side="top"
                                    >
                                        {iconRoleList[member.role]}
                                    </ActionTooltip>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

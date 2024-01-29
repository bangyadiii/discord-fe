import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ServerWithRelation } from "../../types";
import { UserAvatar } from "../user-avatar";

interface MemberSectionProps {
    server?: ServerWithRelation;
}

export default function MemberSection({ server }: MemberSectionProps) {
    return (
        <div className="bg-secondary h-full w-full p-3">
            <ScrollArea>
                {server?.members?.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center px-4 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all"
                    >
                        <UserAvatar src={member.user?.profileUrl!!} />
                        <div className="flex flex-col gap-y-1">
                            <div className="text-xs font-semibold flex items-center gap-x-1">
                                {member.user?.name}
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
}

import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ServerWithRelation } from "../../types";
import { UserAvatar } from "../user-avatar";
import { currentProfile } from "@/lib/current-profile";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import OnlineStatus from "../online-status";
import { Separator } from "../ui/separator";
import ChatInput from "../chat/chat-input";

interface MemberSectionProps {
    server?: ServerWithRelation;
}

export default async function MemberSection({ server }: MemberSectionProps) {
    const user = await currentProfile();
    return (
        <div className="bg-secondary h-full w-full p-1">
            <ScrollArea>
                {server?.members?.map((member) => {
                    return (
                        <Popover key={member.id}>
                            <PopoverTrigger className="w-full flex items-center gap-x-2 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all p-2">
                                <UserAvatar src={member.user?.profileUrl!!} />
                                <div className="flex flex-col gap-y-1">
                                    <div className="text-xs font-semibold flex items-center gap-x-1">
                                        {member.user?.name}{" "}
                                        {/* {member.user?.id === user?.id && (
                                            <span className="text-xs text-zinc-400">
                                                (You)
                                            </span>
                                        )} */}
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                side="left"
                                align="start"
                                sideOffset={15}
                                className="bg-secondary text-secondary-foreground p-0 border-0"
                            >
                                <div className="flex flex-col gap-y-1 ">
                                    <div className="relative h-32">
                                        <div
                                            className={`absolute bg-primary h-1/2 w-full top-0 left-0 right-0`}
                                        ></div>
                                        <div className="px-6 py-4 relative w-14 h-14 md:h-20 md:w-20">
                                            <UserAvatar
                                                src={member.user?.profileUrl!!}
                                                className="w-14 h-14 md:h-20 md:w-20 ring-[6px] ring-secondary"
                                            />
                                            <OnlineStatus className="absolute -bottom-3 -right-5 w-4 h-4 ring-[6px] ring-secondary" />
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900 mx-4 mb-4 rounded-md p-3 flex flex-col gap-y-1">
                                        <span className="font-semibold">
                                            {member?.user?.name}
                                        </span>
                                        <Separator />
                                        <p className="text-[10px] text-bold ">
                                            MEMBER SINCE
                                        </p>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            {new Date(
                                                member?.joinedAt!!
                                            ).toLocaleDateString()}
                                        </p>
                                        <ChatInput
                                            name={member?.user?.name!}
                                            type="directMessage"
                                            apiURL="/dm"
                                            query={{ 
                                                opponentUserId: member?.user?.id,
                                             }}
                                        />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    );
                })}
            </ScrollArea>
        </div>
    );
}

import React, { useCallback, useEffect } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { Clock, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/store/use-modal-store";
import type { DirectMessageWithRelation, MessageWithRelation } from "@/types";
import { formatTimeForHuman } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";
import { chatInputValidator } from "@/lib/validations";
import ChatIncludeMedia from "./chat-include-media";
import { useUser } from "@clerk/nextjs";

interface ChatItemProps {
    data: MessageWithRelation | DirectMessageWithRelation;
}

export default function ChatItem({ data }: ChatItemProps) {
    const { onOpen } = useModal();
    let dm: DirectMessageWithRelation | null = null;
    let channelMsg: MessageWithRelation | null = null;
    const user = useUser();

    if ((data as DirectMessageWithRelation).conversationId) {
        dm = data as DirectMessageWithRelation;
    } else {
        channelMsg = data as MessageWithRelation;
    }

    const isMe =
        user?.user?.id === (dm?.senderId ?? channelMsg?.member?.userId);
    const [isEditing, setIsEditing] = React.useState(false);
    const deletedAt = (dm && dm?.deletedAt) ?? channelMsg?.deletedAt;
    const isUpdated =
        (dm && dm?.updatedAt !== dm?.createdAt) ??
        channelMsg?.updatedAt !== channelMsg?.createdAt;

    let canDeleteMessage = isMe && deletedAt == null;
    let canEditMessage = true;
    const createdAt = dm?.createdAt ?? channelMsg?.createdAt;

    const form = useForm({
        resolver: zodResolver(chatInputValidator),
        defaultValues: {
            content: data?.content ?? "",
        },
    });

    const onEditFormSubmit = useCallback(
        async (values: z.infer<typeof chatInputValidator>) => {
            setIsEditing(false);
            const url = dm ? `/dm/${data?.id}` : `/messages/${data?.id}`;
            await axiosInstance.patch(url, values);
            form.reset();
        },
        [data?.id, dm, form]
    );

    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if ((isEditing && e.key === "Escape") || e.keyCode === 27) {
                setIsEditing(false);
            }
            if (isEditing && (e.key == "Enter" || e.keyCode === 13)) {
                form.handleSubmit(onEditFormSubmit)();
            }
        };

        window.addEventListener("keydown", keydownHandler);

        return () => window.removeEventListener("keydown", keydownHandler);
    }, [form, onEditFormSubmit, isEditing]);

    function renderEdit() {
        if (!isEditing) {
            return (
                <p
                    className={cn(
                        "text-sm text-zinc-600 dark:text-zinc-300",
                        deletedAt &&
                            "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                    )}
                >
                    {deletedAt ? "This message has been deleted" : data.content}
                    {!deletedAt && isUpdated && (
                        <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                            (edited)
                        </span>
                    )}
                </p>
            );
        }

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onEditFormSubmit)}
                    className="flex items-center gap-x-2 mt-2"
                >
                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="">
                                    <div className="relative">
                                        <Input
                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                            placeholder="Edit message"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button size="sm">Save</Button>
                </form>
                <span className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                    Press <u>Escape</u> to cancel, <u>Enter</u> to save
                </span>
            </Form>
        );
    }

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-0 md:p-4 transition w-full">
            <div className="group flex gap-x-4 w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar
                        src={
                            dm?.sender?.profileUrl ??
                            channelMsg?.member?.user?.profileUrl!
                        }
                    />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {dm?.sender?.name ??
                                    channelMsg?.member?.user?.name!}
                            </p>
                            {isMe && (
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                                    (You)
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {createdAt ? (
                                formatTimeForHuman(createdAt)
                            ) : (
                                <Clock className="w-3 h-3" />
                            )}
                        </span>
                    </div>

                    <div className="mt-4">
                        <ChatIncludeMedia dm={dm} channelMsg={channelMsg} />
                    </div>
                    {renderEdit()}

                    {canDeleteMessage && (
                        <div className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-5 bg-secondary border rounded-sm">
                            {canEditMessage && (
                                <ActionTooltip label="Edit" side="top">
                                    <Edit
                                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                        onClick={() => {
                                            setIsEditing((prev) => !prev);
                                        }}
                                    />
                                </ActionTooltip>
                            )}
                            <ActionTooltip label="Delete" side="top">
                                <Trash
                                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                    onClick={() => {
                                        onOpen("deleteMessage", {
                                            msgUrl: dm
                                                ? `/dm/${data?.id}`
                                                : `/messages/${data?.id}`,
                                        });
                                    }}
                                />
                            </ActionTooltip>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

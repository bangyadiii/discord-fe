"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import EmojiPicker from "@/components/emoji-picker";
import { chatInputValidator } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

import { useCurrentServer } from "@/hooks/store/use-current-server";
import useCurrentUserQuery from "@/hooks/query/use-current-user";
import usePostChatMutation from "@/hooks/query/use-chat-mutation";
import { ChatType } from "@/types";

interface Options {
    fileUploads: boolean;
    emoji: boolean;
}

interface ChatInputProps {
    apiURL: string;
    query: Record<string, any>;
    title: string;
    type: ChatType;
    include?: Options;
}

export default function ChatInput({
    apiURL,
    query,
    title,
    type,
    include = { fileUploads: true, emoji: true },
}: ChatInputProps) {
    const { data: user } = useCurrentUserQuery();
    const form = useForm<z.infer<typeof chatInputValidator>>({
        resolver: zodResolver(chatInputValidator),
        defaultValues: {
            content: "",
        },
    });
    const queryKey = `chat:${type}:${
        query[type === "channel" ? "channelId" : "conversationId"]
    }`;
    const sessionMember = useCurrentServer((s) => s.sessionMember);

    const mutation = usePostChatMutation({ queryKey, apiURL, query });

    const handleOnSubmit = async (data: z.infer<typeof chatInputValidator>) => {
        const object = {
            ...data,
            id: uuidv4(),
            channelId: query.channelId,
            conversationId: query.conversationId,
            member: sessionMember,
            sender: user?.data,
        };
        mutation.mutate(object);
        form.reset();
    };

    const renderFileUploadButton = () => {
        if (!include.fileUploads) return null;
        return (
            <button
                type="button"
                className="absolute left-4 top-3 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center p-1"
            >
                <Plus className="text-white dark:text-[#313338]" />
            </button>
        );
    };

    const renderEmojiButton = () => {
        if (!include.emoji) return null;
        return (
            <button type="button" className="absolute right-4 top-3">
                <EmojiPicker
                    onChange={(emoji: string) => {
                        form.setValue(
                            "content",
                            `${form.getValues().content}${emoji}`
                        );
                    }}
                />
            </button>
        );
    };

    return (
        <Form {...form}>
            <form
                className="w-full"
                onSubmit={form.handleSubmit(handleOnSubmit)}
            >
                <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    {renderFileUploadButton()}
                                    <Input
                                        className={cn(
                                            include.fileUploads && "pl-14",
                                            include.emoji && "pr-14",
                                            "py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-300"
                                        )}
                                        placeholder={`Message ${
                                            type === "channel" ? "#" : "@"
                                        }${title}`}
                                        {...field}
                                    />
                                    {renderEmojiButton()}
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}

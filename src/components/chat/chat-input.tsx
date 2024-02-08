"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import qs from "query-string";
import { axiosInstance } from "@/lib/axios";
import EmojiPicker from "@/components/emoji-picker";
import { chatInputValidator } from "@/lib/validations";
import { useMutation, useQueryClient } from "react-query";

interface ChatInputProps {
    apiURL: string;
    query: Record<string, any>;
    name: string;
    type: "channel" | "directMessage";
}

export default function ChatInput({
    apiURL,
    query,
    name,
    type,
}: ChatInputProps) {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof chatInputValidator>>({
        resolver: zodResolver(chatInputValidator),
        defaultValues: {
            content: "",
        },
    });
    const queryKey = `chat:${type}:${
        query[type === "channel" ? "channelId" : "conversationId"]
    }`;

    const mutation = useMutation({
        mutationFn: (newMessage: any) => {
            const url = qs.stringifyUrl({
                url: apiURL,
                query,
            });
            return axiosInstance.post(url, newMessage);
        },
        onMutate: async (newMessage: any) => {
            await queryClient.cancelQueries({ queryKey: [queryKey] });
            // Snapshot the previous value
            const prevMessages = queryClient.getQueryData([queryKey]);
            // Optimistically update to the new value

            // Return a context object with the snapshotted value
            return { prevMessages };
        },
    });

    const handleOnSubmit = async (data: z.infer<typeof chatInputValidator>) => {
        try {
            mutation.mutate(data);
            form.reset({
                content: "",
            });
        } catch (error: any) {
            throw new Error(error);
        }
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
                                <div className="relative px-4 pb-6">
                                    <button
                                        type="button"
                                        className="absolute left-8 top-3 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center p-1"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-300"
                                        placeholder={
                                            type === "channel"
                                                ? `Message #${name}`
                                                : `Message @${name}`
                                        }
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-8 top-3"
                                    >
                                        <EmojiPicker
                                            onChange={(emoji: string) => {
                                                field.onChange(
                                                    `${field.value}${emoji}`
                                                );
                                            }}
                                        />
                                    </button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}

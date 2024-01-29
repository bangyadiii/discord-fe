"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useModal } from "../../hooks/use-modal-store";
import { Channel, ChannelType } from "@prisma/client";
import { Loader2, Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { channelIconMap } from "../server/server-sidebar";

const schema = z.object({
    name: z
        .string()
        .min(1, "Channel name is required.")
        .max(100, "Too Long")
        .refine((value) => value !== "general", {
            message: "Channel name cannot be 'general'",
        }),
    type: z.nativeEnum(ChannelType),
    serverId: z.string(),
    categoryId: z.string().nullable(),
});

export default function SettingChannelModal() {
    const router = useRouter();
    const param = useParams();
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const isModalOpen = isOpen && type === "settingChannel";
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.channel?.name ?? "",
            type: (data?.channel?.type?.toString() ??
                ChannelType.TEXT) as ChannelType,
            serverId: param?.serverId?.toString() ?? "",
            categoryId: data?.channel?.categoryId || null,
        },
    });

    useEffect(() => {
        form.setValue("name", data?.channel?.name ?? "");
        form.setValue(
            "type",
            (data?.channel?.type ?? ChannelType.TEXT) as ChannelType
        );
        form.setValue("serverId", data?.channel?.serverId ?? "");
        form.setValue("categoryId", data?.channel?.categoryId ?? null);
    }, [form, data]);

    const Icon = channelIconMap[data?.channel?.type ?? ChannelType.TEXT];

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.patch<{ data: Channel }>(
                `/channels/${data?.channel?.id}`,
                values,
                {
                    params: {
                        categoryId: data?.channelCategoryId || null,
                    },
                }
            );
            toast({
                title: "Channel has been updated",
                variant: "success",
            });
            form.reset();
            router.refresh();
            onOpen("settingChannel", { channel: response.data?.data });
        } catch (error: any) {
            setIsLoading(false);
            console.error(error);
            toast({
                title: "Oops! Something went wrong.",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickDeleteChannel = async () => {
        const isConfirm = confirm(
            "Are you sure you want to delete this channel?"
        );
        if (!isConfirm) return;
        try {
            setIsLoading(true);
            await axiosInstance.delete(`/channels/${data?.channel?.id}`);
            router.refresh();
            onClose();
        } catch (error: any) {
            setIsLoading(false);
            console.error(error);
            toast({
                title: "Oops! Something went wrong.",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        onClose();
    };

    return (
        <Sheet open={isModalOpen} onOpenChange={handleClose}>
            <SheetContent className="min-h-screen p-0" side="bottom">
                <div className="w-full min-h-screen">
                    <div className="flex">
                        <aside className="w-2/5 min-h-screen flex flex-col items-end bg-secondary p-5">
                            <div className="w-[200px]">
                                <SheetHeader className="my-7">
                                    <SheetTitle className=" text-zinc-600 dark:text-zinc-400 flex">
                                        {Icon}{" "}
                                        <span className="ml-1 text-xs uppercase font-bold">
                                            {data?.channel?.name}
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                <ul className="flex flex-col gap-y-3 text-sm">
                                    <li className="p-2 cursor-pointer rounded hover:bg-background hover:text-secondary-foreground">
                                        Overview
                                    </li>
                                    <li
                                        className="p-2 cursor-pointer rounded hover:bg-background hover:text-secondary-foreground flex items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickDeleteChannel();
                                        }}
                                    >
                                        Delete Channel
                                        <Trash className="ml-auto w-4 h-4" />
                                    </li>
                                </ul>
                            </div>
                        </aside>
                        <main className="w-full md:w-3/5 pt-10">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8 w-3/4 mr-auto"
                                >
                                    <div className="space-y-8 px-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel
                                                            htmlFor="name"
                                                            className="font-bold uppercase text-xs"
                                                        >
                                                            Channel Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="bg-zinc-300 border-0 focus-visible:ring-0 text-black"
                                                                placeholder="Input channel name"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        ></FormField>

                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel
                                                            htmlFor="type"
                                                            className="font-bold uppercase text-xs"
                                                        >
                                                            Channel Type
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }
                                                            >
                                                                <SelectTrigger className="">
                                                                    <SelectValue placeholder="Type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        {Object.values(
                                                                            ChannelType
                                                                        ).map(
                                                                            (
                                                                                type
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        type
                                                                                    }
                                                                                    value={
                                                                                        type
                                                                                    }
                                                                                    className="capitalize"
                                                                                >
                                                                                    {
                                                                                        type
                                                                                    }
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        ></FormField>
                                    </div>
                                    <SheetFooter className="px-6 py-3">
                                        <Button
                                            className=""
                                            disabled={isLoading}
                                        >
                                            Save
                                            {isLoading && (
                                                <Loader2 className="animate-spin ml-5" />
                                            )}
                                        </Button>
                                    </SheetFooter>
                                </form>
                            </Form>
                        </main>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

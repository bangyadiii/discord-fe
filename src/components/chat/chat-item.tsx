import React, { useEffect } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { Edit, FileIcon, ShieldAlert, Trash, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
    // message?: MessageWithRelation;
    // dm?: DirectMessageWithRelation;
    // currentUserId: string;
    // socketUrl?: string;
    // socketQuery?: Record<string, string>;
}

const schema = z.object({
    content: z.string().min(1),
});
export default function ChatItem(props: ChatItemProps) {
    let message = `Halo ini konten pesan`;
    const [isEditing, setIsEditing] = React.useState(false);
    const deletedAt = false;
    const isUpdated = true;
    const canDeleteMessage = true;
    const canEditMessage = true;

    const includeImage = false;
    const includeVideo = true;
    const includePdf = false;

    const { onOpen } = useModal();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            content: message,
        },
    });
    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.keyCode === 27) {
                setIsEditing(false);
            }
            if (e.key == "Enter" || e.keyCode === 13) {
                console.log("enter");
                // form.handleSubmit(onSubmit)();
            }
        };

        window.addEventListener("keydown", keydownHandler);

        return () => window.removeEventListener("keydown", keydownHandler);
    }, [form]);

    const onSubmit = async (values: z.infer<typeof schema>) => {
        console.log(values);
        return;
        // await axiosInstance.patch(`/servers/${data?.server.id}`, values);
        // form.reset();
    };

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-0 md:p-4 transition w-full">
            <div className="group flex gap-x-4 w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src="https://avatars.githubusercontent.com/u/25190530?v=4" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                TriAdi
                            </p>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            08/01/2023 09:30 PM
                        </span>
                    </div>
                    {!isEditing && (
                        <p
                            className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300 mb-2",
                                deletedAt &&
                                    "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                            )}
                        >
                            {deletedAt && !isUpdated
                                ? "This message has been deleted"
                                : message}
                            {!deletedAt && isUpdated && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {isEditing && (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex items-center gap-x-2 pt-2"
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
                                Press Escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                    {includeImage && (
                        <button
                            className="w-fit"
                            onClick={() => {
                                onOpen("imageChat", {
                                    imageUrl:
                                        "https://utfs.io/f/e24092b9-bb22-433b-a02b-f7faba9e6912-ivih5g.jpg",
                                });
                            }}
                        >
                            <Image
                                src={
                                    "https://utfs.io/f/e24092b9-bb22-433b-a02b-f7faba9e6912-ivih5g.jpg"
                                }
                                alt="message image"
                                width={500}
                                height={500}
                                className="rounded-md"
                            />
                        </button>
                    )}
                    {includeVideo && (
                        <video
                            width={500}
                            height={500}
                            controls
                            autoPlay={false}
                            autoFocus={false}
                        >
                            <source
                                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {includePdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-secondary/10">
                            <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
                            <a
                                href="https://utfs.io/f/a7421ce2-34ef-40b3-86d7-4f5cf00c5566-1b11rv.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                File PDF
                            </a>
                        </div>
                    )}

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
                                        onOpen("deleteMessage");
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

"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
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
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import React, { useEffect } from "react";
import FileUpload from "../file-upload";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useModal } from "../../../hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Loader } from "lucide-react";

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
});

export default function CreateChannelModal() {
    const router = useRouter();
    const param = useParams();

    const { isOpen, onClose, type } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
            serverId: param.serverId?.toString(),
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            setIsLoading(true);
            await axiosInstance.post("/channels", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="p-0 overflow-hidden">
                <DialogHeader className="pt-8">
                    <DialogTitle className="text-2xl px-6 text-center font-bold">
                        Create New Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
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
                                                    disabled={isLoading}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.values(
                                                                ChannelType
                                                            ).map((type) => (
                                                                <SelectItem
                                                                    key={type}
                                                                    value={type}
                                                                    className="capitalize"
                                                                >
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
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
                        <DialogFooter className="bg-secondary px-6 py-3">
                            <Button className="w-full" disabled={isLoading}>
                                Create
                                {isLoading && (
                                    <Loader className="animate-spin ml-5" />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

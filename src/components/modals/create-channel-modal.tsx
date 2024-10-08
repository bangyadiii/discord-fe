"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useModal } from "@/hooks/store/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveChannelValidator } from "@/lib/validations";

export default function CreateChannelModal() {
    const router = useRouter();
    const param = useParams();
    const { isOpen, onClose, type, data } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const isModalOpen = isOpen && type === "createChannel";
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(saveChannelValidator),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
            serverId: param?.serverId?.toString() ?? "",
            categoryId: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof saveChannelValidator>) => {
        try {
            setIsLoading(true);
            await axiosInstance.post("/channels", values, {
                params: {
                    categoryId: data?.channelCategoryId || null,
                },
            });
            form.reset();
            router.refresh();
            onClose();
        } catch (error: any) {
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
                            <Button className="w-full" disabled={isLoading || !form.formState.isValid}>
                                Create
                                {isLoading && (
                                    <Loader2 className="animate-spin ml-5" />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

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
} from "../ui/dialog";

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
import { useModal } from "../../../hooks/use-modal-store";
import { Loader2 } from "lucide-react";

const schema = z.object({
    name: z
        .string()
        .min(1, "Channel name is required.")
        .max(100, "Too Long")
        .refine((value) => value !== "general", {
            message: "Channel name cannot be 'general'",
        }),
    serverId: z.string(),
});

export default function SettingChannelCategoryModal() {
    const router = useRouter();
    const param = useParams();

    const { isOpen, onClose, type } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const isModalOpen = isOpen && type === "settingChannelCategory";

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            serverId: param.serverId?.toString(),
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            setIsLoading(true);
            await axiosInstance.patch(
                `/channel-categories/${param?.channelCategoryId}`,
                values
            );
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.error(error);
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
                        Setting Category
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
                                                Category Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-secondary border-0 focus-visible:ring-0 text-secondary-foreground"
                                                    placeholder="Input channel name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            ></FormField>
                        </div>
                        <DialogFooter className="bg-secondary px-6 py-3">
                            <Button className="w-full" disabled={isLoading}>
                                Save
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

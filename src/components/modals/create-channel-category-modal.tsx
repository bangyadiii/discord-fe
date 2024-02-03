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
import { useModal } from "@/hooks/use-modal-store";
import { Loader } from "lucide-react";
import { createChannelCategoryValidator } from "@/lib/validations";

export default function CreateChannelCategoryModal() {
    const router = useRouter();
    const params = useParams();

    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === "createChannelCategory";

    const form = useForm({
        resolver: zodResolver(createChannelCategoryValidator),
        defaultValues: {
            name: "",
            serverId: params?.serverId?.toString() ?? "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof createChannelCategoryValidator>) => {
        try {
            await axiosInstance.post("/channel-categories", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.error(error);
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
                        Create Category
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

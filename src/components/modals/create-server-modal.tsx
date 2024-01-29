"use client";

import { useForm } from "react-hook-form";
import { Loader2, LoaderIcon } from "lucide-react";
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useModal } from "../../hooks/use-modal-store";
import { useToast } from "../ui/use-toast";

const schema = z.object({
    name: z.string().min(1, "Server name is required.").max(100, "Too Long"),
    imageUrl: z.string().url(),
});

export default function CreateServerModal() {
    const router = useRouter();
    const { isOpen, onClose, type } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const isModalOpen = isOpen && type === "createServer";
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            setIsLoading(true);
            await axiosInstance.post("/servers", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            toast({
                title: "Oops! Something went wrong.",
                description: error.message,
                duration: 5000,
                className: "bg-red-500",
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
            <DialogContent className=" p-0 overflow-hidden">
                <DialogHeader className="pt-8">
                    <DialogTitle className="text-2xl px-6 text-center font-bold text-primary-foreground">
                        Create Your Own Server
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Give your server a personality by adding a name and an
                        avatar. You can always change these later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <div className="flex justify-center items-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FileUpload
                                                onChange={field.onChange}
                                                endpoint="imageUploader"
                                                value={field.value}
                                            />
                                        </FormItem>
                                    )}
                                ></FormField>
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="name"
                                                className="font-bold uppercase text-xs text-zinc-500 dark:text-zinc-300"
                                            >
                                                Server Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="bg-zinc-300 border-0 focus-visible:ring-0 text-black"
                                                    placeholder="Input your server name"
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
                                {isLoading && <Loader2 />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { addFriendValidator } from "@/lib/validations";
import * as z from "zod";
import { Friend } from "@prisma/client";
import { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddFriendSection() {
    const form = useForm({
        resolver: zodResolver(addFriendValidator),
        defaultValues: {
            username: "",
        },
    });

    const onAddFriend = async (values: z.infer<typeof addFriendValidator>) => {
        try {
            await axiosInstance.post<{
                message?: string;
                data?: Friend;
                error?: any;
            }>("/friends/request", values);
            form.reset();
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response);
                form.setError("username", {
                    type: "manual",
                    message: error.response?.data?.message,
                });
            }
        }
    };
    return (
        <div className="w-full h-full px-4 py-3">
            <h3 className="font-semibold leading-10">ADD FRIEND</h3>
            <p className="text-sm text-zinc-300 dark:text-zinc-400 mb-5">
                You can add friends with their username
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onAddFriend)}
                    className="w-full flex gap-x-3 gap-y-3 flex-wrap"
                >
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="You can add friends with their username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {form.formState.isSubmitSuccessful && (
                                            <FormMessage className="text-emerald-600">
                                                Friend request sent successfully
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <Button
                        size={"sm"}
                        disabled={
                            form.formState.isLoading || !form.formState.isDirty
                        }
                        className="w-full md:w-36 flex justify-center"
                    >
                        {form.formState.isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Send Request"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

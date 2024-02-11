"use client";

import { Loader2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Server } from "@prisma/client";
import { useMutation } from "react-query";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface JoinServerModalProps {
    server: Server;
}

const useJoinServerMutation = (server: Server) => {
    return useMutation({
        mutationKey: ["joinServer"],
        mutationFn: () => {
            return axiosInstance.post(`/servers/${server.id}/join`);
        },
    });
};

export function JoinServerModal({ server }: JoinServerModalProps) {
    const [mounted, setMounted] = React.useState(false);

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const { isLoading, mutate, isError } = useJoinServerMutation(server);

    const handleClose = () => {
        return redirect("/");
    };

    const handleJoin = () => {
        try {
            mutate();
            if (isError) {
                throw new Error("Something went wrong");
            }
            router.push(`/servers/${server.id}`);
            window.location.reload();
        } catch (error: any) {
            toast({
                title: "Something went wrong",
                description: error.message ?? "Cannot join server for now :(",
                duration: 5000,
                action: (
                    <ToastAction altText="Try again" onClick={handleJoin}>
                        Try again
                    </ToastAction>
                ),
            });
        }
    };

    if (!mounted) return null;

    return (
        <AlertDialog open>
            <AlertDialogContent className="bg-background p-0 overflow-hidden">
                <AlertDialogHeader className="pt-8 px-6 flex justify-center items-center">
                    <div className="w-[100px] h-[100px] mb-3">
                        <Avatar className="w-full h-full min-h-full min-w-full">
                            <AvatarImage src={server.imageUrl}></AvatarImage>
                            <AvatarFallback>{server.name}</AvatarFallback>
                        </Avatar>
                    </div>
                    <AlertDialogTitle className="text-xl px-6 text-center font-semibold">
                        Joining{" "}
                        <span className="uppercase text-primary font-bold">
                            {server.name}
                        </span>{" "}
                        Server
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Are you sure you want to join this server?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="bg-secondary px-6 py-4">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="w-32"
                        onClick={handleClose}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        className="w-32 bg-primary text-primary-foreground"
                        onClick={handleJoin}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                            "Join"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

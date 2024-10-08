"use client";

import React from "react";
import { useModal } from "@/hooks/store/use-modal-store";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
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

export default function DeleteMessageModal() {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteMessage";
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleClose = () => {
        onClose();
    };

    const handleDeleteMessage = async () => {
        try {
            if (!data?.msgUrl) {
                throw new Error("Invalid message URL");
            }

            setIsLoading(true);
            await axiosInstance.delete<{ message: string }>(data.msgUrl);
        } catch (error: any) {
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

    return (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="bg-background p-0 overflow-hidden">
                <AlertDialogHeader className="pt-8">
                    <AlertDialogTitle className="font-bold text-center">
                        Delete Message
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Are you sure you want to delete this message?
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
                        className="w-32 bg-destructive hover:bg-red-600"
                        onClick={handleDeleteMessage}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

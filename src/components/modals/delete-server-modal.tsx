"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import React from "react";
import { useModal } from "../../../hooks/use-modal-store";
import { Button } from "../ui/button";
import { axiosInstance } from "@/lib/axios";
import { Server } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

export default function DeleteServerModal() {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "deleteServer";
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleClose = () => {
        onClose();
    };

    const handleDeleteServer = async () => {
        try {
            setIsLoading(true);
            await axiosInstance.delete<{ message: string }>(
                `/servers/${data?.server?.id}`
            );
            router.refresh();
            router.push("/");
            window.location.reload();
        } catch (error: any) {
            toast({
                title: "Oops! Something went wrong.",
                description: error.message,
                duration: 5000,
                className: "bg-red-500",
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-background p-0 overflow-hidden">
                <DialogHeader className="pt-8">
                    <DialogTitle className="font-bold text-center">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete{" "}
                        <span className="text-primary font-semibold">
                            {data?.server?.name}
                        </span>
                        ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-secondary px-6 py-4">
                    <div className="flex justify-between items-center w-full">
                        <Button
                            disabled={isLoading}
                            className="w-32"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="ghost"
                            className="w-32 bg-red-500"
                            onClick={handleDeleteServer}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

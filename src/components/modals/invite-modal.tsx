"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import React from "react";
import { useModal } from "@/hooks/store/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Server } from "@prisma/client";

export default function InviteModal() {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "invite";
    const origin = useOrigin();
    const [copied, setCopied] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const inviteLink = `${origin}/invite/${data?.server?.inviteCode}`;

    const handleClose = () => {
        onClose();
    };

    const onCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const handleGenerateNewLink = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.patch<{ data: Server }>(
                `/servers/${data?.server?.id}/invite-code`
            );

            onOpen("invite", { server: response.data.data });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-background p-0 overflow-hidden px-4 pb-4">
                <DialogHeader className="pt-8">
                    <DialogTitle className="font-bold">
                        Invite friends to {data?.server?.name}
                    </DialogTitle>
                </DialogHeader>
                <Label className="dark:text-zinc-300 text-zinc-600 uppercase text-xs">
                    Send A Server invite link to A friend
                </Label>
                <div className="flex items-center mt-2 gap-x-2">
                    <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0  focus-visible:ring-offset-0"
                        value={inviteLink}
                    />
                    <Button size="icon" onClick={onCopy}>
                        {copied ? <Check /> : <Copy />}
                    </Button>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    className="text-sm mt-4"
                    onClick={handleGenerateNewLink}
                    disabled={isLoading}
                >
                    Generate new Link
                    <RefreshCw
                        className={cn(
                            "w-4 h-4 ml-4",
                            isLoading && "transition-transform animate-spin"
                        )}
                    />
                </Button>
            </DialogContent>
        </Dialog>
    );
}

import React from "react";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal-store";

function ImageChatModal() {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "imageChat";

    const handleClose = () => {
        onClose();
    };
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="min-w-fit h-fit p-0">
                <div className="relative">
                    {data?.imageUrl ? (
                        <Image
                            src={data?.imageUrl}
                            width={1000}
                            height={1000}
                            alt="image-chat"
                        />
                    ) : (
                        <div className="w-full h-full flex justify-center items-center">
                            <p className="text-center">No image found</p>
                        </div>
                    )}
                    <a
                        href="https://utfs.io/f/e24092b9-bb22-433b-a02b-f7faba9e6912-ivih5g.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute -bottom-7 left-0"
                    >Open in new tab</a>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ImageChatModal;

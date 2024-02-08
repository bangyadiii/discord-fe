import { useModal } from "@/hooks/use-modal-store";
import { DirectMessageWithRelation, MessageWithRelation } from "@/types";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ChatIncludeMediaProps {
    dm: DirectMessageWithRelation | null;
    channelMsg: MessageWithRelation | null;
}

export default function ChatIncludeMedia({
    dm,
    channelMsg,
}: ChatIncludeMediaProps) {
    const { onOpen } = useModal();
    if (!dm && !channelMsg) return null;

    const ext = (dm?.fileUrl ?? channelMsg?.fileUrl)?.split(".").pop() ?? null;

    let includeImage = false;
    let includeVideo = false;
    let includeDocument = false;

    if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") {
        includeImage = true;
    } else if (ext === "mp4" || ext === "webm" || ext === "ogg") {
        includeVideo = true;
    } else if (ext === "pdf") {
        includeDocument = true;
    } else {
        includeImage = false;
        includeVideo = false;
        includeDocument = false;
    }

    if (includeImage) {
        return (
            <button
                className="w-fit"
                onClick={() => {
                    onOpen("imageChat", {
                        imageUrl: dm?.fileUrl ?? channelMsg?.fileUrl!,
                    });
                }}
            >
                <Image
                    src={dm?.fileUrl ?? channelMsg?.fileUrl!}
                    alt="message image"
                    width={500}
                    height={500}
                    className="rounded-md"
                />
            </button>
        );
    }
    if (includeVideo) {
        return (
            <video
                width={500}
                height={500}
                controls
                autoPlay={false}
                autoFocus={false}
            >
                <source
                    src={dm?.fileUrl ?? channelMsg?.fileUrl!}
                    type={`video/${ext}`}
                />
                Your browser does not support the video tag.
            </video>
        );
    }
    if (includeDocument) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-secondary/10">
                <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
                <a
                    href={dm?.fileUrl ?? channelMsg?.fileUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {dm?.fileUrl ?? channelMsg?.fileUrl!}
                </a>
            </div>
        );
    }
    return null;
}

"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "imageUploader";
}

export default function FileUpload({
    value,
    endpoint,
    onChange,
}: FileUploadProps) {
    const fileType = value?.split(".").pop();
    if (value && fileType !== "pdf") {
        return (
            <div className="relative w-20 h-20">
                <Image
                    fill
                    src={value}
                    alt="upload server icon"
                    className="rounded-full"
                />
                <button
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    onClick={() => {
                        onChange("");
                    }}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(err) => {
                alert("Upload Error" + err);
            }}
        />
    );
}

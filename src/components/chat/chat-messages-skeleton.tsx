import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatMessagesSkeleton() {
    return (
        <div className="w-full h-[1000px] gap-y-4 px-3">
            <div className="flex gap-y-2 w-full">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="gap-y-2 ml-4">
                    <Skeleton className="w-20 h-5 mb-2" />
                    <Skeleton className="w-[400px] h-10 mb-2" />
                </div>
            </div>
            <div className="flex gap-y-2 w-full">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="gap-y-2 ml-4">
                    <Skeleton className="w-24 h-5 mb-2" />
                    <Skeleton className="w-[250px] h-10 mb-2" />
                    <Skeleton className="w-[500px] h-[350px] mb-2" />
                </div>
            </div>
            <div className="flex gap-y-2 w-full">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="gap-y-2 ml-4 w-full">
                    <Skeleton className="w-36 h-5 mb-2" />
                    <Skeleton className="w-[400px] h-[90px] mb-2" />
                </div>
            </div>
            <div className="flex gap-y-2 w-full">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="gap-y-2 ml-4">
                    <Skeleton className="w-24 h-5 mb-2" />
                    <Skeleton className="w-[300px] h-9 mb-2" />
                </div>
            </div>
            <div className="flex gap-y-2 w-full">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="gap-y-2 ml-4">
                    <Skeleton className="w-24 h-5 mb-2" />
                    <Skeleton className="w-[340px] h-[120px] mb-2" />
                </div>
            </div>
        </div>
    );
}

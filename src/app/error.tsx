"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Lottie, { Options } from "react-lottie";
import * as animationData from "@/assets/Animation - 1707620201602.json";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isStopped, setIsStopped] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    useEffect(() => {
        // Log the error to an error reporting service
        console.debug({ error });
    }, [error]);

    const defaultOptions: Options = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
                isStopped={isStopped}
                isPaused={isPaused}
            />
            <h2 className="text-2xl font-semibold">Something went wrong!</h2>
            <div>
                <Button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    variant={"link"}
                >
                    Try again
                </Button>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const origin =
        typeof window !== "undefined" && mounted ? window.location.origin : "";
    if (!mounted) return "";

    return origin;
};

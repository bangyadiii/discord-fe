"use client";

import { pusherClient } from "@/lib/pusher";
import React from "react";

export default function PusherProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    pusherClient.signin();

    return <>{children}</>;
}

"use client";

import { useCurrentServer } from "@/hooks/store/use-current-server";
import { MemberWithRelation, ServerWithRelation } from "@/types";
import { useRef } from "react";

interface StoreInitializerProps {
    server?: ServerWithRelation;
    sessionMember?: MemberWithRelation;
}

export default function StoreInitializer({
    server,
    sessionMember,
}: StoreInitializerProps) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useCurrentServer.setState({
            server,
            sessionMember,
        });
        initialized.current = true;
    }
    return null;
}

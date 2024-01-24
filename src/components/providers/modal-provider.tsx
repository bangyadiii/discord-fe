"use client";

import React, { useEffect } from "react";
import CreateServerModal from "../modals/server-modal";
import InviteModal from "../modals/invite-modal";

export default function ModalProvider() {
    const [isMounted, setIsMounted] = React.useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) return null;

    return (
        <>
            <CreateServerModal />
            <InviteModal />
        </>
    );
}

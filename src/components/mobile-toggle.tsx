import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSideBar from "./navigation/navigation-sidebar";
import ServerSideBar from "./server/server-sidebar";
import { DirectMessageWithRelation, ServerWithRelation } from "../types";
import { User } from "@prisma/client";
import DMSideBar from "./dm/dm-sidebar";
import { type } from "os";

interface MobileToggleProps {
    type: "channel" | "directMessage";
    data: {
        server?: ServerWithRelation;
        conversations?: DirectMessageWithRelation[];
        opponentUser?: User;
    };
}

export default function MobileToggle({
    type,
    data: { server, conversations, opponentUser },
}: MobileToggleProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSideBar />
                </div>
                {type == "channel" && server ? (
                    <ServerSideBar server={server} />
                ) : (
                    <DMSideBar
                        opponentUser={opponentUser!}
                        conversations={conversations!}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}

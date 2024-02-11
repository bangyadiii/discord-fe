import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ServerSideBar from "./server-sidebar";
import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import { useServersStore } from "@/hooks/store/use-servers-store";

export default function ServerMobileSidebar() {
    const { servers } = useServersStore.getState();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    {!servers || servers?.length === 0 ? (
                        <div>Loading...</div>
                    ) : (
                        <NavigationSideBar servers={servers} />
                    )}
                </div>
                <ServerSideBar />
            </SheetContent>
        </Sheet>
    );
}

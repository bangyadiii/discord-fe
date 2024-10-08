import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import DashboardSidebar from "./dashboard-sidebar";
import { useServersStore } from "@/hooks/store/use-servers-store";

export default function DashboardMobileSidebar() {
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
                        <div>Error</div>
                    ) : (
                        <NavigationSideBar servers={servers} />
                    )}
                </div>
                <DashboardSidebar />
            </SheetContent>
        </Sheet>
    );
}

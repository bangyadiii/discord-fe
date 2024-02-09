import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";
import NavigationDM from "./navigation-dm";
import { ServerWithRelation } from "@/types";

interface NavigationSideBarProps {
    servers: ServerWithRelation[];
}

export default async function NavigationSideBar({
    servers,
}: NavigationSideBarProps) {
    return (
        <nav className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-zinc-200 dark:bg-[#1E1F22] py-3">
            <NavigationDM />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers?.length > 0 && servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <NavigationAction />
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox:
                                "h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center group-hover:bg-emerald-500 bg-background dark:bg-neutral-700",
                        },
                    }}
                />
            </div>
        </nav>
    );
}

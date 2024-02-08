import { ChannelType, MembershipRole } from "@prisma/client";
import { Crown, Hash, Mic, ShieldAlert, User } from "lucide-react";
import ServerSideBarHeader from "@/components/server/server-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./server-search";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import UserInformation from "@/components/user-information";
import { useCurrentServer } from "@/hooks/store/use-current-server";
import ChannelList from "./channel-list";

export const channelIconMap = {
    [ChannelType.TEXT]: <Hash className="h-4 w-4" />,
    [ChannelType.VOICE]: <Mic className="h-4 w-4" />,
};

const iconRoleList: Record<MembershipRole, React.ReactElement | null> = {
    OWNER: <Crown className="h-4 w-4 text-amber-600" />,
    ADMIN: <ShieldAlert className="h-4 w-4 text-red-500" />,
    MEMBER: <User className="h-4 w-4 text-primary" />,
    GUEST: null,
};

export default async function ServerSideBar() {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();
    const { server, sessionMember } = useCurrentServer.getState();
    if (!server || !sessionMember) throw new Error("Server state invalid");

    return (
        <div className="flex flex-col h-full w-full bg-secondary">
            <ServerSideBarHeader
                server={server}
                sessionMember={sessionMember}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={[]} />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-600 rounded-md my-2" />
                <ChannelList server={server} sessionMember={sessionMember} />
            </ScrollArea>
            <div className="">
                <UserInformation />
            </div>
        </div>
    );
}

import {
    Channel,
    ChannelType,
    Member,
    MembershipRole,
    Server,
} from "@prisma/client";
import ServerSideBarHeader from "./server-sidebar-header";
import { ServerWithRelation } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Hash, Mic, ShieldAlert, User } from "lucide-react";
import ServerSearch from "./server-search";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ChannelItem from "../channel/channel-item";
import UserInformation from "../user-information";

interface ServerSideBarProps {
    server: ServerWithRelation;
}

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

export default async function ServerSideBar({ server }: ServerSideBarProps) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();

    const textChannels = server.channels?.filter(
        (channel) => channel.type === ChannelType.TEXT
    );
    const voiceChannels = server.channels?.filter(
        (channel) => channel.type === ChannelType.VOICE
    );
    const members = server.members?.filter(
        (member) => member.userId !== user.id
    );
    const role = server.members?.find(
        (member) => member.userId === user.id
    )?.role;

    return (
        <div className="flex flex-col h-full w-full bg-secondary">
            <ServerSideBarHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type],
                                })),
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: voiceChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type],
                                })),
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.user?.name!!,
                                    icon: iconRoleList[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-600 rounded-md my-2" />
                {server.channels?.map((channel) => {
                    if (channel.categoryId === null) {
                        return (
                            <ChannelItem key={channel.id} channel={channel} />
                        );
                    }
                    return null;
                })}
                {server.channelCategories?.map((category) => (
                    <div key={category.id} className="my-3">
                        <ServerSection
                            label={category.name}
                            role={role}
                            channelType={ChannelType.TEXT}
                            sectionType="channel"
                            category={category}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="">
                <UserInformation />
            </div>
        </div>
    );
}

import { Channel, ChannelType, Member, Server } from "@prisma/client";
import ServerSideBarHeader from "./server-sidebar-header";
import { ServerWithRelation } from "../../../types";

interface ServerSideBarProps {
    server: ServerWithRelation;
}
export default function ServerSideBar({ server }: ServerSideBarProps) {
    const textChannels = server.channels?.filter(
        (channel) => channel.type === ChannelType.TEXT
    );
    const voiceChannels = server.channels?.filter(
        (channel) => channel.type === ChannelType.VOICE
    );
    const role = server.members?.find((member) => member.role === "OWNER")?.role;

    return (
        <div className="flex flex-col h-full w-full bg-secondary">
            <ServerSideBarHeader server={server} role={role} />
        </div>
    );
}

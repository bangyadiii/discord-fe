"use client";
import ChannelItem from "@/components/channel/channel-item";
import ServerSection from "./server-section";
import { ChannelType } from "@prisma/client";
import { MemberWithRelation, ServerWithRelation } from "@/types";
import { useServerQuery } from "@/hooks/query/use-server-query";

interface ChannelListProps {
    server: ServerWithRelation;
    sessionMember: MemberWithRelation;
}

export default function ChannelList({
    server: initialData,
    sessionMember,
}: Readonly<ChannelListProps>) {
    const { data } = useServerQuery({
        apiUrl: `/servers/${initialData.id}`,
        initialData: initialData,
    });
    const server = data?.data;
    if (!server) throw new Error("Server data is invalid");

    return (
        <>
            {server.channels?.map((channel) => {
                if (channel.categoryId === null) {
                    return <ChannelItem key={channel.id} channel={channel} />;
                }
                return null;
            })}
            {server.channelCategories?.map((category) => (
                <div key={category.id} className="my-3">
                    <ServerSection
                        label={category.name}
                        role={sessionMember.role}
                        channelType={ChannelType.TEXT}
                        sectionType="channel"
                        category={category}
                    />
                </div>
            ))}
        </>
    );
}

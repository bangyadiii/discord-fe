import React from "react";

function ChannelPage({
    params,
}: {
    params?: {
        serverId: string;
        channelId: string;
    };
}) {
    return <div>ChannelPage {params?.channelId}</div>;
}

export default ChannelPage;

import DMSideBar from "@/components/dm/dm-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import React from "react";

export default async function DMLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        userId: string;
    };
}) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();

    const conversations = await db.$queryRawUnsafe<{
        conversation_partner_id: string;
        last_message_time: string;
    }[]>(`
        SELECT
            CASE
                WHEN sender_id = '${user.id}' THEN receiver_id
                ELSE sender_id
            END AS conversation_partner_id,
            MAX(created_at) AS last_message_time
        FROM
            direct_messages
        WHERE
            sender_id = '${user.id}' OR receiver_id = '${user.id}'
        GROUP BY
            conversation_partner_id
        ORDER BY
            last_message_time DESC;
    `);
    const conversationPartnerIds = conversations.map(
        (conversation) => conversation.conversation_partner_id
    );
    const conversationPartners = await db.user.findMany({
        where: {
            id: {
                in: conversationPartnerIds,
            },
        },
    });

    return (
        <div className="h-screen flex overflow-hidden">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
                <DMSideBar
                    partners={conversationPartners}
                />
            </div>

            <div className="h-full flex-1 md:pl-60">{children}</div>
        </div>
    );
}

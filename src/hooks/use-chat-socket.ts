import { DirectMessageWithRelation, MessageWithRelation } from "@/types";
import { find } from "lodash";
import { useCallback, useEffect } from "react";
import { QueryClient } from "react-query";
import { pusherClient } from "@/lib/pusher";
import { extractType, toPusherKey } from "@/lib/utils";

interface UseChatSocketParam {
    queryClient: QueryClient;
    queryKey: string;
}

export default function useChatSocket({
    queryClient,
    queryKey,
}: UseChatSocketParam) {
    const type = extractType(queryKey);

    // Handler for new message
    const newMessageHandler = useCallback(
        (incoming: {
            data: MessageWithRelation | DirectMessageWithRelation;
        }) => {
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newPages = oldData.pages.map((page: any) => {
                    if (!page.data) return page;
                    if (find(page.data, { id: incoming.data.id })) return page;
                    const newData = [incoming.data, ...page.data];
                    return {
                        ...page,
                        data: newData,
                    };
                });
                return {
                    ...oldData,
                    pages: newPages,
                };
            });
        },
        [queryKey, queryClient]
    );

    // handler for deleted message
    const deletedMessageHandler = useCallback(
        ({
            data,
        }: {
            data: MessageWithRelation | DirectMessageWithRelation;
        }) => {
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newPages = oldData.pages.map((page: any) => {
                    if (!page.data) return page;

                    const newData = page.data.map((item: any) => {
                        /**
                         * if the message is already deleted, return the item.
                         * else update the item with the deletedAt field
                         * */
                        if (item.id === data.id) {
                            return {
                                ...item,
                                deletedAt: data.deletedAt,
                            };
                        }
                        return item;
                    });
                    return {
                        ...page,
                        data: newData,
                    };
                });
                return {
                    ...oldData,
                    pages: newPages,
                };
            });
        },
        [queryClient, queryKey]
    );

    // handler for updated message
    const updatedMessageHandler = useCallback(
        ({
            data,
        }: {
            data: DirectMessageWithRelation | MessageWithRelation;
        }) => {
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newPages = oldData.pages.map((page: any) => {
                    if (!page.data) return page;

                    const newData = page.data.map((item: any) => {
                        if (item.id === data.id) {
                            return {
                                ...item,
                                content: data.content,
                            };
                        }
                        return item;
                    });
                    return {
                        ...page,
                        data: newData,
                    };
                });
                return {
                    ...oldData,
                    pages: newPages,
                };
            });
        },
        [queryClient, queryKey]
    );

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(queryKey));
        pusherClient.bind(toPusherKey(`${type}:new`), newMessageHandler);
        pusherClient.bind(
            toPusherKey(`${type}:deleted`),
            deletedMessageHandler
        );
        pusherClient.bind(
            toPusherKey(`${type}:updated`),
            updatedMessageHandler
        );

        return () => {
            pusherClient.unsubscribe(toPusherKey(queryKey));
            pusherClient.unbind(toPusherKey(`${type}:new`));
            pusherClient.unbind(toPusherKey(`${type}:deleted`));
            pusherClient.unbind(toPusherKey(`${type}:updated`));
        };
    }, [
        queryKey,
        type,
        newMessageHandler,
        deletedMessageHandler,
        updatedMessageHandler,
    ]);
}

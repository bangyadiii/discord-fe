import { DirectMessageWithRelation, MessageWithRelation } from "@/types";
import { useCallback, useEffect } from "react";
import { QueryClient } from "react-query";
import { pusherClient } from "@/lib/pusher";
import { toPrivateKey, toPusherKey } from "@/lib/utils";
import { find } from "lodash";

interface UseChatSocketParam {
    queryClient: QueryClient;
    queryKey: string;
}

export default function useChatSocket({
    queryClient,
    queryKey,
}: UseChatSocketParam) {
    // Handler for new message
    const newMessageHandler = useCallback(
        (incoming: {
            data: MessageWithRelation | DirectMessageWithRelation;
        }) => {
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                // if the message is already in the list, update that message with the new one
                // else add the new message to the list of messages in the first index of oldData.pages.[0].data
                const newPages = oldData.pages.map((page: any) => {
                    if (!page.data) return page;
                    if (find(page.data, { id: incoming.data.id })) {
                        const newData = page.data.map((item: any) => {
                            if (item.id === incoming.data.id) {
                                return incoming.data;
                            }
                            return item;
                        });
                        return {
                            ...page,
                            data: newData,
                        };
                    }
                    return {
                        ...page,
                        data: [incoming.data, ...page.data],
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
                                updatedAt: data.updatedAt,
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
        pusherClient.subscribe(toPrivateKey(toPusherKey(queryKey)));
        pusherClient.bind(toPusherKey(`message:new`), newMessageHandler);
        pusherClient.bind(
            toPusherKey(`message:deleted`),
            deletedMessageHandler
        );
        pusherClient.bind(
            toPusherKey(`message:updated`),
            updatedMessageHandler
        );

        return () => {
            pusherClient.unsubscribe(toPrivateKey(toPusherKey(queryKey)));
            pusherClient.unbind(toPusherKey(`message:new`));
            pusherClient.unbind(toPusherKey(`message:deleted`));
            pusherClient.unbind(toPusherKey(`message:updated`));
        };
    }, [
        queryKey,
        newMessageHandler,
        deletedMessageHandler,
        updatedMessageHandler,
    ]);
}

import { ChannelType } from "@prisma/client";
import * as z from "zod";

export const chatInputValidator = z.object({
    content: z.string().min(1).max(2000),
});

export const createChannelCategoryValidator = z.object({
    name: z
        .string()
        .min(1, "Channel name is required.")
        .max(100, "Too Long")
        .refine((value) => value !== "general", {
            message: "Channel name cannot be 'general'",
        }),
    serverId: z.string(),
});

export const saveChannelValidator = z.object({
    name: z
        .string()
        .min(1, "Channel name is required.")
        .max(100, "Too Long")
        .refine((value) => value !== "general", {
            message: "Channel name cannot be 'general'",
        }),
    type: z.nativeEnum(ChannelType),
    serverId: z.string(),
    categoryId: z.string().nullable(),
});

export const inputServerValidator = z.object({
    name: z.string().min(1, "Server name is required.").max(100, "Too Long"),
    imageUrl: z.string().url(),
});

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const currentProfile = async (): Promise<User | null> => {
    const { userId } = auth();
    if (!userId) return null;

    const profile = await db.user.findUnique({
        where: {
            providerUserId: userId,
        },
    });

    return profile;
};

import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const currentProfile = async (req: NextApiRequest): Promise<User | null> => {
    const { userId } = getAuth(req);
    if (!userId) return null;

    const profile = await db.user.findUnique({
        where: {
            providerUserId: userId,
        },
    });

    return profile;
};

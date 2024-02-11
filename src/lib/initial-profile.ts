import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const initialProfile = async (): Promise<User> => {
    const user = await currentUser();
    if (!user) return redirectToSignIn();

    const profile = await db.user.findUnique({
        where: {
            id: user.id,
        },
    });

    if (profile) return profile;

    const newProfile = await db.user.create({
        data: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
            profileUrl: user.imageUrl,
            providerUserId: user.id,
            provider: "google",
        },
    });
    return newProfile;
};

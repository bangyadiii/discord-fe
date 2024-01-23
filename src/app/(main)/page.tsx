import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";

export default async function SetupPage() {
    const profile = await initialProfile();
    const server = await db.server.findFirst({
        where: {
            ownerId: profile.id,
            OR: [
                {
                    members: {
                        some: {
                            userId: profile.id,
                        },
                    },
                },
            ],
        },
    });
    if (server) {
        return redirect(`/server/${server.id}`);
    }

    return (
        <div>
            <InitialModal />
        </div>
    );
}

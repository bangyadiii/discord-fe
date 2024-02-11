import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import { useServersStore } from "@/hooks/store/use-servers-store";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentProfile();

    if (!user) return redirect("/");

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    userId: user.id,
                    leftAt: null,
                },
            },
        },
        include:{
            members: true,
            channels: true,
        }
    });
    useServersStore.setState({ servers });
    return (
        <div className="min-h-screen">
            <div className="hidden md:flex w-[72px] z-30 flex-col fixed inset-y-0 dark:bg-[#1e2124]">
                <NavigationSideBar servers={servers} />
            </div>

            <main className="md:pl-[72px] min-h-screen">{children}</main>
        </div>
    );
}

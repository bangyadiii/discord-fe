import NavigationSideBar from "@/components/navigation/navigation-sidebar";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <div className="hidden md:flex w-[72px] z-30 flex-col fixed inset-y-0 dark:bg-[#1e2124]">
                <NavigationSideBar />
            </div>

            <main className="md:pl-[72px] min-h-screen">{children}</main>
        </div>
    );
}

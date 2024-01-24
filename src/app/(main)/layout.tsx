import { ModeToggle } from "@/components/ModeToggle";
import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0 dark:bg-[#1e2124]">
                <NavigationSideBar />
            </div>

            <main className="md:pl-[72px] h-full">{children}</main>
        </div>
    );
}

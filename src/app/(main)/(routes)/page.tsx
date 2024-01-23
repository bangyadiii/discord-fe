import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-between w-full">
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
        </div>
    );
}

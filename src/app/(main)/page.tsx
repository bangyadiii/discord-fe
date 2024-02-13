import { currentProfile } from "@/lib/current-profile";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {
    const user = await currentProfile();
    if (user) return redirect(`/dashboard`);
    await initialProfile();
    return redirect(`/dashboard`);
}

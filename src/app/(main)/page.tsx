import { redirect } from "next/navigation";

export default async function SetupPage() {
    return redirect(`/home`);
}

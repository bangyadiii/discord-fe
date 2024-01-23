import { SignIn } from "@clerk/nextjs";

function Page() {
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <SignIn />
        </div>
    );
}

export default Page;

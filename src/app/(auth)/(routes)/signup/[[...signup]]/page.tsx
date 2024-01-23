import { SignUp } from "@clerk/nextjs";

function Page() {
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <SignUp />
        </div>
    );
}

export default Page;

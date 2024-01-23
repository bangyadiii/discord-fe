import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

const f = createUploadthing();

const handleAuth = async (req: NextRequest, res: NextResponse) => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const { userId } = auth();

            // If you throw, the user will not be able to upload
            if (!userId) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);
        }),
    messageFile: f(["image", "pdf"])
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const { userId } = auth();

            // If you throw, the user will not be able to upload
            if (!userId) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId };
        })
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

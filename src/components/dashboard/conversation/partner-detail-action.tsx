"use client";
import { Button } from "@/components/ui/button";

export default function PartnerDetailAction() {
    return (
        <div className="flex gap-x-2">
            <Button size={"xs"} onClick={() => alert("not implemented :(")}>
                Add Friend
            </Button>
            <Button
                size={"xs"}
                variant={"destructive"}
                onClick={() => alert("not implemented :(")}
            >
                Block
            </Button>
        </div>
    );
}

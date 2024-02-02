import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
    src: string;
    className?: string;
}
export function UserAvatar({ src, className }: UserAvatarProps) {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            <AvatarImage src={src} />
            <AvatarFallback>User</AvatarFallback>
        </Avatar>
    );
}

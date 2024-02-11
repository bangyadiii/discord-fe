import { ScrollArea } from "@/components/ui/scroll-area";
import UserInformation from "@/components/user-information";
import DashboardSidebarHeader from "./dashboard-sidebar-header";
import { useConversations } from "@/hooks/store/use-conversations-store";
import MakeConversation from "./make-conversation";
import ConversationList from "./conversation-list";

export default function DashboardSidebar() {
    const { conversations } = useConversations.getState();

    return (
        <div className="flex flex-col h-full w-full bg-secondary">
            <DashboardSidebarHeader />
            <ScrollArea className="flex-1 px-3">
                <div className="flex justify-between items-center">
                    <span className="inline-flex uppercase text-xs my-4 text-zinc-500 hover:text-zinc-500/75 dark:text-zinc-400 dark:hover:text-zinc-300">
                        DIRECT MESSAGE
                    </span>
                    <MakeConversation />
                </div>
                {!conversations || conversations?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-primary-foreground text-sm font-semibold">
                            No conversations
                        </span>
                        <span className="text-primary-foreground text-sm">
                            Start a conversation with a friend!
                        </span>
                    </div>
                ) : (
                    <ConversationList conversations={conversations} />
                )}
            </ScrollArea>
            <div className="">
                <UserInformation />
            </div>
        </div>
    );
}

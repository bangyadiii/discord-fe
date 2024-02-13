import { ScrollArea } from "@/components/ui/scroll-area";
import UserInformation from "@/components/user-information";
import DashboardSidebarHeader from "./dashboard-sidebar-header";
import { useConversations } from "@/hooks/store/use-conversations-store";
import MakeConversation from "./make-conversation";
import ConversationList from "./conversation-list";
import FriendSidebarItem from "./friend-sidebar-item";

export default function DashboardSidebar() {
    const { conversations } = useConversations.getState();

    return (
        <div className="flex flex-col h-full w-full bg-secondary">
            <DashboardSidebarHeader />
            <div className="px-3 mt-2">
                <FriendSidebarItem />
            </div>
            <ScrollArea className="flex-1 px-3">
                <div className="flex justify-between items-center">
                    <span className="inline-flex uppercase text-xs my-4 text-zinc-500 hover:text-zinc-500/75 dark:text-zinc-400 dark:hover:text-zinc-300">
                        DIRECT MESSAGE
                    </span>
                    <MakeConversation />
                </div>

                <ConversationList conversations={conversations} />
            </ScrollArea>
            <div className="">
                <UserInformation />
            </div>
        </div>
    );
}

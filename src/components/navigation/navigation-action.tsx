"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "../../hooks/use-modal-store";

export default function NavigationAction() {
    const { onOpen } = useModal();

    const handleOnClick = () => {
        onOpen("createServer");
    };

    return (
        <div>
            <ActionTooltip label="Add a Server" align="center" side="right">
                <button
                    className="group flex items-center"
                    onClick={handleOnClick}
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center group-hover:bg-emerald-500 bg-background dark:bg-neutral-700">
                        <Plus
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}

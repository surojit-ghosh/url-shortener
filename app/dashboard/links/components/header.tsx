import { Input } from "@/components/ui/input";
import React from "react";
import LinkModal from "./link-modal";

const LinksHeader = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Links</h1>

            <div className="flex justify-between gap-4">
                <Input className="w-full sm:max-w-96" />
                <LinkModal />
            </div>
        </div>
    );
};

export { LinksHeader };

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";

const LinksHeader = () => {
    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Links</h1>

            <div className="flex justify-between gap-4">
                <Input className="w-full sm:max-w-96" />
                <Button variant="default" className="size-9 sm:size-fit">
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block">Create Link</span>
                </Button>
            </div>
        </div>
    );
};

export { LinksHeader };

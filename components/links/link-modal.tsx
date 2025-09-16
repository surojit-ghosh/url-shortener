"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import LinkForm from "./link-form";
import { useState } from "react";

const LinkModal = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="size-9 sm:size-fit">
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block">Create Link</span>
                </Button>
            </DialogTrigger>

            <DialogContent
                className="max-h-[90vh] max-w-6xl overflow-y-auto"
                onInteractOutside={(e) => {
                    // Check if the click was on a calendar or popover element
                    const target = e.target as Element;
                    if (
                        target?.closest("[data-radix-popper-content-wrapper]") ||
                        target?.closest("[data-slot=\'calendar']") ||
                        target?.closest(".rdp")
                    ) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">New Link</DialogTitle>
                </DialogHeader>

                <LinkForm close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default LinkModal;

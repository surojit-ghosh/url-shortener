"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import LinkForm from "./link-form";
import { useState } from "react";

interface EditLinkModalProps {
    linkData: {
        id: string;
        url: string;
        key: string;
        password?: string | null;
        geoTargeting?: Record<string, string> | null;
        deviceTargeting?: Record<string, string> | null;
        metadata?: Record<string, string> | null;
        expiresAt?: string | null;
    };
}

const EditLinkModal = ({ linkData }: EditLinkModalProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant="ghost"
                className="h-auto w-full justify-start p-2"
                onClick={() => setOpen(true)}
            >
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>

            <DialogContent
                className="max-h-[90vh] max-w-6xl overflow-y-auto"
                onInteractOutside={(e) => {
                    // Check if the click was on a calendar or popover element
                    const target = e.target as Element;
                    if (
                        target?.closest("[data-radix-popper-content-wrapper]") ||
                        target?.closest("[data-slot='calendar']") ||
                        target?.closest(".rdp")
                    ) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">Edit Link</DialogTitle>
                </DialogHeader>

                <LinkForm close={() => setOpen(false)} editMode={true} editData={linkData} />
            </DialogContent>
        </Dialog>
    );
};

export default EditLinkModal;

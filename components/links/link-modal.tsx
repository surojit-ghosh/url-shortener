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

const LinkModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="size-9 sm:size-fit">
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block">Create Link</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">New Link</DialogTitle>
                </DialogHeader>

                <LinkForm />
            </DialogContent>
        </Dialog>
    );
};

export default LinkModal;

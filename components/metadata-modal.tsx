"use client";

import { useState, useEffect } from "react";
import { FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MetadataData {
    title?: string;
    description?: string;
    image?: string;
}

interface MetadataModalProps {
    metadata?: MetadataData;
    onSave: (metadata?: MetadataData) => void;
    trigger?: React.ReactNode;
}

const MetadataModal = ({ metadata: initialMetadata, onSave, trigger }: MetadataModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [metadata, setMetadata] = useState<MetadataData>(initialMetadata || {});

    useEffect(() => {
        if (isOpen) {
            setMetadata(initialMetadata || {});
        }
    }, [isOpen, initialMetadata]);

    const handleSave = () => {
        // Validate metadata image URL if provided
        if (metadata.image && metadata.image.length > 0) {
            try {
                new URL(metadata.image);
            } catch {
                toast.error("Image must be a valid URL");
                return;
            }
        }

        // Only save if at least one field has content
        const hasContent = metadata.title || metadata.description || metadata.image;
        onSave(hasContent ? metadata : undefined);
        setIsOpen(false);
        toast.success("Metadata settings saved!");
    };

    const hasMetadata = () => {
        return Boolean(metadata.title || metadata.description || metadata.image);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        type="button"
                        variant="outline"
                        className="flex w-full items-center justify-start gap-2"
                    >
                        <FileText size={16} />
                        <span className="flex-1 text-start">Metadata & SEO</span>
                        {hasMetadata() && (
                            <Badge variant="secondary" className="text-xs">
                                Configured
                            </Badge>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText size={20} />
                        Metadata & SEO
                    </DialogTitle>
                    <DialogDescription className="break-words">
                        Customize how your link appears when shared on social media and search
                        engines
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 overflow-hidden py-4">
                    <div className="max-w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="meta-title" className="flex items-center gap-2">
                                <FileText size={14} />
                                Title
                            </Label>
                            <Input
                                id="meta-title"
                                placeholder="Page title (max 100 characters)"
                                value={metadata.title || ""}
                                onChange={(e) =>
                                    setMetadata((prev) => ({ ...prev, title: e.target.value }))
                                }
                                maxLength={100}
                                className="w-full text-sm break-all"
                                style={{ wordBreak: "break-all", overflowWrap: "break-word" }}
                            />
                            <p className="text-muted-foreground text-xs">
                                {metadata.title?.length || 0}/100 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta-description" className="flex items-center gap-2">
                                <FileText size={14} />
                                Description
                            </Label>
                            <Textarea
                                id="meta-description"
                                placeholder="Page description (max 300 characters)"
                                value={metadata.description || ""}
                                onChange={(e) =>
                                    setMetadata((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="w-full resize-none text-sm leading-relaxed break-words"
                                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                                maxLength={300}
                                rows={3}
                            />
                            <p className="text-muted-foreground text-xs">
                                {metadata.description?.length || 0}/300 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meta-image" className="flex items-center gap-2">
                                <ImageIcon size={14} />
                                Image URL
                            </Label>
                            <Input
                                id="meta-image"
                                placeholder="https://example.com/image.jpg"
                                value={metadata.image || ""}
                                onChange={(e) =>
                                    setMetadata((prev) => ({ ...prev, image: e.target.value }))
                                }
                                className="w-full text-sm break-all"
                                style={{ wordBreak: "break-all", overflowWrap: "break-word" }}
                            />
                            <p className="text-muted-foreground text-xs">
                                URL to an image that represents your content (recommended:
                                1200x630px)
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setMetadata({})}>
                            Clear All
                        </Button>
                    </div>
                    <Button type="button" onClick={handleSave}>
                        Save Metadata
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MetadataModal;

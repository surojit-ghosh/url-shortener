"use client";

import { useState, useEffect } from "react";
import { Lock, LockOpen, Eye, EyeOff, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SecurityMetadataData {
    password?: string;
    metadata?: {
        title?: string;
        description?: string;
        image?: string;
    };
}

interface SecurityMetadataModalProps {
    password?: string;
    metadata?: {
        title?: string;
        description?: string;
        image?: string;
    };
    onSave: (data: SecurityMetadataData) => void;
    trigger?: React.ReactNode;
}

export const SecurityMetadataModal = ({
    password: initialPassword,
    metadata: initialMetadata,
    onSave,
    trigger,
}: SecurityMetadataModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Local state for form data
    const [password, setPassword] = useState(initialPassword || "");
    const [metadata, setMetadata] = useState(initialMetadata || {});

    useEffect(() => {
        setIsPasswordProtected(Boolean(password && password.length > 0));
    }, [password]);

    useEffect(() => {
        if (isOpen) {
            // Reset local state when modal opens
            setPassword(initialPassword || "");
            setMetadata(initialMetadata || {});
        }
    }, [isOpen, initialPassword, initialMetadata]);

    const handleSave = () => {
        // Validate password if provided
        if (password && password.length > 0 && password.length < 4) {
            toast.error("Password must be at least 4 characters long");
            return;
        }

        // Validate metadata image URL if provided
        if (metadata.image && metadata.image.length > 0) {
            try {
                new URL(metadata.image);
            } catch {
                toast.error("Image must be a valid URL");
                return;
            }
        }

        const savedData: SecurityMetadataData = {
            password: password || undefined,
            metadata:
                metadata.title || metadata.description || metadata.image ? metadata : undefined,
        };

        onSave(savedData);
        setIsOpen(false);
        toast.success("Security & metadata settings saved!");
    };

    const getActiveSettingsCount = () => {
        let count = 0;
        if (password && password.length > 0) count++;
        if (metadata.title || metadata.description || metadata.image) count++;
        return count;
    };

    const DefaultTrigger = () => (
        <Button type="button" variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
                <Lock size={16} />
                Security & Metadata
            </div>
            {getActiveSettingsCount() > 0 && (
                <Badge variant="secondary" className="text-xs">
                    {getActiveSettingsCount()} active
                </Badge>
            )}
        </Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger || <DefaultTrigger />}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock size={20} />
                        Security & Metadata
                    </DialogTitle>
                    <DialogDescription>
                        Configure password protection and link metadata
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="security" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    </TabsList>

                    <TabsContent value="security" className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Password Protection
                                    </Label>
                                    <p className="text-muted-foreground text-xs">
                                        Require a password to access this link
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newState = !isPasswordProtected;
                                        setIsPasswordProtected(newState);
                                        if (!newState) {
                                            setPassword("");
                                        }
                                    }}
                                    className="h-8 text-xs"
                                >
                                    {isPasswordProtected ? (
                                        <>
                                            <LockOpen size={14} className="mr-1" />
                                            Remove
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={14} className="mr-1" />
                                            Enable
                                        </>
                                    )}
                                </Button>
                            </div>

                            {isPasswordProtected && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password (min. 4 characters)"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={16} className="text-gray-400" />
                                            ) : (
                                                <Eye size={16} className="text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {password && password.length > 0 && password.length < 4 && (
                                        <p className="text-xs text-red-500">
                                            Password must be at least 4 characters long
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="metadata" className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Link Metadata</Label>
                                <p className="text-muted-foreground text-xs">
                                    Customize how your link appears when shared on social media
                                </p>
                            </div>

                            <div className="space-y-4">
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
                                            setMetadata((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        maxLength={100}
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        {metadata.title?.length || 0}/100 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="meta-description"
                                        className="flex items-center gap-2"
                                    >
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
                                            setMetadata((prev) => ({
                                                ...prev,
                                                image: e.target.value,
                                            }))
                                        }
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        URL to an image that represents your content
                                    </p>
                                </div>

                                {(metadata.title || metadata.description || metadata.image) && (
                                    <div className="bg-muted rounded-md p-3">
                                        <Label className="text-xs font-medium">Preview</Label>
                                        <div className="mt-2 space-y-1">
                                            {metadata.title && (
                                                <div className="text-sm font-medium">
                                                    {metadata.title}
                                                </div>
                                            )}
                                            {metadata.description && (
                                                <div className="text-muted-foreground text-xs">
                                                    {metadata.description}
                                                </div>
                                            )}
                                            {metadata.image && (
                                                <div className="text-xs text-blue-600">
                                                    {metadata.image}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                        Save Settings
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SecurityMetadataModal;

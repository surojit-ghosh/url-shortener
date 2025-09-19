"use client";

import { siteConfig } from "@/config/site";
import { Check, Clipboard, CornerDownRight, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { QRCodeModal } from "../qr-code-modal";
import EditLinkModal from "./edit-link-modal";
import { useDeleteLink } from "@/lib/queries/links";
import { toast } from "sonner";

type LinkCardProps = {
    id: string;
    url: string;
    shortKey: string;
    clicks?: number;
    expiresAt?: string | null;
    password?: string | null;
    geoTargeting?: Record<string, string> | null;
    deviceTargeting?: Record<string, string> | null;
    metadata?: Record<string, string> | null;
};

const LinkCard = ({
    id,
    url,
    shortKey,
    clicks = 0,
    expiresAt,
    password,
    geoTargeting,
    deviceTargeting,
    metadata,
}: LinkCardProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const deleteLink = useDeleteLink();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${siteConfig.url}${shortKey}`);
            setIsCopied(true);
            toast.success("Link copied to clipboard!");
            // Reset copied state after 3 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    const handleDelete = async () => {
        if (
            window.confirm(
                `Are you sure you want to delete "${siteConfig.url}${shortKey}"? This action cannot be undone.`
            )
        ) {
            try {
                await deleteLink.mutateAsync(id);
                toast.success("Link deleted successfully!");
            } catch (error) {
                console.error("Failed to delete link:", error);
                toast.error("Failed to delete link. Please try again.");
            }
        }
    };

    const linkData = {
        id,
        url,
        key: shortKey,
        password,
        geoTargeting,
        deviceTargeting,
        metadata,
        expiresAt,
    };

    return (
        <div className="border-muted flex items-center gap-4 border p-4">
            <div className="bg-muted rounded-full p-2">
                <Image
                    src={`https://www.google.com/s2/favicons?sz=64&domain_url=${new URL(url).origin}`}
                    alt="favicon"
                    height={20}
                    width={20}
                    onError={(e) => {
                        e.currentTarget.src = "/favicon.ico";
                    }}
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col font-medium">
                <div className="flex items-center gap-2">
                    <a href={url} className="text-sm hover:underline">
                        {siteConfig.url}
                        {shortKey}
                    </a>
                    <div className="flex items-center justify-center gap-1">
                        <button
                            onClick={handleCopy}
                            className="hover:bg-muted cursor-pointer rounded-full p-2"
                        >
                            {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                        </button>
                        <QRCodeModal
                            shortKey={shortKey}
                            originalUrl={url}
                            baseUrl={`https://${siteConfig.url}`}
                        />
                    </div>
                </div>

                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <CornerDownRight size={14} />
                    <a href={url} className="mr-1 flex-1 truncate">
                        {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                    <Eye size={14} />
                    <p>
                        {clicks} {clicks === 1 ? "click" : "clicks"}
                    </p>
                </div>
            </div>

            <div className="ml-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"ghost"}>
                            <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <EditLinkModal linkData={linkData} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={handleDelete}
                            disabled={deleteLink.isPending}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default LinkCard;

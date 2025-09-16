"use client";

import { siteConfig } from "@/config/site";
import {
    Calendar,
    Check,
    Clipboard,
    CornerDownRight,
    AlertTriangle,
    EllipsisVertical,
} from "lucide-react";
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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type LinkCardProps = {
    url: string;
    shortKey: string;
    createdAt: string;
    expiresAt?: string | null;
};

const LinkCard = ({ url, shortKey, createdAt, expiresAt }: LinkCardProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${siteConfig.url}${shortKey}`);
            setIsCopied(true);

            // Reset copied state after 3 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    // Check if link is expired
    const isExpired = expiresAt ? new Date() > new Date(expiresAt) : false;
    return (
        <div className="border-muted flex items-center gap-4 border p-4">
            <div className="bg-muted rounded-full p-2">
                <Image
                    src={`https://www.google.com/s2/favicons?sz=64&domain_url=${new URL(url).origin}`}
                    alt="favicon"
                    height={20}
                    width={20}
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col font-medium">
                <div className="flex items-center gap-2">
                    <a href={url} className="text-sm hover:underline">
                        {siteConfig.url}
                        {shortKey}
                    </a>
                    <button onClick={handleCopy} className="hover:bg-muted rounded-full p-2">
                        {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                    </button>

                    {/* Expiration Status - Only show if expired */}
                    {isExpired && (
                        <Badge variant="destructive" className="text-xs">
                            <AlertTriangle size={12} className="mr-1" />
                            Expired
                        </Badge>
                    )}
                </div>

                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <CornerDownRight size={14} />
                    <a href={url} className="mr-1 flex-1 truncate">
                        {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                    <Calendar size={14} />
                    <p>
                        {new Date(createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
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
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default LinkCard;

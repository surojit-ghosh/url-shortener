"use client";

import { useState, useEffect } from "react";
import { Download, Copy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    generateQRCode,
    downloadQRCode,
    copyQRCodeToClipboard,
    getShortUrl,
} from "@/lib/utils/qr-code";

interface QRCodeModalProps {
    shortKey: string;
    originalUrl: string;
    baseUrl?: string;
    trigger?: React.ReactNode;
}

export const QRCodeModal = ({ shortKey, originalUrl, baseUrl = "", trigger }: QRCodeModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    const shortUrl = getShortUrl(shortKey, baseUrl);
    const displayUrl = originalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const filename = `qr-code-${shortKey}`;

    console.log("QRCodeModal rendered", { shortKey, originalUrl, shortUrl });

    useEffect(() => {
        const generateQRCodeImage = async () => {
            console.log("Starting QR code generation for:", shortUrl);
            setIsGenerating(true);
            try {
                const dataUrl = await generateQRCode(shortUrl, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                });
                console.log("QR code generated successfully");
                setQrCodeDataUrl(dataUrl);
            } catch (error) {
                console.error("Error generating QR code:", error);
                toast.error("Failed to generate QR code");
            } finally {
                setIsGenerating(false);
            }
        };

        if (isOpen && !qrCodeDataUrl) {
            generateQRCodeImage();
        }
    }, [isOpen, qrCodeDataUrl, shortUrl]);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadQRCode(shortUrl, filename, {
                width: 512,
                margin: 2,
            });
            toast.success("QR code downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download QR code");
            console.error("Error downloading QR code:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyImage = async () => {
        setIsCopying(true);
        try {
            await copyQRCodeToClipboard(shortUrl, {
                width: 300,
                margin: 2,
            });
            toast.success("QR code copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy QR code");
            console.error("Error copying QR code:", error);
        } finally {
            setIsCopying(false);
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            toast.success("Short URL copied to clipboard!");
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    console.log("Dialog onOpenChange:", open);
                    setIsOpen(open);
                }}
            >
                <DialogTrigger asChild>
                    {trigger || (
                        <button
                            className="hover:bg-muted cursor-pointer rounded-full p-2"
                            title="Show QR Code"
                            onClick={() => console.log("QR trigger clicked")}
                        >
                            <QrCode size={16} />
                        </button>
                    )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <QrCode size={20} />
                            QR Code
                        </DialogTitle>
                        <DialogDescription>
                            Scan this QR code to access your shortened URL
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* QR Code Display */}
                        <div className="flex justify-center">
                            <div className="border-muted rounded-lg border-2 p-4">
                                {isGenerating ? (
                                    <div className="flex h-[300px] w-[300px] items-center justify-center">
                                        <div className="text-muted-foreground">
                                            Generating QR code...
                                        </div>
                                    </div>
                                ) : qrCodeDataUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={qrCodeDataUrl}
                                        alt="QR Code"
                                        className="h-[300px] w-[300px]"
                                        style={{ imageRendering: "pixelated" }}
                                    />
                                ) : (
                                    <div className="flex h-[300px] w-[300px] items-center justify-center">
                                        <div className="text-muted-foreground">
                                            Failed to generate QR code
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* URL Information */}
                        <div className="space-y-2">
                            <div>
                                <div className="text-sm font-medium">Short URL</div>
                                <div className="bg-muted flex items-center justify-between rounded-md p-2">
                                    <code className="text-sm">{shortUrl}</code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopyUrl}
                                        className="h-6 w-6"
                                    >
                                        <Copy size={12} />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Original URL</div>
                                <div className="text-muted-foreground truncate text-sm">
                                    {displayUrl}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading || !qrCodeDataUrl}
                                className="flex-1"
                            >
                                <Download size={16} className="mr-2" />
                                {isDownloading ? "Downloading..." : "Download"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCopyImage}
                                disabled={isCopying || !qrCodeDataUrl}
                                className="flex-1"
                            >
                                <Copy size={16} className="mr-2" />
                                Copy Image
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default QRCodeModal;

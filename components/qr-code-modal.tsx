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

    useEffect(() => {
        const generateQRCodeImage = async () => {
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
        } catch (error) {
            console.error("Failed to copy URL:", error);
            toast.error("Failed to copy URL");
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {trigger || (
                        <button
                            className="hover:bg-muted cursor-pointer rounded-full p-2"
                            title="Show QR Code"
                        >
                            <QrCode size={16} />
                        </button>
                    )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <QrCode size={20} />
                            QR Code
                        </DialogTitle>
                        <DialogDescription>
                            Scan this QR code to access your shortened URL
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* QR Code Display */}
                        <div className="flex justify-center">
                            <div className="border-muted rounded-lg border-2 bg-white p-4">
                                {isGenerating ? (
                                    <div className="flex h-[300px] w-[300px] items-center justify-center">
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                            <div className="text-muted-foreground">
                                                Generating QR code...
                                            </div>
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
                                        <div className="text-muted-foreground text-center">
                                            <QrCode size={32} className="mx-auto mb-2 opacity-50" />
                                            Failed to generate QR code
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* URL Information */}
                        <div className="space-y-3">
                            <div>
                                <div className="mb-2 text-sm font-medium">Short URL</div>
                                <div className="bg-muted/50 flex items-center justify-between rounded-md border p-3">
                                    <code className="mr-2 flex-1 font-mono text-sm text-blue-600">
                                        {shortUrl}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopyUrl}
                                        className="h-8 w-8 p-0"
                                        title="Copy URL"
                                    >
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-sm font-medium">Original URL</div>
                                <div className="text-muted-foreground bg-muted/30 rounded border p-2 text-sm break-all">
                                    {displayUrl}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading || !qrCodeDataUrl}
                                className="flex-1"
                                variant="default"
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
                                {isCopying ? "Copying..." : "Copy Image"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default QRCodeModal;

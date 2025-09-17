import QRCode from "qrcode";

export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
}

/**
 * Generate QR code as data URL
 */
export const generateQRCode = async (
    text: string,
    options: QRCodeOptions = {}
): Promise<string> => {
    const defaultOptions = {
        width: 256,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#FFFFFF"
        },
        ...options
    };

    try {
        const dataUrl = await QRCode.toDataURL(text, defaultOptions);
        return dataUrl;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
    }
};

/**
 * Generate QR code as Canvas element (for better customization)
 */
export const generateQRCodeCanvas = async (
    text: string,
    canvas: HTMLCanvasElement,
    options: QRCodeOptions = {}
): Promise<void> => {
    const defaultOptions = {
        width: 256,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#FFFFFF"
        },
        ...options
    };

    try {
        await QRCode.toCanvas(canvas, text, defaultOptions);
    } catch (error) {
        console.error("Error generating QR code canvas:", error);
        throw new Error("Failed to generate QR code canvas");
    }
};

/**
 * Download QR code as image file
 */
export const downloadQRCode = async (
    text: string,
    filename: string = "qr-code",
    options: QRCodeOptions = {}
): Promise<void> => {
    try {
        const dataUrl = await generateQRCode(text, options);

        // Create download link
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${filename}.png`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error downloading QR code:", error);
        throw new Error("Failed to download QR code");
    }
};

/**
 * Copy QR code to clipboard
 */
export const copyQRCodeToClipboard = async (
    text: string,
    options: QRCodeOptions = {}
): Promise<void> => {
    try {
        const dataUrl = await generateQRCode(text, options);

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
        ]);
    } catch (error) {
        console.error("Error copying QR code to clipboard:", error);
        throw new Error("Failed to copy QR code to clipboard");
    }
};

/**
 * Get short URL from key
 */
export const getShortUrl = (key: string, baseUrl: string = ""): string => {
    return `${baseUrl}${key}`;
};
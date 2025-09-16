import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

/**
 * Get country code from IP address
 */
export function getCountryFromIP(ip: string): string | null {
    try {
        const geo = geoip.lookup(ip);
        return geo?.country || null;
    } catch (error) {
        console.error("Error getting country from IP:", error);
        return null;
    }
}

/**
 * Get device/OS type from user agent string
 */
export function getDeviceFromUserAgent(userAgent: string): string | null {
    try {
        const parser = new UAParser(userAgent);
        const os = parser.getOS();

        if (!os.name) return null;

        // Map OS names to our device types
        const osName = os.name.toLowerCase();

        if (osName.includes("windows")) return "windows";
        if (osName.includes("mac") || osName.includes("os x")) return "macos";
        if (osName.includes("linux")) return "linux";
        if (osName.includes("android")) return "android";
        if (osName.includes("ios")) return "ios";

        return null;
    } catch (error) {
        console.error("Error getting device from user agent:", error);
        return null;
    }
}

/**
 * Get client IP address from Next.js request headers
 */
export function getClientIP(headers: Headers): string {
    // Check various headers that might contain the real IP
    const forwardedFor = headers.get("x-forwarded-for");
    const realIP = headers.get("x-real-ip");
    const connectingIP = headers.get("cf-connecting-ip"); // Cloudflare

    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, get the first one
        return forwardedFor.split(",")[0].trim();
    }

    if (realIP) {
        return realIP.trim();
    }

    if (connectingIP) {
        return connectingIP.trim();
    }

    // Fallback to localhost for development
    return "127.0.0.1";
}

/**
 * Find the appropriate redirect URL based on targeting rules
 */
export function findTargetedURL(
    defaultUrl: string,
    geoTargeting?: Record<string, string> | null,
    deviceTargeting?: Record<string, string> | null,
    countryCode?: string | null,
    deviceType?: string | null
): string {
    // Check geo targeting first
    if (geoTargeting && countryCode && geoTargeting[countryCode]) {
        return geoTargeting[countryCode];
    }

    // Then check device targeting
    if (deviceTargeting && deviceType && deviceTargeting[deviceType]) {
        return deviceTargeting[deviceType];
    }

    // Fall back to default URL
    return defaultUrl;
}
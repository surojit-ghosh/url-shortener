import { notFound, redirect } from "next/navigation";
import { getLinkByKey } from "@/lib/utils/key";
import {
    getClientIP,
    getCountryFromIP,
    getDeviceFromUserAgent,
    findTargetedURL,
} from "@/lib/utils/targeting";
import Link from "next/link";
import PasswordVerification from "@/components/password-verification";
import { headers } from "next/headers";

interface PageProps {
    params: Promise<{
        key: string;
    }>;
}

export default async function RedirectPage({ params }: PageProps) {
    const { key } = await params;

    if (!key) {
        notFound();
    }

    let result;

    try {
        result = await getLinkByKey(key);
    } catch (error) {
        console.error("Error fetching link:", error);
        notFound();
    }

    if (!result) {
        notFound();
    }

    if (result.expired) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold text-red-600">Link Expired</h1>
                    <p className="mb-4 text-gray-600">
                        This short link has expired and is no longer available.
                    </p>
                    <Link href="/" className="text-blue-600 underline hover:text-blue-800">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    if (!result.link) {
        notFound();
    }

    // Check if the link is password protected
    if (result.link.password) {
        return <PasswordVerification linkKey={key} />;
    }

    // Get targeting information
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const clientIP = getClientIP(headersList);

    // Determine country and device
    const countryCode = getCountryFromIP(clientIP);
    const deviceType = getDeviceFromUserAgent(userAgent);

    // Find the appropriate URL based on targeting rules
    const targetUrl = findTargetedURL(
        result.link.url,
        result.link.geoTargeting as Record<string, string> | null,
        result.link.deviceTargeting as Record<string, string> | null,
        countryCode,
        deviceType
    );

    // Log for debugging (remove in production)
    console.log("Targeting info:", {
        ip: clientIP,
        country: countryCode,
        device: deviceType,
        targetUrl,
        geoRules: result.link.geoTargeting,
        deviceRules: result.link.deviceTargeting,
    });

    // Redirect to the targeted URL
    redirect(targetUrl);
}

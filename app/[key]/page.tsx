import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import Link from "next/link";

import { getLinkByKey } from "@/lib/utils/key";
import {
    getClientIP,
    getCountryFromIP,
    getDeviceFromUserAgent,
    findTargetedURL,
} from "@/lib/utils/targeting";
import { trackClickAction } from "@/lib/actions/analytics.action";
import PasswordVerification from "@/components/password-verification";

interface PageProps {
    params: Promise<{ key: string }>;
}

interface LinkMetadata {
    title?: string;
    description?: string;
    image?: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params;

    if (!key) {
        return {
            title: "Link Not Found",
            description: "The requested short link could not be found.",
        };
    }

    try {
        const result = await getLinkByKey(key);

        if (!result?.link) {
            return {
                title: "Link Not Found",
                description: "The requested short link could not be found.",
            };
        }

        const metadata = result.link.metadata as LinkMetadata | null;
        const title = metadata?.title || `Redirecting to ${new URL(result.link.url).hostname}`;
        const description =
            metadata?.description || `This link will redirect you to ${result.link.url}`;
        const metadataObj: Metadata = {
            title,
            description,
            openGraph: {
                title,
                description,
                url: `${process.env.NEXT_PUBLIC_APP_URL || "https://snippy.surojit.in"}/${key}`,
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
            },
        };

        if (metadata?.image) {
            metadataObj.openGraph!.images = [{ url: metadata.image }];
            metadataObj.twitter!.images = [metadata.image];
        }

        return metadataObj;
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Link Error",
            description: "There was an error processing this link.",
        };
    }
}

export default async function RedirectPage({ params }: PageProps) {
    const { key } = await params;

    if (!key) notFound();

    let result;
    try {
        result = await getLinkByKey(key);
    } catch (error) {
        console.error("Error fetching link:", error);
        notFound();
    }

    if (!result) notFound();

    if (result.expired) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-10 w-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="mb-4 text-3xl font-bold text-gray-900">Link Expired</h1>
                    <p className="mb-6 text-gray-600">
                        This short link has expired and is no longer available.
                    </p>
                    <p className="mb-6 text-sm text-gray-500">
                        The link owner set an expiration date that has now passed.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    if (!result.link) notFound();

    if (result.link.password) {
        return <PasswordVerification linkKey={key} />;
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "";
    const clientIP = getClientIP(headersList);

    const countryCode = await getCountryFromIP(clientIP);
    const deviceType = getDeviceFromUserAgent(userAgent);

    const targetUrl = findTargetedURL(
        result.link.url,
        result.link.geoTargeting as Record<string, string> | null,
        result.link.deviceTargeting as Record<string, string> | null,
        countryCode,
        deviceType
    );

    // Track analytics using server action (no blocking, runs in background)
    trackClickAction({
        linkKey: key,
        targetUrl,
        clientIP,
        userAgent,
        countryCode: countryCode || undefined,
        deviceType: deviceType || undefined,
        referer,
    }).catch((error) => {
        console.error("Analytics tracking failed:", error);
    });

    redirect(targetUrl);
}

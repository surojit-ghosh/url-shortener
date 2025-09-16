import { notFound, redirect } from "next/navigation";
import { getLinkByKey } from "@/lib/utils/key";
import Link from "next/link";

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

    // Log the URL for debugging
    console.log("Redirecting to:", result.link.url);

    // Redirect happens outside try-catch since it throws NEXT_REDIRECT intentionally
    redirect(result.link.url);
}

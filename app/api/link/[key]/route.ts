import { NextRequest, NextResponse } from "next/server";
import { getLinkByKey } from "@/lib/utils/key";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;

        if (!key) {
            return NextResponse.json(
                { message: "Key is required" },
                { status: 400 }
            );
        }

        const result = await getLinkByKey(key);

        if (!result) {
            return NextResponse.json(
                { message: "Link not found" },
                { status: 404 }
            );
        }

        if (result.expired) {
            return NextResponse.json(
                { message: "Link has expired" },
                { status: 410 } // 410 Gone - resource no longer available
            );
        }

        if (!result.link) {
            return NextResponse.json(
                { message: "Link not found" },
                { status: 404 }
            );
        }

        // Return the URL for redirection
        return NextResponse.json({
            url: result.link.url,
            key: result.link.key,
            expiresAt: result.link.expiresAt
        });

    } catch (error) {
        console.error("Error fetching link:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
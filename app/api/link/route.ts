import { prisma } from "@/lib/prisma";
import { linkFormSchema } from "@/lib/zod/link.schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { checkIfKeyExist } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    try {
        const body = await request.json();
        const data = linkFormSchema.parse(body);
        const isExist = await checkIfKeyExist(data.key);

        if (isExist) {
            return NextResponse.json(
                {
                    fieldErrors: {
                        key: ["This slug is already taken."],
                    },
                },
                { status: 400 }
            );
        }

        // Prepare the data for database insertion
        const linkData: {
            key: string;
            url: string;
            userId: string;
            password?: string;
            geoTargeting?: Record<string, string>;
            deviceTargeting?: Record<string, string>;
            metadata?: Record<string, string>;
            expiresAt?: Date;
        } = {
            key: data.key,
            url: data.url,
            userId: session?.user.id as string,
        };

        // Hash password if provided
        if (data.password && data.password.trim() !== "") {
            const saltRounds = 12;
            linkData.password = await bcrypt.hash(data.password, saltRounds);
        }

        // Add targeting rules if provided
        if (data.geoTargeting && Object.keys(data.geoTargeting).length > 0) {
            linkData.geoTargeting = data.geoTargeting;
        }

        if (data.deviceTargeting && Object.keys(data.deviceTargeting).length > 0) {
            linkData.deviceTargeting = data.deviceTargeting;
        }

        // Add metadata if provided
        if (data.metadata && (data.metadata.title || data.metadata.description || data.metadata.image)) {
            linkData.metadata = data.metadata as Record<string, string>;
        }

        // Add expiresAt if provided
        if (data.expiresAt) {
            linkData.expiresAt = new Date(data.expiresAt);
        }

        const newLink = await prisma.link.create({ data: linkData });

        return NextResponse.json(newLink, { status: 201 });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                {
                    fieldErrors: err.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }
        console.error("Error creating link:", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const userId = session?.user?.id;
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = {
        userId,
        ...(search && {
            OR: [
                { key: { contains: search, mode: "insensitive" as const } },
                { url: { contains: search, mode: "insensitive" as const } }
            ]
        })
    };

    try {
        // Get total count for pagination
        const totalCount = await prisma.link.count({
            where: whereClause
        });

        // Get paginated links
        const links = await prisma.link.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip: skip,
            take: limit,
            select: {
                id: true,
                key: true,
                url: true,
                createdAt: true,
                expiresAt: true,
                password: true, // Include to check if password exists
                geoTargeting: true,
                deviceTargeting: true,
                metadata: true,
                _count: {
                    select: {
                        clicks: true
                    }
                }
            }
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            data: links,
            page: page,
            total: totalCount,
            totalPages: totalPages
        });
    } catch (error) {
        console.error("Error fetching links:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Link ID is required" },
                { status: 400 }
            );
        }

        // Verify the link belongs to the user
        const existingLink = await prisma.link.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!existingLink) {
            return NextResponse.json(
                { message: "Link not found or unauthorized" },
                { status: 404 }
            );
        }

        // Prepare update data
        const linkUpdateData: {
            password?: string | null;
            geoTargeting?: Record<string, string>;
            deviceTargeting?: Record<string, string>;
            metadata?: Record<string, string>;
            expiresAt?: Date | null;
        } = {};

        // Only update allowed fields (not url or key)
        if (updateData.password !== undefined) {
            if (updateData.password && updateData.password.trim() !== "") {
                const saltRounds = 12;
                linkUpdateData.password = await bcrypt.hash(updateData.password, saltRounds);
            } else {
                linkUpdateData.password = null;
            }
        }

        if (updateData.geoTargeting !== undefined) {
            linkUpdateData.geoTargeting = updateData.geoTargeting;
        }

        if (updateData.deviceTargeting !== undefined) {
            linkUpdateData.deviceTargeting = updateData.deviceTargeting;
        }

        if (updateData.metadata !== undefined) {
            linkUpdateData.metadata = updateData.metadata;
        }

        if (updateData.expiresAt !== undefined) {
            linkUpdateData.expiresAt = updateData.expiresAt ? new Date(updateData.expiresAt) : null;
        }

        const updatedLink = await prisma.link.update({
            where: { id: id },
            data: linkUpdateData
        });

        return NextResponse.json(updatedLink, { status: 200 });
    } catch (err) {
        console.error("Error updating link:", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Link ID is required" },
                { status: 400 }
            );
        }

        // Verify the link belongs to the user
        const existingLink = await prisma.link.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!existingLink) {
            return NextResponse.json(
                { message: "Link not found or unauthorized" },
                { status: 404 }
            );
        }

        await prisma.link.delete({
            where: { id: id }
        });

        return NextResponse.json(
            { message: "Link deleted successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error deleting link:", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
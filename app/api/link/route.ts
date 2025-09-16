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
    console.log("Search Params:", searchParams);

    const links = await prisma.link.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            key: true,
            url: true,
            createdAt: true,
            expiresAt: true,
            password: true, // Include to check if password exists
            geoTargeting: true,
            deviceTargeting: true,
        }
    });

    return NextResponse.json({ data: links });
}
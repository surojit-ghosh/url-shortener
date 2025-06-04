import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/zod/link.schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { checkIfKeyExist } from "@/lib/utils";

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    try {
        const body = await request.json();
        const data = linkSchema.parse(body);
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
        const newLink = await prisma.link.create({ data: { key: data.key, url: data.url, userId: session?.user.id as string } });

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
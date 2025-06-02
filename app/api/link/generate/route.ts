import { getRandomKey } from "@/lib/utils/link/get-random-key";
import { NextResponse } from "next/server";

export async function GET() {
    const key = await getRandomKey();

    return NextResponse.json({ key: key });
};
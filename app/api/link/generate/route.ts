import { getRandomKey } from "@/lib/helpers/link/get-random-key";
import { NextResponse } from "next/server";

export async function GET() {
    const key = await getRandomKey();

    return NextResponse.json({ KEY: key });
};
"use server";

import { getRandomKey } from "@/lib/utils";

export const genereateRandomKey = async (): Promise<string> => {
    return await getRandomKey();
};
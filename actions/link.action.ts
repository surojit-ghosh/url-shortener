"use server";

import { checkIfKeyExist, getRandomKey } from "@/lib/utils";

export const genereateRandomKey = async (): Promise<string> => {
    return await getRandomKey();
};

export const checkIfKeyExists = async (key: string): Promise<boolean> => {
    return await checkIfKeyExist(key);
};
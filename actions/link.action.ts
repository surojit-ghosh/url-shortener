"use server";

import { checkIfKeyExist, getRandomKey } from "@/lib/utils";

export const genereateRandomKey = async (): Promise<string> => {
    return await getRandomKey();
};

export const checkIfKeyExists = async (key: string): Promise<boolean> => {
    return await checkIfKeyExist(key);
};

export const getDefaultValues = async () => {
    const key = await getRandomKey();
    return {
        url: "",
        key: key,
    };
};
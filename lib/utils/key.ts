import { customAlphabet } from "nanoid";
import { prisma } from "../prisma";

export const nanoid = (length?: number) => {
    return customAlphabet(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        length || 7,
    )();
};

export const checkIfKeyExist = async (key: string): Promise<boolean> => {
    const existing = await prisma.link.findUnique({
        where: { key: key },
        select: { id: true }
    });

    return Boolean(existing);
};

export const getRandomKey = async (): Promise<string> => {
    const key = nanoid();

    const exists = await checkIfKeyExist(key);

    if (exists) {
        return getRandomKey();
    } else {
        return key;
    };
};
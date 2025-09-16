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

export const getLinkByKey = async (key: string) => {
    const link = await prisma.link.findUnique({
        where: { key: key },
        select: {
            id: true,
            url: true,
            password: true,
            expiresAt: true
        }
    });

    if (!link) {
        return null;
    }

    // Check if link is expired
    if (link.expiresAt && new Date() > link.expiresAt) {
        return { expired: true, link: null };
    }

    return { expired: false, link };
};

export const isLinkExpired = (expiresAt: Date | null): boolean => {
    if (!expiresAt) return false;
    return new Date() > expiresAt;
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
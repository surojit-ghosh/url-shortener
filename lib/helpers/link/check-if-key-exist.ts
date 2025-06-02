import { prisma } from "@/lib/prisma";

export const checkIfKeyExist = async (key: string): Promise<boolean> => {
    const existing = await prisma.link.findUnique({
        where: { key: key },
        select: { id: true }
    });

    return Boolean(existing);
};

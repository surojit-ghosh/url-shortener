import { nanoid } from "./nanoid";
import { checkIfKeyExist } from "./check-if-key-exist";

export async function getRandomKey(): Promise<string> {
    const key = nanoid();

    const exists = await checkIfKeyExist(key);

    if (exists) {
        return getRandomKey();
    } else {
        return key;
    };
};
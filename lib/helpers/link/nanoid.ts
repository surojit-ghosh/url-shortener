import { customAlphabet } from "nanoid";

export const nanoid = (length?: number) => {
    return customAlphabet(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        length || 7,
    )();
};
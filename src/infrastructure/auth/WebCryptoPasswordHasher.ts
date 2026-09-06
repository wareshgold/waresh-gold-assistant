import type { PasswordHasher } from "../../domain/auth/providers/PasswordHasher";

const ITERATIONS = 120_000;
const KEY_LENGTH = 256;
const HASH_ALGORITHM = "SHA-256";

const toBase64 = (bytes: Uint8Array): string => {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
    const binary = atob(value);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const derive = async (password: string, salt: Uint8Array): Promise<ArrayBuffer> => {
    const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    return crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: ITERATIONS, hash: HASH_ALGORITHM },
        material,
        KEY_LENGTH,
    );
};

const equal = (left: Uint8Array, right: Uint8Array): boolean => {
    if (left.length !== right.length) return false;
    let diff = 0;
    for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
    return diff === 0;
};

export class WebCryptoPasswordHasher implements PasswordHasher {
    async hash(password: string): Promise<{ hash: string; salt: string }> {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const derived = new Uint8Array(await derive(password, salt));
        return { hash: toBase64(derived), salt: toBase64(salt) };
    }

    async verify(password: string, hash: string, salt: string): Promise<boolean> {
        try {
            const derived = new Uint8Array(await derive(password, fromBase64(salt)));
            return equal(derived, fromBase64(hash));
        } catch {
            return false;
        }
    }
}

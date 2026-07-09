import crypto from "crypto";
import bcrypt from "bcrypt";
const ALGORITHM = "aes-256-cbc";
// Kunci enkripsi harus berukuran tepat 32 byte untuk AES-256.
// Jika tidak disediakan di env, gunakan default fallback aman sepanjang 32 karakter.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "j4kw1rs3cur3k3yforap12026spkmch!";
const IV_LENGTH = 16; // Block size untuk AES adalah 16 byte
/**
 * Melakukan hashing password satu arah dengan bcrypt.
 */
export async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}
/**
 * Melakukan komparasi password dengan hash tersimpan.
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
/**
 * Mengenkripsi teks biasa menjadi ciphertext heksadesimal dengan format iv:ciphertext.
 */
export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}
/**
 * Mendekripsi format iv:ciphertext kembali menjadi teks biasa.
 */
export function decrypt(encryptedData) {
    try {
        const parts = encryptedData.split(":");
        if (parts.length !== 2) {
            throw new Error("Format data terenkripsi tidak valid.");
        }
        const iv = Buffer.from(parts[0], "hex");
        const encryptedText = Buffer.from(parts[1], "hex");
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString("utf8");
    }
    catch (error) {
        console.error("Gagal mendekripsi data:", error);
        return "DECRYPTION_ERROR";
    }
}
//# sourceMappingURL=security.js.map
/**
 * Melakukan hashing password satu arah dengan bcrypt.
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Melakukan komparasi password dengan hash tersimpan.
 */
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
/**
 * Mengenkripsi teks biasa menjadi ciphertext heksadesimal dengan format iv:ciphertext.
 */
export declare function encrypt(text: string): string;
/**
 * Mendekripsi format iv:ciphertext kembali menjadi teks biasa.
 */
export declare function decrypt(encryptedData: string): string;
//# sourceMappingURL=security.d.ts.map
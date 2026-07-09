export interface TokenPayload {
    id: number;
    email: string;
    role: "SUPER ADMIN" | "ADMIN" | "DEBITUR";
    idKreditur?: number | null;
}
/**
 * Men-generate Access Token JWT berdasarkan payload user.
 */
export declare function generateToken(payload: TokenPayload): string;
/**
 * Memverifikasi token JWT secara langsung dan mengembalikan payload.
 */
export declare function verifyJwtToken(token: string): TokenPayload;
//# sourceMappingURL=jwt.d.ts.map
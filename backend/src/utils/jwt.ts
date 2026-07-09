import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jakwir_jwt_secret_key_2026_super_secure";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export interface TokenPayload {
  id: number;
  email: string;
  role: "SUPER ADMIN" | "ADMIN" | "DEBITUR";
  idKreditur?: number | null;
}

/**
 * Men-generate Access Token JWT berdasarkan payload user.
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

/**
 * Memverifikasi token JWT secara langsung dan mengembalikan payload.
 */
export function verifyJwtToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

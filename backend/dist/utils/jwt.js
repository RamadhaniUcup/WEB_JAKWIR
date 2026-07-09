import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "jakwir_jwt_secret_key_2026_super_secure";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
/**
 * Men-generate Access Token JWT berdasarkan payload user.
 */
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
/**
 * Memverifikasi token JWT secara langsung dan mengembalikan payload.
 */
export function verifyJwtToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map
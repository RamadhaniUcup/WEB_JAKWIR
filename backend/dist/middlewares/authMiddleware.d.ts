import { Request, Response, NextFunction } from "express";
import { type TokenPayload } from "../utils/jwt.js";
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}
/**
 * Middleware untuk memverifikasi token JWT dari header Authorization.
 */
export declare function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
/**
 * Middleware untuk otorisasi akses berdasarkan daftar Role yang diizinkan.
 */
export declare function authorizeRoles(...allowedRoles: ("SUPER ADMIN" | "ADMIN" | "DEBITUR")[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map
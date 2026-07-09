import { Request, Response, NextFunction } from "express";
import { verifyJwtToken, type TokenPayload } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware untuk memverifikasi token JWT dari header Authorization.
 */
export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Akses ditolak. Token tidak disediakan atau tidak valid." });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Akses ditolak. Token tidak valid." });
    return;
  }

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid atau telah kedaluwarsa." });
  }
}

/**
 * Middleware untuk otorisasi akses berdasarkan daftar Role yang diizinkan.
 */
export function authorizeRoles(...allowedRoles: ("SUPER ADMIN" | "ADMIN" | "DEBITUR")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized. Pengguna belum terautentikasi." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden. Anda tidak memiliki akses untuk tindakan ini." });
      return;
    }

    next();
  };
}

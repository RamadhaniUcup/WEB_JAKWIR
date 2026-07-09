import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * Mendapatkan semua Kriteria
 */
export declare function getAllKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Mendapatkan Kriteria berdasarkan ID
 */
export declare function getKriteriaById(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Membuat Kriteria baru (Hanya untuk Admin / Super Admin)
 */
export declare function createKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Memperbarui Kriteria
 */
export declare function updateKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Menghapus Kriteria (Cascade delete terpicu di database/Prisma)
 */
export declare function deleteKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=kriteriaController.d.ts.map
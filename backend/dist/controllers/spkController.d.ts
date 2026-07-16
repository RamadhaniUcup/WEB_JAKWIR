import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * Memicu perhitungan SPK untuk satu pengajuan
 */
export declare function getProfileMatchingScore(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Memicu perhitungan SPK secara massal (Bulk)
 */
export declare function calculateBulkSpk(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Mendapatkan laporan komparasi 4 metode SPK
 */
export declare function getLaporanSpk(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=spkController.d.ts.map
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * Memicu perhitungan Profile Matching kelayakan kredit untuk satu pengajuan
 */
export declare function getProfileMatchingScore(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Memicu perhitungan Profile Matching kelayakan kredit secara massal (Bulk)
 */
export declare function calculateBulkSpk(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=spkController.d.ts.map
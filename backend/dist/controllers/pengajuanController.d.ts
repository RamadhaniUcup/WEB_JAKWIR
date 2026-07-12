import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * 1. Submit Pengajuan Kredit (Nasabah)
 */
export declare function createPengajuan(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 2. Get Pengajuan Khusus Admin (Penyedia Jasa)
 */
export declare function getPengajuanForAdmin(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 3. Input Survey Lapangan (Pilihan Dropdown)
 */
export declare function inputSurvey(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 4. Approval Status Pengajuan Manual (Admin)
 */
export declare function updatePengajuanStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 5. History Pengajuan Kredit (Nasabah)
 */
export declare function getNasabahHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=pengajuanController.d.ts.map
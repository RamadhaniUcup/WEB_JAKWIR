import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * Mendapatkan profil debitur yang sedang login
 */
export declare function getDebiturProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Memperbarui profil debitur (termasuk enkripsi NIK dan Alamat)
 */
export declare function updateDebiturProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=debiturController.d.ts.map
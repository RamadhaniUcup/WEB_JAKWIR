import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * Mendapatkan profil nasabah yang sedang login
 */
export declare function getNasabahProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * Memperbarui profil nasabah (termasuk enkripsi NIK dan Alamat)
 */
export declare function updateNasabahProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=nasabahController.d.ts.map
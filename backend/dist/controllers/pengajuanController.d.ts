import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
/**
 * 3. Submit Pengajuan Kredit (Debitur)
 * Mengajukan permohonan kredit baru ke Kreditur tertentu.
 */
export declare function createPengajuan(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 4. Get Pengajuan Khusus Admin (Kreditur)
 * Mengembalikan daftar berkas masuk yang diajukan ke Kreditur (Instansi) Admin saat ini.
 */
export declare function getPengajuanForAdmin(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 5 & 6 & 7 & 8 & 9. Input Survey Lapangan & Otomatisasi Kalkulasi SPK (Admin)
 */
export declare function inputSurveyAndCalculate(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 10. Approval Status Pengajuan (Admin)
 * Mengubah status pengajuan menjadi DITERIMA atau DITOLAK.
 */
export declare function updatePengajuanStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
/**
 * 11 & 12. History Pengajuan Kredit (Debitur)
 * Mengembalikan riwayat pengajuan pribadi debitur bersangkutan.
 */
export declare function getDebiturHistory(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=pengajuanController.d.ts.map
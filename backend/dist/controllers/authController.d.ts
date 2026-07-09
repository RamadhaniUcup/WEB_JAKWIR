import { Request, Response } from "express";
/**
 * Registrasi untuk Debitur (Borrower/Nasabah)
 * Menerapkan bcrypt hashing pada password dan enkripsi AES-256-CBC pada NIK & Alamat.
 */
export declare function registerDebitur(req: Request, res: Response): Promise<void>;
/**
 * Registrasi untuk User Admin / Super Admin (Mitra Kreditur)
 * Menerapkan bcrypt hashing pada password.
 */
export declare function registerUser(req: Request, res: Response): Promise<void>;
/**
 * Login untuk Admin / Super Admin (Mitra Kreditur)
 */
export declare function loginUser(req: Request, res: Response): Promise<void>;
/**
 * Login untuk Debitur (Borrower/Nasabah)
 */
export declare function loginDebitur(req: Request, res: Response): Promise<void>;
/**
 * Mengambil daftar seluruh kreditur aktif (untuk pilihan di form registrasi/pengajuan)
 */
export declare function getPublicKrediturList(req: any, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map
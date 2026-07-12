import { Request, Response } from "express";
/**
 * Registrasi untuk Nasabah (Borrower)
 * Menerapkan bcrypt hashing pada password dan enkripsi AES-256-CBC pada NIK & Alamat.
 */
export declare function registerNasabah(req: Request, res: Response): Promise<void>;
/**
 * Registrasi untuk User Admin / Super Admin (Mitra Penyedia Jasa)
 * Menerapkan bcrypt hashing pada password.
 */
export declare function registerUser(req: Request, res: Response): Promise<void>;
/**
 * Login untuk Admin / Super Admin (Mitra Penyedia Jasa)
 */
export declare function loginUser(req: Request, res: Response): Promise<void>;
/**
 * Login untuk Nasabah (Borrower)
 */
export declare function loginNasabah(req: Request, res: Response): Promise<void>;
/**
 * Mengambil daftar seluruh penyedia jasa aktif
 */
export declare function getPublicPenyediaJasaList(req: any, res: Response): Promise<void>;
/**
 * Mengambil detail satu penyedia jasa berdasarkan ID
 */
export declare function getPublicPenyediaJasaDetails(req: any, res: Response): Promise<void>;
/**
 * Mengambil statistik agregat publik
 */
export declare function getPublicStats(req: any, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map
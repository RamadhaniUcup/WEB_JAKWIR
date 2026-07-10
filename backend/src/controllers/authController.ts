import { Request, Response } from "express";
import { prisma } from "../db.js";
import { hashPassword, comparePassword, encrypt, decrypt } from "../utils/security.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Registrasi untuk Debitur (Borrower/Nasabah)
 * Menerapkan bcrypt hashing pada password dan enkripsi AES-256-CBC pada NIK & Alamat.
 */
export async function registerDebitur(req: Request, res: Response): Promise<void> {
  try {
    const { namaDebitur, nik, telepon, alamat, password, email } = req.body;

    if (!namaDebitur || !nik || !telepon || !alamat || !password || !email) {
      res.status(400).json({ message: "Semua data registrasi debitur harus diisi." });
      return;
    }

    const existingDebitur = await prisma.debitur.findUnique({ where: { email } });
    if (existingDebitur) {
      res.status(400).json({ message: "Email sudah terdaftar." });
      return;
    }

    // 1. Hash password dengan bcrypt
    const hashedPassword = await hashPassword(password);

    // 2. Enkripsi data sensitif (NIK & Alamat) menggunakan AES-256-CBC
    const encryptedNik = encrypt(nik);
    const encryptedAlamat = encrypt(alamat);

    // 3. Simpan ke database
    const debitur = await prisma.debitur.create({
      data: {
        namaDebitur,
        nik: encryptedNik,
        telepon,
        alamat: encryptedAlamat,
        password: hashedPassword,
        email,
      },
    });

    res.status(201).json({
      message: "Debitur berhasil diregistrasikan.",
      data: {
        idDebitur: debitur.idDebitur,
        namaDebitur: debitur.namaDebitur,
        email: debitur.email,
        // NIK dan Alamat disimpan terenkripsi di DB, kirim yang aman/terekstrasi jika diperlukan
      },
    });
  } catch (error) {
    console.error("Error registrasi debitur:", error);
    res.status(500).json({ message: "Terjadi kesalahan internal server." });
  }
}

/**
 * Registrasi untuk User Admin / Super Admin (Mitra Kreditur)
 * Menerapkan bcrypt hashing pada password.
 */
export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, email, role, idKreditur } = req.body;

    if (!username || !password || !email || !role) {
      res.status(400).json({ message: "Username, password, email, dan role wajib diisi." });
      return;
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email sudah terdaftar." });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: role === "SUPER ADMIN" ? "SUPER_ADMIN" : "ADMIN",
        idKreditur: idKreditur ? Number(idKreditur) : null,
      },
    });

    res.status(201).json({
      message: "User admin berhasil diregistrasikan.",
      data: {
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        role: user.role,
        idKreditur: user.idKreditur,
      },
    });
  } catch (error) {
    console.error("Error registrasi user:", error);
    res.status(500).json({ message: "Terjadi kesalahan internal server." });
  }
}

/**
 * Login untuk Admin / Super Admin (Mitra Kreditur)
 */
export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email dan password wajib diisi." });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { email },
      include: { kreditur: true },
    });

    if (!user) {
      res.status(401).json({ message: "Kredensial tidak valid (Email tidak ditemukan)." });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Kredensial tidak valid (Kata sandi salah)." });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user.idUser,
      email: user.email,
      role: user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN",
      idKreditur: user.idKreditur,
    });

    res.status(200).json({
      message: "Login admin berhasil.",
      token,
      user: {
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        role: user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN",
        kreditur: user.kreditur ? user.kreditur.namaPerusahaan : "Global Admin",
      },
    });
  } catch (error) {
    console.error("Error login user:", error);
    res.status(500).json({ message: "Terjadi kesalahan internal server." });
  }
}

/**
 * Login untuk Debitur (Borrower/Nasabah)
 */
export async function loginDebitur(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email dan password wajib diisi." });
      return;
    }

    const debitur = await prisma.debitur.findUnique({ where: { email } });
    if (!debitur) {
      res.status(401).json({ message: "Kredensial tidak valid." });
      return;
    }

    const isMatch = await comparePassword(password, debitur.password);
    if (!isMatch) {
      res.status(401).json({ message: "Kredensial tidak valid." });
      return;
    }

    // Dekripsi data NIK dan Alamat untuk dikirimkan kembali (Opsional, mendemonstrasikan dekripsi)
    const decryptedNik = decrypt(debitur.nik);
    const decryptedAlamat = decrypt(debitur.alamat);

    const token = generateToken({
      id: debitur.idDebitur,
      email: debitur.email,
      role: "DEBITUR",
      idKreditur: null,
    });

    res.status(200).json({
      message: "Login debitur berhasil.",
      token,
      debitur: {
        idDebitur: debitur.idDebitur,
        namaDebitur: debitur.namaDebitur,
        email: debitur.email,
        telepon: debitur.telepon,
        nik: decryptedNik, // Terkirim setelah didekripsi dengan aman
        alamat: decryptedAlamat, // Terkirim setelah didekripsi dengan aman
      },
    });
  } catch (error) {
    console.error("Error login debitur:", error);
    res.status(500).json({ message: "Terjadi kesalahan internal server." });
  }
}

/**
 * Mengambil daftar seluruh kreditur aktif (untuk pilihan di form registrasi/pengajuan)
 */
export async function getPublicKrediturList(req: any, res: Response): Promise<void> {
  try {
    const list = await prisma.kreditur.findMany({
      where: { statusAktif: "AKTIF" }
    });
    res.status(200).json({ data: list });
  } catch (error) {
    console.error("Error get public kreditur list:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil daftar lembaga kreditur." });
  }
}

/**
 * Mengambil detail satu kreditur berdasarkan ID (untuk mengambil batas limit & tenor)
 */
export async function getPublicKrediturDetails(req: any, res: Response): Promise<void> {
  try {
    const idKreditur = Number(req.params.id);
    const kreditur = await prisma.kreditur.findUnique({
      where: { idKreditur }
    });

    if (!kreditur) {
      res.status(404).json({ message: "Kreditur tidak ditemukan." });
      return;
    }

    res.status(200).json({ data: kreditur });
  } catch (error) {
    console.error("Error get public kreditur details:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail lembaga kreditur." });
  }
}

/**
 * Mengambil statistik agregat publik (untuk counter di landing page)
 */
export async function getPublicStats(req: any, res: Response): Promise<void> {
  try {
    const totalKreditur = await prisma.kreditur.count({
      where: { statusAktif: "AKTIF" }
    });

    const totalDebitur = await prisma.debitur.count();

    const aggregateDana = await prisma.pengajuan.aggregate({
      where: { statusPeminjaman: "DITERIMA" },
      _sum: {
        jumlahKredit: true
      }
    });

    const sumDana = Number(aggregateDana._sum.jumlahKredit || 0);

    res.status(200).json({
      data: {
        totalKreditur,
        totalDebitur,
        totalDanaDisalurkan: sumDana
      }
    });
  } catch (error) {
    console.error("Error get public stats:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil statistik." });
  }
}

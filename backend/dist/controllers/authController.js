import { prisma } from "../db.js";
import { hashPassword, comparePassword, encrypt, decrypt } from "../utils/security.js";
import { generateToken } from "../utils/jwt.js";
/**
 * Registrasi untuk Nasabah (Borrower)
 * Menerapkan bcrypt hashing pada password dan enkripsi AES-256-CBC pada NIK & Alamat.
 */
export async function registerNasabah(req, res) {
    try {
        const { namaNasabah, nik, telepon, alamat, password, email } = req.body;
        if (!namaNasabah || !nik || !telepon || !alamat || !password || !email) {
            res.status(400).json({ message: "Semua data registrasi nasabah harus diisi." });
            return;
        }
        const existingNasabah = await prisma.nasabah.findUnique({ where: { email } });
        if (existingNasabah) {
            res.status(400).json({ message: "Email sudah terdaftar." });
            return;
        }
        // 1. Hash password dengan bcrypt
        const hashedPassword = await hashPassword(password);
        // 2. Enkripsi data sensitif (NIK & Alamat) menggunakan AES-256-CBC
        const encryptedNik = encrypt(nik);
        const encryptedAlamat = encrypt(alamat);
        // 3. Simpan ke database
        const nasabah = await prisma.nasabah.create({
            data: {
                namaNasabah,
                nik: encryptedNik,
                telepon,
                alamat: encryptedAlamat,
                password: hashedPassword,
                email,
            },
        });
        res.status(201).json({
            message: "Nasabah berhasil diregistrasikan.",
            data: {
                idNasabah: nasabah.idNasabah,
                namaNasabah: nasabah.namaNasabah,
                email: nasabah.email,
            },
        });
    }
    catch (error) {
        console.error("Error registrasi nasabah:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}
/**
 * Registrasi untuk User Admin / Super Admin (Mitra Penyedia Jasa)
 * Menerapkan bcrypt hashing pada password.
 */
export async function registerUser(req, res) {
    try {
        const { username, password, email, role, idPenyediaJasa } = req.body;
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
                idPenyediaJasa: idPenyediaJasa ? Number(idPenyediaJasa) : null,
            },
        });
        res.status(201).json({
            message: "User admin berhasil diregistrasikan.",
            data: {
                idUser: user.idUser,
                username: user.username,
                email: user.email,
                role: user.role,
                idPenyediaJasa: user.idPenyediaJasa,
            },
        });
    }
    catch (error) {
        console.error("Error registrasi user:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}
/**
 * Login untuk Admin / Super Admin (Mitra Penyedia Jasa)
 */
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email dan password wajib diisi." });
            return;
        }
        const user = await prisma.users.findUnique({
            where: { email },
            include: { penyediaJasa: true },
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
            idPenyediaJasa: user.idPenyediaJasa,
        });
        res.status(200).json({
            message: "Login admin berhasil.",
            token,
            user: {
                idUser: user.idUser,
                username: user.username,
                email: user.email,
                role: user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN",
                penyediaJasa: user.penyediaJasa ? user.penyediaJasa.namaPenyediaJasa : "Global Admin",
            },
        });
    }
    catch (error) {
        console.error("Error login user:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}
/**
 * Login untuk Nasabah (Borrower)
 */
export async function loginNasabah(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email dan password wajib diisi." });
            return;
        }
        const nasabah = await prisma.nasabah.findUnique({ where: { email } });
        if (!nasabah) {
            res.status(401).json({ message: "Kredensial tidak valid." });
            return;
        }
        const isMatch = await comparePassword(password, nasabah.password);
        if (!isMatch) {
            res.status(401).json({ message: "Kredensial tidak valid." });
            return;
        }
        // Dekripsi data NIK dan Alamat untuk dikirimkan kembali
        const decryptedNik = decrypt(nasabah.nik);
        const decryptedAlamat = decrypt(nasabah.alamat);
        const token = generateToken({
            id: nasabah.idNasabah,
            email: nasabah.email,
            role: "NASABAH",
            idPenyediaJasa: null,
        });
        res.status(200).json({
            message: "Login nasabah berhasil.",
            token,
            nasabah: {
                idNasabah: nasabah.idNasabah,
                namaNasabah: nasabah.namaNasabah,
                email: nasabah.email,
                telepon: nasabah.telepon,
                nik: decryptedNik,
                alamat: decryptedAlamat,
            },
        });
    }
    catch (error) {
        console.error("Error login nasabah:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal server." });
    }
}
/**
 * Mengambil daftar seluruh penyedia jasa aktif
 */
export async function getPublicPenyediaJasaList(req, res) {
    try {
        const list = await prisma.penyediaJasa.findMany({
            where: { statusAktif: "AKTIF" }
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        console.error("Error get public penyedia jasa list:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil daftar penyedia jasa." });
    }
}
/**
 * Mengambil detail satu penyedia jasa berdasarkan ID
 */
export async function getPublicPenyediaJasaDetails(req, res) {
    try {
        const idPenyediaJasa = Number(req.params.id);
        const pj = await prisma.penyediaJasa.findUnique({
            where: { idPenyediaJasa }
        });
        if (!pj) {
            res.status(404).json({ message: "Penyedia jasa tidak ditemukan." });
            return;
        }
        res.status(200).json({ data: pj });
    }
    catch (error) {
        console.error("Error get public penyedia jasa details:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail penyedia jasa." });
    }
}
/**
 * Mengambil statistik agregat publik
 */
export async function getPublicStats(req, res) {
    try {
        const totalPenyediaJasa = await prisma.penyediaJasa.count({
            where: { statusAktif: "AKTIF" }
        });
        const totalNasabah = await prisma.nasabah.count();
        const aggregateDana = await prisma.pengajuan.aggregate({
            where: { statusPeminjaman: "DITERIMA" },
            _sum: {
                jumlahKredit: true
            }
        });
        const sumDana = Number(aggregateDana._sum.jumlahKredit || 0);
        res.status(200).json({
            data: {
                totalKreditur: totalPenyediaJasa,
                totalDebitur: totalNasabah,
                totalDanaDisalurkan: sumDana
            }
        });
    }
    catch (error) {
        console.error("Error get public stats:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil statistik." });
    }
}
//# sourceMappingURL=authController.js.map
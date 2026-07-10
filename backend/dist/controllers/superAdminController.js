import { prisma } from "../db.js";
import { hashPassword, encrypt, decrypt } from "../utils/security.js";
// ==========================================
// 1. CRUD DATA KREDITUR
// ==========================================
export async function getKrediturs(req, res) {
    try {
        const list = await prisma.kreditur.findMany({
            orderBy: { idKreditur: "desc" },
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        console.error("SuperAdmin: Error get krediturs:", error);
        res.status(500).json({ message: "Gagal mengambil data kreditur." });
    }
}
export async function createKreditur(req, res) {
    try {
        const { namaPerusahaan, alamat, statusAktif, limitPengajuan, limitTenor } = req.body;
        if (!namaPerusahaan || !alamat) {
            res.status(400).json({ message: "Nama perusahaan dan alamat wajib diisi." });
            return;
        }
        const newKreditur = await prisma.kreditur.create({
            data: {
                namaPerusahaan,
                alamat,
                statusAktif: statusAktif || "AKTIF",
                limitPengajuan: limitPengajuan !== undefined ? Number(limitPengajuan) : 0,
                limitTenor: limitTenor !== undefined ? Number(limitTenor) : 12,
            },
        });
        res.status(201).json({ message: "Kreditur berhasil dibuat.", data: newKreditur });
    }
    catch (error) {
        console.error("SuperAdmin: Error create kreditur:", error);
        res.status(500).json({ message: "Gagal membuat data kreditur." });
    }
}
export async function updateKreditur(req, res) {
    try {
        const idKreditur = Number(req.params.id);
        const { namaPerusahaan, alamat, statusAktif, limitPengajuan, limitTenor } = req.body;
        const exists = await prisma.kreditur.findUnique({ where: { idKreditur } });
        if (!exists) {
            res.status(404).json({ message: "Kreditur tidak ditemukan." });
            return;
        }
        const dataUpdate = {};
        if (namaPerusahaan !== undefined)
            dataUpdate.namaPerusahaan = namaPerusahaan;
        if (alamat !== undefined)
            dataUpdate.alamat = alamat;
        if (statusAktif !== undefined)
            dataUpdate.statusAktif = statusAktif;
        if (limitPengajuan !== undefined)
            dataUpdate.limitPengajuan = Number(limitPengajuan);
        if (limitTenor !== undefined)
            dataUpdate.limitTenor = Number(limitTenor);
        const updated = await prisma.kreditur.update({
            where: { idKreditur },
            data: dataUpdate,
        });
        res.status(200).json({ message: "Kreditur berhasil diperbarui.", data: updated });
    }
    catch (error) {
        console.error("SuperAdmin: Error update kreditur:", error);
        res.status(500).json({ message: "Gagal memperbarui data kreditur." });
    }
}
export async function deleteKreditur(req, res) {
    try {
        const idKreditur = Number(req.params.id);
        const exists = await prisma.kreditur.findUnique({ where: { idKreditur } });
        if (!exists) {
            res.status(404).json({ message: "Kreditur tidak ditemukan." });
            return;
        }
        await prisma.kreditur.delete({ where: { idKreditur } });
        res.status(200).json({ message: "Kreditur berhasil dihapus." });
    }
    catch (error) {
        console.error("SuperAdmin: Error delete kreditur:", error);
        res.status(500).json({ message: "Gagal menghapus data kreditur." });
    }
}
// ==========================================
// 2. CRUD DATA USER ADMIN KREDITUR
// ==========================================
export async function getUsers(req, res) {
    try {
        const list = await prisma.users.findMany({
            include: { kreditur: true },
            orderBy: { idUser: "desc" },
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        console.error("SuperAdmin: Error get users:", error);
        res.status(500).json({ message: "Gagal mengambil data user." });
    }
}
export async function createUser(req, res) {
    try {
        const { username, password, email, role, idKreditur } = req.body;
        if (!username || !password || !email || !role) {
            res.status(400).json({ message: "Data pendaftaran user tidak lengkap." });
            return;
        }
        const exists = await prisma.users.findUnique({ where: { email } });
        if (exists) {
            res.status(400).json({ message: "Email user sudah terdaftar." });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role,
                idKreditur: idKreditur ? Number(idKreditur) : null,
            },
        });
        res.status(201).json({ message: "User admin berhasil dibuat.", data: newUser });
    }
    catch (error) {
        console.error("SuperAdmin: Error create user:", error);
        res.status(500).json({ message: "Gagal membuat data user." });
    }
}
export async function updateUser(req, res) {
    try {
        const idUser = Number(req.params.id);
        const { username, password, email, role, idKreditur } = req.body;
        const exists = await prisma.users.findUnique({ where: { idUser } });
        if (!exists) {
            res.status(404).json({ message: "User tidak ditemukan." });
            return;
        }
        const dataUpdate = {};
        if (username !== undefined)
            dataUpdate.username = username;
        if (email !== undefined)
            dataUpdate.email = email;
        if (role !== undefined)
            dataUpdate.role = role;
        if (idKreditur !== undefined)
            dataUpdate.idKreditur = idKreditur ? Number(idKreditur) : null;
        if (password) {
            dataUpdate.password = await hashPassword(password);
        }
        const updated = await prisma.users.update({
            where: { idUser },
            data: dataUpdate,
        });
        res.status(200).json({ message: "User berhasil diperbarui.", data: updated });
    }
    catch (error) {
        console.error("SuperAdmin: Error update user:", error);
        res.status(500).json({ message: "Gagal memperbarui data user." });
    }
}
export async function deleteUser(req, res) {
    try {
        const idUser = Number(req.params.id);
        const exists = await prisma.users.findUnique({ where: { idUser } });
        if (!exists) {
            res.status(404).json({ message: "User tidak ditemukan." });
            return;
        }
        await prisma.users.delete({ where: { idUser } });
        res.status(200).json({ message: "User berhasil dihapus." });
    }
    catch (error) {
        console.error("SuperAdmin: Error delete user:", error);
        res.status(500).json({ message: "Gagal menghapus data user." });
    }
}
// ==========================================
// 3. CRUD DATA DEBITUR
// ==========================================
export async function getDebiturs(req, res) {
    try {
        const list = await prisma.debitur.findMany({
            orderBy: { idDebitur: "desc" },
        });
        // Dekripsi data sensitif (NIK & Alamat)
        const formatted = list.map((d) => ({
            idDebitur: d.idDebitur,
            namaDebitur: d.namaDebitur,
            email: d.email,
            telepon: d.telepon,
            nik: decrypt(d.nik),
            alamat: decrypt(d.alamat),
        }));
        res.status(200).json({ data: formatted });
    }
    catch (error) {
        console.error("SuperAdmin: Error get debiturs:", error);
        res.status(500).json({ message: "Gagal mengambil data debitur." });
    }
}
export async function createDebitur(req, res) {
    try {
        const { namaDebitur, email, telepon, nik, alamat, password } = req.body;
        if (!namaDebitur || !email || !telepon || !nik || !alamat || !password) {
            res.status(400).json({ message: "Data registrasi debitur tidak lengkap." });
            return;
        }
        const exists = await prisma.debitur.findUnique({ where: { email } });
        if (exists) {
            res.status(400).json({ message: "Email debitur sudah terdaftar." });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const encryptedNik = encrypt(nik);
        const encryptedAlamat = encrypt(alamat);
        const newDebitur = await prisma.debitur.create({
            data: {
                namaDebitur,
                email,
                telepon,
                nik: encryptedNik,
                alamat: encryptedAlamat,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            message: "Debitur berhasil dibuat.",
            data: {
                idDebitur: newDebitur.idDebitur,
                namaDebitur: newDebitur.namaDebitur,
                email: newDebitur.email,
                telepon: newDebitur.telepon,
            },
        });
    }
    catch (error) {
        console.error("SuperAdmin: Error create debitur:", error);
        res.status(500).json({ message: "Gagal membuat data debitur." });
    }
}
export async function updateDebitur(req, res) {
    try {
        const idDebitur = Number(req.params.id);
        const { namaDebitur, email, telepon, nik, alamat, password } = req.body;
        const exists = await prisma.debitur.findUnique({ where: { idDebitur } });
        if (!exists) {
            res.status(404).json({ message: "Debitur tidak ditemukan." });
            return;
        }
        const dataUpdate = {};
        if (namaDebitur !== undefined)
            dataUpdate.namaDebitur = namaDebitur;
        if (email !== undefined)
            dataUpdate.email = email;
        if (telepon !== undefined)
            dataUpdate.telepon = telepon;
        if (nik !== undefined)
            dataUpdate.nik = encrypt(nik);
        if (alamat !== undefined)
            dataUpdate.alamat = encrypt(alamat);
        if (password) {
            dataUpdate.password = await hashPassword(password);
        }
        const updated = await prisma.debitur.update({
            where: { idDebitur },
            data: dataUpdate,
        });
        res.status(200).json({
            message: "Debitur berhasil diperbarui.",
            data: {
                idDebitur: updated.idDebitur,
                namaDebitur: updated.namaDebitur,
                email: updated.email,
            },
        });
    }
    catch (error) {
        console.error("SuperAdmin: Error update debitur:", error);
        res.status(500).json({ message: "Gagal memperbarui data debitur." });
    }
}
export async function deleteDebitur(req, res) {
    try {
        const idDebitur = Number(req.params.id);
        const exists = await prisma.debitur.findUnique({ where: { idDebitur } });
        if (!exists) {
            res.status(404).json({ message: "Debitur tidak ditemukan." });
            return;
        }
        await prisma.debitur.delete({ where: { idDebitur } });
        res.status(200).json({ message: "Debitur berhasil dihapus." });
    }
    catch (error) {
        console.error("SuperAdmin: Error delete debitur:", error);
        res.status(500).json({ message: "Gagal menghapus data debitur." });
    }
}
//# sourceMappingURL=superAdminController.js.map
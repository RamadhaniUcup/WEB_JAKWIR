import { prisma } from "../db.js";
import { hashPassword, encrypt, decrypt } from "../utils/security.js";
// ==========================================
// 1. CRUD DATA PENYEDIA JASA
// ==========================================
export async function getPenyediaJasas(req, res) {
    try {
        const list = await prisma.penyediaJasa.findMany({
            orderBy: { idPenyediaJasa: "desc" },
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        console.error("SuperAdmin: Error get penyedia jasas:", error);
        res.status(500).json({ message: "Gagal mengambil data penyedia jasa." });
    }
}
export async function createPenyediaJasa(req, res) {
    try {
        const { namaPenyediaJasa, alamat, statusAktif, limitPengajuan, limitTenor, persentaseCf, persentaseSf } = req.body;
        if (!namaPenyediaJasa || !alamat) {
            res.status(400).json({ message: "Nama penyedia jasa dan alamat wajib diisi." });
            return;
        }
        const newPj = await prisma.penyediaJasa.create({
            data: {
                namaPenyediaJasa,
                alamat,
                statusAktif: statusAktif || "AKTIF",
                limitPengajuan: limitPengajuan !== undefined ? Number(limitPengajuan) : 0,
                limitTenor: limitTenor !== undefined ? Number(limitTenor) : 12,
                persentaseCf: persentaseCf !== undefined ? Number(persentaseCf) : 60,
                persentaseSf: persentaseSf !== undefined ? Number(persentaseSf) : 40,
            },
        });
        res.status(201).json({ message: "Penyedia jasa berhasil dibuat.", data: newPj });
    }
    catch (error) {
        console.error("SuperAdmin: Error create penyedia jasa:", error);
        res.status(500).json({ message: "Gagal membuat data penyedia jasa." });
    }
}
export async function updatePenyediaJasa(req, res) {
    try {
        const idPenyediaJasa = Number(req.params.id);
        const { namaPenyediaJasa, alamat, statusAktif, limitPengajuan, limitTenor, persentaseCf, persentaseSf } = req.body;
        const exists = await prisma.penyediaJasa.findUnique({ where: { idPenyediaJasa } });
        if (!exists) {
            res.status(404).json({ message: "Penyedia jasa tidak ditemukan." });
            return;
        }
        const dataUpdate = {};
        if (namaPenyediaJasa !== undefined)
            dataUpdate.namaPenyediaJasa = namaPenyediaJasa;
        if (alamat !== undefined)
            dataUpdate.alamat = alamat;
        if (statusAktif !== undefined)
            dataUpdate.statusAktif = statusAktif;
        if (limitPengajuan !== undefined)
            dataUpdate.limitPengajuan = Number(limitPengajuan);
        if (limitTenor !== undefined)
            dataUpdate.limitTenor = Number(limitTenor);
        if (persentaseCf !== undefined)
            dataUpdate.persentaseCf = Number(persentaseCf);
        if (persentaseSf !== undefined)
            dataUpdate.persentaseSf = Number(persentaseSf);
        const updated = await prisma.penyediaJasa.update({
            where: { idPenyediaJasa },
            data: dataUpdate,
        });
        res.status(200).json({ message: "Penyedia jasa berhasil diperbarui.", data: updated });
    }
    catch (error) {
        console.error("SuperAdmin: Error update penyedia jasa:", error);
        res.status(500).json({ message: "Gagal memperbarui data penyedia jasa." });
    }
}
export async function deletePenyediaJasa(req, res) {
    try {
        const idPenyediaJasa = Number(req.params.id);
        const exists = await prisma.penyediaJasa.findUnique({ where: { idPenyediaJasa } });
        if (!exists) {
            res.status(404).json({ message: "Penyedia jasa tidak ditemukan." });
            return;
        }
        await prisma.penyediaJasa.delete({ where: { idPenyediaJasa } });
        res.status(200).json({ message: "Penyedia jasa berhasil dihapus." });
    }
    catch (error) {
        console.error("SuperAdmin: Error delete penyedia jasa:", error);
        res.status(500).json({ message: "Gagal menghapus data penyedia jasa." });
    }
}
// ==========================================
// 2. CRUD DATA USER ADMIN PENYEDIA JASA
// ==========================================
export async function getUsers(req, res) {
    try {
        const list = await prisma.users.findMany({
            include: { penyediaJasa: true },
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
        const { username, password, email, role, idPenyediaJasa } = req.body;
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
                idPenyediaJasa: idPenyediaJasa ? Number(idPenyediaJasa) : null,
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
        const { username, password, email, role, idPenyediaJasa } = req.body;
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
        if (idPenyediaJasa !== undefined)
            dataUpdate.idPenyediaJasa = idPenyediaJasa ? Number(idPenyediaJasa) : null;
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
// 3. CRUD DATA NASABAH
// ==========================================
export async function getNasabahs(req, res) {
    try {
        const list = await prisma.nasabah.findMany({
            orderBy: { idNasabah: "desc" },
        });
        // Dekripsi data sensitif (NIK & Alamat)
        const formatted = list.map((d) => ({
            idNasabah: d.idNasabah,
            namaNasabah: d.namaNasabah,
            email: d.email,
            telepon: d.telepon,
            nik: decrypt(d.nik),
            alamat: decrypt(d.alamat),
        }));
        res.status(200).json({ data: formatted });
    }
    catch (error) {
        console.error("SuperAdmin: Error get nasabahs:", error);
        res.status(500).json({ message: "Gagal mengambil data nasabah." });
    }
}
export async function createNasabah(req, res) {
    try {
        const { namaNasabah, email, telepon, nik, alamat, password } = req.body;
        if (!namaNasabah || !email || !telepon || !nik || !alamat || !password) {
            res.status(400).json({ message: "Data registrasi nasabah tidak lengkap." });
            return;
        }
        const exists = await prisma.nasabah.findUnique({ where: { email } });
        if (exists) {
            res.status(400).json({ message: "Email nasabah sudah terdaftar." });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const encryptedNik = encrypt(nik);
        const encryptedAlamat = encrypt(alamat);
        const newNasabah = await prisma.nasabah.create({
            data: {
                namaNasabah,
                email,
                telepon,
                nik: encryptedNik,
                alamat: encryptedAlamat,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            message: "Nasabah berhasil dibuat.",
            data: {
                idNasabah: newNasabah.idNasabah,
                namaNasabah: newNasabah.namaNasabah,
                email: newNasabah.email,
                telepon: newNasabah.telepon,
            },
        });
    }
    catch (error) {
        console.error("SuperAdmin: Error create nasabah:", error);
        res.status(500).json({ message: "Gagal membuat data nasabah." });
    }
}
export async function updateNasabah(req, res) {
    try {
        const idNasabah = Number(req.params.id);
        const { namaNasabah, email, telepon, nik, alamat, password } = req.body;
        const exists = await prisma.nasabah.findUnique({ where: { idNasabah } });
        if (!exists) {
            res.status(404).json({ message: "Nasabah tidak ditemukan." });
            return;
        }
        const dataUpdate = {};
        if (namaNasabah !== undefined)
            dataUpdate.namaNasabah = namaNasabah;
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
        const updated = await prisma.nasabah.update({
            where: { idNasabah },
            data: dataUpdate,
        });
        res.status(200).json({
            message: "Nasabah berhasil diperbarui.",
            data: {
                idNasabah: updated.idNasabah,
                namaNasabah: updated.namaNasabah,
                email: updated.email,
            },
        });
    }
    catch (error) {
        console.error("SuperAdmin: Error update nasabah:", error);
        res.status(500).json({ message: "Gagal memperbarui data nasabah." });
    }
}
export async function deleteNasabah(req, res) {
    try {
        const idNasabah = Number(req.params.id);
        const exists = await prisma.nasabah.findUnique({ where: { idNasabah } });
        if (!exists) {
            res.status(404).json({ message: "Nasabah tidak ditemukan." });
            return;
        }
        await prisma.nasabah.delete({ where: { idNasabah } });
        res.status(200).json({ message: "Nasabah berhasil dihapus." });
    }
    catch (error) {
        console.error("SuperAdmin: Error delete nasabah:", error);
        res.status(500).json({ message: "Gagal menghapus data nasabah." });
    }
}
//# sourceMappingURL=superAdminController.js.map
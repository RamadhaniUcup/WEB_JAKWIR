import { prisma } from "../db.js";
// ==========================================
// 1. UPDATE KREDITUR PROFILE & LIMITS
// ==========================================
export async function updateKrediturProfile(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden. Hanya admin kreditur yang dapat mengupdate profil lembaga." });
            return;
        }
        const { namaPerusahaan, alamat, limitPengajuan, limitTenor } = req.body;
        const dataUpdate = {};
        if (namaPerusahaan !== undefined)
            dataUpdate.namaPerusahaan = namaPerusahaan;
        if (alamat !== undefined)
            dataUpdate.alamat = alamat;
        if (limitPengajuan !== undefined)
            dataUpdate.limitPengajuan = Number(limitPengajuan);
        if (limitTenor !== undefined)
            dataUpdate.limitTenor = Number(limitTenor);
        const updated = await prisma.kreditur.update({
            where: { idKreditur: idKreditur },
            data: dataUpdate,
        });
        res.status(200).json({ message: "Profil lembaga pembiayaan berhasil diperbarui.", data: updated });
    }
    catch (error) {
        console.error("KrediturSetting: Error update profile:", error);
        res.status(500).json({ message: "Gagal memperbarui profil lembaga pembiayaan." });
    }
}
export async function getMyKrediturProfile(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden. Hanya admin kreditur." });
            return;
        }
        const profile = await prisma.kreditur.findUnique({
            where: { idKreditur: idKreditur },
        });
        res.status(200).json({ data: profile });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memuat profil lembaga." });
    }
}
// ==========================================
// 2. CRUD ASPEK (FILTER BY OWN ID_KREDITUR)
// ==========================================
export async function getAspeks(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const list = await prisma.aspek.findMany({
            where: { idKreditur: idKreditur },
            orderBy: { idAspek: "asc" },
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memuat aspek." });
    }
}
export async function createAspek(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const { namaAspek, persentaseCf, persentaseSf, bobotAspek } = req.body;
        const newAspek = await prisma.aspek.create({
            data: {
                idKreditur: idKreditur,
                namaAspek,
                persentaseCf: Number(persentaseCf),
                persentaseSf: Number(persentaseSf),
                bobotAspek: Number(bobotAspek),
            },
        });
        res.status(201).json({ message: "Aspek berhasil dibuat.", data: newAspek });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal membuat aspek." });
    }
}
export async function updateAspek(req, res) {
    try {
        const idAspek = Number(req.params.id);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const exists = await prisma.aspek.findFirst({
            where: { idAspek, idKreditur: idKreditur }
        });
        if (!exists) {
            res.status(404).json({ message: "Aspek tidak ditemukan." });
            return;
        }
        const { namaAspek, persentaseCf, persentaseSf, bobotAspek } = req.body;
        const dataUpdate = {};
        if (namaAspek !== undefined)
            dataUpdate.namaAspek = namaAspek;
        if (persentaseCf !== undefined)
            dataUpdate.persentaseCf = Number(persentaseCf);
        if (persentaseSf !== undefined)
            dataUpdate.persentaseSf = Number(persentaseSf);
        if (bobotAspek !== undefined)
            dataUpdate.bobotAspek = Number(bobotAspek);
        const updated = await prisma.aspek.update({
            where: { idAspek },
            data: dataUpdate,
        });
        res.status(200).json({ message: "Aspek berhasil diperbarui.", data: updated });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memperbarui aspek." });
    }
}
export async function deleteAspek(req, res) {
    try {
        const idAspek = Number(req.params.id);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const exists = await prisma.aspek.findFirst({
            where: { idAspek, idKreditur: idKreditur }
        });
        if (!exists) {
            res.status(404).json({ message: "Aspek tidak ditemukan." });
            return;
        }
        await prisma.aspek.delete({ where: { idAspek } });
        res.status(200).json({ message: "Aspek berhasil dihapus." });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal menghapus aspek." });
    }
}
// ==========================================
// 3. CRUD KRITERIA
// ==========================================
export async function getKriterias(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const list = await prisma.kriteria.findMany({
            where: {
                aspek: { idKreditur: idKreditur },
            },
            include: { aspek: true, subKriteria: true },
            orderBy: { idKriteria: "asc" },
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memuat kriteria." });
    }
}
export async function createKriteria(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const { idAspek, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor } = req.body;
        const aspek = await prisma.aspek.findFirst({
            where: { idAspek: Number(idAspek), idKreditur: idKreditur }
        });
        if (!aspek) {
            res.status(400).json({ message: "Aspek tidak valid atau tidak dimiliki oleh lembaga Anda." });
            return;
        }
        const newKriteria = await prisma.kriteria.create({
            data: {
                idAspek: Number(idAspek),
                kodeKriteria,
                namaKriteria,
                nilaiTarget: Number(nilaiTarget),
                jenisFaktor: jenisFaktor,
            },
        });
        res.status(201).json({ message: "Kriteria berhasil dibuat.", data: newKriteria });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal membuat kriteria." });
    }
}
export async function updateKriteria(req, res) {
    try {
        const idKriteria = Number(req.params.id);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const exists = await prisma.kriteria.findFirst({
            where: { idKriteria, aspek: { idKreditur: idKreditur } },
        });
        if (!exists) {
            res.status(404).json({ message: "Kriteria tidak ditemukan." });
            return;
        }
        const { kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor } = req.body;
        const dataUpdate = {};
        if (kodeKriteria !== undefined)
            dataUpdate.kodeKriteria = kodeKriteria;
        if (namaKriteria !== undefined)
            dataUpdate.namaKriteria = namaKriteria;
        if (nilaiTarget !== undefined)
            dataUpdate.nilaiTarget = Number(nilaiTarget);
        if (jenisFaktor !== undefined)
            dataUpdate.jenisFaktor = jenisFaktor;
        const updated = await prisma.kriteria.update({
            where: { idKriteria },
            data: dataUpdate,
        });
        res.status(200).json({ message: "Kriteria berhasil diperbarui.", data: updated });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memperbarui kriteria." });
    }
}
export async function deleteKriteria(req, res) {
    try {
        const idKriteria = Number(req.params.id);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const exists = await prisma.kriteria.findFirst({
            where: { idKriteria, aspek: { idKreditur: idKreditur } },
        });
        if (!exists) {
            res.status(404).json({ message: "Kriteria tidak ditemukan." });
            return;
        }
        await prisma.kriteria.delete({ where: { idKriteria } });
        res.status(200).json({ message: "Kriteria berhasil dihapus." });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal menghapus kriteria." });
    }
}
// ==========================================
// 4. CRUD SUB KRITERIA
// ==========================================
export async function getSubKriterias(req, res) {
    try {
        const idKriteria = Number(req.params.idKriteria);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const kriteria = await prisma.kriteria.findFirst({
            where: { idKriteria, aspek: { idKreditur: idKreditur } },
        });
        if (!kriteria) {
            res.status(404).json({ message: "Kriteria tidak ditemukan." });
            return;
        }
        const list = await prisma.subKriteria.findMany({
            where: { idKriteria },
            orderBy: { nilaiRating: "desc" },
        });
        res.status(200).json({ data: list });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memuat sub-kriteria." });
    }
}
export async function createSubKriteria(req, res) {
    try {
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const { idKriteria, deskripsi, nilaiRating } = req.body;
        const kriteria = await prisma.kriteria.findFirst({
            where: { idKriteria: Number(idKriteria), aspek: { idKreditur: idKreditur } },
        });
        if (!kriteria) {
            res.status(400).json({ message: "Kriteria tidak valid." });
            return;
        }
        const newSub = await prisma.subKriteria.create({
            data: {
                idKriteria: Number(idKriteria),
                deskripsi,
                nilaiRating: Number(nilaiRating),
            },
        });
        res.status(201).json({ message: "Sub-kriteria berhasil dibuat.", data: newSub });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal membuat sub-kriteria." });
    }
}
export async function updateSubKriteria(req, res) {
    try {
        const idSub = Number(req.params.id);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const exists = await prisma.subKriteria.findFirst({
            where: { idSub, kriteria: { aspek: { idKreditur: idKreditur } } },
        });
        if (!exists) {
            res.status(404).json({ message: "Sub-kriteria tidak ditemukan." });
            return;
        }
        const { deskripsi, nilaiRating } = req.body;
        const dataUpdate = {};
        if (deskripsi !== undefined)
            dataUpdate.deskripsi = deskripsi;
        if (nilaiRating !== undefined)
            dataUpdate.nilaiRating = Number(nilaiRating);
        const updated = await prisma.subKriteria.update({
            where: { idSub },
            data: dataUpdate,
        });
        res.status(200).json({ message: "Sub-kriteria berhasil diperbarui.", data: updated });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal memperbarui sub-kriteria." });
    }
}
export async function deleteSubKriteria(req, res) {
    try {
        const idSub = Number(req.params.id);
        const idKreditur = req.user?.idKreditur;
        if (!idKreditur) {
            res.status(403).json({ message: "Forbidden." });
            return;
        }
        const exists = await prisma.subKriteria.findFirst({
            where: { idSub, kriteria: { aspek: { idKreditur: idKreditur } } },
        });
        if (!exists) {
            res.status(404).json({ message: "Sub-kriteria tidak ditemukan." });
            return;
        }
        await prisma.subKriteria.delete({ where: { idSub } });
        res.status(200).json({ message: "Sub-kriteria berhasil dihapus." });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal menghapus sub-kriteria." });
    }
}
//# sourceMappingURL=krediturSettingController.js.map
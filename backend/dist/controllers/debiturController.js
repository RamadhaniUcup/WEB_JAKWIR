import { prisma } from "../db.js";
import { encrypt, decrypt } from "../utils/security.js";
/**
 * Mendapatkan profil debitur yang sedang login
 */
export async function getDebiturProfile(req, res) {
    try {
        const idDebitur = req.user?.id;
        if (!idDebitur) {
            res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
            return;
        }
        const debitur = await prisma.debitur.findUnique({
            where: { idDebitur },
        });
        if (!debitur) {
            res.status(404).json({ message: "Debitur tidak ditemukan." });
            return;
        }
        // Dekripsi data sensitif untuk dikembalikan
        const decryptedNik = decrypt(debitur.nik);
        const decryptedAlamat = decrypt(debitur.alamat);
        res.status(200).json({
            data: {
                idDebitur: debitur.idDebitur,
                namaDebitur: debitur.namaDebitur,
                email: debitur.email,
                telepon: debitur.telepon,
                nik: decryptedNik,
                alamat: decryptedAlamat,
            },
        });
    }
    catch (error) {
        console.error("Error get profil debitur:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data profil." });
    }
}
/**
 * Memperbarui profil debitur (termasuk enkripsi NIK dan Alamat)
 */
export async function updateDebiturProfile(req, res) {
    try {
        const idDebitur = req.user?.id;
        if (!idDebitur) {
            res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
            return;
        }
        const { namaDebitur, nik, telepon, alamat } = req.body;
        // Cari debitur lama
        const existingDebitur = await prisma.debitur.findUnique({ where: { idDebitur } });
        if (!existingDebitur) {
            res.status(404).json({ message: "Debitur tidak ditemukan." });
            return;
        }
        // Bangun data pembaruan
        const updateData = {};
        if (namaDebitur !== undefined)
            updateData.namaDebitur = namaDebitur;
        if (telepon !== undefined)
            updateData.telepon = telepon;
        // Enkripsi NIK & Alamat jika diubah
        if (nik !== undefined) {
            updateData.nik = encrypt(nik);
        }
        if (alamat !== undefined) {
            updateData.alamat = encrypt(alamat);
        }
        const updated = await prisma.debitur.update({
            where: { idDebitur },
            data: updateData,
        });
        res.status(200).json({
            message: "Profil debitur berhasil diperbarui.",
            data: {
                idDebitur: updated.idDebitur,
                namaDebitur: updated.namaDebitur,
                email: updated.email,
                telepon: updated.telepon,
                nik: nik !== undefined ? nik : decrypt(updated.nik),
                alamat: alamat !== undefined ? alamat : decrypt(updated.alamat),
            },
        });
    }
    catch (error) {
        console.error("Error update profil debitur:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui profil." });
    }
}
//# sourceMappingURL=debiturController.js.map
import { Response } from "express";
import { prisma } from "../db.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { encrypt, decrypt } from "../utils/security.js";

/**
 * Mendapatkan profil nasabah yang sedang login
 */
export async function getNasabahProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idNasabah = req.user?.id;
    if (!idNasabah) {
      res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
      return;
    }

    const nasabah = await prisma.nasabah.findUnique({
      where: { idNasabah },
    });

    if (!nasabah) {
      res.status(404).json({ message: "Nasabah tidak ditemukan." });
      return;
    }

    // Dekripsi data sensitif untuk dikembalikan
    const decryptedNik = decrypt(nasabah.nik);
    const decryptedAlamat = decrypt(nasabah.alamat);

    res.status(200).json({
      data: {
        idNasabah: nasabah.idNasabah,
        namaNasabah: nasabah.namaNasabah,
        email: nasabah.email,
        telepon: nasabah.telepon,
        nik: decryptedNik,
        alamat: decryptedAlamat,
      },
    });
  } catch (error) {
    console.error("Error get profil nasabah:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data profil." });
  }
}

/**
 * Memperbarui profil nasabah (termasuk enkripsi NIK dan Alamat)
 */
export async function updateNasabahProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idNasabah = req.user?.id;
    if (!idNasabah) {
      res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
      return;
    }

    const { namaNasabah, nik, telepon, alamat } = req.body;

    // Cari nasabah lama
    const existingNasabah = await prisma.nasabah.findUnique({ where: { idNasabah } });
    if (!existingNasabah) {
      res.status(404).json({ message: "Nasabah tidak ditemukan." });
      return;
    }

    // Bangun data pembaruan
    const updateData: any = {};
    if (namaNasabah !== undefined) updateData.namaNasabah = namaNasabah;
    if (telepon !== undefined) updateData.telepon = telepon;
    
    // Enkripsi NIK & Alamat jika diubah
    if (nik !== undefined) {
      updateData.nik = encrypt(nik);
    }
    if (alamat !== undefined) {
      updateData.alamat = encrypt(alamat);
    }

    const updated = await prisma.nasabah.update({
      where: { idNasabah },
      data: updateData,
    });

    res.status(200).json({
      message: "Profil nasabah berhasil diperbarui.",
      data: {
        idNasabah: updated.idNasabah,
        namaNasabah: updated.namaNasabah,
        email: updated.email,
        telepon: updated.telepon,
        nik: nik !== undefined ? nik : decrypt(updated.nik),
        alamat: alamat !== undefined ? alamat : decrypt(updated.alamat),
      },
    });
  } catch (error) {
    console.error("Error update profil nasabah:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui profil." });
  }
}

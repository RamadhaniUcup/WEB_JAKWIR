import { Response } from "express";
import { prisma } from "../db.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

/**
 * Mendapatkan semua Kriteria
 */
export async function getAllKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // Admin Mitra hanya bisa melihat kriteria dari Kreditur mereka sendiri
    // sedangkan Super Admin bisa melihat semuanya.
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    let kriteria;
    if (user.role === "SUPER ADMIN") {
      kriteria = await prisma.kriteria.findMany({
        include: { aspek: true },
      });
    } else {
      // Role ADMIN, filter berdasarkan idKreditur
      const whereClause = user.idKreditur 
        ? { aspek: { idKreditur: user.idKreditur } }
        : {};
      kriteria = await prisma.kriteria.findMany({
        where: whereClause,
        include: { aspek: true },
      });
    }

    res.status(200).json({ data: kriteria });
  } catch (error) {
    console.error("Error get kriteria:", error);
    res.status(500).json({ message: "Gagal memproses data kriteria." });
  }
}

/**
 * Mendapatkan Kriteria berdasarkan ID
 */
export async function getKriteriaById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const kriteria = await prisma.kriteria.findUnique({
      where: { idKriteria: id },
      include: { aspek: true, subKriteria: true },
    });

    if (!kriteria) {
      res.status(404).json({ message: "Kriteria tidak ditemukan." });
      return;
    }

    // Cek otorisasi data jika ADMIN (bukan SUPER ADMIN)
    if (req.user?.role === "ADMIN" && kriteria.aspek.idKreditur !== req.user.idKreditur) {
      res.status(403).json({ message: "Forbidden. Anda tidak memiliki akses ke kriteria instansi lain." });
      return;
    }

    res.status(200).json({ data: kriteria });
  } catch (error) {
    console.error("Error get kriteria by id:", error);
    res.status(500).json({ message: "Gagal memproses data kriteria." });
  }
}

/**
 * Membuat Kriteria baru (Hanya untuk Admin / Super Admin)
 */
export async function createKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { idAspek, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor } = req.body;

    if (!idAspek || !kodeKriteria || !namaKriteria || !nilaiTarget || !jenisFaktor) {
      res.status(400).json({ message: "Data kriteria tidak lengkap." });
      return;
    }

    // Verifikasi aspek yang dituju
    const aspek = await prisma.aspek.findUnique({ where: { idAspek: Number(idAspek) } });
    if (!aspek) {
      res.status(404).json({ message: "Aspek tujuan tidak ditemukan." });
      return;
    }

    // Jika ADMIN, pastikan aspek tersebut milik kreditur yang sama
    if (req.user?.role === "ADMIN" && aspek.idKreditur !== req.user.idKreditur) {
      res.status(403).json({ message: "Forbidden. Anda tidak dapat menambahkan kriteria pada aspek instansi lain." });
      return;
    }

    const newKriteria = await prisma.kriteria.create({
      data: {
        idAspek: Number(idAspek),
        kodeKriteria,
        namaKriteria,
        nilaiTarget: Number(nilaiTarget),
        jenisFaktor: jenisFaktor as "CORE" | "SECONDARY",
      },
    });

    res.status(201).json({ message: "Kriteria berhasil dibuat.", data: newKriteria });
  } catch (error) {
    console.error("Error create kriteria:", error);
    res.status(500).json({ message: "Gagal membuat kriteria baru." });
  }
}

/**
 * Memperbarui Kriteria
 */
export async function updateKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor } = req.body;

    const existingKriteria = await prisma.kriteria.findUnique({
      where: { idKriteria: id },
      include: { aspek: true },
    });

    if (!existingKriteria) {
      res.status(404).json({ message: "Kriteria tidak ditemukan." });
      return;
    }

    // Batasan otorisasi ADMIN
    if (req.user?.role === "ADMIN" && existingKriteria.aspek.idKreditur !== req.user.idKreditur) {
      res.status(403).json({ message: "Forbidden. Tidak memiliki akses mengubah data ini." });
      return;
    }

    const updateData: any = {};
    if (kodeKriteria !== undefined) updateData.kodeKriteria = kodeKriteria;
    if (namaKriteria !== undefined) updateData.namaKriteria = namaKriteria;
    if (nilaiTarget !== undefined) updateData.nilaiTarget = Number(nilaiTarget);
    if (jenisFaktor !== undefined) updateData.jenisFaktor = jenisFaktor as "CORE" | "SECONDARY";

    const updated = await prisma.kriteria.update({
      where: { idKriteria: id },
      data: updateData,
    });

    res.status(200).json({ message: "Kriteria berhasil diperbarui.", data: updated });
  } catch (error) {
    console.error("Error update kriteria:", error);
    res.status(500).json({ message: "Gagal memperbarui kriteria." });
  }
}

/**
 * Menghapus Kriteria (Cascade delete terpicu di database/Prisma)
 */
export async function deleteKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    const existingKriteria = await prisma.kriteria.findUnique({
      where: { idKriteria: id },
      include: { aspek: true },
    });

    if (!existingKriteria) {
      res.status(404).json({ message: "Kriteria tidak ditemukan." });
      return;
    }

    // Batasan otorisasi ADMIN
    if (req.user?.role === "ADMIN" && existingKriteria.aspek.idKreditur !== req.user.idKreditur) {
      res.status(403).json({ message: "Forbidden. Tidak memiliki akses menghapus data ini." });
      return;
    }

    await prisma.kriteria.delete({ where: { idKriteria: id } });

    res.status(200).json({ message: "Kriteria berhasil dihapus (termasuk sub-kriteria & penilaian terkait secara cascade)." });
  } catch (error) {
    console.error("Error delete kriteria:", error);
    res.status(500).json({ message: "Gagal menghapus kriteria." });
  }
}

import { Response } from "express";
import { prisma } from "../db.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

/**
 * Mendapatkan semua Kriteria (Mendukung filter idPenyediaJasa)
 */
export async function getAllKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    let kriteria;
    if (user.role === "SUPER ADMIN") {
      const { idPenyediaJasa } = req.query;
      const whereClause = idPenyediaJasa 
        ? { idPenyediaJasa: Number(idPenyediaJasa) }
        : {};
      kriteria = await prisma.kriteria.findMany({
        where: whereClause,
        include: { subKriteria: true },
      });
    } else {
      // Role ADMIN, filter berdasarkan idPenyediaJasa miliknya sendiri
      const whereClause = user.idPenyediaJasa 
        ? { idPenyediaJasa: user.idPenyediaJasa }
        : {};
      kriteria = await prisma.kriteria.findMany({
        where: whereClause,
        include: { subKriteria: true },
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
      include: { subKriteria: true },
    });

    if (!kriteria) {
      res.status(404).json({ message: "Kriteria tidak ditemukan." });
      return;
    }

    // Cek otorisasi data jika ADMIN (bukan SUPER ADMIN)
    if (req.user?.role === "ADMIN" && kriteria.idPenyediaJasa !== req.user.idPenyediaJasa) {
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
 * Membuat Kriteria baru (Hanya untuk Super Admin)
 */
export async function createKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin yang dapat membuat kriteria." });
      return;
    }

    const { idPenyediaJasa, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor, bobot, jenisAtribut } = req.body;

    if (!idPenyediaJasa || !kodeKriteria || !namaKriteria || !nilaiTarget || !jenisFaktor) {
      res.status(400).json({ message: "Data kriteria tidak lengkap." });
      return;
    }

    // Verifikasi penyedia jasa yang dituju
    const pj = await prisma.penyediaJasa.findUnique({ where: { idPenyediaJasa: Number(idPenyediaJasa) } });
    if (!pj) {
      res.status(404).json({ message: "Penyedia Jasa tujuan tidak ditemukan." });
      return;
    }

    const newKriteria = await prisma.kriteria.create({
      data: {
        idPenyediaJasa: Number(idPenyediaJasa),
        kodeKriteria,
        namaKriteria,
        nilaiTarget: Number(nilaiTarget),
        jenisFaktor: jenisFaktor as "CORE" | "SECONDARY",
        bobot: bobot !== undefined ? Number(bobot) : 0,
        jenisAtribut: (jenisAtribut as "BENEFIT" | "COST") || "BENEFIT",
      },
    });

    res.status(201).json({ message: "Kriteria berhasil dibuat.", data: newKriteria });
  } catch (error) {
    console.error("Error create kriteria:", error);
    res.status(500).json({ message: "Gagal membuat kriteria baru." });
  }
}

/**
 * Memperbarui Kriteria (Hanya untuk Super Admin)
 */
export async function updateKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin yang dapat merubah kriteria." });
      return;
    }

    const id = Number(req.params.id);
    const { kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor, bobot, jenisAtribut } = req.body;

    const existingKriteria = await prisma.kriteria.findUnique({
      where: { idKriteria: id },
    });

    if (!existingKriteria) {
      res.status(404).json({ message: "Kriteria tidak ditemukan." });
      return;
    }

    const updateData: any = {};
    if (kodeKriteria !== undefined) updateData.kodeKriteria = kodeKriteria;
    if (namaKriteria !== undefined) updateData.namaKriteria = namaKriteria;
    if (nilaiTarget !== undefined) updateData.nilaiTarget = Number(nilaiTarget);
    if (jenisFaktor !== undefined) updateData.jenisFaktor = jenisFaktor as "CORE" | "SECONDARY";
    if (bobot !== undefined) updateData.bobot = Number(bobot);
    if (jenisAtribut !== undefined) updateData.jenisAtribut = jenisAtribut as "BENEFIT" | "COST";

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
 * Menghapus Kriteria (Hanya untuk Super Admin)
 */
export async function deleteKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin yang dapat menghapus kriteria." });
      return;
    }

    const id = Number(req.params.id);

    const existingKriteria = await prisma.kriteria.findUnique({
      where: { idKriteria: id },
    });

    if (!existingKriteria) {
      res.status(404).json({ message: "Kriteria tidak ditemukan." });
      return;
    }

    await prisma.kriteria.delete({ where: { idKriteria: id } });

    res.status(200).json({ message: "Kriteria berhasil dihapus (termasuk sub-kriteria & penilaian terkait secara cascade)." });
  } catch (error) {
    console.error("Error delete kriteria:", error);
    res.status(500).json({ message: "Gagal menghapus kriteria." });
  }
}

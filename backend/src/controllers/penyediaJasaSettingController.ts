import { Response } from "express";
import { prisma } from "../db.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

// ==========================================
// 1. UPDATE PENYEDIA JASA PROFILE & LIMITS (ADMIN CAN UPDATE THEIR OWN PROFILE)
// ==========================================

export async function updatePenyediaJasaProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPenyediaJasa = req.user?.idPenyediaJasa;
    if (!idPenyediaJasa) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat mengupdate profil." });
      return;
    }

    const { namaPenyediaJasa, alamat, limitPengajuan, limitTenor, persentaseCf, persentaseSf } = req.body;

    const dataUpdate: any = {};
    if (namaPenyediaJasa !== undefined) dataUpdate.namaPenyediaJasa = namaPenyediaJasa;
    if (alamat !== undefined) dataUpdate.alamat = alamat;
    if (limitPengajuan !== undefined) dataUpdate.limitPengajuan = Number(limitPengajuan);
    if (limitTenor !== undefined) dataUpdate.limitTenor = Number(limitTenor);
    if (persentaseCf !== undefined) dataUpdate.persentaseCf = Number(persentaseCf);
    if (persentaseSf !== undefined) dataUpdate.persentaseSf = Number(persentaseSf);

    const updated = await prisma.penyediaJasa.update({
      where: { idPenyediaJasa: idPenyediaJasa as number },
      data: dataUpdate,
    });

    res.status(200).json({ message: "Profil penyedia jasa berhasil diperbarui.", data: updated });
  } catch (error) {
    console.error("PenyediaJasaSetting: Error update profile:", error);
    res.status(500).json({ message: "Gagal memperbarui profil penyedia jasa." });
  }
}

export async function getMyPenyediaJasaProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPenyediaJasa = req.user?.idPenyediaJasa;
    if (!idPenyediaJasa) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa." });
      return;
    }

    const profile = await prisma.penyediaJasa.findUnique({
      where: { idPenyediaJasa: idPenyediaJasa as number },
    });
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat profil penyedia jasa." });
  }
}

// ==========================================
// 2. CRUD KRITERIA (GET FOR BOTH, MUTATE ONLY SUPER ADMIN)
// ==========================================

export async function getKriterias(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    let list;
    if (user.role === "SUPER ADMIN") {
      const { idPenyediaJasa } = req.query;
      const whereClause = idPenyediaJasa ? { idPenyediaJasa: Number(idPenyediaJasa) } : {};
      list = await prisma.kriteria.findMany({
        where: whereClause,
        include: { subKriteria: true },
        orderBy: { idKriteria: "asc" },
      });
    } else {
      const idPenyediaJasa = user.idPenyediaJasa;
      list = await prisma.kriteria.findMany({
        where: { idPenyediaJasa: idPenyediaJasa as number },
        include: { subKriteria: true },
        orderBy: { idKriteria: "asc" },
      });
    }

    res.status(200).json({ data: list });
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat kriteria." });
  }
}

export async function createKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin." });
      return;
    }

    const { idPenyediaJasa, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor } = req.body;

    const newKriteria = await prisma.kriteria.create({
      data: {
        idPenyediaJasa: Number(idPenyediaJasa),
        kodeKriteria,
        namaKriteria,
        nilaiTarget: Number(nilaiTarget),
        jenisFaktor: jenisFaktor as any,
      },
    });

    res.status(201).json({ message: "Kriteria berhasil dibuat.", data: newKriteria });
  } catch (error) {
    console.error("Error create kriteria:", error);
    res.status(500).json({ message: "Gagal membuat kriteria." });
  }
}

export async function updateKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin." });
      return;
    }

    const idKriteria = Number(req.params.id);
    const { kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor } = req.body;
    const dataUpdate: any = {};
    if (kodeKriteria !== undefined) dataUpdate.kodeKriteria = kodeKriteria;
    if (namaKriteria !== undefined) dataUpdate.namaKriteria = namaKriteria;
    if (nilaiTarget !== undefined) dataUpdate.nilaiTarget = Number(nilaiTarget);
    if (jenisFaktor !== undefined) dataUpdate.jenisFaktor = jenisFaktor;

    const updated = await prisma.kriteria.update({
      where: { idKriteria },
      data: dataUpdate,
    });

    res.status(200).json({ message: "Kriteria berhasil diperbarui.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui kriteria." });
  }
}

export async function deleteKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin." });
      return;
    }

    const idKriteria = Number(req.params.id);
    await prisma.kriteria.delete({ where: { idKriteria } });
    res.status(200).json({ message: "Kriteria berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kriteria." });
  }
}

// ==========================================
// 3. CRUD SUB KRITERIA (GET FOR BOTH, MUTATE ONLY SUPER ADMIN)
// ==========================================

export async function getSubKriterias(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idKriteria = Number(req.params.idKriteria);
    const list = await prisma.subKriteria.findMany({
      where: { idKriteria },
      orderBy: { nilaiRating: "desc" },
    });

    res.status(200).json({ data: list });
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat sub-kriteria." });
  }
}

export async function createSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin." });
      return;
    }

    const { idKriteria, deskripsi, nilaiRating } = req.body;

    const newSub = await prisma.subKriteria.create({
      data: {
        idKriteria: Number(idKriteria),
        deskripsi,
        nilaiRating: Number(nilaiRating),
      },
    });

    res.status(201).json({ message: "Sub-kriteria berhasil dibuat.", data: newSub });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat sub-kriteria." });
  }
}

export async function updateSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin." });
      return;
    }

    const idSub = Number(req.params.id);
    const { deskripsi, nilaiRating } = req.body;
    const dataUpdate: any = {};
    if (deskripsi !== undefined) dataUpdate.deskripsi = deskripsi;
    if (nilaiRating !== undefined) dataUpdate.nilaiRating = Number(nilaiRating);

    const updated = await prisma.subKriteria.update({
      where: { idSub },
      data: dataUpdate,
    });

    res.status(200).json({ message: "Sub-kriteria berhasil diperbarui.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui sub-kriteria." });
  }
}

export async function deleteSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "SUPER ADMIN") {
      res.status(403).json({ message: "Forbidden. Hanya Super Admin." });
      return;
    }

    const idSub = Number(req.params.id);
    await prisma.subKriteria.delete({ where: { idSub } });
    res.status(200).json({ message: "Sub-kriteria berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus sub-kriteria." });
  }
}

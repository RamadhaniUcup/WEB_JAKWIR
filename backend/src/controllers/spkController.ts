import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { calculateProfileMatching } from "../services/profileMatchingService.js";
import { prisma } from "../db.js";

/**
 * Memicu perhitungan Profile Matching kelayakan kredit untuk satu pengajuan
 */
export async function getProfileMatchingScore(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPengajuan = Number(req.params.idPengajuan);
    const idPenyediaJasaAdmin = req.user?.idPenyediaJasa;

    if (isNaN(idPengajuan)) {
      res.status(400).json({ message: "ID Pengajuan tidak valid." });
      return;
    }

    if (!idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat menghitung SPK." });
      return;
    }

    const pengajuan = await prisma.pengajuan.findUnique({
      where: { idPengajuan }
    });

    if (!pengajuan) {
      res.status(404).json({ message: "Pengajuan tidak ditemukan." });
      return;
    }

    if (pengajuan.idPenyediaJasa !== idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Pengajuan milik instansi lain." });
      return;
    }

    const hasilSPK = await calculateProfileMatching(idPengajuan);
    
    res.status(200).json({
      message: "Perhitungan Profile Matching berhasil diselesaikan.",
      data: hasilSPK
    });
  } catch (error: any) {
    console.error("Error menghitung SPK:", error);
    res.status(500).json({ 
      message: error.message || "Gagal melakukan perhitungan kelayakan kredit." 
    });
  }
}

/**
 * Memicu perhitungan Profile Matching kelayakan kredit secara massal (Bulk)
 */
export async function calculateBulkSpk(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPenyediaJasaAdmin = req.user?.idPenyediaJasa;

    if (!idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat menghitung bulk SPK." });
      return;
    }

    // Ambil semua pengajuan yang statusnya MENUNGGU_SPK untuk Penyedia Jasa ini
    const pendingList = await prisma.pengajuan.findMany({
      where: {
        idPenyediaJasa: idPenyediaJasaAdmin,
        statusPeminjaman: "MENUNGGU_SPK"
      }
    });

    if (pendingList.length === 0) {
      res.status(400).json({ message: "Tidak ada data pengajuan berstatus MENUNGGU_SPK." });
      return;
    }

    const results = [];
    for (const p of pendingList) {
      const resSpk = await calculateProfileMatching(p.idPengajuan);
      results.push(resSpk);
    }

    res.status(200).json({
      message: `Berhasil memproses ${results.length} data pengajuan secara massal.`,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    console.error("Error menghitung bulk SPK:", error);
    res.status(500).json({ 
      message: error.message || "Gagal melakukan perhitungan massal." 
    });
  }
}

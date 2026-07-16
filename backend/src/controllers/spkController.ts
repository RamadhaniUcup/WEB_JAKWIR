import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { calculateSpkForPengajuan } from "../services/spkEngine.service.js";
import { prisma } from "../db.js";

/**
 * Normalisasi dan Rule Penerimaan
 */
async function processSpkDecision(idPengajuan: number, idPenyediaJasaAdmin: number) {
  const scores = await calculateSpkForPengajuan(idPengajuan);
  
  // Hanya Profile Matching yang menentukan nasib pengajuan
  const finalScore = scores.pmScore;

  let statusPeminjaman = "DIPROSES";
  let tingkatRisiko: any = "MENENGAH";

  if (finalScore >= 4.0) {
    statusPeminjaman = "DITERIMA";
    tingkatRisiko = "RENDAH";
  } else if (finalScore >= 3.01 && finalScore <= 3.99) {
    statusPeminjaman = "DITERIMA";
    tingkatRisiko = "MENENGAH";
  } else if (finalScore >= 2.0 && finalScore <= 3.0) {
    statusPeminjaman = "DITOLAK";
    tingkatRisiko = "MENENGAH";
  } else {
    statusPeminjaman = "DITOLAK";
    tingkatRisiko = "TINGGI";
  }

  await prisma.surveyLapangan.upsert({
    where: { idPengajuan },
    update: { 
      skorProfileMatching: finalScore, 
      skorSaw: scores.sawScore,
      skorWp: scores.wpScore,
      skorTopsis: scores.topsisScore,
      tingkatRisiko 
    },
    create: { 
      idPengajuan, 
      skorProfileMatching: finalScore, 
      skorSaw: scores.sawScore,
      skorWp: scores.wpScore,
      skorTopsis: scores.topsisScore,
      tingkatRisiko 
    }
  });

  await prisma.pengajuan.update({
    where: { idPengajuan },
    data: { statusPeminjaman: statusPeminjaman as any }
  });

  return { 
    idPengajuan, 
    ...scores,
    tingkatRisiko, 
    statusPeminjaman 
  };
}

/**
 * Memicu perhitungan SPK untuk satu pengajuan
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

    const hasilSPK = await processSpkDecision(idPengajuan, idPenyediaJasaAdmin);
    
    res.status(200).json({
      message: "Perhitungan SPK multi-metode berhasil diselesaikan.",
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
 * Memicu perhitungan SPK secara massal (Bulk)
 */
export async function calculateBulkSpk(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPenyediaJasaAdmin = req.user?.idPenyediaJasa;

    if (!idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat menghitung bulk SPK." });
      return;
    }

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
      const resSpk = await processSpkDecision(p.idPengajuan, idPenyediaJasaAdmin);
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

/**
 * Mendapatkan laporan komparasi 4 metode SPK
 */
export async function getLaporanSpk(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPenyediaJasaAdmin = req.user?.idPenyediaJasa;
    if (!idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    const laporanList = await prisma.pengajuan.findMany({
      where: {
        idPenyediaJasa: idPenyediaJasaAdmin,
        survey: { isNot: null } // Hanya pengajuan yang sudah ada hasil survey/SPK
      },
      include: {
        nasabah: {
          select: { namaNasabah: true }
        },
        survey: true
      },
      orderBy: {
        idPengajuan: "desc"
      }
    });

    const data = laporanList.map((p) => ({
      idPengajuan: p.idPengajuan,
      namaNasabah: p.nasabah.namaNasabah,
      jumlahKredit: Number(p.jumlahKredit),
      lamaTenor: p.lamaTenor,
      pmScore: p.survey?.skorProfileMatching,
      sawScore: p.survey?.skorSaw,
      wpScore: p.survey?.skorWp,
      topsisScore: p.survey?.skorTopsis,
      tingkatRisiko: p.survey?.tingkatRisiko,
      statusPeminjaman: p.statusPeminjaman
    }));

    res.status(200).json({ data });
  } catch (error: any) {
    console.error("Error get laporan SPK:", error);
    res.status(500).json({ message: "Gagal memuat laporan SPK." });
  }
}

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { calculateProfileMatching } from "../services/profileMatchingService.js";

/**
 * Controller untuk memicu perhitungan Profile Matching kelayakan kredit
 */
export async function getProfileMatchingScore(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPengajuan = Number(req.params.idPengajuan);

    if (isNaN(idPengajuan)) {
      res.status(400).json({ message: "ID Pengajuan tidak valid." });
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

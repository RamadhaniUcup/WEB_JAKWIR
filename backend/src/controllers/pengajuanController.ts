import { Response } from "express";
import { prisma } from "../db.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { processSurveyMapping, calculateProfileMatching } from "../services/profileMatchingService.js";
import { decrypt } from "../utils/security.js";

/**
 * 3. Submit Pengajuan Kredit (Debitur)
 * Mengajukan permohonan kredit baru ke Kreditur tertentu.
 */
export async function createPengajuan(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idDebitur = req.user?.id;
    const { idKreditur, jumlahKredit, lamaTenor } = req.body;

    if (!idDebitur) {
      res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
      return;
    }

    if (!idKreditur || !jumlahKredit || !lamaTenor) {
      res.status(400).json({ message: "Data pengajuan (idKreditur, jumlahKredit, lamaTenor) tidak lengkap." });
      return;
    }

    // Buat pengajuan baru, status otomatis "DIPROSES"
    const newPengajuan = await prisma.pengajuan.create({
      data: {
        tanggalPengajuan: new Date(),
        statusPeminjaman: "DIPROSES",
        idDebitur: Number(idDebitur),
        idKreditur: Number(idKreditur),
        jumlahKredit: Number(jumlahKredit),
        lamaTenor: Number(lamaTenor),
      },
    });

    res.status(201).json({
      message: "Pengajuan kredit berhasil diajukan dan sedang diproses.",
      data: newPengajuan,
    });
  } catch (error) {
    console.error("Error create pengajuan:", error);
    res.status(500).json({ message: "Terjadi kesalahan internal saat mengajukan kredit." });
  }
}

/**
 * 4. Get Pengajuan Khusus Admin (Kreditur)
 * Mengembalikan daftar berkas masuk yang diajukan ke Kreditur (Instansi) Admin saat ini.
 */
export async function getPengajuanForAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idKreditur = req.user?.idKreditur;

    if (!idKreditur) {
      res.status(403).json({ message: "Forbidden. Hanya admin kreditur resmi yang dapat mengakses berkas masuk." });
      return;
    }

    const pengajuanList = await prisma.pengajuan.findMany({
      where: { idKreditur },
      include: {
        debitur: true,
        survey: true,
      },
    });

    // Dekripsi NIK & Alamat untuk kemudahan analisis admin di server response
    const formattedList = pengajuanList.map((p) => ({
      idPengajuan: p.idPengajuan,
      tanggalPengajuan: p.tanggalPengajuan,
      statusPeminjaman: p.statusPeminjaman,
      jumlahKredit: p.jumlahKredit,
      lamaTenor: p.lamaTenor,
      survey: p.survey,
      debitur: {
        idDebitur: p.debitur.idDebitur,
        namaDebitur: p.debitur.namaDebitur,
        email: p.debitur.email,
        telepon: p.debitur.telepon,
        nik: decrypt(p.debitur.nik), // Dekripsi untuk admin
        alamat: decrypt(p.debitur.alamat), // Dekripsi untuk admin
      },
    }));

    res.status(200).json({ data: formattedList });
  } catch (error) {
    console.error("Error get pengajuan admin:", error);
    res.status(500).json({ message: "Gagal mengambil data berkas masuk." });
  }
}

/**
 * 5 & 6 & 7 & 8 & 9. Input Survey Lapangan & Otomatisasi Kalkulasi SPK (Admin)
 */
export async function inputSurveyAndCalculate(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPengajuan = Number(req.params.id);
    const idKrediturAdmin = req.user?.idKreditur;
    
    const { 
      totalAset, 
      pendapatanBersih, 
      statusHunian, 
      statusPekerjaan, 
      jumlahTanggungan, 
      nilaiJaminanAset 
    } = req.body;

    if (!idKrediturAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin kreditur yang dapat menginput hasil survey." });
      return;
    }

    if (
      totalAset === undefined || 
      pendapatanBersih === undefined || 
      !statusHunian || 
      !statusPekerjaan || 
      jumlahTanggungan === undefined || 
      nilaiJaminanAset === undefined
    ) {
      res.status(400).json({ message: "Data survey lapangan tidak lengkap." });
      return;
    }

    // Validasi pengajuan terdaftar dan milik instansi admin
    const pengajuan = await prisma.pengajuan.findUnique({
      where: { idPengajuan },
    });

    if (!pengajuan) {
      res.status(404).json({ message: "Berkas pengajuan tidak ditemukan." });
      return;
    }

    if (pengajuan.idKreditur !== idKrediturAdmin) {
      res.status(403).json({ message: "Forbidden. Berkas pengajuan ini milik lembaga mitra lain." });
      return;
    }

    // 7. Auto-Calculate Ratios
    // - Rasio Hutang = (jumlah tanggungan * 1.500.000 / pendapatan bersih) * 100 (persentase estimasi tanggungan)
    const rawRasioHutang = (Number(jumlahTanggungan) * 1500000) / Number(pendapatanBersih);
    const rasioHutang = Math.min(Math.round(rawRasioHutang * 100 * 100) / 100, 100); // Batas maksimal 100%

    // - Persentase Jaminan = (Nilai Jaminan / Jumlah Kredit) * 100
    const persentaseJaminan = Math.round((Number(nilaiJaminanAset) / Number(pengajuan.jumlahKredit)) * 100 * 100) / 100;

    const surveyRawData = {
      totalAset: Number(totalAset),
      pendapatanBersih: Number(pendapatanBersih),
      statusHunian,
      statusPekerjaan,
      jumlahTanggungan: Number(jumlahTanggungan),
      nilaiJaminanAset: Number(nilaiJaminanAset),
      rasioHutang,
      persentaseJaminan,
    };

    // 8. Auto-Calculate Profile Matching (Mapping & Perhitungan)
    // - Memetakan survey ke rating sub_kriteria dan membuat Penilaian baru
    await processSurveyMapping(idPengajuan, surveyRawData);

    // - Menghitung total skor menggunakan Profile Matching Service
    const hasilSPK = await calculateProfileMatching(idPengajuan);

    // 9. Simpan / Update data Survey Lapangan ke database beserta tingkat risikonya
    const surveyDb = await prisma.surveyLapangan.upsert({
      where: { idPengajuan },
      update: {
        totalAset: Number(totalAset),
        pendapatanBersih: Number(pendapatanBersih),
        statusHunian: statusHunian as any,
        statusPekerjaan: statusPekerjaan as any,
        jumlahTanggungan: Number(jumlahTanggungan),
        nilaiJaminanAset: Number(nilaiJaminanAset),
        rasioHutang,
        persentaseJaminan,
        skorProfileMatching: hasilSPK.skorAkhir,
        tingkatRisiko: hasilSPK.tingkatRisiko,
      },
      create: {
        idPengajuan,
        totalAset: Number(totalAset),
        pendapatanBersih: Number(pendapatanBersih),
        statusHunian: statusHunian as any,
        statusPekerjaan: statusPekerjaan as any,
        jumlahTanggungan: Number(jumlahTanggungan),
        nilaiJaminanAset: Number(nilaiJaminanAset),
        rasioHutang,
        persentaseJaminan,
        skorProfileMatching: hasilSPK.skorAkhir,
        tingkatRisiko: hasilSPK.tingkatRisiko,
      },
    });

    res.status(200).json({
      message: "Data survey lapangan berhasil diinput dan skor Profile Matching telah dikalkulasi.",
      data: {
        survey: surveyDb,
        kalkulasiSPK: hasilSPK,
      },
    });
  } catch (error: any) {
    console.error("Error input survey & hitung:", error);
    res.status(500).json({ message: error.message || "Gagal menginput survei dan menghitung kelayakan kredit." });
  }
}

/**
 * 10. Approval Status Pengajuan (Admin)
 * Mengubah status pengajuan menjadi DITERIMA atau DITOLAK.
 */
export async function updatePengajuanStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPengajuan = Number(req.params.id);
    const idKrediturAdmin = req.user?.idKreditur;
    const { statusPeminjaman } = req.body;

    if (!idKrediturAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin kreditur yang dapat memproses pengajuan." });
      return;
    }

    if (!statusPeminjaman || !["DITERIMA", "DITOLAK"].includes(statusPeminjaman)) {
      res.status(400).json({ message: "Status peminjaman tidak valid (harus DITERIMA atau DITOLAK)." });
      return;
    }

    const pengajuan = await prisma.pengajuan.findUnique({ where: { idPengajuan } });
    if (!pengajuan) {
      res.status(404).json({ message: "Pengajuan tidak ditemukan." });
      return;
    }

    if (pengajuan.idKreditur !== idKrediturAdmin) {
      res.status(403).json({ message: "Forbidden. Tidak memiliki akses mengubah berkas instansi lain." });
      return;
    }

    const updated = await prisma.pengajuan.update({
      where: { idPengajuan },
      data: {
        statusPeminjaman: statusPeminjaman as "DITERIMA" | "DITOLAK",
      },
    });

    res.status(200).json({
      message: `Status pengajuan berhasil diubah menjadi ${statusPeminjaman}.`,
      data: updated,
    });
  } catch (error) {
    console.error("Error update status pengajuan:", error);
    res.status(500).json({ message: "Gagal memperbarui status pengajuan." });
  }
}

/**
 * 11 & 12. History Pengajuan Kredit (Debitur)
 * Mengembalikan riwayat pengajuan pribadi debitur bersangkutan.
 */
export async function getDebiturHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idDebitur = req.user?.id;

    if (!idDebitur) {
      res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
      return;
    }

    const history = await prisma.pengajuan.findMany({
      where: { idDebitur },
      include: {
        kreditur: true,
        survey: true,
      },
      orderBy: { tanggalPengajuan: "desc" },
    });

    res.status(200).json({ data: history });
  } catch (error) {
    console.error("Error get history debitur:", error);
    res.status(500).json({ message: "Gagal mengambil data histori pengajuan." });
  }
}

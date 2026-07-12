import { Response } from "express";
import { prisma } from "../db.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { decrypt } from "../utils/security.js";

/**
 * 1. Submit Pengajuan Kredit (Nasabah)
 */
export async function createPengajuan(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idNasabah = req.user?.id;
    const { idPenyediaJasa, jumlahKredit, lamaTenor } = req.body;

    if (!idNasabah) {
      res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
      return;
    }

    if (!idPenyediaJasa || !jumlahKredit || !lamaTenor) {
      res.status(400).json({ message: "Data pengajuan tidak lengkap." });
      return;
    }

    // Buat pengajuan baru, status otomatis "DIPROSES"
    const newPengajuan = await prisma.pengajuan.create({
      data: {
        tanggalPengajuan: new Date(),
        statusPeminjaman: "DIPROSES",
        idNasabah: Number(idNasabah),
        idPenyediaJasa: Number(idPenyediaJasa),
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
 * 2. Get Pengajuan Khusus Admin (Penyedia Jasa)
 */
export async function getPengajuanForAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPenyediaJasa = req.user?.idPenyediaJasa;

    if (!idPenyediaJasa) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat mengakses berkas masuk." });
      return;
    }

    const pengajuanList = await prisma.pengajuan.findMany({
      where: { idPenyediaJasa },
      include: {
        nasabah: true,
        survey: true,
        penilaian: {
          include: {
            subKriteria: true
          }
        }
      },
    });

    // Dekripsi NIK & Alamat untuk kemudahan analisis admin
    const formattedList = pengajuanList.map((p) => ({
      idPengajuan: p.idPengajuan,
      tanggalPengajuan: p.tanggalPengajuan,
      statusPeminjaman: p.statusPeminjaman,
      jumlahKredit: p.jumlahKredit,
      lamaTenor: p.lamaTenor,
      survey: p.survey,
      penilaian: p.penilaian,
      nasabah: {
        idNasabah: p.nasabah.idNasabah,
        namaNasabah: p.nasabah.namaNasabah,
        email: p.nasabah.email,
        telepon: p.nasabah.telepon,
        nik: decrypt(p.nasabah.nik),
        alamat: decrypt(p.nasabah.alamat),
      },
    }));

    res.status(200).json({ data: formattedList });
  } catch (error) {
    console.error("Error get pengajuan admin:", error);
    res.status(500).json({ message: "Gagal mengambil data berkas masuk." });
  }
}

/**
 * 3. Input Survey Lapangan (Pilihan Dropdown)
 */
export async function inputSurvey(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPengajuan = Number(req.params.id);
    const idPenyediaJasaAdmin = req.user?.idPenyediaJasa;
    const { subIds } = req.body; // Array of selected subKriteria IDs

    if (!idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat menginput hasil survey." });
      return;
    }

    if (!subIds || !Array.isArray(subIds) || subIds.length === 0) {
      res.status(400).json({ message: "Pilihan opsi sub-kriteria wajib diisi." });
      return;
    }

    const pengajuan = await prisma.pengajuan.findUnique({
      where: { idPengajuan },
    });

    if (!pengajuan) {
      res.status(404).json({ message: "Berkas pengajuan tidak ditemukan." });
      return;
    }

    if (pengajuan.idPenyediaJasa !== idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Berkas pengajuan milik instansi lain." });
      return;
    }

    // 1. Simpan atau update Penilaian
    await prisma.penilaian.deleteMany({
      where: { idPengajuan }
    });

    for (const idSub of subIds) {
      await prisma.penilaian.create({
        data: {
          idPengajuan,
          idSub: Number(idSub)
        }
      });
    }

    // 2. Buat atau update SurveyLapangan record (Mengosongkan skor/risiko lama)
    const surveyDb = await prisma.surveyLapangan.upsert({
      where: { idPengajuan },
      update: {
        skorProfileMatching: null,
        tingkatRisiko: null,
      },
      create: {
        idPengajuan,
        skorProfileMatching: null,
        tingkatRisiko: null,
      }
    });

    // 3. Ubah status pengajuan menjadi MENUNGGU_SPK
    await prisma.pengajuan.update({
      where: { idPengajuan },
      data: {
        statusPeminjaman: "MENUNGGU_SPK"
      }
    });

    res.status(200).json({
      message: "Data survey lapangan berhasil disimpan. Status berubah menjadi MENUNGGU_SPK.",
      data: surveyDb
    });
  } catch (error: any) {
    console.error("Error input survey:", error);
    res.status(500).json({ message: error.message || "Gagal menyimpan survei lapangan." });
  }
}

/**
 * 4. Approval Status Pengajuan Manual (Admin)
 */
export async function updatePengajuanStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idPengajuan = Number(req.params.id);
    const idPenyediaJasaAdmin = req.user?.idPenyediaJasa;
    const { statusPeminjaman } = req.body;

    if (!idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Hanya admin penyedia jasa yang dapat memproses pengajuan." });
      return;
    }

    if (!statusPeminjaman || !["DITERIMA", "DITOLAK", "DIPROSES", "MENUNGGU_SPK"].includes(statusPeminjaman)) {
      res.status(400).json({ message: "Status peminjaman tidak valid." });
      return;
    }

    const pengajuan = await prisma.pengajuan.findUnique({ where: { idPengajuan } });
    if (!pengajuan) {
      res.status(404).json({ message: "Pengajuan tidak ditemukan." });
      return;
    }

    if (pengajuan.idPenyediaJasa !== idPenyediaJasaAdmin) {
      res.status(403).json({ message: "Forbidden. Tidak memiliki akses mengubah berkas instansi lain." });
      return;
    }

    const updated = await prisma.pengajuan.update({
      where: { idPengajuan },
      data: {
        statusPeminjaman: statusPeminjaman as any,
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
 * 5. History Pengajuan Kredit (Nasabah)
 */
export async function getNasabahHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const idNasabah = req.user?.id;

    if (!idNasabah) {
      res.status(401).json({ message: "Unauthorized. Pengguna tidak teridentifikasi." });
      return;
    }

    const history = await prisma.pengajuan.findMany({
      where: { idNasabah },
      include: {
        penyediaJasa: true,
        survey: true,
      },
      orderBy: { tanggalPengajuan: "desc" },
    });

    res.status(200).json({ data: history });
  } catch (error) {
    console.error("Error get history nasabah:", error);
    res.status(500).json({ message: "Gagal mengambil data histori pengajuan." });
  }
}

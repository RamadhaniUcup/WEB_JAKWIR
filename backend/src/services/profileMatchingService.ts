import { prisma } from "../db.js";

export interface GapCalculation {
  idKriteria: number;
  kodeKriteria: string;
  namaKriteria: string;
  nilaiRating: number;
  nilaiTarget: number;
  gap: number;
  bobotGap: number;
  jenisFaktor: "CORE" | "SECONDARY";
}

export interface AspectResult {
  idAspek: number;
  namaAspek: string;
  nilaiCF: number;
  nilaiSF: number;
  nilaiTotalAspek: number;
  bobotAspek: number;
  detailKriteria: GapCalculation[];
}

export interface ProfileMatchingBreakdown {
  idPengajuan: number;
  namaDebitur: string;
  tanggalPengajuan: Date;
  jumlahKredit: number;
  lamaTenor: number;
  breakdownAspek: AspectResult[];
  skorAkhir: number;
  tingkatRisiko: "RENDAH" | "MENENGAH" | "TINGGI";
}

/**
 * Helper untuk mencocokkan nilai survei mentah terhadap deskripsi sub-kriteria secara fleksibel.
 * Mendukung pencocokan string, perbandingan numerik (e.g. ">= 10000000"), dan rentang (e.g. "5000000 - 10000000").
 */
function matchDescription(val: any, desc: string): boolean {
  const normalizedDesc = desc.toUpperCase().trim();

  // Pencocokan tipe String (misal Status Hunian, Pekerjaan)
  if (typeof val === "string") {
    const normalizedVal = val.toUpperCase().trim();
    return normalizedDesc.includes(normalizedVal) || normalizedVal.includes(normalizedDesc);
  }

  // Pencocokan tipe Angka/Nominal (misal Pendapatan, Rasio Hutang, Persentase Jaminan)
  if (typeof val === "number") {
    // 1. Cek rentang nilai dengan pemisah "-"
    if (normalizedDesc.includes("-")) {
      const parts = normalizedDesc.split("-").map((p) => parseFloat(p.replace(/[^0-9.]/g, "")));
      const p0 = parts[0];
      const p1 = parts[1];
      if (parts.length === 2 && p0 !== undefined && p1 !== undefined && !isNaN(p0) && !isNaN(p1)) {
        return val >= p0 && val <= p1;
      }
    }

    // 2. Cek operator pembanding
    if (normalizedDesc.startsWith(">=")) {
      const num = parseFloat(normalizedDesc.replace(">=", "").replace(/[^0-9.]/g, ""));
      return val >= num;
    }
    if (normalizedDesc.startsWith("<=")) {
      const num = parseFloat(normalizedDesc.replace("<=", "").replace(/[^0-9.]/g, ""));
      return val <= num;
    }
    if (normalizedDesc.startsWith(">")) {
      const num = parseFloat(normalizedDesc.replace(">", "").replace(/[^0-9.]/g, ""));
      return val > num;
    }
    if (normalizedDesc.startsWith("<")) {
      const num = parseFloat(normalizedDesc.replace("<", "").replace(/[^0-9.]/g, ""));
      return val < num;
    }

    // 3. Pencocokan langsung nilai numerik
    const directNum = parseFloat(normalizedDesc.replace(/[^0-9.]/g, ""));
    if (!isNaN(directNum)) {
      return val === directNum;
    }
  }

  return false;
}

/**
 * Menentukan tingkat risiko berdasarkan skor kelayakan akhir Profile Matching.
 * - Resiko Rendah: 3.5 - 5.0
 * - Resiko Menengah: 2.0 - 3.49
 * - Resiko Tinggi: < 2.0
 */
export function determineRisk(score: number): "RENDAH" | "MENENGAH" | "TINGGI" {
  if (score >= 3.5) return "RENDAH";
  if (score >= 2.0) return "MENENGAH";
  return "TINGGI";
}

/**
 * Service untuk memetakan data survei mentah ke dalam sub-kriteria, menyimpan penilaian, 
 * dan memproses perhitungan Profile Matching secara otomatis.
 */
export async function calculateProfileMatching(idPengajuan: number): Promise<ProfileMatchingBreakdown> {
  const pengajuan = await prisma.pengajuan.findUnique({
    where: { idPengajuan },
    include: {
      debitur: true,
      survey: true,
      penilaian: {
        include: {
          subKriteria: {
            include: {
              kriteria: {
                include: {
                  aspek: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!pengajuan) {
    throw new Error(`Data pengajuan dengan ID ${idPengajuan} tidak ditemukan.`);
  }

  // Ambil data konversi Bobot GAP dari database
  const listBobotGap = await prisma.bobotGap.findMany();

  const getBobotNilai = (selisih: number): number => {
    const match = listBobotGap.find((bg) => bg.selisihGap === selisih);
    return match ? Number(match.bobotNilai) : 1.0;
  };

  const aspekMap = new Map<number, { aspek: any; penilaianList: any[] }>();

  for (const pen of pengajuan.penilaian) {
    const sub = pen.subKriteria;
    const kriteria = sub.kriteria;
    const aspek = kriteria.aspek;

    if (!aspekMap.has(aspek.idAspek)) {
      aspekMap.set(aspek.idAspek, {
        aspek,
        penilaianList: [],
      });
    }

    aspekMap.get(aspek.idAspek)!.penilaianList.push({
      kriteria,
      subKriteria: sub,
    });
  }

  const breakdownAspek: AspectResult[] = [];
  let skorAkhir = 0;

  for (const [idAspek, data] of aspekMap.entries()) {
    const aspek = data.aspek;
    const detailKriteria: GapCalculation[] = [];
    const coreWeights: number[] = [];
    const secondaryWeights: number[] = [];

    for (const item of data.penilaianList) {
      const kriteria = item.kriteria;
      const sub = item.subKriteria;

      const gap = sub.nilaiRating - kriteria.nilaiTarget;
      const bobotGap = getBobotNilai(gap);

      detailKriteria.push({
        idKriteria: kriteria.idKriteria,
        kodeKriteria: kriteria.kodeKriteria,
        namaKriteria: kriteria.namaKriteria,
        nilaiRating: sub.nilaiRating,
        nilaiTarget: kriteria.nilaiTarget,
        gap,
        bobotGap,
        jenisFaktor: kriteria.jenisFaktor,
      });

      if (kriteria.jenisFaktor === "CORE") {
        coreWeights.push(bobotGap);
      } else {
        secondaryWeights.push(bobotGap);
      }
    }

    const nilaiCF = coreWeights.length > 0 ? coreWeights.reduce((a, b) => a + b, 0) / coreWeights.length : 0;
    const nilaiSF = secondaryWeights.length > 0 ? secondaryWeights.reduce((a, b) => a + b, 0) / secondaryWeights.length : 0;

    const persentaseCF = Number(aspek.persentaseCf) / 100;
    const persentaseSF = Number(aspek.persentaseSf) / 100;
    const nilaiTotalAspek = nilaiCF * persentaseCF + nilaiSF * persentaseSF;

    breakdownAspek.push({
      idAspek,
      namaAspek: aspek.namaAspek,
      nilaiCF,
      nilaiSF,
      nilaiTotalAspek,
      bobotAspek: Number(aspek.bobotAspek),
      detailKriteria,
    });

    skorAkhir += nilaiTotalAspek * (Number(aspek.bobotAspek) / 100);
  }

  const finalScore = Math.round(skorAkhir * 100) / 100;

  return {
    idPengajuan: pengajuan.idPengajuan,
    namaDebitur: pengajuan.debitur.namaDebitur,
    tanggalPengajuan: pengajuan.tanggalPengajuan,
    jumlahKredit: Number(pengajuan.jumlahKredit),
    lamaTenor: pengajuan.lamaTenor,
    breakdownAspek,
    skorAkhir: finalScore,
    tingkatRisiko: determineRisk(finalScore),
  };
}

/**
 * Service untuk memetakan data survei mentah menjadi penilaian rating secara otomatis di DB
 * berdasarkan aturan sub-kriteria kreditur yang bersangkutan.
 */
export async function processSurveyMapping(
  idPengajuan: number,
  surveyInput: {
    totalAset: number;
    pendapatanBersih: number;
    statusHunian: string;
    statusPekerjaan: string;
    jumlahTanggungan: number;
    nilaiJaminanAset: number;
    rasioHutang: number;
    persentaseJaminan: number;
  }
): Promise<void> {
  const pengajuan = await prisma.pengajuan.findUnique({
    where: { idPengajuan },
    include: {
      kreditur: {
        include: {
          aspek: {
            include: {
              kriteria: {
                include: {
                  subKriteria: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!pengajuan) {
    throw new Error(`Data pengajuan tidak ditemukan.`);
  }

  // 1. Bersihkan penilaian lama untuk pengajuan ini jika ada (agar bersifat idempotent)
  await prisma.penilaian.deleteMany({
    where: { idPengajuan },
  });

  // 2. Kumpulkan seluruh kriteria dari Aspek Kreditur ini
  const kriteriaList = pengajuan.kreditur.aspek.flatMap((aspek) => aspek.kriteria);

  // 3. Iterasi tiap kriteria untuk dicocokkan nilai raw surveynya ke sub_kriteria
  for (const kriteria of kriteriaList) {
    let rawValue: any = null;
    const key = kriteria.namaKriteria.toUpperCase() + "_" + kriteria.kodeKriteria.toUpperCase();

    // Map kriteria ke data survei raw berdasarkan kode/nama kriteria
    if (key.includes("PENDAPATAN") || key.includes("C1")) {
      rawValue = surveyInput.pendapatanBersih;
    } else if (key.includes("HUTANG") || key.includes("RASIO") || key.includes("C2")) {
      rawValue = surveyInput.rasioHutang;
    } else if (key.includes("JAMINAN") || key.includes("AGUNAN") || key.includes("PERSENTASE_JAMINAN") || key.includes("C3")) {
      rawValue = surveyInput.persentaseJaminan;
    } else if (key.includes("HUNIAN") || key.includes("TINGGAL") || key.includes("C4")) {
      rawValue = surveyInput.statusHunian;
    } else if (key.includes("PEKERJAAN") || key.includes("STATUS_KERJA") || key.includes("C5")) {
      rawValue = surveyInput.statusPekerjaan;
    } else if (key.includes("TANGGUNGAN") || key.includes("KELUARGA") || key.includes("C6")) {
      rawValue = surveyInput.jumlahTanggungan;
    } else if (key.includes("ASET") || key.includes("KEKAYAAN") || key.includes("C7")) {
      rawValue = surveyInput.totalAset;
    } else {
      // Jika kriteria tidak terpetakan secara otomatis, gunakan nilai jaminan aset atau default
      rawValue = surveyInput.nilaiJaminanAset;
    }

    // Cari sub_kriteria yang cocok dengan rawValue menggunakan matchDescription
    let matchedSub = kriteria.subKriteria.find((sub) => matchDescription(rawValue, sub.deskripsi));

    // Fallback jika tidak ada aturan yang cocok, ambil nilai target kriteria atau rating terendah
    if (!matchedSub) {
      matchedSub = kriteria.subKriteria.sort((a, b) => a.nilaiRating - b.nilaiRating)[0];
    }

    if (matchedSub) {
      // Simpan entitas Penilaian di database
      await prisma.penilaian.create({
        data: {
          idPengajuan,
          idSub: matchedSub.idSub,
        },
      });
    }
  }
}

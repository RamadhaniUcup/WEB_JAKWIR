import { prisma } from "../db.js";
/**
 * Menentukan tingkat risiko berdasarkan skor akhir Profile Matching.
 * - Resiko Rendah: 3.5 - 5.0
 * - Resiko Menengah: 2.0 - 3.49
 * - Resiko Tinggi: < 2.0
 */
export function determineRisk(score) {
    if (score >= 3.5)
        return "RENDAH";
    if (score >= 2.0)
        return "MENENGAH";
    return "TINGGI";
}
/**
 * Menghitung kelayakan kredit dan menyimpan keputusan akhir secara otomatis.
 */
export async function calculateProfileMatching(idPengajuan) {
    const pengajuan = await prisma.pengajuan.findUnique({
        where: { idPengajuan },
        include: {
            nasabah: true,
            penyediaJasa: true,
            penilaian: {
                include: {
                    subKriteria: {
                        include: {
                            kriteria: true,
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
    const getBobotNilai = (selisih) => {
        const match = listBobotGap.find((bg) => bg.selisihGap === selisih);
        return match ? Number(match.bobotNilai) : 1.0;
    };
    const detailKriteria = [];
    const coreWeights = [];
    const secondaryWeights = [];
    for (const pen of pengajuan.penilaian) {
        const sub = pen.subKriteria;
        const kriteria = sub.kriteria;
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
        }
        else {
            secondaryWeights.push(bobotGap);
        }
    }
    const nilaiCF = coreWeights.length > 0 ? coreWeights.reduce((a, b) => a + b, 0) / coreWeights.length : 0;
    const nilaiSF = secondaryWeights.length > 0 ? secondaryWeights.reduce((a, b) => a + b, 0) / secondaryWeights.length : 0;
    const persentaseCf = Number(pengajuan.penyediaJasa.persentaseCf);
    const persentaseSf = Number(pengajuan.penyediaJasa.persentaseSf);
    const skorAkhirRaw = (nilaiCF * (persentaseCf / 100)) + (nilaiSF * (persentaseSf / 100));
    const finalScore = Math.round(skorAkhirRaw * 100) / 100;
    const tingkatRisiko = determineRisk(finalScore);
    return {
        idPengajuan: pengajuan.idPengajuan,
        namaNasabah: pengajuan.nasabah.namaNasabah,
        tanggalPengajuan: pengajuan.tanggalPengajuan,
        jumlahKredit: Number(pengajuan.jumlahKredit),
        lamaTenor: pengajuan.lamaTenor,
        nilaiCF,
        nilaiSF,
        persentaseCf,
        persentaseSf,
        detailKriteria,
        skorAkhir: finalScore,
        tingkatRisiko,
    };
}
//# sourceMappingURL=profileMatchingService.js.map
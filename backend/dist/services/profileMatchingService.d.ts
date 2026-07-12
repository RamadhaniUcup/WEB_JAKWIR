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
export interface ProfileMatchingBreakdown {
    idPengajuan: number;
    namaNasabah: string;
    tanggalPengajuan: Date;
    jumlahKredit: number;
    lamaTenor: number;
    nilaiCF: number;
    nilaiSF: number;
    persentaseCf: number;
    persentaseSf: number;
    detailKriteria: GapCalculation[];
    skorAkhir: number;
    tingkatRisiko: "RENDAH" | "MENENGAH" | "TINGGI";
    statusPeminjaman: "DITERIMA" | "DITOLAK";
}
/**
 * Menentukan tingkat risiko berdasarkan skor akhir Profile Matching.
 * - Resiko Rendah: 3.5 - 5.0
 * - Resiko Menengah: 2.0 - 3.49
 * - Resiko Tinggi: < 2.0
 */
export declare function determineRisk(score: number): "RENDAH" | "MENENGAH" | "TINGGI";
/**
 * Menghitung kelayakan kredit dan menyimpan keputusan akhir secara otomatis.
 */
export declare function calculateProfileMatching(idPengajuan: number): Promise<ProfileMatchingBreakdown>;
//# sourceMappingURL=profileMatchingService.d.ts.map
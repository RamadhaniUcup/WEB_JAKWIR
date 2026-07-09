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
 * Menentukan tingkat risiko berdasarkan skor kelayakan akhir Profile Matching.
 * - Resiko Rendah: 3.5 - 5.0
 * - Resiko Menengah: 2.0 - 3.49
 * - Resiko Tinggi: < 2.0
 */
export declare function determineRisk(score: number): "RENDAH" | "MENENGAH" | "TINGGI";
/**
 * Service untuk memetakan data survei mentah ke dalam sub-kriteria, menyimpan penilaian,
 * dan memproses perhitungan Profile Matching secara otomatis.
 */
export declare function calculateProfileMatching(idPengajuan: number): Promise<ProfileMatchingBreakdown>;
/**
 * Service untuk memetakan data survei mentah menjadi penilaian rating secara otomatis di DB
 * berdasarkan aturan sub-kriteria kreditur yang bersangkutan.
 */
export declare function processSurveyMapping(idPengajuan: number, surveyInput: {
    totalAset: number;
    pendapatanBersih: number;
    statusHunian: string;
    statusPekerjaan: string;
    jumlahTanggungan: number;
    nilaiJaminanAset: number;
    rasioHutang: number;
    persentaseJaminan: number;
}): Promise<void>;
//# sourceMappingURL=profileMatchingService.d.ts.map
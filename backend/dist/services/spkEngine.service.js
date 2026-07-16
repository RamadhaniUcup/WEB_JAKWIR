import { calculateProfileMatching } from "./profileMatchingService.js";
import { calculateSAW } from "./methods/saw.service.js";
import { calculateWP } from "./methods/wp.service.js";
import { calculateTOPSIS } from "./methods/topsis.service.js";
export async function calculateSpkForPengajuan(idPengajuan) {
    // 1. Jalankan semua metode kalkulasi
    const pmResult = await calculateProfileMatching(idPengajuan);
    const rawSaw = await calculateSAW(idPengajuan);
    const rawWp = await calculateWP(idPengajuan);
    const rawTopsis = await calculateTOPSIS(idPengajuan);
    // 2. Standarisasi hasil SAW/WP/TOPSIS (0-1) ke skala (1-5)
    // Rumus: Skor = (Vi * 4) + 1
    const standardize = (val) => Math.round(((val * 4) + 1) * 100) / 100;
    return {
        pmScore: pmResult.skorAkhir,
        sawScore: standardize(rawSaw),
        wpScore: standardize(rawWp),
        topsisScore: standardize(rawTopsis),
    };
}
//# sourceMappingURL=spkEngine.service.js.map
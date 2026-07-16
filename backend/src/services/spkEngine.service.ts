import { calculateProfileMatching } from "./profileMatchingService.js";
import { calculateSAW } from "./methods/saw.service.js";
import { calculateWP } from "./methods/wp.service.js";
import { calculateTOPSIS } from "./methods/topsis.service.js";

export async function calculateSpkForPengajuan(idPengajuan: number) {
  // 1. Jalankan semua metode kalkulasi
  const pmResult = await calculateProfileMatching(idPengajuan);
  const rawSaw = await calculateSAW(idPengajuan);
  const rawWp = await calculateWP(idPengajuan);
  const rawTopsis = await calculateTOPSIS(idPengajuan);

  // 2. Pembulatan hasil desimal murni (0.0 - 1.0) menjadi 4 angka di belakang koma
  const formatDec = (val: number) => Math.round(val * 10000) / 10000;

  return {
    pmScore: pmResult.skorAkhir,
    sawScore: formatDec(rawSaw),
    wpScore: formatDec(rawWp),
    topsisScore: formatDec(rawTopsis),
  };
}

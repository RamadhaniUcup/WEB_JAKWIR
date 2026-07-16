import { prisma } from "../../db.js";

export async function calculateTOPSIS(idPengajuanTarget: number): Promise<number> {
  const targetPengajuan = await prisma.pengajuan.findUnique({
    where: { idPengajuan: idPengajuanTarget },
    select: { idPenyediaJasa: true }
  });
  if (!targetPengajuan) return 0;
  const idPenyediaJasa = targetPengajuan.idPenyediaJasa;

  const kriteriaList = await prisma.kriteria.findMany({
    where: { idPenyediaJasa }
  });
  if (kriteriaList.length === 0) return 0;

  const allPengajuan = await prisma.pengajuan.findMany({
    where: { idPenyediaJasa },
    include: {
      penilaian: { include: { subKriteria: true } }
    }
  });

  const matrix: Record<number, Record<number, number>> = {};
  for (const p of allPengajuan) {
    matrix[p.idPengajuan] = {};
    for (const k of kriteriaList) {
      const pnl = p.penilaian.find(x => x.subKriteria.idKriteria === k.idKriteria);
      matrix[p.idPengajuan]![k.idKriteria] = pnl ? pnl.subKriteria.nilaiRating : 0;
    }
  }

  // 1. Normalisasi Bobot W
  let totalBobot = 0;
  for (const k of kriteriaList) {
    totalBobot += Number(k.bobot);
  }
  const W: Record<number, number> = {};
  for (const k of kriteriaList) {
    W[k.idKriteria] = totalBobot > 0 ? Number(k.bobot) / totalBobot : 0;
  }

  // 2. Matriks Keputusan Ternormalisasi (R) dan Terbobot (Y)
  // Pembagi tiap kolom = akar kuadrat dari jumlah (x^2)
  const divider: Record<number, number> = {};
  for (const k of kriteriaList) {
    let sumSq = 0;
    for (const p of allPengajuan) {
      sumSq += Math.pow(matrix[p.idPengajuan]?.[k.idKriteria] || 0, 2);
    }
    divider[k.idKriteria] = Math.sqrt(sumSq);
  }

  const Y: Record<number, Record<number, number>> = {};
  for (const p of allPengajuan) {
    Y[p.idPengajuan] = {};
    for (const k of kriteriaList) {
      const x_ij = matrix[p.idPengajuan]?.[k.idKriteria] || 0;
      const div = divider[k.idKriteria] || 0;
      const r_ij = div === 0 ? 0 : x_ij / div;
      Y[p.idPengajuan]![k.idKriteria] = r_ij * (W[k.idKriteria] || 0);
    }
  }

  // 3. Solusi Ideal Positif (A+) dan Negatif (A-)
  const A_plus: Record<number, number> = {};
  const A_minus: Record<number, number> = {};
  for (const k of kriteriaList) {
    const yVals = allPengajuan.map(p => Y[p.idPengajuan]?.[k.idKriteria] || 0);
    if (k.jenisAtribut === "BENEFIT") {
      A_plus[k.idKriteria] = Math.max(...yVals);
      A_minus[k.idKriteria] = Math.min(...yVals);
    } else { 
      // Untuk COST, Ideal Positif = nilai terkecil
      A_plus[k.idKriteria] = Math.min(...yVals);
      A_minus[k.idKriteria] = Math.max(...yVals);
    }
  }

  // 4. Jarak Positif (D+) dan Negatif (D-)
  const D_plus: Record<number, number> = {};
  const D_minus: Record<number, number> = {};
  for (const p of allPengajuan) {
    let sumDplus = 0;
    let sumDminus = 0;
    for (const k of kriteriaList) {
      const y_ij = Y[p.idPengajuan]?.[k.idKriteria] || 0;
      const a_p = A_plus[k.idKriteria] || 0;
      const a_m = A_minus[k.idKriteria] || 0;
      sumDplus += Math.pow(y_ij - a_p, 2);
      sumDminus += Math.pow(y_ij - a_m, 2);
    }
    D_plus[p.idPengajuan] = Math.sqrt(sumDplus);
    D_minus[p.idPengajuan] = Math.sqrt(sumDminus);
  }

  // 5. Nilai Preferensi V (Target Pengajuan Saja)
  if (typeof D_plus[idPengajuanTarget] === "undefined") return 0;

  const dP = D_plus[idPengajuanTarget] || 0;
  const dM = D_minus[idPengajuanTarget] || 0;
  
  if (dP + dM === 0) return 0;

  const vScore = dM / (dP + dM);
  return vScore;
}

import { prisma } from "../../db.js";

export async function calculateSAW(idPengajuanTarget: number): Promise<number> {
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

  const maxVals: Record<number, number> = {};
  const minVals: Record<number, number> = {};
  for (const k of kriteriaList) {
    const vals = allPengajuan.map(p => matrix[p.idPengajuan]?.[k.idKriteria] || 0);
    maxVals[k.idKriteria] = Math.max(...vals);
    minVals[k.idKriteria] = Math.min(...vals);
  }

  let vScore = 0;
  let totalBobot = 0;
  for (const k of kriteriaList) {
    totalBobot += Number(k.bobot);
  }

  for (const k of kriteriaList) {
    if (!matrix[idPengajuanTarget]) return 0;
    
    const xVal = matrix[idPengajuanTarget]?.[k.idKriteria] || 0;
    const maxVal = maxVals[k.idKriteria] || 0;
    const minVal = minVals[k.idKriteria] || 0;
    let rVal = 0;

    if (k.jenisAtribut === "BENEFIT") {
      rVal = maxVal === 0 ? 0 : xVal / maxVal;
    } else {
      rVal = xVal === 0 ? 0 : minVal / xVal;
    }

    const w = totalBobot > 0 ? Number(k.bobot) / totalBobot : 0;
    vScore += rVal * w;
  }

  return vScore;
}

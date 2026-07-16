import { prisma } from "../../db.js";
export async function calculateWP(idPengajuanTarget) {
    const targetPengajuan = await prisma.pengajuan.findUnique({
        where: { idPengajuan: idPengajuanTarget },
        select: { idPenyediaJasa: true }
    });
    if (!targetPengajuan)
        return 0;
    const idPenyediaJasa = targetPengajuan.idPenyediaJasa;
    const kriteriaList = await prisma.kriteria.findMany({
        where: { idPenyediaJasa }
    });
    if (kriteriaList.length === 0)
        return 0;
    const allPengajuan = await prisma.pengajuan.findMany({
        where: { idPenyediaJasa },
        include: {
            penilaian: { include: { subKriteria: true } }
        }
    });
    const matrix = {};
    for (const p of allPengajuan) {
        matrix[p.idPengajuan] = {};
        for (const k of kriteriaList) {
            const pnl = p.penilaian.find(x => x.subKriteria.idKriteria === k.idKriteria);
            matrix[p.idPengajuan][k.idKriteria] = pnl && pnl.subKriteria.nilaiRating > 0 ? pnl.subKriteria.nilaiRating : 1;
        }
    }
    // 1. Normalisasi Bobot W
    let totalBobot = 0;
    for (const k of kriteriaList) {
        totalBobot += Number(k.bobot);
    }
    const W = {};
    for (const k of kriteriaList) {
        let w_j = totalBobot > 0 ? Number(k.bobot) / totalBobot : 0;
        if (k.jenisAtribut === "COST") {
            w_j = -w_j; // Cost dinaikkan pangkat negatif
        }
        W[k.idKriteria] = w_j;
    }
    // 2. Hitung vektor S
    const S = {};
    let totalS = 0;
    for (const p of allPengajuan) {
        let s_i = 1;
        for (const k of kriteriaList) {
            const x_ij = matrix[p.idPengajuan]?.[k.idKriteria] || 1;
            const w_j = W[k.idKriteria] || 0;
            s_i *= Math.pow(x_ij, w_j);
        }
        S[p.idPengajuan] = s_i;
        totalS += s_i;
    }
    // 3. Hitung V untuk pengajuan target
    if (totalS === 0 || typeof S[idPengajuanTarget] === "undefined")
        return 0;
    const targetS = S[idPengajuanTarget] || 0;
    const vScore = targetS / totalS;
    return vScore;
}
//# sourceMappingURL=wp.service.js.map
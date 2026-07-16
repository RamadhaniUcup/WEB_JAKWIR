import { type FC } from "react";
import { useGetLaporanSpk } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const LaporanSpk: FC = () => {
  const { data: laporanData, isLoading } = useGetLaporanSpk();

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const getStatusBadge = (status: string) => {
    if (status === "DITERIMA") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (status === "DITOLAK") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (status === "MENUNGGU_SPK") return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-200">
        <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
        <p className="text-xs text-slate-400 mt-2">Memuat Laporan SPK...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Laporan Multi-Metode SPK</h1>
        <p className="text-sm text-slate-400 mt-1">
          Perbandingan hasil algoritma Profile Matching, SAW, WP, dan TOPSIS. Status akhir ditentukan secara mutlak oleh Profile Matching.
        </p>
      </div>

      <GlassCard className="overflow-hidden" hoverEffect={false}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-lg font-bold text-white">Riwayat Perhitungan Sistem Pendukung Keputusan</h3>
          <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
            {laporanData?.length || 0} Riwayat Tersedia
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Nasabah & Pinjaman</th>
                <th className="px-6 py-4 border-l border-white/5 bg-indigo-500/5 text-indigo-300">Skor PM (Utama)</th>
                <th className="px-6 py-4 border-l border-white/5">Skor SAW</th>
                <th className="px-6 py-4 border-l border-white/5">Skor WP</th>
                <th className="px-6 py-4 border-l border-white/5">Skor TOPSIS</th>
                <th className="px-6 py-4 border-l border-white/5 text-center">Keputusan Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {laporanData && laporanData.length > 0 ? (
                laporanData.map((row: any) => (
                  <tr key={row.idPengajuan} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-white text-sm">{row.namaNasabah}</div>
                      <div className="text-xs text-emerald-400 font-medium mt-0.5">{formatRupiah(row.jumlahKredit)} ({row.lamaTenor} bln)</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">REQ-{row.idPengajuan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-l border-white/5 bg-indigo-500/5">
                      <div className="font-bold text-lg text-indigo-400">{row.pmScore ?? "-"}</div>
                      <div className="text-[10px] text-indigo-400/70 mt-1 uppercase tracking-wide">
                        Risiko: {row.tingkatRisiko || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-l border-white/5">
                      <div className="font-bold text-slate-200">{row.sawScore ?? "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-l border-white/5">
                      <div className="font-bold text-slate-200">{row.wpScore ?? "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-l border-white/5">
                      <div className="font-bold text-slate-200">{row.topsisScore ?? "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-l border-white/5 text-center">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-xl border ${getStatusBadge(row.statusPeminjaman)}`}>
                        {row.statusPeminjaman}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Belum ada riwayat perhitungan SPK.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default LaporanSpk;

import { type FC } from "react";
import { useGetPengajuanHistory } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

interface HistoryItem {
  idPengajuan: number;
  tanggalPengajuan: string;
  statusPeminjaman: "DIPROSES" | "DITERIMA" | "DITOLAK";
  jumlahKredit: string;
  lamaTenor: number;
  kreditur: {
    namaPerusahaan: string;
  };
  survey?: {
    skorProfileMatching: string;
    tingkatRisiko: "RENDAH" | "MENENGAH" | "TINGGI";
  } | null;
}

export const HistoryPengajuan: FC = () => {
  const { data: historyList, isLoading } = useGetPengajuanHistory();

  // Helper formatting nominal Rupiah
  const formatRupiah = (val: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(val));
  };

  const getStatusBadge = (status: "DIPROSES" | "DITERIMA" | "DITOLAK") => {
    switch (status) {
      case "DIPROSES":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "DITERIMA":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "DITOLAK":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const translateStatus = (status: "DIPROSES" | "DITERIMA" | "DITOLAK") => {
    if (status === "DIPROSES") return "Dalam Proses Verifikasi";
    if (status === "DITERIMA") return "Disetujui / Diterima";
    return "Ditolak";
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto text-slate-200 min-h-screen font-sans">
      <h2 className="text-3xl font-extrabold text-white mb-8">History Pengajuan Saya</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-xs text-slate-400 mt-3 font-semibold">Memuat riwayat pengajuan...</p>
        </div>
      ) : historyList && historyList.length === 0 ? (
        <div className="p-8 bg-white/3 border border-white/10 rounded-2xl text-center text-slate-400 text-sm">
          Anda belum memiliki riwayat pengajuan kredit.
        </div>
      ) : (
        <div className="space-y-4">
          {historyList?.map((item: HistoryItem) => {
            const formattedDate = new Date(item.tanggalPengajuan).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <GlassCard key={item.idPengajuan} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6" hoverEffect={true}>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-[10px] font-mono text-slate-500">ID: REQ-{item.idPengajuan}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(item.statusPeminjaman)}`}>
                      {translateStatus(item.statusPeminjaman)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.kreditur.namaPerusahaan}</h3>
                  <p className="text-xs text-slate-400 mt-1">Diajukan pada: {formattedDate} • Tenor {item.lamaTenor} Bulan</p>
                  
                  {/* Status SPK Profile Matching jika survey sudah diinput */}
                  {item.survey && (
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-2 py-1 rounded-lg">
                        Skor SPK: {item.survey.skorProfileMatching}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        item.survey.tingkatRisiko === "RENDAH" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.survey.tingkatRisiko === "MENENGAH"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        Risiko: {item.survey.tingkatRisiko}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-left md:text-right min-w-[12rem]">
                  <p className="text-xs text-slate-500 mb-1">Jumlah Kredit</p>
                  <p className="text-xl font-extrabold text-emerald-400">{formatRupiah(item.jumlahKredit)}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
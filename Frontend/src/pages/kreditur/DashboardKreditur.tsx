import { type FC } from "react";
import { Link } from "react-router-dom";
import { useGetPengajuan } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

interface LivePengajuan {
  idPengajuan: number;
  tanggalPengajuan: string;
  statusPeminjaman: "DIPROSES" | "DITERIMA" | "DITOLAK";
  jumlahKredit: string;
  lamaTenor: number;
  debitur: {
    namaDebitur: string;
    email: string;
    telepon: string;
    nik: string;
    alamat: string;
  };
  survey?: {
    skorProfileMatching: string;
    tingkatRisiko: "RENDAH" | "MENENGAH" | "TINGGI";
  } | null;
}

export const DashboardKreditur: FC = () => {
  const { data: pengajuanList, isLoading } = useGetPengajuan();

  // Helper formatting nominal Rupiah
  const formatRupiah = (val: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(val));
  };

  // Kalkulasi statistik dari data riil
  const totalPengajuan = pengajuanList?.length || 0;
  const pendingCount = pengajuanList?.filter((p) => p.statusPeminjaman === "DIPROSES").length || 0;
  const approvedList = pengajuanList?.filter((p) => p.statusPeminjaman === "DITERIMA") || [];
  const totalDanaDisalurkan = approvedList.reduce((acc, curr) => acc + Number(curr.jumlahKredit), 0);
  const activeDebiturCount = new Set(pengajuanList?.map((p) => p.debitur?.idDebitur)).size;

  // Batasi daftar antrean terbaru maksimal 5 data
  const latestQueue = pengajuanList?.slice(0, 5) || [];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Ringkasan Portofolio</h1>
        <p className="text-sm text-slate-400 mt-1">Pantau performa penyaluran dana dan antrean pengajuan hari ini secara dinamis.</p>
      </div>

      {/* Widget Statistik Panel Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6" hoverEffect={false}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Dana Disalurkan</p>
          <p className="text-2xl font-extrabold text-white">{formatRupiah(totalDanaDisalurkan)}</p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center font-semibold">
            <span className="mr-1">Dana Cair</span> dari {approvedList.length} berkas disetujui
          </p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden" hoverEffect={false}>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Pengajuan Menunggu</p>
            <p className="text-2xl font-extrabold text-amber-400">{pendingCount} Berkas</p>
            <p className="text-xs text-slate-500 mt-2 font-semibold">Butuh survei & input data lapangan</p>
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        </GlassCard>

        <GlassCard className="p-6" hoverEffect={false}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rasio Gagal Bayar (NPL)</p>
          <p className="text-2xl font-extrabold text-white">0.85%</p>
          <p className="text-xs text-emerald-400 mt-2 font-semibold">Sangat Sehat (Di bawah 5%)</p>
        </GlassCard>

        <GlassCard className="p-6" hoverEffect={false}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Debitur Aktif</p>
          <p className="text-2xl font-extrabold text-white">{activeDebiturCount} Orang</p>
          <p className="text-xs text-slate-500 mt-2 font-semibold">Terdaftar di sistem aggregator</p>
        </GlassCard>
      </div>

      {/* Tabel Data Pengajuan */}
      <GlassCard className="overflow-hidden" hoverEffect={false}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-lg font-bold text-white">Antrean Pengajuan Terbaru</h3>
          <Link 
            to="/kreditur/pengajuan" 
            className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-colors decoration-none"
          >
            Lihat Semua ({totalPengajuan})
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <span className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-slate-400 mt-2">Memuat antrean...</p>
          </div>
        ) : latestQueue.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Tidak ada antrean berkas pengajuan kredit saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">ID Req</th>
                  <th className="px-6 py-4 whitespace-nowrap">Calon Debitur</th>
                  <th className="px-6 py-4 whitespace-nowrap">Nominal & Tenor</th>
                  <th className="px-6 py-4 whitespace-nowrap">Skor SPK / Risiko</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {latestQueue.map((row: LivePengajuan, index: number) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">REQ-{row.idPengajuan}</td>
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{row.debitur.namaDebitur}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-emerald-400">{formatRupiah(row.jumlahKredit)}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{row.lamaTenor} Bulan</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.survey ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            {row.survey.skorProfileMatching}
                          </span>
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            row.survey.tingkatRisiko === "RENDAH" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                            row.survey.tingkatRisiko === "MENENGAH" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                            "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {row.survey.tingkatRisiko}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Belum disurvei</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`flex items-center text-xs font-bold ${
                        row.statusPeminjaman === "DIPROSES" ? "text-amber-400" :
                        row.statusPeminjaman === "DITERIMA" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {row.statusPeminjaman === "DIPROSES" && <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>}
                        {row.statusPeminjaman === "DITERIMA" && <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>}
                        {row.statusPeminjaman === "DITOLAK" && <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>}
                        {row.statusPeminjaman}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Link 
                        to="/kreditur/pengajuan" 
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-colors decoration-none inline-block cursor-pointer"
                      >
                        Tinjau
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

    </div>
  );
};
import { type FC } from "react";
import { useGetPengajuan, useCalculateSpk, useCalculateBulkSpk } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const KalkulasiSpk: FC = () => {
  const { data: pengajuanList, isLoading, refetch } = useGetPengajuan();
  const calculateSpkMutation = useCalculateSpk();
  const calculateBulkSpkMutation = useCalculateBulkSpk();

  // Filter pengajuan yang statusnya MENUNGGU_SPK (sudah disurvey tapi belum dihitung)
  const waitingList = pengajuanList?.filter((p) => p.statusPeminjaman === "MENUNGGU_SPK") || [];

  const handleCalculateSingle = (idPengajuan: number) => {
    calculateSpkMutation.mutate(idPengajuan, {
      onSuccess: (res) => {
        alert(
          `Kalkulasi SPK Berhasil!\n\nNama Nasabah: ${res.data.namaNasabah}\nSkor Akhir: ${res.data.skorAkhir}\nRisiko: ${res.data.tingkatRisiko}\nStatus Akhir: ${res.data.statusPeminjaman}`
        );
        refetch();
      },
      onError: (err: any) => {
        alert(`Gagal kalkulasi SPK: ${err?.response?.data?.message || err.message}`);
      },
    });
  };

  const handleCalculateBulk = () => {
    if (waitingList.length === 0) return;
    if (!confirm(`Apakah Anda yakin ingin mengkalkulasi seluruh (${waitingList.length}) berkas pengajuan dalam antrean secara massal?`)) return;

    calculateBulkSpkMutation.mutate(undefined, {
      onSuccess: (res) => {
        alert(res.message || `Kalkulasi massal berhasil memproses ${res.count} berkas.`);
        refetch();
      },
      onError: (err: any) => {
        alert(`Gagal kalkulasi massal: ${err?.response?.data?.message || err.message}`);
      },
    });
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Kalkulasi Kelayakan SPK</h1>
          <p className="text-slate-400 text-sm mt-2">
            Proses perhitungan Profile Matching kelayakan pinjaman kredit nasabah secara otomatis.
          </p>
        </div>
        
        {waitingList.length > 0 && (
          <button
            onClick={handleCalculateBulk}
            disabled={calculateBulkSpkMutation.isPending}
            className="px-6 py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/10 cursor-pointer text-sm"
          >
            {calculateBulkSpkMutation.isPending ? "Memproses Massal..." : `Hitung Semua Data (${waitingList.length})`}
          </button>
        )}
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/2 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Antrean Pengajuan Menunggu SPK</h2>
          <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold">
            {waitingList.length} Berkas Antrean
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/3 text-[10px] text-slate-400 font-bold uppercase">
              <th className="p-4">Tanggal Masuk</th>
              <th className="p-4">Nama Nasabah</th>
              <th className="p-4">Nominal Pengajuan</th>
              <th className="p-4">Jangka Tenor</th>
              <th className="p-4">Status Pengajuan</th>
              <th className="p-4 text-center">Aksi Kalkulasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">Memuat daftar antrean SPK...</td>
              </tr>
            ) : waitingList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  <div className="text-3xl mb-3">🎉</div>
                  <p className="text-slate-400 font-bold">Semua Antrean Bersih</p>
                  <p className="text-slate-500 text-xs mt-1">Tidak ada berkas pengajuan kredit berstatus MENUNGGU_SPK saat ini.</p>
                </td>
              </tr>
            ) : (
              waitingList.map((p) => (
                <tr key={p.idPengajuan} className="hover:bg-white/1 text-slate-300">
                  <td className="p-4 text-xs font-mono text-slate-400">
                    {new Date(p.tanggalPengajuan).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{p.nasabah?.namaNasabah}</div>
                    <div className="text-[10px] text-slate-500">{p.nasabah?.email}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    Rp {Number(p.jumlahKredit).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{p.lamaTenor} Bulan</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {p.statusPeminjaman}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCalculateSingle(p.idPengajuan)}
                      disabled={calculateSpkMutation.isPending}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-indigo-500 hover:text-white rounded-xl text-xs font-bold transition text-slate-400 cursor-pointer"
                    >
                      {calculateSpkMutation.isPending && calculateSpkMutation.variables === p.idPengajuan
                        ? "Menghitung..."
                        : "Hitung SPK"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
export default KalkulasiSpk;

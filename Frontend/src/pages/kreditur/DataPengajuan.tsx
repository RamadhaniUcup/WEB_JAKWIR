import { useState, type FC } from "react";
import { useGetPengajuan, useUpdateApprovalStatus } from "../../hooks/useApi.js";
import { FormSurvey } from "../../components/kreditur/FormSurvey.js";
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
    totalAset: string;
    pendapatanBersih: string;
    statusHunian: string;
    statusPekerjaan: string;
    jumlahTanggungan: number;
    nilaiJaminanAset: string;
    rasioHutang: string;
    persentaseJaminan: string;
    skorProfileMatching: string;
    tingkatRisiko: "RENDAH" | "MENENGAH" | "TINGGI";
  } | null;
}

export const DataPengajuan: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterRisk, setFilterRisk] = useState("Semua");
  const [selectedPengajuan, setSelectedPengajuan] = useState<LivePengajuan | null>(null);

  // Hook untuk mengambil list pengajuan
  const { data: pengajuanList, isLoading, refetch } = useGetPengajuan();
  
  // Hook untuk memproses status DITERIMA/DITOLAK
  const updateApprovalStatusMutation = useUpdateApprovalStatus();

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
    if (status === "DIPROSES") return "Menunggu Verifikasi";
    if (status === "DITERIMA") return "Disetujui";
    return "Ditolak";
  };

  // Filter logika data
  const filteredData = (pengajuanList || []).filter((item: LivePengajuan) => {
    const matchesSearch =
      item.debitur.namaDebitur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `REQ-${item.idPengajuan}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusText = translateStatus(item.statusPeminjaman);
    const matchesStatus = filterStatus === "Semua" || statusText === filterStatus;
    
    const riskText = item.survey?.tingkatRisiko 
      ? item.survey.tingkatRisiko === "RENDAH" ? "Rendah" : item.survey.tingkatRisiko === "MENENGAH" ? "Menengah" : "Tinggi"
      : "Belum disurvei";
    const matchesRisk = filterRisk === "Semua" || riskText === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleApproveReject = (id: number, decision: "DITERIMA" | "DITOLAK") => {
    updateApprovalStatusMutation.mutate(
      { idPengajuan: id, statusPeminjaman: decision },
      {
        onSuccess: () => {
          alert(`Status permohonan kredit berhasil diupdate ke: ${decision}`);
          setSelectedPengajuan(null);
          refetch();
        },
        onError: (err: any) => {
          alert(`Gagal merubah status: ${err?.response?.data?.message || err.message}`);
        },
      }
    );
  };

  return (
    <div className="space-y-8 font-sans relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Data Pengajuan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tinjau profil risiko, hitung kriteria Profile Matching, dan proses persetujuan kredit calon debitur.
        </p>
      </div>

      {/* Control Panel / Filter */}
      <GlassCard className="p-6" hoverEffect={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pencarian */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cari Debitur</label>
            <input
              type="text"
              placeholder="Cari ID atau Nama Debitur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.1] text-white focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition"
            />
          </div>

          {/* Filter Status */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0f172a] border border-white/[0.1] text-white focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          {/* Filter Risiko */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Risiko</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-[#0f172a] border border-white/[0.1] text-white focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition cursor-pointer"
            >
              <option value="Semua">Semua Tingkat Risiko</option>
              <option value="Rendah">Rendah (Aman)</option>
              <option value="Menengah">Menengah</option>
              <option value="Tinggi">Tinggi (Berisiko)</option>
              <option value="Belum disurvei">Belum Disurvei</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Tabel Data Pengajuan */}
      <GlassCard className="overflow-hidden" hoverEffect={false}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-lg font-bold text-white">Daftar Berkas Pengajuan</h3>
          <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
            {filteredData.length} Ditemukan
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-slate-400 mt-2">Memuat berkas masuk...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">ID Req</th>
                  <th className="px-6 py-4">Calon Debitur</th>
                  <th className="px-6 py-4">Tanggal Masuk</th>
                  <th className="px-6 py-4">Nominal & Tenor</th>
                  <th className="px-6 py-4">Skor / Risiko</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.length > 0 ? (
                  filteredData.map((row: LivePengajuan) => {
                    const formattedDate = new Date(row.tanggalPengajuan).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <tr key={row.idPengajuan} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">REQ-{row.idPengajuan}</td>
                        <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{row.debitur.namaDebitur}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">{formattedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-emerald-400">{formatRupiah(row.jumlahKredit)}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{row.lamaTenor} Bulan</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.survey ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                {row.survey.skorProfileMatching}
                              </span>
                              <span
                                className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                  row.survey.tingkatRisiko === "RENDAH"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : row.survey.tingkatRisiko === "MENENGAH"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}
                              >
                                {row.survey.tingkatRisiko}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Belum disurvei</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`flex items-center text-xs font-bold ${getStatusBadge(row.statusPeminjaman)} px-2.5 py-1 rounded-xl border w-fit`}>
                            {translateStatus(row.statusPeminjaman)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setSelectedPengajuan(row)}
                            className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-400 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition cursor-pointer"
                          >
                            Tinjau Berkas
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                      Tidak ada data pengajuan yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* DETAIL MODAL OVERLAY */}
      {selectedPengajuan && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <GlassCard className="w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto" hoverEffect={false}>
            {/* Header Modal */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-indigo-400">ID PENGAJUAN: REQ-{selectedPengajuan.idPengajuan}</span>
                <h2 className="text-2xl font-bold text-white mt-1">Evaluasi Pengajuan Kredit</h2>
              </div>
              <button
                onClick={() => setSelectedPengajuan(null)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Kolom Kiri: Profil & KTP */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Identitas Calon Debitur</h4>
                  <table className="w-full text-xs text-slate-300 space-y-2">
                    <tbody>
                      <tr>
                        <td className="py-1.5 text-slate-500 w-1/3">Nama</td>
                        <td className="py-1.5 font-bold text-white">{selectedPengajuan.debitur.namaDebitur}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 text-slate-500">Email</td>
                        <td className="py-1.5 font-semibold text-slate-300">{selectedPengajuan.debitur.email}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 text-slate-500">Telepon</td>
                        <td className="py-1.5 text-slate-300">{selectedPengajuan.debitur.telepon}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 text-slate-500">NIK (Decrypted)</td>
                        <td className="py-1.5 text-slate-300 font-mono">{selectedPengajuan.debitur.nik}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 text-slate-500">Alamat Rumah</td>
                        <td className="py-1.5 text-slate-300 leading-relaxed">{selectedPengajuan.debitur.alamat}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rincian Kredit</h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500">Jumlah Dimohon</p>
                      <p className="text-lg font-bold text-emerald-400">{formatRupiah(selectedPengajuan.jumlahKredit)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Tenor Waktu</p>
                      <p className="text-lg font-bold text-white">{selectedPengajuan.lamaTenor} Bulan</p>
                    </div>
                  </div>
                </div>

                {/* Tampilkan Kalkulasi Rasio & Keputusan jika survey sudah diinput */}
                {selectedPengajuan.survey && (
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hasil SPK Profile Matching</h4>
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500">Rasio Hutang (DTI)</p>
                        <p className="text-sm font-bold text-slate-200">{selectedPengajuan.survey.rasioHutang}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Persentase Jaminan</p>
                        <p className="text-sm font-bold text-slate-200">{selectedPengajuan.survey.persentaseJaminan}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Skor Akhir SPK</p>
                        <p className="text-lg font-extrabold text-indigo-400">{selectedPengajuan.survey.skorProfileMatching} / 5.00</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Tingkat Risiko</p>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-bold rounded ${
                          selectedPengajuan.survey.tingkatRisiko === "RENDAH" ? "bg-emerald-500/10 text-emerald-400" :
                          selectedPengajuan.survey.tingkatRisiko === "MENENGAH" ? "bg-amber-500/10 text-amber-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>
                          {selectedPengajuan.survey.tingkatRisiko}
                        </span>
                      </div>
                    </div>

                    {/* Tombol Keputusan Pengajuan */}
                    {selectedPengajuan.statusPeminjaman === "DIPROSES" && (
                      <div className="flex gap-4 pt-2">
                        <button
                          onClick={() => handleApproveReject(selectedPengajuan.idPengajuan, "DITERIMA")}
                          disabled={updateApprovalStatusMutation.isPending}
                          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          Setujui Kredit
                        </button>
                        <button
                          onClick={() => handleApproveReject(selectedPengajuan.idPengajuan, "DITOLAK")}
                          disabled={updateApprovalStatusMutation.isPending}
                          className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          Tolak Kredit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Formulir Survei Lapangan */}
              <div>
                {!selectedPengajuan.survey ? (
                  <FormSurvey 
                    idPengajuan={selectedPengajuan.idPengajuan} 
                    onSuccessCallback={() => {
                      setSelectedPengajuan(null);
                      refetch();
                    }}
                  />
                ) : (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h3 className="text-sm font-bold text-white">Detail Survey Lapangan (Tersimpan)</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500">Total Aset</span>
                        <span className="text-slate-300 font-semibold">{formatRupiah(selectedPengajuan.survey.totalAset)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500">Pendapatan Bersih</span>
                        <span className="text-slate-300 font-semibold">{formatRupiah(selectedPengajuan.survey.pendapatanBersih)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500">Status Pekerjaan</span>
                        <span className="text-slate-300 font-semibold">{selectedPengajuan.survey.statusPekerjaan}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500">Status Tempat Tinggal</span>
                        <span className="text-slate-300 font-semibold">{selectedPengajuan.survey.statusHunian}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500">Jumlah Tanggungan</span>
                        <span className="text-slate-300 font-semibold">{selectedPengajuan.survey.jumlahTanggungan} Orang</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Nilai Jaminan Aset</span>
                        <span className="text-slate-300 font-semibold">{formatRupiah(selectedPengajuan.survey.nilaiJaminanAset)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

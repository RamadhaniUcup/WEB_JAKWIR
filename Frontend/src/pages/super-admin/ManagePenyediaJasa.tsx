import { useState, type FC } from "react";
import {
  useGetSuperAdminPenyediaJasas,
  useCreateSuperAdminPenyediaJasa,
  useUpdateSuperAdminPenyediaJasa,
  useDeleteSuperAdminPenyediaJasa,
} from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

interface PenyediaJasaRow {
  idPenyediaJasa: number;
  namaPenyediaJasa: string;
  alamat: string;
  statusAktif: "AKTIF" | "TIDAK_AKTIF";
  limitPengajuan: string;
  limitTenor: number;
}

export const ManagePenyediaJasa: FC = () => {
  const { data: list, isLoading } = useGetSuperAdminPenyediaJasas();
  const createMutation = useCreateSuperAdminPenyediaJasa();
  const updateMutation = useUpdateSuperAdminPenyediaJasa();
  const deleteMutation = useDeleteSuperAdminPenyediaJasa();

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [namaPenyediaJasa, setNamaPenyediaJasa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [statusAktif, setStatusAktif] = useState<"AKTIF" | "TIDAK_AKTIF">("AKTIF");
  const [limitPengajuan, setLimitPengajuan] = useState(0);
  const [limitTenor, setLimitTenor] = useState(12);

  const [isOpenForm, setIsOpenForm] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setNamaPenyediaJasa("");
    setAlamat("");
    setStatusAktif("AKTIF");
    setLimitPengajuan(0);
    setLimitTenor(12);
    setIsOpenForm(false);
  };

  const handleEdit = (k: PenyediaJasaRow) => {
    setEditingId(k.idPenyediaJasa);
    setNamaPenyediaJasa(k.namaPenyediaJasa);
    setAlamat(k.alamat);
    setStatusAktif(k.statusAktif);
    setLimitPengajuan(Number(k.limitPengajuan));
    setLimitTenor(k.limitTenor);
    setIsOpenForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateMutation.mutate(
        {
          idPenyediaJasa: editingId,
          namaPenyediaJasa,
          alamat,
          statusAktif,
          limitPengajuan,
          limitTenor,
        },
        {
          onSuccess: () => {
            alert("Penyedia jasa berhasil diperbarui!");
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          namaPenyediaJasa,
          alamat,
          statusAktif,
          limitPengajuan,
          limitTenor,
        },
        {
          onSuccess: () => {
            alert("Penyedia jasa berhasil didaftarkan!");
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus penyedia jasa ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          alert("Penyedia jasa berhasil dihapus.");
        },
      });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Penyedia Jasa</h1>
          <p className="text-sm text-slate-400 mt-1">Registrasi lembaga pembiayaan baru dan konfigurasikan limit pengajuan kredit.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsOpenForm(true);
          }}
          className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Tambah Lembaga
        </button>
      </div>

      {/* Form Input/Edit Modal-style */}
      {isOpenForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-lg p-8 relative" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Ubah Data Lembaga" : "Registrasi Lembaga Baru"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nama Penyedia Jasa</label>
                <input
                  type="text"
                  value={namaPenyediaJasa}
                  onChange={(e) => setNamaPenyediaJasa(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="Contoh: IndoFund Digital"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Alamat Kantor Pusat</label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="Alamat kantor lengkap..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Maksimal Limit Kredit (Rp)</label>
                  <input
                    type="number"
                    value={limitPengajuan}
                    onChange={(e) => setLimitPengajuan(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="Contoh: 100000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Maksimal Tenor (Bulan)</label>
                  <input
                    type="number"
                    value={limitTenor}
                    onChange={(e) => setLimitTenor(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="Contoh: 24"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Status Aktif Aggregator</label>
                <select
                  value={statusAktif}
                  onChange={(e) => setStatusAktif(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-sm transition cursor-pointer"
                >
                  <option value="AKTIF">Aktif (Ditampilkan di publik)</option>
                  <option value="TIDAK_AKTIF">Tidak Aktif (Diarsipkan)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full py-3 bg-linear-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                {editingId ? "Simpan Perubahan" : "Daftarkan Lembaga"}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Tabel Data */}
      <GlassCard className="overflow-hidden" hoverEffect={false}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-slate-400 mt-2 font-semibold">Memuat data lembaga...</p>
          </div>
        ) : !list || list.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Tidak ada penyedia jasa terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Penyedia Jasa</th>
                  <th className="px-6 py-4">Alamat Kantor</th>
                  <th className="px-6 py-4">Batas Limit Pinjaman</th>
                  <th className="px-6 py-4">Maks Tenor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((row: PenyediaJasaRow) => (
                  <tr key={row.idPenyediaJasa} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{row.idPenyediaJasa}</td>
                    <td className="px-6 py-4 font-bold text-white">{row.namaPenyediaJasa}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs truncate max-w-[12rem]">{row.alamat}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(row.limitPengajuan))}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">{row.limitTenor} Bulan</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border ${
                        row.statusAktif === "AKTIF" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {row.statusAktif}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete(row.idPenyediaJasa)}
                          className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-500/20 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
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
export default ManagePenyediaJasa;

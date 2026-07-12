import { useState, type FC } from "react";
import {
  useGetSuperAdminNasabahs,
  useCreateSuperAdminNasabah,
  useUpdateSuperAdminNasabah,
  useDeleteSuperAdminNasabah,
} from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

interface NasabahRow {
  idNasabah: number;
  namaNasabah: string;
  email: string;
  telepon: string;
  nik: string;
  alamat: string;
}

export const ManageNasabah: FC = () => {
  const { data: list, isLoading } = useGetSuperAdminNasabahs();
  const createMutation = useCreateSuperAdminNasabah();
  const updateMutation = useUpdateSuperAdminNasabah();
  const deleteMutation = useDeleteSuperAdminNasabah();

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [namaNasabah, setNamaNasabah] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");

  const [isOpenForm, setIsOpenForm] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setNamaNasabah("");
    setEmail("");
    setTelepon("");
    setNik("");
    setAlamat("");
    setPassword("");
    setIsOpenForm(false);
  };

  const handleEdit = (d: NasabahRow) => {
    setEditingId(d.idNasabah);
    setNamaNasabah(d.namaNasabah);
    setEmail(d.email);
    setTelepon(d.telepon);
    setNik(d.nik);
    setAlamat(d.alamat);
    setPassword("");
    setIsOpenForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      namaNasabah,
      email,
      telepon,
      nik,
      alamat,
    };
    if (password) payload.password = password;

    if (editingId) {
      updateMutation.mutate(
        { idNasabah: editingId, ...payload },
        {
          onSuccess: () => {
            alert("Biodata nasabah berhasil diupdate!");
            resetForm();
          },
        }
      );
    } else {
      if (!password) {
        alert("Kata sandi wajib diisi untuk pendaftaran nasabah baru!");
        return;
      }
      createMutation.mutate({ ...payload, password }, {
        onSuccess: () => {
          alert("Nasabah baru berhasil didaftarkan!");
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus profil nasabah ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          alert("Profil nasabah berhasil dihapus.");
        },
      });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Data Nasabah</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola data profil e-KYC KTP, alamat tinggal, dan kredensial login nasabah.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsOpenForm(true);
          }}
          className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Tambah Nasabah
        </button>
      </div>

      {/* Form Input/Edit */}
      {isOpenForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-lg p-8 relative" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Ubah Data Nasabah" : "Registrasi Nasabah Baru"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nama Lengkap Sesuai KTP</label>
                <input
                  type="text"
                  value={namaNasabah}
                  onChange={(e) => setNamaNasabah(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="0812xxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">NIK (16-Digit)</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    maxLength={16}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition font-mono"
                    placeholder="320xxxxxxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Kata Sandi</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                    placeholder="••••••••"
                    required={!editingId}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Alamat Lengkap</label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="Tulis domisili rumah saat ini..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full py-3 bg-linear-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                {editingId ? "Simpan Perubahan" : "Registrasi Nasabah"}
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
            <p className="text-xs text-slate-400 mt-2 font-semibold">Memuat data nasabah...</p>
          </div>
        ) : !list || list.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Tidak ada nasabah terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Telepon</th>
                  <th className="px-6 py-4">NIK (Decrypted)</th>
                  <th className="px-6 py-4">Alamat Rumah</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((row: NasabahRow) => (
                  <tr key={row.idNasabah} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{row.idNasabah}</td>
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{row.namaNasabah}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{row.email}</td>
                    <td className="px-6 py-4 text-slate-300 text-xs">{row.telepon}</td>
                    <td className="px-6 py-4 font-mono text-slate-300 text-xs">{row.nik}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs max-w-[12rem] truncate">{row.alamat}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete(row.idNasabah)}
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
export default ManageNasabah;

import { useState, type FC } from "react";
import {
  useGetSuperAdminUsers,
  useCreateSuperAdminUser,
  useUpdateSuperAdminUser,
  useDeleteSuperAdminUser,
  useGetSuperAdminPenyediaJasas,
} from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

interface UserRow {
  idUser: number;
  username: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  idPenyediaJasa: number | null;
  penyediaJasa?: {
    namaPenyediaJasa: string;
  } | null;
}

export const ManageUsers: FC = () => {
  const { data: users, isLoading } = useGetSuperAdminUsers();
  const { data: penyediaJasas } = useGetSuperAdminPenyediaJasas();

  const createMutation = useCreateSuperAdminUser();
  const updateMutation = useUpdateSuperAdminUser();
  const deleteMutation = useDeleteSuperAdminUser();

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [idPenyediaJasa, setIdPenyediaJasa] = useState<string>("");

  const [isOpenForm, setIsOpenForm] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("ADMIN");
    setIdPenyediaJasa("");
    setIsOpenForm(false);
  };

  const handleEdit = (u: UserRow) => {
    setEditingId(u.idUser);
    setUsername(u.username);
    setEmail(u.email);
    setPassword(""); // Jangan tampilkan password lama demi keamanan
    setRole(u.role);
    setIdPenyediaJasa(u.idPenyediaJasa ? String(u.idPenyediaJasa) : "");
    setIsOpenForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      username,
      email,
      role,
      idPenyediaJasa: idPenyediaJasa ? Number(idPenyediaJasa) : null,
    };
    if (password) payload.password = password;

    if (editingId) {
      updateMutation.mutate(
        { idUser: editingId, ...payload },
        {
          onSuccess: () => {
            alert("Akun admin berhasil diupdate!");
            resetForm();
          },
        }
      );
    } else {
      if (!password) {
        alert("Password wajib diisi untuk registrasi baru!");
        return;
      }
      createMutation.mutate(payload, {
        onSuccess: () => {
          alert("Akun admin berhasil didaftarkan!");
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun admin ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          alert("Akun berhasil dihapus.");
        },
      });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Akun Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Konfigurasikan username, kata sandi, dan lembaga mitra untuk administrator.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsOpenForm(true);
          }}
          className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Tambah Akun Admin
        </button>
      </div>

      {/* Form Input/Edit */}
      {isOpenForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-lg p-8 relative" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Ubah Akun Admin" : "Tambah Akun Admin Baru"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nama Pengguna (Username)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="Contoh: admin_indofund"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Alamat Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="admin@lembaga.id"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Kata Sandi {editingId && "(Kosongkan jika tidak ingin diubah)"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition"
                  placeholder="••••••••"
                  required={!editingId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Peran Otorisasi</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-sm transition cursor-pointer"
                  >
                    <option value="ADMIN">Lembaga Admin</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Penyedia Jasa</label>
                  <select
                    value={idPenyediaJasa}
                    onChange={(e) => setIdPenyediaJasa(e.target.value)}
                    disabled={role === "SUPER_ADMIN"}
                    className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required={role === "ADMIN"}
                  >
                    <option value="">-- Hubungkan Penyedia Jasa --</option>
                    {penyediaJasas?.map((k) => (
                      <option key={k.idPenyediaJasa} value={k.idPenyediaJasa}>
                        {k.namaPenyediaJasa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full py-3 bg-linear-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                {editingId ? "Simpan Perubahan" : "Buat Akun Admin"}
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
            <p className="text-xs text-slate-400 mt-2 font-semibold">Memuat data user...</p>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Tidak ada user admin terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Peran</th>
                  <th className="px-6 py-4">Penyedia Jasa</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((row: UserRow) => (
                  <tr key={row.idUser} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{row.idUser}</td>
                    <td className="px-6 py-4 font-bold text-white">{row.username}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{row.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded border ${
                        row.role === "SUPER_ADMIN" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}>
                        {row.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "MITRA ADMIN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-xs font-semibold">
                      {row.role === "SUPER_ADMIN" ? (
                        <span className="text-slate-500 italic">Semua Lembaga</span>
                      ) : (
                        row.penyediaJasa?.namaPenyediaJasa || <span className="text-red-400">Putus Hubungan</span>
                      )}
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
                          onClick={() => handleDelete(row.idUser)}
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
export default ManageUsers;

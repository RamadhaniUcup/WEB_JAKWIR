import { useState, useEffect, type FC, type FormEvent } from "react";
import { useGetDebiturProfile, useUpdateDebiturProfile } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const EditProfile: FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");

  // Ambil profil debitur
  const { data: profile, isLoading } = useGetDebiturProfile();
  const updateProfileMutation = useUpdateDebiturProfile();

  // Sinkronisasi data saat profil termuat
  useEffect(() => {
    if (profile) {
      setName(profile.namaDebitur || "");
      setPhone(profile.telepon || "");
      setNik(profile.nik || "");
      setAlamat(profile.alamat || "");
    }
  }, [profile]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate(
      {
        namaDebitur: name,
        telepon: phone,
        nik,
        alamat,
      },
      {
        onSuccess: () => {
          alert("Profil Anda berhasil disimpan dan diperbarui!");
        },
        onError: (err: any) => {
          alert(`Gagal memperbarui profil: ${err?.response?.data?.message || err.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-screen text-slate-200">
        <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto text-slate-200 min-h-screen font-sans">
      <GlassCard className="p-8" hoverEffect={false}>
        <h2 className="text-2xl font-bold text-white mb-6">Pengaturan Profil</h2>
        
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden border-2 border-indigo-400">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=6366f1&color=fff&size=128`} 
              alt="Profil Besar" 
            />
          </div>
          <div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Nasabah Terverifikasi
            </span>
            <p className="text-[10px] text-slate-500 mt-2">NIK dan Alamat dilindungi oleh enkripsi kriptografi AES-256.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Nama Lengkap Sesuai KTP</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              required
            />
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Alamat Email</label>
            <input 
              type="email" 
              value={profile?.email || ""}
              className="w-full px-4 py-3 bg-white/3 border border-white/5 rounded-xl text-slate-500 cursor-not-allowed text-sm" 
              disabled 
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Nomor Handphone Aktif</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              required
            />
          </div>

          {/* NIK (Sensitif) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</label>
            <input 
              type="text" 
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="16-digit nomor KTP Anda"
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              maxLength={16}
              required
            />
          </div>

          {/* Alamat (Sensitif) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Alamat Rumah Sesuai KTP</label>
            <textarea 
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Alamat domisili lengkap..."
              rows={3}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              required
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="w-full py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Menyimpan Profil...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
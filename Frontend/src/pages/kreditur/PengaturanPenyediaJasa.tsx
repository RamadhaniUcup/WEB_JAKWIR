import { useState, useEffect, type FC, type FormEvent } from "react";
import { useGetMyPenyediaJasaProfile, useUpdateMyPenyediaJasaProfile } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const PengaturanPenyediaJasa: FC = () => {
  const [namaPenyediaJasa, setNamaPenyediaJasa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [limitPengajuan, setLimitPengajuan] = useState("");
  const [limitTenor, setLimitTenor] = useState("");
  const [persentaseCf, setPersentaseCf] = useState("60");
  const [persentaseSf, setPersentaseSf] = useState("40");

  const { data: profile, isLoading } = useGetMyPenyediaJasaProfile();
  const updateMutation = useUpdateMyPenyediaJasaProfile();

  useEffect(() => {
    if (profile) {
      setNamaPenyediaJasa(profile.namaPenyediaJasa || "");
      setAlamat(profile.alamat || "");
      setLimitPengajuan(String(profile.limitPengajuan || 0));
      setLimitTenor(String(profile.limitTenor || 12));
      setPersentaseCf(String(profile.persentaseCf || 60));
      setPersentaseSf(String(profile.persentaseSf || 40));
    }
  }, [profile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const cfVal = Number(persentaseCf);
    const sfVal = Number(persentaseSf);

    if (cfVal + sfVal !== 100) {
      alert("Total persentase Core Factor & Secondary Factor harus berjumlah 100%.");
      return;
    }

    updateMutation.mutate(
      {
        namaPenyediaJasa,
        alamat,
        limitPengajuan: Number(limitPengajuan),
        limitTenor: Number(limitTenor),
        persentaseCf: cfVal,
        persentaseSf: sfVal,
      },
      {
        onSuccess: () => {
          alert("Profil instansi dan pengaturan SPK berhasil diperbarui!");
        },
        onError: (err: any) => {
          alert(`Gagal menyimpan konfigurasi: ${err?.response?.data?.message || err.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-200">
        <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Pengaturan Instansi</h1>
        <p className="text-sm text-slate-400 mt-1">Konfigurasikan limit penyaluran kredit dan profil lembaga pembiayaan Anda.</p>
      </div>

      <GlassCard className="p-8" hoverEffect={false}>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nama Penyedia Jasa Pembiayaan</label>
            <input 
              type="text" 
              value={namaPenyediaJasa}
              onChange={(e) => setNamaPenyediaJasa(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Alamat Kantor Pusat</label>
            <textarea 
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Maksimal Nominal Pengajuan (Rp)</label>
              <input 
                type="number" 
                value={limitPengajuan}
                onChange={(e) => setLimitPengajuan(e.target.value)}
                className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="Contoh: 150000000"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">Batas pinjaman nasabah untuk lembaga Anda.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Maksimal Tenor Cicilan (Bulan)</label>
              <input 
                type="number" 
                value={limitTenor}
                onChange={(e) => setLimitTenor(e.target.value)}
                className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="Contoh: 36"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">Batas jangka waktu pelunasan cicilan bulanan.</p>
            </div>
          </div>


          {/* Bobot CF / SF Global */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bobot Core Factor (CF %)</label>
              <input 
                type="number" 
                value={persentaseCf}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPersentaseCf(String(val));
                  setPersentaseSf(String(100 - val));
                }}
                min={0}
                max={100}
                className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">Bobot kriteria utama CORE.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bobot Secondary Factor (SF %)</label>
              <input 
                type="number" 
                value={persentaseSf}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPersentaseSf(String(val));
                  setPersentaseCf(String(100 - val));
                }}
                min={0}
                max={100}
                className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">Bobot kriteria pendukung SECONDARY.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Menyimpan Pengaturan...
                </>
              ) : (
                "Simpan Pengaturan Instansi"
              )}
            </button>
          </div>

        </form>
      </GlassCard>
    </div>
  );
};
export default PengaturanPenyediaJasa;

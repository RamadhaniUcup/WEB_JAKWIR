import { useState, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetKrediturList, useSubmitPengajuan } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const PengajuanKredit: FC = () => {
  const [idKreditur, setIdKreditur] = useState("");
  const [nominal, setNominal] = useState("");
  const [tenor, setTenor] = useState("12");
  const [keperluan, setKeperluan] = useState("");
  
  const navigate = useNavigate();

  // Fetch daftar kreditur dan mutasi submit
  const { data: krediturList, isLoading: isKrediturLoading } = useGetKrediturList();
  const submitPengajuanMutation = useSubmitPengajuan();

  const handleKirim = (e: FormEvent) => {
    e.preventDefault();

    if (!idKreditur) {
      alert("Harap pilih lembaga kreditur terlebih dahulu!");
      return;
    }

    submitPengajuanMutation.mutate(
      {
        idKreditur: Number(idKreditur),
        jumlahKredit: Number(nominal),
        lamaTenor: Number(tenor),
      },
      {
        onSuccess: () => {
          alert("Pengajuan kredit berhasil terkirim dan status Anda sekarang: DIPROSES.");
          navigate("/debitur/history");
        },
        onError: (err: any) => {
          alert(`Gagal mengirim pengajuan: ${err?.response?.data?.message || err.message}`);
        },
      }
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-slate-200 pt-32 font-sans">
      <GlassCard className="p-8" hoverEffect={false}>
        <h2 className="text-2xl font-bold text-white mb-6">Formulir Pengajuan Kredit</h2>
        
        <form onSubmit={handleKirim} className="space-y-5">
          {/* Pilih Lembaga Kreditur */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Mitra Lembaga Kreditur</label>
            {isKrediturLoading ? (
              <div className="text-xs text-slate-400">Loading daftar lembaga...</div>
            ) : (
              <select
                value={idKreditur}
                onChange={(e) => setIdKreditur(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
                required
              >
                <option value="">-- Pilih Lembaga --</option>
                {krediturList?.map((k) => (
                  <option key={k.idKreditur} value={k.idKreditur}>
                    {k.namaPerusahaan}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nominal Kredit */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nominal Pinjaman yang Diajukan (Rp)</label>
            <input 
              type="number" 
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Contoh: 25000000" 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              required 
            />
          </div>

          {/* Tenor Jangka Waktu */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tenor Jangka Waktu (Bulan)</label>
            <select 
              value={tenor}
              onChange={(e) => setTenor(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
            >
              <option value="6">6 Bulan</option>
              <option value="12">12 Bulan</option>
              <option value="24">24 Bulan</option>
              <option value="36">36 Bulan</option>
              <option value="48">48 Bulan</option>
              <option value="60">60 Bulan</option>
            </select>
          </div>

          {/* Rencana Keperluan */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tujuan Penggunaan Dana</label>
            <textarea 
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              placeholder="Tulis alasan pengajuan, misal: modal usaha mikro..." 
              rows={4} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              required
            />
          </div>

          {/* Upload e-KYC */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Unggah Identitas KTP (e-KYC)</label>
            <input 
              type="file" 
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitPengajuanMutation.isPending}
            className="w-full py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {submitPengajuanMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Mengirim Berkas Pengajuan...
              </>
            ) : (
              "Kirim Pengajuan Kredit"
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
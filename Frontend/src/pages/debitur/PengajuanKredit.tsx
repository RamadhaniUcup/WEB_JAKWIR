import { useState, useEffect, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetKrediturList, useGetKrediturDetails, useSubmitPengajuan } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const PengajuanKredit: FC = () => {
  const [idKreditur, setIdKreditur] = useState("");
  const [nominal, setNominal] = useState(5000000);
  const [tenor, setTenor] = useState("12");
  const [keperluan, setKeperluan] = useState("");
  
  const navigate = useNavigate();

  // Fetch daftar kreditur publik
  const { data: krediturList, isLoading: isKrediturLoading } = useGetKrediturList();
  
  // Fetch detail limit kreditur terpilih
  const selectedId = Number(idKreditur);
  const { data: detailKreditur } = useGetKrediturDetails(selectedId);
  const submitPengajuanMutation = useSubmitPengajuan();

  // Batas limit & tenor default
  const maxLimit = detailKreditur ? Number(detailKreditur.limitPengajuan) : 10000000;
  const maxTenor = detailKreditur ? Number(detailKreditur.limitTenor) : 12;

  // Sesuaikan nilai nominal jika melebihi batas limit kreditur terpilih
  useEffect(() => {
    if (detailKreditur) {
      const limit = Number(detailKreditur.limitPengajuan);
      if (nominal > limit) {
        setNominal(limit);
      }
      const tenorInt = Number(detailKreditur.limitTenor);
      if (Number(tenor) > tenorInt) {
        setTenor(String(tenorInt));
      }
    }
  }, [detailKreditur, nominal, tenor]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleKirim = (e: FormEvent) => {
    e.preventDefault();

    if (!idKreditur) {
      alert("Harap pilih lembaga kreditur terlebih dahulu!");
      return;
    }

    submitPengajuanMutation.mutate(
      {
        idKreditur: Number(idKreditur),
        jumlahKredit: nominal,
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

  // Kumpulan opsi tenor default
  const tenorOptions = [6, 12, 18, 24, 36, 48, 60];

  return (
    <div className="p-6 max-w-2xl mx-auto text-slate-200 pt-32 font-sans">
      <GlassCard className="p-8" hoverEffect={false}>
        <h2 className="text-2xl font-bold text-white mb-2">Formulir Pengajuan Kredit</h2>
        <p className="text-xs text-slate-400 mb-6">Ajukan limit pembiayaan sesuai kebutuhan usaha atau konsumtif Anda.</p>
        
        <form onSubmit={handleKirim} className="space-y-6">
          {/* Pilih Lembaga Kreditur */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Pilih Mitra Lembaga Kreditur</label>
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

          {/* Menampilkan limit pembiayaan jika kreditur terpilih */}
          {detailKreditur && (
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <p className="text-slate-400">Limit Pinjaman Mitra:</p>
                <p className="text-emerald-400 font-bold text-sm">{formatRupiah(maxLimit)}</p>
              </div>
              <div>
                <p className="text-slate-400">Tenor Maksimal Mitra:</p>
                <p className="text-white font-bold text-sm">{maxTenor} Bulan</p>
              </div>
            </div>
          )}

          {/* Nominal Kredit via Slider/Range Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Nominal Pinjaman Diajukan</label>
              <span className="text-sm font-extrabold text-emerald-400">{formatRupiah(nominal)}</span>
            </div>
            
            <input 
              type="range" 
              min={1000000}
              max={maxLimit}
              step={500000}
              value={nominal}
              onChange={(e) => setNominal(Number(e.target.value))}
              disabled={!idKreditur}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" 
              required 
            />
            
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
              <span>{formatRupiah(1000000)}</span>
              <span>Maks: {formatRupiah(maxLimit)}</span>
            </div>
          </div>

          {/* Tenor Jangka Waktu (Dibersihkan agar tidak melebihi limitTenor) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tenor Jangka Waktu (Bulan)</label>
            <select 
              value={tenor}
              onChange={(e) => setTenor(e.target.value)}
              disabled={!idKreditur}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tenorOptions
                .filter((opt) => opt <= maxTenor)
                .map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} Bulan
                  </option>
                ))}
            </select>
          </div>

          {/* Rencana Keperluan */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tujuan Penggunaan Dana</label>
            <textarea 
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              placeholder="Tulis alasan pengajuan, misal: modal usaha mikro..." 
              rows={3} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition" 
              required
            />
          </div>

          {/* Upload e-KYC */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Unggah Identitas KTP (e-KYC)</label>
            <input 
              type="file" 
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitPengajuanMutation.isPending || !idKreditur}
            className="w-full py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
export default PengajuanKredit;
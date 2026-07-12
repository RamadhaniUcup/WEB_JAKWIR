import { useState, useEffect, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPenyediaJasaList, useGetPenyediaJasaDetails, useSubmitPengajuan } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const PengajuanKredit: FC = () => {
  const [idPenyediaJasa, setIdPenyediaJasa] = useState("");
  const [nominal, setNominal] = useState(5000000);
  const [tenor, setTenor] = useState("12");
  const [keperluan, setKeperluan] = useState("");
  
  const navigate = useNavigate();

  // Fetch daftar penyedia jasa publik
  const { data: penyediaJasaList, isLoading: isPjLoading } = useGetPenyediaJasaList();
  
  // Fetch detail limit penyedia jasa terpilih
  const selectedId = Number(idPenyediaJasa);
  const { data: detailPj } = useGetPenyediaJasaDetails(selectedId);
  const submitPengajuanMutation = useSubmitPengajuan();

  // Batas limit & tenor default
  const maxLimit = detailPj ? Number(detailPj.limitPengajuan) : 10000000;
  const maxTenor = detailPj ? Number(detailPj.limitTenor) : 12;

  // Sesuaikan nilai nominal jika melebihi batas limit ketika penyedia jasa terpilih berubah
  useEffect(() => {
    if (detailPj) {
      const limit = Number(detailPj.limitPengajuan);
      if (nominal > limit) {
        setNominal(limit);
      }
      const tenorInt = Number(detailPj.limitTenor);
      if (Number(tenor) > tenorInt) {
        setTenor(String(tenorInt));
      }
    }
  }, [detailPj]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleKirim = (e: FormEvent) => {
    e.preventDefault();

    if (!idPenyediaJasa) {
      alert("Harap pilih lembaga Penyedia Jasa terlebih dahulu!");
      return;
    }

    if (nominal < 1000000) {
      alert("Nominal pinjaman minimal Rp 1.000.000!");
      return;
    }

    if (nominal > maxLimit) {
      alert(`Nominal pinjaman melebihi batas limit Penyedia Jasa (${formatRupiah(maxLimit)})!`);
      return;
    }

    submitPengajuanMutation.mutate(
      {
        idPenyediaJasa: Number(idPenyediaJasa),
        jumlahKredit: nominal,
        lamaTenor: Number(tenor),
      },
      {
        onSuccess: () => {
          alert("Pengajuan kredit berhasil terkirim dan status Anda sekarang: DIPROSES.");
          navigate("/nasabah/history");
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
          {/* Pilih Lembaga Penyedia Jasa */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Pilih Mitra Penyedia Jasa</label>
            {isPjLoading ? (
              <div className="text-xs text-slate-400">Loading daftar lembaga...</div>
            ) : (
              <select
                value={idPenyediaJasa}
                onChange={(e) => setIdPenyediaJasa(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
                required
              >
                <option value="">-- Pilih Lembaga --</option>
                {penyediaJasaList?.map((k) => (
                  <option key={k.idPenyediaJasa} value={k.idPenyediaJasa}>
                    {k.namaPenyediaJasa}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Menampilkan limit pembiayaan jika penyedia jasa terpilih */}
          {detailPj && (
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

          {/* Nominal Kredit via Input Angka Manual */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Nominal Pinjaman Diajukan</label>
              <span className="text-sm font-extrabold text-emerald-400">{formatRupiah(nominal)}</span>
            </div>
            
            <input 
              type="number" 
              min={1000000}
              max={maxLimit}
              value={nominal || ""}
              onChange={(e) => setNominal(Number(e.target.value))}
              disabled={!idPenyediaJasa}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold" 
              placeholder="Contoh: 15000000"
              required 
            />
            
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-semibold">
              <span>Minimal: {formatRupiah(1000000)}</span>
              <span>Maksimal: {formatRupiah(maxLimit)}</span>
            </div>
          </div>

          {/* Tenor Jangka Waktu */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tenor Jangka Waktu (Bulan)</label>
            <select 
              value={tenor}
              onChange={(e) => setTenor(e.target.value)}
              disabled={!idPenyediaJasa}
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
            disabled={submitPengajuanMutation.isPending || !idPenyediaJasa}
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

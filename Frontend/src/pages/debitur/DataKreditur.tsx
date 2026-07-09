import { type FC } from "react";
import { Link } from "react-router-dom";
import { useGetKrediturList } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

interface LiveKreditur {
  idKreditur: number;
  namaPerusahaan: string;
  alamat: string;
  statusAktif: string;
}

export const DataKreditur: FC = () => {
  const { data: krediturList, isLoading, error } = useGetKrediturList();

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200 pt-32 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Mitra Lembaga Kreditur</h1>
        <p className="text-slate-400 mt-2">Bandingkan opsi skema bunga dan profil instansi pembiayaan secara terbuka.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-xs text-slate-400 mt-3 font-semibold">Mengambil daftar mitra kreditur...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl text-center">
          Gagal mengambil data kreditur. Silakan muat ulang halaman.
        </div>
      ) : krediturList && krediturList.length === 0 ? (
        <div className="p-4 bg-white/5 border border-white/10 text-slate-400 text-sm font-semibold rounded-xl text-center">
          Tidak ada lembaga kreditur aktif terdaftar saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {krediturList?.map((k: LiveKreditur, idx: number) => {
            // Masing-masing kreditur memiliki tipe/limit tiruan untuk melengkapi visual
            const tipeOptions = ["Perbankan", "Fintech P2P", "Syariah"];
            const limitOptions = ["Rp 250 Juta", "Rp 50 Juta", "Rp 120 Juta"];
            const bungaOptions = ["0.56%", "0.98%", "Setara 0.62%"];
            const tenorOptions = ["12 - 60 Bulan", "3 - 24 Bulan", "12 - 48 Bulan"];
            
            const tipe = tipeOptions[idx % tipeOptions.length];
            const limit = limitOptions[idx % limitOptions.length];
            const bunga = bungaOptions[idx % bungaOptions.length];
            const tenor = tenorOptions[idx % tenorOptions.length];
            const rating = (4.7 + (idx % 3) * 0.1).toFixed(1);

            return (
              <GlassCard key={k.idKreditur} className="p-6 flex flex-col justify-between" hoverEffect>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{k.namaPerusahaan}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-1 inline-block">{tipe}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">★ {rating}</span>
                  </div>

                  <p className="text-[10px] text-slate-500 mb-2 font-semibold uppercase tracking-wider">Kantor Cabang</p>
                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">{k.alamat}</p>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 my-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Estimasi Bunga</p>
                      <p className="font-bold text-emerald-400">{bunga} <span className="text-[10px] font-normal text-slate-400">/bln</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Maksimal Limit</p>
                      <p className="font-bold text-white">{limit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Tenor Opsi</p>
                      <p className="font-semibold text-slate-300 text-xs">{tenor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Durasi Proses</p>
                      <p className="font-semibold text-slate-300 text-xs">1 - 3 Hari</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/debitur/pengajuan"
                  className="w-full py-2.5 mt-4 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 rounded-xl font-bold text-xs transition text-white block text-center cursor-pointer decoration-none"
                >
                  Ajukan Kredit Sekarang
                </Link>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
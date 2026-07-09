import { GlassCard } from '../../components/common/glasscard';
import type { FC } from 'react';


interface Kreditur {
  id: string;
  nama: string;
  tipe: 'Perbankan' | 'Fintech P2P' | 'Syariah';
  bunga: string;
  limit: string;
  tenor: string;
  proses: string;
  rating: number;
}

const mockKreditur: Kreditur[] = [
  { id: '1', nama: 'Bank Mitra Nasional', tipe: 'Perbankan', bunga: '0.56%', limit: 'Rp 250 Juta', tenor: '12 - 60 Bulan', proses: '2 - 3 Hari', rating: 4.9 },
  { id: '2', nama: 'IndoFund Digital', tipe: 'Fintech P2P', bunga: '0.98%', limit: 'Rp 50 Juta', tenor: '3 - 24 Bulan', proses: '10 Menit', rating: 4.8 },
  { id: '3', nama: 'Amanah Syariah', tipe: 'Syariah', bunga: 'Setara 0.62%', limit: 'Rp 120 Juta', tenor: '12 - 48 Bulan', proses: '1 - 2 Hari', rating: 4.7 }
];

export const DataKreditur: FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200 pt-32">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Pilih Lembaga Kreditur</h1>
        <p className="text-slate-400 mt-2">Bandingkan opsi skema bunga dan profil instansi pembiayaan secara terbuka.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockKreditur.map((k) => (
          <GlassCard key={k.id} className="p-6 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{k.nama}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-1 inline-block">{k.tipe}</span>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">★ {k.rating}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 my-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Suku Bunga</p>
                  <p className="font-bold text-emerald-400">{k.bunga} <span className="text-[10px] font-normal text-slate-400">/bln</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Maksimal Limit</p>
                  <p className="font-bold text-white">{k.limit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tenor Opsi</p>
                  <p className="font-semibold text-slate-300 text-xs">{k.tenor}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Durasi Proses</p>
                  <p className="font-semibold text-slate-300 text-xs">{k.proses}</p>
                </div>
              </div>
            </div>
            <button className="w-full py-2.5 mt-4 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 rounded-xl font-bold text-xs transition text-white">
              Pilih Kreditur Ini
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
import type { FC } from 'react';
import { GlassCard } from '../../components/common/glasscard';

export const HistoryPengajuan: FC = () => {
  const histories = [
    { id: 'REQ-9921', lembaga: 'IndoFund Digital', nominal: 'Rp 25.000.000', tanggal: '07 Juli 2026', status: 'Dalam Proses', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'REQ-8832', lembaga: 'Bank Mitra Nasional', nominal: 'Rp 10.000.000', tanggal: '15 Maret 2026', status: 'Lunas', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'REQ-7741', lembaga: 'Amanah Syariah', nominal: 'Rp 50.000.000', tanggal: '10 Januari 2026', status: 'Ditolak', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto text-slate-200 min-h-screen">
      <h2 className="text-3xl font-extrabold text-white mb-8">History Pengajuan Saya</h2>
      
      <div className="space-y-4">
        {histories.map((item) => (
          <GlassCard key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="text-xs font-mono text-slate-500">{item.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badge}`}>
                  {item.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.lembaga}</h3>
              <p className="text-xs text-slate-400">Diajukan pada: {item.tanggal}</p>
            </div>
            
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500 mb-1">Nominal Pinjaman</p>
              <p className="text-xl font-bold text-emerald-400">{item.nominal}</p>
            </div>
            
            <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-colors">
              Lihat Detail
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
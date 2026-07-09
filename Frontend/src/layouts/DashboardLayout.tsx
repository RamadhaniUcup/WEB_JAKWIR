import type { FC } from "react";
import { GlassCard } from "../components/common/glasscard";


const dataPengajuan = [
  { id: 'REQ-001', nama: 'Budi Santoso', nominal: 'Rp 25.000.000', tenor: '12 Bulan', risk: 'Rendah', status: 'Pending' },
  { id: 'REQ-002', nama: 'Siti Aminah', nominal: 'Rp 10.000.000', tenor: '6 Bulan', risk: 'Menengah', status: 'Pending' },
  { id: 'REQ-003', nama: 'Ahmad Faisal', nominal: 'Rp 150.000.000', tenor: '36 Bulan', risk: 'Tinggi', status: 'Ditolak' },
];

export const DashboardKreditur: FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Ringkasan Portofolio</h1>
        <p className="text-sm text-slate-400 mt-1">Pantau performa penyaluran dana dan antrean pengajuan hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Dana Disalurkan</p>
          <p className="text-2xl font-extrabold text-white">Rp 4.2 Milyar</p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center font-semibold">
            <span className="mr-1">↑ 12%</span> dari bulan lalu
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Pengajuan Menunggu</p>
          <p className="text-2xl font-extrabold text-amber-400">12 Berkas</p>
          <p className="text-xs text-slate-500 mt-2 font-semibold">Butuh verifikasi e-KYC</p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Antrean Pengajuan Terbaru</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/2 text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">ID Req</th>
                <th className="px-6 py-4">Calon Debitur</th>
                <th className="px-6 py-4">Nominal & Tenor</th>
                <th className="px-6 py-4">Skor Risiko</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dataPengajuan.map((row, index) => (
                <tr key={index} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{row.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{row.nama}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-emerald-400">{row.nominal}</div>
                    <div className="text-[10px] text-slate-500">{row.tenor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      row.risk === 'Rendah' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      row.risk === 'Menengah' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center text-xs font-bold ${
                      row.status === 'Pending' ? 'text-amber-400' :
                      row.status === 'Disetujui' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {row.status === 'Pending' && <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
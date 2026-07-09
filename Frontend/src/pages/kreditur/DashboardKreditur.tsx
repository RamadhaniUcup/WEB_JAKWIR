import type { FC } from 'react';
import { GlassCard } from '../../components/common/glasscard';

// Dummy data untuk tabel antrean pengajuan
const dataPengajuan = [
  { id: 'REQ-001', nama: 'Budi Santoso', nominal: 'Rp 25.000.000', tenor: '12 Bulan', risk: 'Rendah', status: 'Pending' },
  { id: 'REQ-002', nama: 'Siti Aminah', nominal: 'Rp 10.000.000', tenor: '6 Bulan', risk: 'Menengah', status: 'Pending' },
  { id: 'REQ-003', nama: 'Ahmad Faisal', nominal: 'Rp 150.000.000', tenor: '36 Bulan', risk: 'Tinggi', status: 'Ditolak' },
  { id: 'REQ-004', nama: 'Diana Putri', nominal: 'Rp 50.000.000', tenor: '24 Bulan', risk: 'Rendah', status: 'Disetujui' },
  { id: 'REQ-005', nama: 'Eko Prasetyo', nominal: 'Rp 5.000.000', tenor: '3 Bulan', risk: 'Menengah', status: 'Pending' },
];

export const DashboardKreditur: FC = () => {
  return (
    <div className="space-y-8">
      
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Ringkasan Portofolio</h1>
        <p className="text-sm text-slate-400 mt-1">Pantau performa penyaluran dana dan antrean pengajuan hari ini.</p>
      </div>

      {/* Widget Statistik Panel Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Dana Disalurkan</p>
          <p className="text-2xl font-extrabold text-white">Rp 4.2 Milyar</p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center font-semibold">
            <span className="mr-1">↑ 12%</span> dari bulan lalu
          </p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Pengajuan Menunggu</p>
            <p className="text-2xl font-extrabold text-amber-400">12 Berkas</p>
            <p className="text-xs text-slate-500 mt-2 font-semibold">Butuh tinjauan manual</p>
          </div>
          {/* Efek glow kecil untuk penekanan */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rasio Gagal Bayar (NPL)</p>
          <p className="text-2xl font-extrabold text-white">1.2%</p>
          <p className="text-xs text-emerald-400 mt-2 font-semibold">Sangat Sehat (Di bawah 5%)</p>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Debitur Aktif</p>
          <p className="text-2xl font-extrabold text-white">342 Orang</p>
          <p className="text-xs text-slate-500 mt-2 font-semibold">Tersebar di 15 Provinsi</p>
        </GlassCard>
      </div>

      {/* Tabel Data Pengajuan */}
      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-lg font-bold text-white">Antrean Pengajuan Terbaru</h3>
          <button className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-colors">
            Lihat Semua
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID Req</th>
                <th className="px-6 py-4 whitespace-nowrap">Calon Debitur</th>
                <th className="px-6 py-4 whitespace-nowrap">Nominal & Tenor</th>
                <th className="px-6 py-4 whitespace-nowrap">Skor Risiko</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dataPengajuan.map((row, index) => (
                <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">{row.id}</td>
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{row.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-emerald-400">{row.nominal}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{row.tenor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                      row.risk === 'Rendah' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      row.risk === 'Menengah' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center text-xs font-bold ${
                      row.status === 'Pending' ? 'text-amber-400' :
                      row.status === 'Disetujui' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {row.status === 'Pending' && <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>}
                      {row.status === 'Disetujui' && <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>}
                      {row.status === 'Ditolak' && <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                      Tinjau
                    </button>
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
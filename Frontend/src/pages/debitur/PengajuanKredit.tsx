
import { useState, type FC, type FormEvent } from 'react';
import { GlassCard } from '../../components/common/glasscard';

export const PengajuanKredit: FC = () => {
  const [nominal, setNominal] = useState('');
  const [tenor, setTenor] = useState('12');
  const [keperluan, setKeperluan] = useState('');

  const handleKirim = (e: FormEvent) => {
    e.preventDefault();
    console.log({ nominal, tenor, keperluan });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-slate-200 pt-32">
      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Formulir Pengajuan Kredit</h2>
        <form onSubmit={handleKirim} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nominal Pinjaman (Rp)</label>
            <input 
              type="number" 
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              placeholder="Contoh: 25000000" 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tenor Jangka Waktu</label>
            <select 
              value={tenor}
              onChange={(e) => setTenor(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="6">6 Bulan</option>
              <option value="12">12 Bulan</option>
              <option value="24">24 Bulan</option>
              <option value="36">36 Bulan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tujuan Penggunaan Dana</label>
            <textarea 
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              placeholder="Tulis alasan pengajuan, misal: modal usaha mikro..." 
              rows={4} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Unggah Identitas KTP (e-KYC)</label>
            <input 
              type="file" 
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer" 
              required 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg">
            Kirim Pengajuan Kredit
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
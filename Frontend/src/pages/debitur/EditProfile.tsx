
import { useState, type FC, type FormEvent } from 'react';
import { GlassCard } from '../../components/common/glasscard';

export const EditProfile: FC = () => {
  const [name, setName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi.santoso@email.com');
  const [phone, setPhone] = useState('081234567890');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto text-slate-200 min-h-screen">
      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Pengaturan Profil</h2>
        
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden border-2 border-indigo-400">
            <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=6366f1&color=fff&size=128" alt="Profil Besar" />
          </div>
          <div>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition">
              Ubah Foto
            </button>
            <p className="text-[10px] text-slate-500 mt-2">Format JPG, PNG maks 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Nama Lengkap Sesuai KTP</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Alamat Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed" 
              disabled 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Nomor Handphone Aktif</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500" 
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full py-3 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
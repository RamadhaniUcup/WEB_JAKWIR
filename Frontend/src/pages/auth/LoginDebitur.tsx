
import { useState, type FC, type FormEvent } from 'react';
import { GlassCard } from '../../components/common/glasscard';

export const LoginDebitur: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Login Debitur:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-slate-200">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Masuk Debitur</h2>
          <p className="text-sm text-slate-400 mt-2">Kelola pengajuan dan cek limit kredit Anda</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Alamat Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" 
              placeholder="nama@email.com" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Kata Sandi</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
            Masuk Akun
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
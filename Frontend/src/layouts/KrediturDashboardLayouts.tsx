
import type { FC, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const KrediturDashboardLayout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      <aside className="w-64 backdrop-blur-xl bg-slate-900/50 border-r border-white/10 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <span className="text-slate-950 font-extrabold text-sm">J</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Mitra Panel</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu Utama</div>
          
          <Link to="/kreditur/dashboard" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/kreditur/dashboard') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <span className="text-sm font-semibold">Dashboard Utama</span>
          </Link>
          
          <Link to="/kreditur/pengajuan" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/kreditur/pengajuan') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <span className="text-sm font-semibold flex-1">Data Pengajuan</span>
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">12 Baru</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-bold">
            Keluar Sistem
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 backdrop-blur-md bg-slate-900/30 border-b border-white/10 flex items-center justify-between px-8 z-10">
          <div>
            <h2 className="text-lg font-bold text-white">IndoFund Digital</h2>
            <p className="text-xs text-slate-400">ID Mitra: #IFD-99281</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white relative">
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
              🔔
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin+IFD&background=6366f1&color=fff" alt="Admin" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
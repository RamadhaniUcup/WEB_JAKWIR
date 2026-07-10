import type { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

interface LayoutProps {
  children: ReactNode;
}

export const SuperAdminDashboardLayout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Zustand auth hooks
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/kreditur/login"; // Redirect ke portal login utama
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar Aside */}
      <aside className="w-64 backdrop-blur-xl bg-slate-900/50 border-r border-white/10 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20">
            <span className="text-slate-950 font-extrabold text-sm">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">SUPER ADMIN</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu Utama</div>
          
          <Link to="/super-admin/dashboard" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive("/super-admin/dashboard") ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="text-sm font-semibold">Dashboard Ringkasan</span>
          </Link>
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-6 mb-2 px-2">Manajemen Data</div>

          <Link to="/super-admin/kreditur" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive("/super-admin/kreditur") ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="text-sm font-semibold">Data Kreditur</span>
          </Link>

          <Link to="/super-admin/users" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive("/super-admin/users") ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="text-sm font-semibold">Akun Admin Lembaga</span>
          </Link>

          <Link to="/super-admin/debitur" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive("/super-admin/debitur") ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="text-sm font-semibold">Data Debitur</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-bold cursor-pointer"
          >
            Keluar Panel
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Dashboard */}
        <header className="h-20 backdrop-blur-md bg-slate-900/30 border-b border-white/10 flex items-center justify-between px-8 z-10">
          <div>
            <h2 className="text-lg font-bold text-white">Aggregator Super Administrator</h2>
            <p className="text-xs text-slate-400">Selamat datang, {user?.username || "Super Admin"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-cyan-400 overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=SuperAdmin&background=06b6d4&color=fff`} alt="Super Admin" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default SuperAdminDashboardLayout;

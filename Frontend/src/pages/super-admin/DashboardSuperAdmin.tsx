import { type FC } from "react";
import { Link } from "react-router-dom";
import {
  useGetSuperAdminKrediturs,
  useGetSuperAdminUsers,
  useGetSuperAdminDebiturs,
} from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const DashboardSuperAdmin: FC = () => {
  const { data: krediturs, isLoading: loadKreditur } = useGetSuperAdminKrediturs();
  const { data: users, isLoading: loadUsers } = useGetSuperAdminUsers();
  const { data: debiturs, isLoading: loadDebitur } = useGetSuperAdminDebiturs();

  const totalKreditur = krediturs?.length || 0;
  const totalUser = users?.length || 0;
  const totalDebitur = debiturs?.length || 0;

  const isGlobalLoading = loadKreditur || loadUsers || loadDebitur;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Super Admin</h1>
        <p className="text-sm text-slate-400 mt-1">Kelola data master nasabah aggregator, instansi kreditur, dan otorisasi login panel.</p>
      </div>

      {isGlobalLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-xs text-slate-400 mt-3 font-semibold">Memuat metrik sistem aggregator...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6" hoverEffect={false}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Lembaga Pembiayaan</p>
              <p className="text-3xl font-extrabold text-white">{totalKreditur} Mitra</p>
              <p className="text-xs text-cyan-400 mt-2 font-semibold">Telah bergabung & aktif</p>
            </GlassCard>

            <GlassCard className="p-6" hoverEffect={false}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Akun Administrator Mitra</p>
              <p className="text-3xl font-extrabold text-white">{totalUser} Akun</p>
              <p className="text-xs text-cyan-400 mt-2 font-semibold">Memiliki akses ke dashboard instansi</p>
            </GlassCard>

            <GlassCard className="p-6" hoverEffect={false}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nasabah Aggregator (Debitur)</p>
              <p className="text-3xl font-extrabold text-white">{totalDebitur} Profil</p>
              <p className="text-xs text-cyan-400 mt-2 font-semibold">Menggunakan e-KYC tervalidasi</p>
            </GlassCard>
          </div>

          {/* Quick Links Menu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 flex flex-col justify-between" hoverEffect>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Kelola Lembaga Pembiayaan</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">Tambah mitra perbankan, syariah, atau P2P fintech, dan atur batasan limit pinjaman atau cicilan tenor mereka.</p>
              </div>
              <Link to="/super-admin/kreditur" className="py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl text-center hover:bg-cyan-500/20 transition-all decoration-none">
                Konfigurasi Kreditur →
              </Link>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-between" hoverEffect>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Kelola Akun Administrator</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">Buat akun untuk perwakilan administrator mitra agar mereka dapat melakukan survei lapangan nasabah dan kelola SPK.</p>
              </div>
              <Link to="/super-admin/users" className="py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl text-center hover:bg-cyan-500/20 transition-all decoration-none">
                Konfigurasi Otorisasi →
              </Link>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-between" hoverEffect>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Kelola Profil Nasabah</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">Pantau list biodata nasabah aggregator terdaftar, NIK, dan perbarui data diri KTP mereka secara terpusat.</p>
              </div>
              <Link to="/super-admin/debitur" className="py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl text-center hover:bg-cyan-500/20 transition-all decoration-none">
                Konfigurasi Debitur →
              </Link>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};
export default DashboardSuperAdmin;

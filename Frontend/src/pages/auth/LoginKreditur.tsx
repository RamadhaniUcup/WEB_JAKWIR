import { useState, type FC, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const LoginKreditur: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    loginMutation.mutate(
      { email, password, isAdmin: true },
      {
        onSuccess: (data) => {
          const userRole = (data.user as any).role;
          if (userRole === "SUPER ADMIN") {
            navigate("/super-admin/dashboard");
          } else {
            navigate("/kreditur/dashboard");
          }
        },
        onError: (err: any) => {
          setErrorMsg(err?.response?.data?.message || "Login gagal. Periksa email atau password mitra.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-slate-200 relative overflow-hidden font-sans">
      {/* Decorative ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <GlassCard className="w-full max-w-md p-8 relative z-10" hoverEffect={false}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-tr from-cyan-500 to-indigo-500 shadow-lg shadow-cyan-500/20 mb-3">
            <span className="text-slate-950 font-extrabold text-xl">K</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Portal Mitra Kreditur</h2>
          <p className="text-xs text-slate-400 mt-2">Masuk ke dashboard lembaga pembiayaan Anda</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Email Lembaga Mitra</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition text-sm" 
              placeholder="mitra@indofund.id" 
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Kata Sandi</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition text-sm" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full py-3 mt-4 bg-linear-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Memproses Portal...
              </>
            ) : (
              "Masuk Portal Mitra"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs space-y-3">
          <p className="text-slate-500">
            Ingin bermitra dengan JAKWIR?{" "}
            <Link to="/kreditur/landing" className="text-cyan-400 hover:underline font-bold">
              Hubungi Kami
            </Link>
          </p>
          <p>
            <Link to="/debitur/login" className="text-slate-400 hover:text-white transition font-medium">
              Masuk sebagai Debitur (Nasabah) →
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

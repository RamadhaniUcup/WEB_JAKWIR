import { useState, type FC, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const LoginDebitur: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    loginMutation.mutate(
      { email, password, isAdmin: false },
      {
        onSuccess: () => {
          navigate("/debitur/history");
        },
        onError: (err: any) => {
          setErrorMsg(err?.response?.data?.message || "Login gagal. Silakan periksa kredensial Anda.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-slate-200 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <GlassCard className="w-full max-w-md p-8 relative z-10" hoverEffect={false}>
        <div className="text-center mb-8">
          <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-2 mb-3">
            ← Kembali ke Beranda
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Masuk Debitur</h2>
          <p className="text-xs text-slate-400 mt-2">Kelola pengajuan dan pantau keputusan kelayakan kredit Anda</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Alamat Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm" 
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
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full py-3 mt-4 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Memproses Masuk...
              </>
            ) : (
              "Masuk Akun"
            )}
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs font-semibold">
          <p className="text-slate-500">
            Belum memiliki akun nasabah?{" "}
            <Link to="/debitur/register" className="text-indigo-400 hover:underline font-bold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
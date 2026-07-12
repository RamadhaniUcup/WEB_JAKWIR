import type { FC } from "react";

export const LandingPenyediaJasa: FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">Kemitraan Eksklusif</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Salurkan Dana Aman, Jangkau Nasabah <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Tepat Sasaran.</span>
          </h1>
          <p className="text-slate-400 text-base">
            Bergabunglah sebagai mitra Penyedia Jasa resmi di JAKWIR.
          </p>
          <div className="pt-2">
            <button className="px-6 py-3 bg-linear-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold rounded-xl shadow-lg cursor-pointer">
              Daftar Sebagai Lembaga Mitra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPenyediaJasa;

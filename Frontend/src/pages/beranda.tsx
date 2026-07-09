import { useState } from "react"; 

export default function Beranda() {
  // 1. Inisialisasi State untuk Slider Kalkulator
  const [loanAmount, setLoanAmount] = useState<number>(25000000);
  const [tenor, setTenor] = useState<number>(12);

  // 2. Fungsi Format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // 3. Logika Perhitungan Estimasi Cicilan
  // Menggunakan benchmark bunga 0.5% per bulan sesuai desain awal
  const baseInterestRate = 0.005;
  const monthlyPrincipal = loanAmount / tenor;
  const monthlyInterest = loanAmount * baseInterestRate;
  const estInstallment = Math.round(monthlyPrincipal + monthlyInterest);

  return (
    <section 
      id="beranda" 
      // Mengurangi pt-32 menjadi pt-12 karena di MainLayout sudah ada pt-20
      className="pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full "
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
         
        {/* === KOLOM KIRI: Teks Hero === */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mx-auto lg:mx-0">
            <i className="fa-solid fa-shield-halved text-cyan-400"></i>
            <span>Diawasi & Berizin Resmi Resmi OJK</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Kendali Penuh di Tangan Anda, <br />
            <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Bebas Pilih Kreditur.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Jangan batasi pilihan finansial Anda. Bandingkan suku bunga, tenor,
            dan limit secara transparan dari puluhan mitra lembaga keuangan
            tepercaya dalam satu platform modular terpadu.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="#kreditur"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 text-slate-950 font-bold text-base transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 text-center"
            >
              Bandingkan Kreditur <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
            <a
              href="#alur"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all text-center"
            >
              Pelajari Alur
            </a>
          </div>

          {/* Small Analytics */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">35+</p>
              <p className="text-xs text-slate-500 mt-1">Kreditur Terverifikasi</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">Rp 2T+</p>
              <p className="text-xs text-slate-500 mt-1">Total Dana Cair</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">0.5%</p>
              <p className="text-xs text-slate-500 mt-1">Suku Bunga Mulai Dari</p>
            </div>
          </div>
        </div>

        {/* === KOLOM KANAN: Glass Card Calculator === */}
        <div className="lg:col-span-5 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 rounded-3xl relative z-10 hover:border-white/20 transition-colors">
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Simulasi Instan
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                Smart Matcher
              </span>
            </div>

            <div className="space-y-6">
              {/* Range Jumlah Pinjaman */}
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <label className="text-slate-400 font-medium">Jumlah Pinjaman</label>
                  <span className="text-indigo-400 font-bold">
                    {formatRupiah(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000000"
                  max="200000000"
                  step="5000000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Range Tenor */}
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <label className="text-slate-400 font-medium">Tenor Pengembalian</label>
                  <span className="text-cyan-400 font-bold">
                    {tenor} Bulan
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="3"
                  value={tenor}
                  onChange={(e) => setTenor(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Hasil Estimasi Cicilan */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Estimasi Cicilan Bulanan:</span>
                  <span className="text-white font-medium">Mulai dari</span>
                </div>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-300">
                  {formatRupiah(estInstallment)}
                  <span className="text-xs font-normal text-slate-500 inline-block ml-1">/bln</span>
                </div>
              </div>

              <button className="w-full block text-center py-4 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg cursor-pointer">
                Cari Kreditur Sesuai Limit
              </button>
            </div>
          </div>

          {/* Floating Ambient Elements Behind Glass Card */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-2xl blur-xl pointer-events-none -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl pointer-events-none -z-10"></div>
        </div>

      </div>
    </section>
  );
}
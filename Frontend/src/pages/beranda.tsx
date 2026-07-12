import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/common/glasscard.js";
import { useGetPublicStats, useGetPenyediaJasaList } from "../hooks/useApi.js";

export const Beranda: FC = () => {
  // Fetch data dari database
  const { data: stats } = useGetPublicStats();
  const { data: livePenyediaJasaList } = useGetPenyediaJasaList();

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
  const baseInterestRate = 0.005; // 0.5% per bulan
  const monthlyPrincipal = loanAmount / tenor;
  const monthlyInterest = loanAmount * baseInterestRate;
  const estInstallment = Math.round(monthlyPrincipal + monthlyInterest);

  // Mock data untuk 6 Penyedia Jasa Terpopuler
  const mockPenyediaJasa = [
    {
      nama: "Bank Mandiri Utama",
      tipe: "Perbankan",
      limitMax: "Rp 250 Juta",
      bunga: "0.6% / bln",
      rating: "4.9",
      terpopuler: true,
    },
    {
      nama: "Kredit Pintar Syariah",
      tipe: "Fintech P2P",
      limitMax: "Rp 80 Juta",
      bunga: "0.8% / bln",
      rating: "4.8",
      terpopuler: true,
    },
    {
      nama: "Kospin Jasa Sejahtera",
      tipe: "Koperasi",
      limitMax: "Rp 50 Juta",
      bunga: "0.95% / bln",
      rating: "4.7",
      terpopuler: false,
    },
    {
      nama: "Bank BNI Griya",
      tipe: "Perbankan",
      limitMax: "Rp 500 Juta",
      bunga: "0.55% / bln",
      rating: "4.9",
      terpopuler: false,
    },
    {
      nama: "Modalku Fintech",
      tipe: "Fintech P2P",
      limitMax: "Rp 150 Juta",
      bunga: "0.75% / bln",
      rating: "4.8",
      terpopuler: false,
    },
    {
      nama: "BPR Dana Rinjani",
      tipe: "Perbankan",
      limitMax: "Rp 100 Juta",
      bunga: "0.85% / bln",
      rating: "4.6",
      terpopuler: false,
    },
  ];

  const displayList = livePenyediaJasaList && livePenyediaJasaList.length > 0 
    ? livePenyediaJasaList.slice(0, 6).map((k: any, idx: number) => {
        const tipeOptions = ["Perbankan", "Fintech P2P", "Syariah"];
        const bungaOptions = ["0.55% / bln", "0.75% / bln", "0.95% / bln"];
        const ratingOptions = ["4.9", "4.8", "4.7"];
        return {
          nama: k.namaPenyediaJasa,
          tipe: tipeOptions[idx % tipeOptions.length],
          limitMax: formatRupiah(Number(k.limitPengajuan || 100000000)),
          bunga: bungaOptions[idx % bungaOptions.length],
          rating: ratingOptions[idx % ratingOptions.length],
          terpopuler: idx < 2
        };
      })
    : mockPenyediaJasa;

  return (
    <div className="w-full text-slate-200 bg-[#0f172a] relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[5%] left-[-15%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-15%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* =========================================================
          HERO SECTION (Kalkulator Simulasi)
          ========================================================= */}
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Kiri: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>AGREGATOR PINJAMAN KREDIT INDONESIA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Kendali Penuh di Tangan Anda, <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Bebas Pilih Penyedia Jasa.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Jangan batasi pilihan finansial Anda. Bandingkan suku bunga, tenor,
              dan limit secara transparan dari puluhan mitra lembaga keuangan
              tepercaya dalam satu platform modular terpadu.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/nasabah/penyedia-jasa"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-slate-950 font-extrabold text-base hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/20 transition-all text-center"
              >
                Ajukan Sekarang →
              </Link>
              <a
                href="#alur"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all text-center"
              >
                Pelajari Alur
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Simulator Card */}
          <div className="lg:col-span-5 relative">
            <GlassCard className="p-8 relative z-10" hoverEffect={false}>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Simulasi Pinjaman
                </span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase">
                  Matcher Instan
                </span>
              </div>

              <div className="space-y-6">
                {/* Slider Jumlah Pinjaman */}
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <label className="text-slate-400 font-bold">Jumlah Pinjaman</label>
                    <span className="text-indigo-400 font-extrabold">
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

                {/* Slider Tenor */}
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <label className="text-slate-400 font-bold">Tenor Cicilan</label>
                    <span className="text-cyan-400 font-extrabold">
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

                {/* Hasil Estimasi */}
                <div className="p-5 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Estimasi Angsuran Bulanan:</span>
                    <span>Bunga Acuan 0.5%</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {formatRupiah(estInstallment)}
                    <span className="text-xs font-normal text-slate-500 inline-block ml-1.5">/ bln</span>
                  </div>
                </div>

                <Link
                  to="/nasabah/penyedia-jasa"
                  className="w-full block text-center py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-200 transition-colors shadow-lg cursor-pointer decoration-none"
                >
                  Cari Penyedia Jasa Sesuai Limit
                </Link>
              </div>
            </GlassCard>
            
            {/* Ambient Behind Simulator */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-2xl blur-xl pointer-events-none -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none -z-10"></div>
          </div>

        </div>
      </section>

      {/* =========================================================
          1. SEKSI STATISTIK (Social Proof Banner)
          ========================================================= */}
      <section className="py-12 bg-slate-900/40 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="space-y-1">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {stats && stats.totalDanaDisalurkan > 0 
                  ? formatRupiah(stats.totalDanaDisalurkan) 
                  : "Rp 120 Miliar+"}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Dana Disalurkan</p>
            </div>

            <div className="space-y-1 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {stats && stats.totalPenyediaJasa > 0 
                  ? `${stats.totalPenyediaJasa} Mitra` 
                  : "45+ Mitra"}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Penyedia Jasa Terdaftar</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                {stats && stats.totalNasabah > 0 
                  ? `${new Intl.NumberFormat("id-ID").format(stats.totalNasabah)}+` 
                  : "15.000+"}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nasabah Aktif</p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          2. SEKSI KELEBIHAN WEBSITE (Why Choose Us)
          ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Kenapa Memilih JAKWIR?</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">Kami menghadirkan standardisasi penilaian kredit yang objektif dan melindungi data privasi Anda.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg shadow-inner">
              🏷️
            </div>
            <h3 className="text-base font-bold text-white">Transparansi Bunga</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Suku bunga dihitung transparan dari awal simulasi. Tidak ada biaya siluman atau provisi yang disembunyikan.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">
              🏦
            </div>
            <h3 className="text-base font-bold text-white">Bebas Pilih Penyedia Jasa</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Pilih lembaga keuangan perbankan, syariah, atau koperasi terbaik secara mandiri sesuai profil risiko Anda.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
              🛡️
            </div>
            <h3 className="text-base font-bold text-white">Keamanan Data (e-KYC)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Identitas NIK KTP dan alamat domisili Anda dienkripsi penuh menggunakan AES-256-CBC standard perbankan.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-lg">
              📊
            </div>
            <h3 className="text-base font-bold text-white">Penilaian Objektif</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Keputusan persetujuan kelayakan kredit didasarkan perhitungan Profile Matching yang adil dan efisien.</p>
          </GlassCard>

        </div>
      </section>

      {/* =========================================================
          3. SEKSI 6 PENYEDIA JASA TERPOPULER (Top Lenders)
          ========================================================= */}
      <section className="py-20 bg-slate-900/10 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Mitra Penyedia Jasa Terpopuler</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">Lihat daftar lembaga pembiayaan terfavorit pilihan nasabah aggregator bulan ini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((k, index) => (
              <GlassCard key={index} className="p-6 relative flex flex-col justify-between" hoverEffect>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">
                      {k.tipe}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      ⭐ {k.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{k.nama}</h3>

                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-white/5 pt-3 mb-6">
                    <div className="flex justify-between">
                      <span>Limit Pinjaman:</span>
                      <span className="text-white font-semibold">s/d {k.limitMax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suku Bunga Acuan:</span>
                      <span className="text-emerald-400 font-bold">{k.bunga}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {k.terpopuler && (
                    <div className="mb-4 text-center py-1 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 rounded-lg">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400">
                        🔥 Paling Banyak Diajukan
                      </span>
                    </div>
                  )}
                  <Link
                    to="/nasabah/penyedia-jasa"
                    className="w-full block py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white text-center hover:bg-white/10 transition decoration-none"
                  >
                    Ajukan Limit Pembiayaan
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/nasabah/penyedia-jasa"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer decoration-none text-sm"
            >
              Lihat Semua Penyedia Jasa →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SEKSI ALUR PENGAJUAN (How It Works)
          ========================================================= */}
      <section id="alur" className="py-20 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">4 Langkah Mudah Pengajuan</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">Pahami tahapan mudah mengajukan dana pembiayaan hingga masuk ke rekening Anda.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Step 1 */}
          <GlassCard className="p-6 relative overflow-hidden flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="absolute top-[-10%] right-[-10%] text-7xl font-extrabold text-white/5 select-none pointer-events-none">
                1
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-4">Langkah 01</span>
              <h3 className="text-base font-bold text-white mb-2">Lengkapi Biodata</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Buat akun nasabah dan masukkan e-KYC NIK KTP serta data profil keuangan Anda.</p>
            </div>
          </GlassCard>

          {/* Step 2 */}
          <GlassCard className="p-6 relative overflow-hidden flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="absolute top-[-10%] right-[-10%] text-7xl font-extrabold text-white/5 select-none pointer-events-none">
                2
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-4">Langkah 02</span>
              <h3 className="text-base font-bold text-white mb-2">Pilih Mitra Lembaga</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Bandingkan bunga, jangka tenor cicilan, dan ajukan berkas pinjaman Anda ke satu Penyedia Jasa.</p>
            </div>
          </GlassCard>

          {/* Step 3 */}
          <GlassCard className="p-6 relative overflow-hidden flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="absolute top-[-10%] right-[-10%] text-7xl font-extrabold text-white/5 select-none pointer-events-none">
                3
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-4">Langkah 03</span>
              <h3 className="text-base font-bold text-white mb-2">Survei Lapangan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Tim analis mitra Penyedia Jasa melakukan verifikasi lapangan, menginput pilihan kriteria hasil survei ke sistem SPK.</p>
            </div>
          </GlassCard>

          {/* Step 4 */}
          <GlassCard className="p-6 relative overflow-hidden flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="absolute top-[-10%] right-[-10%] text-7xl font-extrabold text-white/5 select-none pointer-events-none">
                4
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-4">Langkah 04</span>
              <h3 className="text-base font-bold text-white mb-2">Dana Dicairkan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Keputusan SPK diterbitkan, jika disetujui, dana langsung dicairkan oleh mitra bank/fintech ke rekening Anda.</p>
            </div>
          </GlassCard>

        </div>
      </section>

      {/* =========================================================
          5. SEKSI PENGAWASAN & REGULASI (Trust Signals)
          ========================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
        <GlassCard className="p-8 text-center" hoverEffect={false}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Diawasi dan Terdaftar Secara Resmi Oleh:
          </p>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-75 mb-6">
            {/* OJK Logo Placeholder */}
            <div className="flex items-center space-x-2 border border-white/10 rounded-xl px-4 py-2 bg-white/2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-slate-950 font-bold">O</span>
              <span className="text-xs font-extrabold tracking-widest text-white font-mono">OJK</span>
            </div>
            
            {/* Kominfo Logo Placeholder */}
            <div className="flex items-center space-x-2 border border-white/10 rounded-xl px-4 py-2 bg-white/2">
              <span className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] text-slate-950 font-bold">K</span>
              <span className="text-xs font-extrabold tracking-widest text-white font-mono">KOMINFO</span>
            </div>

            {/* AFPI Logo Placeholder */}
            <div className="flex items-center space-x-2 border border-white/10 rounded-xl px-4 py-2 bg-white/2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-slate-950 font-bold">A</span>
              <span className="text-xs font-extrabold tracking-widest text-white font-mono">AFPI</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl mx-auto pt-2 border-t border-white/5">
            JAKWIR menjamin keamanan data pribadi Anda dengan standar enkripsi AES-256 tingkat perbankan. Seluruh mitra lembaga Penyedia Jasa kami memiliki izin usaha perbankan/pinjaman berlisensi dari otoritas regulator Indonesia.
          </p>
        </GlassCard>
      </section>

    </div>
  );
};
export default Beranda;
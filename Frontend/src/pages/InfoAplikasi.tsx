import type { FC } from 'react';
import { GlassCard } from '../components/common/glasscard'; // Sesuaikan path jika berbeda

export const InfoAplikasi: FC = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-slate-200 min-h-screen">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/20 mb-2">
          <span className="text-slate-900 font-extrabold text-3xl">J</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Tentang JAKWIR</h1>
        <p className="text-slate-400 text-lg">Platform Pemilihan Kredit Terbuka & Transparan</p>
      </div>

      <div className="space-y-8">
        {/* Deskripsi Utama */}
        <GlassCard className="p-8 space-y-6 text-sm leading-relaxed text-slate-300">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Apa itu JAKWIR?</h2>
          <p>
            <strong className="text-white text-base">JAKWIR</strong> adalah platform agregator inovasi keuangan digital yang merombak cara Anda mencari dan mengajukan pinjaman. Kami <strong>tidak bertindak sebagai pemberi pinjaman</strong>, melainkan sebagai jembatan cerdas yang menghubungkan Anda dengan puluhan lembaga pembiayaan resmi (Perbankan, Fintech P2P, dan Koperasi) yang diawasi langsung oleh OJK.
          </p>
          <p>
            Visi kami adalah mengembalikan kendali finansial ke tangan masyarakat. Dengan aplikasi ini, Anda tidak perlu lagi mengunduh banyak aplikasi berbeda atau terjebak pada satu pilihan suku bunga. Anda memiliki kebebasan absolut untuk membandingkan suku bunga, tenor, dan limit secara transparan sebelum mengambil keputusan.
          </p>
        </GlassCard>

        {/* Keamanan & Privasi */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Keamanan & Privasi Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                🛡️
              </div>
              <h3 className="font-bold text-white">Enkripsi End-to-End</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seluruh lalu lintas data identitas dan e-KYC (KTP/Selfie) Anda dilindungi dengan standar enkripsi bank tingkat tinggi (AES-256).
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
                🔒
              </div>
              <h3 className="font-bold text-white">Tanpa Jual Beli Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kami berkomitmen mutlak untuk tidak menyebarkan atau menjual data pribadi Anda ke pihak ketiga. Berkas hanya akan dikirimkan kepada kreditur spesifik yang Anda pilih sendiri.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Hubungi Kami / Bantuan */}
        <GlassCard className="p-8 text-center bg-linear-to-b from-white/5 to-transparent">
          <h2 className="text-xl font-bold text-white mb-4">Butuh Bantuan Lebih Lanjut?</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-lg mx-auto">
            Tim layanan pelanggan kami siap membantu Anda setiap hari kerja (Senin - Jumat, 09:00 - 17:00 WIB) untuk menjawab pertanyaan seputar pengajuan dan sistem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-semibold">
            <a href="mailto:support@jakwir.id" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition w-full sm:w-auto flex items-center justify-center">
              ✉️ support@jakwir.id
            </a>
            <a href="tel:02188889999" className="px-6 py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition w-full sm:w-auto flex items-center justify-center">
              📞 (021) 8888-9999
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
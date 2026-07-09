import type { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-slate-955 border-t border-white/10 pt-16 pb-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/5">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 text-white text-base font-bold">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-950"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>JAKWIR</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Platform teknologi finansial terpadu yang memfasilitasi keterbukaan akses pembiayaan multiguna di Indonesia.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-slate-400 text-sm">
            
            {/* Column 1: Produk */}
            <div className="space-y-3">
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                Produk
              </p>
              <a href="#" className="block hover:text-white transition-colors">Kredit Tanpa Agunan</a>
              <a href="#" className="block hover:text-white transition-colors">Kredit Multiguna</a>
              <a href="#" className="block hover:text-white transition-colors">Pendanaan Mikro</a>
            </div>
            
            {/* Column 2: Korporasi */}
            <div className="space-y-3">
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                Korporasi
              </p>
              <a href="#" className="block hover:text-white transition-colors">Tentang Kami</a>
              <a href="#" className="block hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="block hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
            
            {/* Column 3: Hubungi Kami */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                Hubungi Kami
              </p>
              <p className="text-slate-400 text-xs">support@jakwir.id</p>
              <p className="text-slate-400 text-xs">Jakarta, Indonesia</p>
            </div>
            
          </div>
        </div>

        {/* Middle Section: OJK Compliance Disclaimer */}
        <div className="space-y-4 leading-relaxed bg-white/2 border border-white/5 p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
            <span>⚠️ Pernyataan Risiko & Kepatuhan Hukum</span>
          </div>
          <p>
            JAKWIR adalah platform inovasi keuangan digital yang terdaftar pada Otoritas Jasa Keuangan (OJK). Kami bertindak sebagai agregator yang mempertemukan calon debitur dengan lembaga pembiayaan resmi. JAKWIR tidak pernah menghimpun dana masyarakat atau berperan sebagai pemberi pinjaman langsung.
          </p>
          <p>
            Segala transaksi pinjaman pinjam-meminjam merupakan kesepakatan perdata mutlak antara debitur dengan lembaga kreditur pilihan yang bersangkutan. Pastikan Anda mempelajari detail kontrak pinjaman secara bijak sebelum melakukan konfirmasi perjanjian digital.
          </p>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] pt-4 text-slate-600">
          <p>
            &copy; 2026 JAKWIR. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0 text-slate-400 text-sm">
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
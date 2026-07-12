import { useState, type FC } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Bind ke Zustand auth store
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isLoggedIn = !!token;

  // Style untuk link yang sedang aktif
  const activeStyle = "text-[#60A5FA] font-medium";

  // Style default untuk link dengan efek hover transisi
  const defaultStyle =
    "text-gray-400 hover:text-gray-200 font-medium transition-colors";

  // Data menu disesuaikan dengan rute aplikasi JAKWIR
  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Penyedia Jasa", href: "/nasabah/penyedia-jasa" },
    { label: "Info Aplikasi", href: "/info" },
  ];

  return (
    <header className="relative w-full bg-slate-900/10 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-12 border-b border-white/5 font-sans z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO AREA */}
        <Link to="/" className="logo flex items-center gap-3 cursor-pointer z-50 decoration-none">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {/* SVG Icon Wallet */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
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
          <h1 className="text-white text-lg sm:text-xl font-bold tracking-wide">
            JAKWIR
          </h1>
        </Link>

        {/* HAMBURGER BUTTON (Mobile Only) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-white hover:text-[#60A5FA] focus:outline-none md:hidden z-50 transition-colors"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* NAVIGATION LINKS & ACTIONS WRAPPER */}
        <div
          className={`
            absolute md:static inset-x-0 top-full md:top-auto bg-[#0B0F19] md:bg-transparent
            flex flex-col md:flex-row items-center md:justify-end flex-1
            p-6 md:p-0 border-t border-white/10 md:border-0 shadow-2xl md:shadow-none
            transition-all duration-300 ease-in-out z-40
            ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible md:opacity-100 md:visible"}
          `}
        >
          {/* Main Navigation - PUSAT DI DESKTOP */}
          <nav className="flex flex-col md:flex-row md:absolute md:left-1/2 md:-translate-x-1/2 gap-4 md:gap-8 w-full md:w-auto text-center md:text-left mb-8 md:mb-0">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm py-3 md:py-0 rounded-lg md:rounded-none hover:bg-white/5 md:hover:bg-transparent transition-all duration-200 ${
                    isActive ? activeStyle : defaultStyle
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Action/Auth Section */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            {isLoggedIn ? (
              <div className="relative w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                {/* Ajukan Sekarang button */}
                <Link
                  to="/nasabah/pengajuan"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full md:w-auto bg-linear-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all cursor-pointer text-center"
                >
                  Ajukan Kredit
                </Link>

                {/* Profile Dropdown */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border border-indigo-400 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.namaNasabah || user?.username || "User")}&background=6366f1&color=fff&size=64`} alt="Profil" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{user?.namaNasabah || user?.username || "Pengguna"}</span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Panel */}
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10 hidden md:block"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-full md:w-56 rounded-2xl backdrop-blur-xl bg-[#0f172a]/95 border border-white/[0.08] shadow-2xl p-2 space-y-1 z-20">
                        <div className="px-4 py-2.5 border-b border-white/5 mb-1">
                          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Peran Pengguna</p>
                          <p className="text-xs text-indigo-400 font-bold mt-0.5">Nasabah</p>
                        </div>
                        <Link
                          to="/nasabah/edit-profile"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
                        >
                          👤 Pengaturan Profil
                        </Link>
                        <Link
                          to="/nasabah/history"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
                        >
                          ⏳ Riwayat Pengajuan
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold text-left cursor-pointer"
                        >
                          🚪 Keluar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/nasabah/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-2.5 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all cursor-pointer text-center"
                >
                  Masuk Nasabah
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;

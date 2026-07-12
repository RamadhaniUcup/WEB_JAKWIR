import { useState, type FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterNasabahMutation } from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

// 1. Definisikan Skema Validasi Form Registrasi dengan Zod
const registerSchema = z
  .object({
    namaNasabah: z.string().min(2, "Nama lengkap minimal terdiri dari 2 karakter"),
    email: z.string().email("Format alamat email tidak valid"),
    telepon: z.string().min(10, "Nomor handphone minimal terdiri dari 10 digit"),
    nik: z
      .string()
      .length(16, "Nomor NIK harus tepat berjumlah 16 digit")
      .regex(/^[0-9]+$/, "NIK hanya boleh berisi angka"),
    alamat: z.string().min(5, "Alamat domisili minimal terdiri dari 5 karakter"),
    password: z.string().min(6, "Kata sandi minimal terdiri dari 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterNasabah: FC = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const registerMutation = useRegisterNasabahMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setErrorMsg("");
    const { confirmPassword, ...payload } = data;

    registerMutation.mutate(payload, {
      onSuccess: () => {
        alert("Pendaftaran akun berhasil! Silakan masuk menggunakan akun baru Anda.");
        navigate("/nasabah/login");
      },
      onError: (err: any) => {
        setErrorMsg(err?.response?.data?.message || "Pendaftaran gagal. Email mungkin sudah terdaftar.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 text-slate-200 relative overflow-hidden font-sans">
      {/* Decorative glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <GlassCard className="w-full max-w-lg p-8 relative z-10 my-8" hoverEffect={false}>
        <div className="text-center mb-6">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-2 mb-3">
            ← Kembali ke Beranda
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Daftar Nasabah Baru</h2>
          <p className="text-xs text-slate-400 mt-2">Buat akun untuk mengajukan kredit dan memantau limit pembiayaan Anda</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Nama Lengkap */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nama Lengkap Sesuai KTP</label>
            <input
              type="text"
              {...register("namaNasabah")}
              className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Contoh: Budi Santoso"
            />
            {errors.namaNasabah && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.namaNasabah.message}</p>}
          </div>

          {/* Email & Telepon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Alamat Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="nama@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nomor Handphone</label>
              <input
                type="tel"
                {...register("telepon")}
                className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="0812xxxxxxxx"
              />
              {errors.telepon && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.telepon.message}</p>}
            </div>
          </div>

          {/* NIK */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nomor NIK KTP (16-Digit)</label>
            <input
              type="text"
              {...register("nik")}
              maxLength={16}
              className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition font-mono"
              placeholder="3201xxxxxxxxxxxx"
            />
            {errors.nik && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.nik.message}</p>}
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Alamat Domisili Lengkap</label>
            <textarea
              {...register("alamat")}
              rows={2}
              className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Tulis alamat rumah domisili saat ini..."
            />
            {errors.alamat && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.alamat.message}</p>}
          </div>

          {/* Sandi & Konfirmasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Kata Sandi</label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Ulangi Sandi</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3 mt-4 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {registerMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Mendaftarkan Nasabah...
              </>
            ) : (
              "Daftar Akun Nasabah"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs">
          <p className="text-slate-500">
            Sudah memiliki akun nasabah?{" "}
            <Link to="/nasabah/login" className="text-indigo-400 hover:underline font-bold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
export default RegisterNasabah;

import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitSurvey, useGetKriterias } from "../../hooks/useApi.js";
import { GlassCard } from "../common/glasscard.js";

// 1. Definisikan Skema Validasi Zod dengan Validasi Silang (Jaminan <= Aset)
const surveySchema = z
  .object({
    totalAset: z.number().min(1, "Total aset harus lebih besar dari 0"),
    pendapatanBersih: z.number().min(1, "Pendapatan bersih harus lebih besar dari 0"),
    nilaiJaminanAset: z.number().min(1, "Nilai jaminan harus lebih besar dari 0"),
    idSubPendapatan: z.number({ message: "Pilih kategori pendapatan" }),
    idSubHunian: z.number({ message: "Pilih kategori status hunian" }),
    idSubPekerjaan: z.number({ message: "Pilih kategori status pekerjaan" }),
    idSubTanggungan: z.number({ message: "Pilih kategori jumlah tanggungan" }),
  })
  .refine((data) => data.nilaiJaminanAset <= data.totalAset, {
    message: "Nilai jaminan aset tidak boleh melebihi total aset",
    path: ["nilaiJaminanAset"],
  });

type SurveyFormData = z.infer<typeof surveySchema>;

interface FormSurveyProps {
  idPengajuan: number;
  onSuccessCallback?: () => void;
}

export const FormSurvey: FC<FormSurveyProps> = ({ idPengajuan, onSuccessCallback }) => {
  const submitSurveyMutation = useSubmitSurvey();
  
  // Ambil list kriteria & sub-kriteria dinamis milik kreditur admin yang sedang login
  const { data: kriterias, isLoading: isKriteriaLoading } = useGetKriterias();

  const kriteriaPendapatan = kriterias?.find((k) => k.kodeKriteria === "C1" || k.namaKriteria.toUpperCase().includes("PENDAPATAN"));
  const kriteriaHunian = kriterias?.find((k) => k.kodeKriteria === "C4" || k.namaKriteria.toUpperCase().includes("HUNIAN"));
  const kriteriaPekerjaan = kriterias?.find((k) => k.kodeKriteria === "C5" || k.namaKriteria.toUpperCase().includes("PEKERJAAN"));
  const kriteriaTanggungan = kriterias?.find((k) => k.kodeKriteria === "C6" || k.namaKriteria.toUpperCase().includes("TANGGUNGAN"));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
  });

  const onSubmit = (data: SurveyFormData) => {
    // 1. Map idSubHunian ke enum StatusHunian
    let statusHunian: "MILIK_SENDIRI" | "SEWA" | "KONTRAK" | "BERSAMA_ORANG_TUA" = "MILIK_SENDIRI";
    const chosenHunianSub = kriteriaHunian?.subKriteria?.find((s: any) => s.idSub === data.idSubHunian);
    if (chosenHunianSub) {
      const desc = chosenHunianSub.deskripsi.toUpperCase();
      if (desc.includes("SEWA")) statusHunian = "SEWA";
      else if (desc.includes("KONTRAK")) statusHunian = "KONTRAK";
      else if (desc.includes("ORANG_TUA") || desc.includes("BERSAMA")) statusHunian = "BERSAMA_ORANG_TUA";
    }

    // 2. Map idSubPekerjaan ke enum StatusPekerjaan
    let statusPekerjaan: "KARYAWAN_TETAP" | "KARYAWAN_KONTRAK" | "WIRAUSAHA" | "TIDAK_BEKERJA" = "KARYAWAN_TETAP";
    const chosenPekSub = kriteriaPekerjaan?.subKriteria?.find((s: any) => s.idSub === data.idSubPekerjaan);
    if (chosenPekSub) {
      const desc = chosenPekSub.deskripsi.toUpperCase();
      if (desc.includes("KONTRAK")) statusPekerjaan = "KARYAWAN_KONTRAK";
      else if (desc.includes("WIRA") || desc.includes("USAHA")) statusPekerjaan = "WIRAUSAHA";
      else if (desc.includes("TIDAK")) statusPekerjaan = "TIDAK_BEKERJA";
    }

    // 3. Map idSubTanggungan ke nilai integer
    let jumlahTanggungan = 0;
    const chosenTangSub = kriteriaTanggungan?.subKriteria?.find((s: any) => s.idSub === data.idSubTanggungan);
    if (chosenTangSub) {
      const numMatch = chosenTangSub.deskripsi.match(/\d+/);
      if (numMatch) {
        jumlahTanggungan = parseInt(numMatch[0], 10);
      }
    }

    submitSurveyMutation.mutate(
      {
        idPengajuan,
        totalAset: data.totalAset,
        pendapatanBersih: data.pendapatanBersih,
        statusHunian,
        statusPekerjaan,
        jumlahTanggungan,
        nilaiJaminanAset: data.nilaiJaminanAset,
        idSubPendapatan: data.idSubPendapatan,
        idSubHunian: data.idSubHunian,
        idSubPekerjaan: data.idSubPekerjaan,
        idSubTanggungan: data.idSubTanggungan,
      },
      {
        onSuccess: () => {
          alert("Data survey lapangan berhasil disimpan dan skor kelayakan dikalkulasi!");
          reset();
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
        onError: (err: any) => {
          alert(`Gagal mengirim data survey: ${err?.response?.data?.message || err.message}`);
        },
      }
    );
  };

  if (isKriteriaLoading) {
    return (
      <div className="py-6 text-center text-slate-400 text-xs font-semibold">
        Memuat opsi kriteria SPK...
      </div>
    );
  }

  return (
    <GlassCard className="p-8 w-full max-w-xl mx-auto" hoverEffect={false}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Input Hasil Survey Lapangan</h3>
        <p className="text-xs text-slate-400 mt-1">Pilih data survey & sub-kriteria pembanding untuk hitung Profile Matching.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Row 1: Aset & Jaminan (Validasi Silang) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Total Aset (Rp)</label>
            <input
              type="number"
              {...register("totalAset", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Contoh: 150000000"
            />
            {errors.totalAset && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.totalAset.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Nilai Jaminan Aset (Rp)</label>
            <input
              type="number"
              {...register("nilaiJaminanAset", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Contoh: 80000000"
            />
            {errors.nilaiJaminanAset && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.nilaiJaminanAset.message}</p>}
          </div>
        </div>

        {/* Row 2: Pendapatan Mentah & Dropdown Pilihan Opsi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pendapatan Bersih (Rp/Bulan)</label>
            <input
              type="number"
              {...register("pendapatanBersih", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Contoh: 12000000"
            />
            {errors.pendapatanBersih && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.pendapatanBersih.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Kategori Pendapatan SPK</label>
            <select
              {...register("idSubPendapatan", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
            >
              <option value="">-- Pilih Opsi --</option>
              {kriteriaPendapatan?.subKriteria?.map((sub: any) => (
                <option key={sub.idSub} value={sub.idSub}>
                  {sub.deskripsi}
                </option>
              ))}
            </select>
            {errors.idSubPendapatan && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.idSubPendapatan.message}</p>}
          </div>
        </div>

        {/* Row 3: Status Hunian & Status Pekerjaan Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Opsi Status Hunian SPK</label>
            <select
              {...register("idSubHunian", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
            >
              <option value="">-- Pilih Opsi --</option>
              {kriteriaHunian?.subKriteria?.map((sub: any) => (
                <option key={sub.idSub} value={sub.idSub}>
                  {sub.deskripsi}
                </option>
              ))}
            </select>
            {errors.idSubHunian && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.idSubHunian.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Opsi Pekerjaan SPK</label>
            <select
              {...register("idSubPekerjaan", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
            >
              <option value="">-- Pilih Opsi --</option>
              {kriteriaPekerjaan?.subKriteria?.map((sub: any) => (
                <option key={sub.idSub} value={sub.idSub}>
                  {sub.deskripsi}
                </option>
              ))}
            </select>
            {errors.idSubPekerjaan && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.idSubPekerjaan.message}</p>}
          </div>
        </div>

        {/* Row 4: Jumlah Tanggungan */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Opsi Jumlah Tanggungan SPK</label>
          <select
            {...register("idSubTanggungan", { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
          >
            <option value="">-- Pilih Opsi --</option>
            {kriteriaTanggungan?.subKriteria?.map((sub: any) => (
              <option key={sub.idSub} value={sub.idSub}>
                {sub.deskripsi}
              </option>
            ))}
          </select>
          {errors.idSubTanggungan && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.idSubTanggungan.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitSurveyMutation.isPending}
          className="w-full py-3 mt-4 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitSurveyMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Mengirim Hasil Survey...
            </>
          ) : (
            "Simpan & Kalkulasi Kelayakan"
          )}
        </button>
      </form>
    </GlassCard>
  );
};
export default FormSurvey;

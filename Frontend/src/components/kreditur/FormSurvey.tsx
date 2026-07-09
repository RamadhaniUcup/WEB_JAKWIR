import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitSurvey } from "../../hooks/useApi.js";
import { GlassCard } from "../common/glasscard.js";

// 1. Definisikan Skema Validasi Form Survey Lapangan menggunakan Zod (tipe z.number)
const surveySchema = z.object({
  totalAset: z.number().min(1, "Total aset harus lebih besar dari 0"),
  pendapatanBersih: z.number().min(1, "Pendapatan bersih harus lebih besar dari 0"),
  statusHunian: z.enum(["MILIK_SENDIRI", "SEWA", "KONTRAK", "BERSAMA_ORANG_TUA"], {
    message: "Pilih status hunian yang sesuai",
  }),
  statusPekerjaan: z.enum(["KARYAWAN_TETAP", "KARYAWAN_KONTRAK", "WIRAUSAHA", "TIDAK_BEKERJA"], {
    message: "Pilih status pekerjaan yang sesuai",
  }),
  jumlahTanggungan: z.number().int().min(0, "Jumlah tanggungan minimal 0"),
  nilaiJaminanAset: z.number().min(1, "Nilai jaminan harus lebih besar dari 0"),
});

// Infer tipe data dari skema Zod
type SurveyFormData = z.infer<typeof surveySchema>;

interface FormSurveyProps {
  idPengajuan: number;
  onSuccessCallback?: () => void;
}

export const FormSurvey: FC<FormSurveyProps> = ({ idPengajuan, onSuccessCallback }) => {
  const submitSurveyMutation = useSubmitSurvey();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      totalAset: 0,
      pendapatanBersih: 0,
      statusHunian: "MILIK_SENDIRI",
      statusPekerjaan: "KARYAWAN_TETAP",
      jumlahTanggungan: 0,
      nilaiJaminanAset: 0,
    },
  });

  const onSubmit = (data: SurveyFormData) => {
    submitSurveyMutation.mutate(
      {
        idPengajuan,
        ...data,
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

  return (
    <GlassCard className="p-8 w-full max-w-xl mx-auto" hoverEffect={false}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Input Hasil Survey Lapangan</h3>
        <p className="text-xs text-slate-400 mt-1">Isi data lapangan untuk memicu perhitungan otomatis Profile Matching.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Row 1: Aset & Pendapatan */}
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
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pendapatan Bersih (Rp/Bulan)</label>
            <input
              type="number"
              {...register("pendapatanBersih", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Contoh: 12000000"
            />
            {errors.pendapatanBersih && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.pendapatanBersih.message}</p>}
          </div>
        </div>

        {/* Row 2: Status Hunian & Pekerjaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Status Hunian</label>
            <select
              {...register("statusHunian")}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
            >
              <option value="MILIK_SENDIRI">Milik Sendiri</option>
              <option value="SEWA">Sewa</option>
              <option value="KONTRAK">Kontrak</option>
              <option value="BERSAMA_ORANG_TUA">Bersama Orang Tua</option>
            </select>
            {errors.statusHunian && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.statusHunian.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Status Pekerjaan</label>
            <select
              {...register("statusPekerjaan")}
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
            >
              <option value="KARYAWAN_TETAP">Karyawan Tetap</option>
              <option value="KARYAWAN_KONTRAK">Karyawan Kontrak</option>
              <option value="WIRAUSAHA">Wirausaha</option>
              <option value="TIDAK_BEKERJA">Tidak Bekerja</option>
            </select>
            {errors.statusPekerjaan && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.statusPekerjaan.message}</p>}
          </div>
        </div>

        {/* Row 3: Tanggungan & Jaminan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Jumlah Tanggungan</label>
            <input
              type="number"
              {...register("jumlahTanggungan", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Contoh: 3"
            />
            {errors.jumlahTanggungan && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.jumlahTanggungan.message}</p>}
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

import { useState, useEffect, type FC } from "react";
import { useGetKriterias, useSubmitSurvey, useGetPengajuan } from "../../hooks/useApi.js";
import { GlassCard } from "../common/glasscard.js";

interface FormSurveyProps {
  idPengajuan: number;
  onSuccessCallback?: () => void;
}

export const FormSurvey: FC<FormSurveyProps> = ({ idPengajuan, onSuccessCallback }) => {
  const submitSurveyMutation = useSubmitSurvey();
  const { data: kriterias, isLoading: isKriteriaLoading } = useGetKriterias();
  const { data: pengajuanList } = useGetPengajuan();

  // Cari data pengajuan aktif untuk memuat penilaian yang sudah diinput sebelumnya (fitur edit survey)
  const activePengajuan = pengajuanList?.find((p) => p.idPengajuan === idPengajuan);
  const existingPenilaian = activePengajuan?.penilaian || [];

  // Map kriteria ID -> selected subKriteria ID
  const [selectedSubCriteria, setSelectedSubCriteria] = useState<Record<number, number>>({});

  // Prefill data survei lama jika ada
  useEffect(() => {
    if (existingPenilaian.length > 0) {
      const initialMap: Record<number, number> = {};
      existingPenilaian.forEach((p: any) => {
        if (p.subKriteria) {
          initialMap[p.subKriteria.idKriteria] = p.idSub;
        }
      });
      setSelectedSubCriteria(initialMap);
    }
  }, [existingPenilaian]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!kriterias || kriterias.length === 0) return;

    // Pastikan seluruh kriteria yang terdaftar telah dipilih opsi sub-kriterianya
    const missingKriteria = kriterias.filter((k) => !selectedSubCriteria[k.idKriteria]);
    if (missingKriteria.length > 0) {
      alert(`Mohon pilih opsi sub-kriteria untuk kriteria: ${missingKriteria.map(k => k.namaKriteria).join(", ")}`);
      return;
    }

    const subIds = Object.values(selectedSubCriteria);

    submitSurveyMutation.mutate(
      {
        idPengajuan,
        subIds,
      },
      {
        onSuccess: () => {
          alert("Data survey lapangan berhasil disimpan! Status pengajuan kini: MENUNGGU_SPK.");
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
        onError: (err: any) => {
          alert(`Gagal menyimpan survey: ${err?.response?.data?.message || err.message}`);
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
        <p className="text-xs text-slate-400 mt-1">
          Pilih tingkat kelayakan / opsi sub-kriteria hasil survei fisik untuk memulai perhitungan SPK.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Dynamic Dropdown Render for each Kriteria */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {kriterias?.map((kriteria) => (
            <div key={kriteria.idKriteria} className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {kriteria.namaKriteria} ({kriteria.kodeKriteria}) - <span className="text-cyan-500 font-mono">{kriteria.jenisFaktor}</span>
              </label>
              <select
                value={selectedSubCriteria[kriteria.idKriteria] || ""}
                onChange={(e) => {
                  setSelectedSubCriteria({
                    ...selectedSubCriteria,
                    [kriteria.idKriteria]: Number(e.target.value)
                  });
                }}
                className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                required
              >
                <option value="">-- Pilih Opsi Kriteria --</option>
                {kriteria.subKriteria?.map((sub: any) => (
                  <option key={sub.idSub} value={sub.idSub}>
                    Rating {sub.nilaiRating} - {sub.deskripsi}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitSurveyMutation.isPending}
          className="w-full py-3 mt-4 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitSurveyMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Menyimpan Hasil Survey...
            </>
          ) : (
            "Simpan Survey Lapangan"
          )}
        </button>
      </form>
    </GlassCard>
  );
};
export default FormSurvey;

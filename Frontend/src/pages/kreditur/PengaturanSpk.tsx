import { useState, type FC } from "react";
import {
  useGetAspeks,
  useCreateAspek,
  useUpdateAspek,
  useDeleteAspek,
  useGetKriterias,
  useCreateKriteria,
  useUpdateKriteria,
  useDeleteKriteria,
  useGetSubKriterias,
  useCreateSubKriteria,
  useUpdateSubKriteria,
  useDeleteSubKriteria,
} from "../../hooks/useApi.js";
import { GlassCard } from "../../components/common/glasscard.js";

export const PengaturanSpk: FC = () => {
  const [activeTab, setActiveTab] = useState<"aspek" | "kriteria" | "subKriteria">("aspek");

  // Hook Aspek
  const { data: aspeks, isLoading: loadAspek } = useGetAspeks();
  const createAspekMutation = useCreateAspek();
  const updateAspekMutation = useUpdateAspek();
  const deleteAspekMutation = useDeleteAspek();

  // Hook Kriteria
  const { data: kriterias, isLoading: loadKriteria } = useGetKriterias();
  const createKriteriaMutation = useCreateKriteria();
  const updateKriteriaMutation = useUpdateKriteria();
  const deleteKriteriaMutation = useDeleteKriteria();

  // State Sub-Kriteria terpilih
  const [selectedKriteriaId, setSelectedKriteriaId] = useState<number>(0);
  const { data: subKriterias, isLoading: loadSub } = useGetSubKriterias(selectedKriteriaId);
  const createSubMutation = useCreateSubKriteria();
  const updateSubMutation = useUpdateSubKriteria();
  const deleteSubMutation = useDeleteSubKriteria();

  // Forms State
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields - Aspek
  const [namaAspek, setNamaAspek] = useState("");
  const [persentaseCf, setPersentaseCf] = useState(60);
  const [persentaseSf, setPersentaseSf] = useState(40);
  const [bobotAspek, setBobotAspek] = useState(30);

  // Form Fields - Kriteria
  const [idAspek, setIdAspek] = useState("");
  const [kodeKriteria, setKodeKriteria] = useState("");
  const [namaKriteria, setNamaKriteria] = useState("");
  const [nilaiTarget, setNilaiTarget] = useState(3);
  const [jenisFaktor, setJenisFaktor] = useState("CORE");

  // Form Fields - Sub Kriteria
  const [deskripsiSub, setDeskripsiSub] = useState("");
  const [nilaiRatingSub, setNilaiRatingSub] = useState(5);

  const resetForm = () => {
    setEditingId(null);
    setNamaAspek("");
    setPersentaseCf(60);
    setPersentaseSf(40);
    setBobotAspek(30);
    setIdAspek("");
    setKodeKriteria("");
    setNamaKriteria("");
    setNilaiTarget(3);
    setJenisFaktor("CORE");
    setDeskripsiSub("");
    setNilaiRatingSub(5);
    setIsOpenForm(false);
  };

  const handleEditAspek = (aspek: any) => {
    setEditingId(aspek.idAspek);
    setNamaAspek(aspek.namaAspek);
    setPersentaseCf(Number(aspek.persentaseCf));
    setPersentaseSf(Number(aspek.persentaseSf));
    setBobotAspek(Number(aspek.bobotAspek));
    setIsOpenForm(true);
  };

  const handleEditKriteria = (k: any) => {
    setEditingId(k.idKriteria);
    setIdAspek(String(k.idAspek));
    setKodeKriteria(k.kodeKriteria);
    setNamaKriteria(k.namaKriteria);
    setNilaiTarget(k.nilaiTarget);
    setJenisFaktor(k.jenisFaktor);
    setIsOpenForm(true);
  };

  const handleEditSub = (sub: any) => {
    setEditingId(sub.idSub);
    setDeskripsiSub(sub.deskripsi);
    setNilaiRatingSub(sub.nilaiRating);
    setIsOpenForm(true);
  };

  const handleAspekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAspekMutation.mutate(
        { idAspek: editingId, namaAspek, persentaseCf, persentaseSf, bobotAspek },
        { onSuccess: resetForm }
      );
    } else {
      createAspekMutation.mutate(
        { namaAspek, persentaseCf, persentaseSf, bobotAspek },
        { onSuccess: resetForm }
      );
    }
  };

  const handleKriteriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateKriteriaMutation.mutate(
        { idKriteria: editingId, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor },
        { onSuccess: resetForm }
      );
    } else {
      createKriteriaMutation.mutate(
        { idAspek: Number(idAspek), kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor },
        { onSuccess: resetForm }
      );
    }
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSubMutation.mutate(
        { idSub: editingId, idKriteria: selectedKriteriaId, deskripsi: deskripsiSub, nilaiRating: nilaiRatingSub },
        { onSuccess: resetForm }
      );
    } else {
      createSubMutation.mutate(
        { idKriteria: selectedKriteriaId, deskripsi: deskripsiSub, nilaiRating: nilaiRatingSub },
        { onSuccess: resetForm }
      );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Konfigurasi Matriks SPK</h1>
          <p className="text-sm text-slate-400 mt-1">Sesuaikan bobot kontribusi Aspek, target Kriteria, serta deskripsi Sub-kriteria.</p>
        </div>
        
        {activeTab !== "subKriteria" && (
          <button
            onClick={() => {
              resetForm();
              setIsOpenForm(true);
            }}
            className="px-4 py-2.5 bg-indigo-500 text-white font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            + Tambah {activeTab === "aspek" ? "Aspek" : "Kriteria"}
          </button>
        )}
        {activeTab === "subKriteria" && selectedKriteriaId > 0 && (
          <button
            onClick={() => {
              resetForm();
              setIsOpenForm(true);
            }}
            className="px-4 py-2.5 bg-indigo-500 text-white font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            + Tambah Opsi Nilai
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("aspek")}
          className={`pb-3 transition-colors ${activeTab === "aspek" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"}`}
        >
          1. Aspek SPK
        </button>
        <button
          onClick={() => setActiveTab("kriteria")}
          className={`pb-3 transition-colors ${activeTab === "kriteria" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"}`}
        >
          2. Kriteria SPK
        </button>
        <button
          onClick={() => setActiveTab("subKriteria")}
          className={`pb-3 transition-colors ${activeTab === "subKriteria" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-white"}`}
        >
          3. Sub-Kriteria (Dropdown Value)
        </button>
      </div>

      {/* RENDER TAB 1: ASPEK */}
      {activeTab === "aspek" && (
        <GlassCard className="overflow-hidden" hoverEffect={false}>
          {loadAspek ? (
            <div className="py-12 text-center text-slate-400">Loading aspek...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Nama Aspek</th>
                    <th className="px-6 py-4">Bobot Aspek (%)</th>
                    <th className="px-6 py-4">Core Factor (CF %)</th>
                    <th className="px-6 py-4">Secondary (SF %)</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {aspeks?.map((aspek) => (
                    <tr key={aspek.idAspek} className="hover:bg-white/[0.01]">
                      <td className="px-6 py-4 font-bold text-white">{aspek.namaAspek}</td>
                      <td className="px-6 py-4 text-slate-300 font-semibold">{aspek.bobotAspek}%</td>
                      <td className="px-6 py-4 text-slate-400">{aspek.persentaseCf}%</td>
                      <td className="px-6 py-4 text-slate-400">{aspek.persentaseSf}%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditAspek(aspek)} className="px-2 py-1 bg-white/5 rounded text-xs">Ubah</button>
                          <button onClick={() => deleteAspekMutation.mutate(aspek.idAspek)} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* RENDER TAB 2: KRITERIA */}
      {activeTab === "kriteria" && (
        <GlassCard className="overflow-hidden" hoverEffect={false}>
          {loadKriteria ? (
            <div className="py-12 text-center text-slate-400">Loading kriteria...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/[0.02] text-xs uppercase text-slate-500 font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Kode</th>
                    <th className="px-6 py-4">Kriteria Kelayakan</th>
                    <th className="px-6 py-4">Aspek Induk</th>
                    <th className="px-6 py-4">Target Nilai</th>
                    <th className="px-6 py-4">Jenis Faktor</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {kriterias?.map((k) => (
                    <tr key={k.idKriteria} className="hover:bg-white/[0.01]">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-bold">{k.kodeKriteria}</td>
                      <td className="px-6 py-4 font-bold text-white">{k.namaKriteria}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{k.aspek.namaAspek}</td>
                      <td className="px-6 py-4 font-bold text-amber-400">Target: {k.nilaiTarget}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.jenisFaktor === "CORE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                          {k.jenisFaktor}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditKriteria(k)} className="px-2 py-1 bg-white/5 rounded text-xs">Ubah</button>
                          <button onClick={() => deleteKriteriaMutation.mutate(k.idKriteria)} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* RENDER TAB 3: SUB-KRITERIA */}
      {activeTab === "subKriteria" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kriteria List */}
          <GlassCard className="p-4 space-y-2 h-fit" hoverEffect={false}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pilih Kriteria</h3>
            {kriterias?.map((k) => (
              <button
                key={k.idKriteria}
                onClick={() => setSelectedKriteriaId(k.idKriteria)}
                className={`w-full text-left px-4 py-3 rounded-xl transition text-xs font-bold ${
                  selectedKriteriaId === k.idKriteria
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                [{k.kodeKriteria}] {k.namaKriteria}
              </button>
            ))}
          </GlassCard>

          {/* Kolom Sub-Kriteria List */}
          <GlassCard className="md:col-span-2 overflow-hidden" hoverEffect={false}>
            <div className="p-4 border-b border-white/10 bg-white/[0.01]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nilai Opsi Deskripsi</h3>
            </div>
            {selectedKriteriaId === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">Pilih salah satu kriteria di samping untuk mengatur dropdown.</div>
            ) : loadSub ? (
              <div className="p-10 text-center text-slate-400">Loading sub-kriteria...</div>
            ) : !subKriterias || subKriterias.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">Belum ada opsi sub-kriteria. Klik tombol di kanan atas untuk menambah.</div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/[0.01] text-xs uppercase text-slate-500 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3">Pernyataan Deskripsi</th>
                    <th className="px-6 py-3">Rating Skor</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subKriterias.map((sub) => (
                    <tr key={sub.idSub} className="hover:bg-white/[0.01]">
                      <td className="px-6 py-3 text-white font-semibold text-xs">{sub.deskripsi}</td>
                      <td className="px-6 py-3 text-emerald-400 font-bold text-xs">{sub.nilaiRating} / 5</td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditSub(sub)} className="px-2 py-1 bg-white/5 rounded text-[10px]">Ubah</button>
                          <button onClick={() => deleteSubMutation.mutate({ idSub: sub.idSub, idKriteria: selectedKriteriaId })} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-[10px]">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </GlassCard>
        </div>
      )}

      {/* FORM OVERLAY MODAL */}
      {isOpenForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-md p-8 relative" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Form Input Config</h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            {/* IF TAB 1: ASPEK */}
            {activeTab === "aspek" && (
              <form onSubmit={handleAspekSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama Aspek</label>
                  <input
                    type="text"
                    value={namaAspek}
                    onChange={(e) => setNamaAspek(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                    placeholder="Contoh: Keuangan"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Bobot Aspek (%)</label>
                    <input
                      type="number"
                      value={bobotAspek}
                      onChange={(e) => setBobotAspek(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Core (CF %)</label>
                    <input
                      type="number"
                      value={persentaseCf}
                      onChange={(e) => setPersentaseCf(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Secondary (SF %)</label>
                    <input
                      type="number"
                      value={persentaseSf}
                      onChange={(e) => setPersentaseSf(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-500 font-bold rounded-xl text-slate-950 text-xs">Simpan Aspek</button>
              </form>
            )}

            {/* IF TAB 2: KRITERIA */}
            {activeTab === "kriteria" && (
              <form onSubmit={handleKriteriaSubmit} className="space-y-4">
                {!editingId && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pilih Aspek Induk</label>
                    <select
                      value={idAspek}
                      onChange={(e) => setIdAspek(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                      required
                    >
                      <option value="">-- Pilih Aspek --</option>
                      {aspeks?.map((a) => <option key={a.idAspek} value={a.idAspek}>{a.namaAspek}</option>)}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Kode Kriteria</label>
                    <input
                      type="text"
                      value={kodeKriteria}
                      onChange={(e) => setKodeKriteria(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                      placeholder="C1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama Kriteria</label>
                    <input
                      type="text"
                      value={namaKriteria}
                      onChange={(e) => setNamaKriteria(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                      placeholder="Pendapatan Bersih"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target SPK (1-5)</label>
                    <input
                      type="number"
                      value={nilaiTarget}
                      onChange={(e) => setNilaiTarget(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                      min={1}
                      max={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Jenis Faktor</label>
                    <select
                      value={jenisFaktor}
                      onChange={(e) => setJenisFaktor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                      required
                    >
                      <option value="CORE">CORE FACTOR</option>
                      <option value="SECONDARY">SECONDARY FACTOR</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-500 font-bold rounded-xl text-slate-950 text-xs">Simpan Kriteria</button>
              </form>
            )}

            {/* IF TAB 3: SUB KRITERIA */}
            {activeTab === "subKriteria" && (
              <form onSubmit={handleSubSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pernyataan Deskripsi (Misal Rentang/String)</label>
                  <input
                    type="text"
                    value={deskripsiSub}
                    onChange={(e) => setDeskripsiSub(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                    placeholder="Contoh: >= 10000000 atau WIRAUSAHA"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Skor Rating Hasil Pencocokan (1-5)</label>
                  <input
                    type="number"
                    value={nilaiRatingSub}
                    onChange={(e) => setNilaiRatingSub(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/3 border border-white/10 rounded-xl text-white text-sm"
                    min={1}
                    max={5}
                    required
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-500 font-bold rounded-xl text-slate-950 text-xs">Simpan Sub-Kriteria</button>
              </form>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};
export default PengaturanSpk;

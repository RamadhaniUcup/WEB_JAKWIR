import { useState, useEffect, type FC } from "react";
import {
  useGetSuperAdminPenyediaJasas,
  useUpdateSuperAdminPenyediaJasa,
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

export const ManageSpk: FC = () => {
  const [selectedPjId, setSelectedPjId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"kriteria" | "subKriteria">("kriteria");

  // Load Penyedia Jasa
  const { data: penyediaJasas } = useGetSuperAdminPenyediaJasas();
  const updatePjMutation = useUpdateSuperAdminPenyediaJasa();

  // Load Kriteria based on selected Penyedia Jasa
  const { data: kriterias, isLoading: loadKriteria } = useGetKriterias(selectedPjId || undefined);

  // Selected Kriteria for Sub-Kriteria CRUD
  const [selectedKriteriaId, setSelectedKriteriaId] = useState<number>(0);
  const { data: subKriterias, isLoading: loadSub } = useGetSubKriterias(selectedKriteriaId);

  // Mutations
  const createKriteriaMutation = useCreateKriteria();
  const updateKriteriaMutation = useUpdateKriteria();
  const deleteKriteriaMutation = useDeleteKriteria();

  const createSubMutation = useCreateSubKriteria();
  const updateSubMutation = useUpdateSubKriteria();
  const deleteSubMutation = useDeleteSubKriteria();

  // Global CF/SF state for selected Penyedia Jasa
  const [pjCf, setPjCf] = useState<number>(60);
  const [pjSf, setPjSf] = useState<number>(40);

  useEffect(() => {
    const currentPj = penyediaJasas?.find((pj) => pj.idPenyediaJasa === selectedPjId);
    if (currentPj) {
      setPjCf(Number(currentPj.persentaseCf || 60));
      setPjSf(Number(currentPj.persentaseSf || 40));
    }
  }, [selectedPjId, penyediaJasas]);

  // Forms State
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields - Kriteria
  const [kodeKriteria, setKodeKriteria] = useState("");
  const [namaKriteria, setNamaKriteria] = useState("");
  const [nilaiTarget, setNilaiTarget] = useState(3);
  const [jenisFaktor, setJenisFaktor] = useState("CORE");
  const [bobot, setBobot] = useState(0);
  const [jenisAtribut, setJenisAtribut] = useState("BENEFIT");

  // Form Fields - Sub Kriteria
  const [deskripsiSub, setDeskripsiSub] = useState("");
  const [nilaiRatingSub, setNilaiRatingSub] = useState(5);

  const resetForm = () => {
    setEditingId(null);
    setKodeKriteria("");
    setNamaKriteria("");
    setNilaiTarget(3);
    setJenisFaktor("CORE");
    setBobot(0);
    setJenisAtribut("BENEFIT");
    setDeskripsiSub("");
    setNilaiRatingSub(5);
    setIsOpenForm(false);
  };

  const handleEditKriteria = (k: any) => {
    setEditingId(k.idKriteria);
    setKodeKriteria(k.kodeKriteria);
    setNamaKriteria(k.namaKriteria);
    setNilaiTarget(k.nilaiTarget);
    setJenisFaktor(k.jenisFaktor);
    setBobot(Number(k.bobot) || 0);
    setJenisAtribut(k.jenisAtribut || "BENEFIT");
    setIsOpenForm(true);
  };

  const handleEditSub = (sub: any) => {
    setEditingId(sub.idSub);
    setDeskripsiSub(sub.deskripsi);
    setNilaiRatingSub(sub.nilaiRating);
    setIsOpenForm(true);
  };

  const handleSavePjWeights = () => {
    if (pjCf + pjSf !== 100) {
      alert("Total persentase Core Factor & Secondary Factor harus sama dengan 100%.");
      return;
    }
    updatePjMutation.mutate(
      {
        idPenyediaJasa: selectedPjId,
        persentaseCf: pjCf,
        persentaseSf: pjSf,
      },
      {
        onSuccess: () => {
          alert("Bobot persentase SPK Penyedia Jasa berhasil diperbarui.");
        },
      }
    );
  };

  const handleKriteriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateKriteriaMutation.mutate(
        { idKriteria: editingId, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor, bobot, jenisAtribut },
        { onSuccess: resetForm }
      );
    } else {
      createKriteriaMutation.mutate(
        { idPenyediaJasa: selectedPjId, kodeKriteria, namaKriteria, nilaiTarget, jenisFaktor, bobot, jenisAtribut },
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
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Master Pengaturan SPK</h1>
        <p className="text-slate-400 text-sm mt-2">
          Kelola Kriteria kelayakan, Sub-kriteria pilihan rating (1-5), dan bobot persentase CF & SF global untuk Penyedia Jasa.
        </p>
      </div>

      {/* Filter Penyedia Jasa */}
      <GlassCard className="p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Pilih Penyedia Jasa</label>
        <select
          value={selectedPjId}
          onChange={(e) => {
            setSelectedPjId(Number(e.target.value));
            setSelectedKriteriaId(0);
          }}
          className="w-full max-w-md px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition cursor-pointer"
        >
          <option value="0">-- Pilih Penyedia Jasa --</option>
          {penyediaJasas?.map((pj) => (
            <option key={pj.idPenyediaJasa} value={pj.idPenyediaJasa}>
              {pj.namaPenyediaJasa}
            </option>
          ))}
        </select>
      </GlassCard>

      {selectedPjId > 0 ? (
        <>
          {/* Bobot Persentase SPK Global */}
          <GlassCard className="p-6">
            <h3 className="text-md font-bold text-white mb-4">Pengaturan Bobot SPK Global</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Core Factor (%)</label>
                <input
                  type="number"
                  value={pjCf}
                  onChange={(e) => {
                    const cfVal = Number(e.target.value);
                    setPjCf(cfVal);
                    setPjSf(100 - cfVal);
                  }}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Secondary Factor (%)</label>
                <input
                  type="number"
                  value={pjSf}
                  onChange={(e) => {
                    const sfVal = Number(e.target.value);
                    setPjSf(sfVal);
                    setPjCf(100 - sfVal);
                  }}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSavePjWeights}
                  disabled={updatePjMutation.isPending}
                  className="w-full sm:w-auto px-6 py-3.5 bg-linear-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer text-xs"
                >
                  {updatePjMutation.isPending ? "Menyimpan..." : "Simpan Bobot SPK"}
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Validation Banner: Minimal 6 Kriteria */}
          {kriterias && kriterias.length < 6 && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-bold text-white mb-0.5">Kriteria Kurang dari Minimal</p>
                <p>Penyedia Jasa ini wajib memiliki minimal 6 kriteria untuk perhitungan SPK (Saat ini: {kriterias.length}).</p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("kriteria")}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === "kriteria" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Kriteria Kelayakan
            </button>
            <button
              onClick={() => setActiveTab("subKriteria")}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === "subKriteria" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Sub-Kriteria (Pilihan Dropdown)
            </button>
          </div>

          {/* TAB CONTENT: KRITERIA */}
          {activeTab === "kriteria" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Daftar Kriteria</h3>
                <button
                  onClick={() => {
                    resetForm();
                    setIsOpenForm(true);
                  }}
                  className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition cursor-pointer"
                >
                  + Tambah Kriteria
                </button>
              </div>

              {isOpenForm && (
                <GlassCard className="p-6 max-w-xl">
                  <h4 className="text-md font-bold text-white mb-4">
                    {editingId ? "Edit Kriteria" : "Tambah Kriteria Baru"}
                  </h4>
                  <form onSubmit={handleKriteriaSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Kode Kriteria</label>
                        <input
                          type="text"
                          value={kodeKriteria}
                          onChange={(e) => setKodeKriteria(e.target.value)}
                          placeholder="Contoh: C1"
                          maxLength={5}
                          className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Jenis Faktor</label>
                        <select
                          value={jenisFaktor}
                          onChange={(e) => setJenisFaktor(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                        >
                          <option value="CORE">CORE (Utama)</option>
                          <option value="SECONDARY">SECONDARY (Pendukung)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Nama Kriteria</label>
                      <input
                        type="text"
                        value={namaKriteria}
                        onChange={(e) => setNamaKriteria(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Target (PM)</label>
                        <select
                          value={nilaiTarget}
                          onChange={(e) => setNilaiTarget(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Atribut (S/W/T)</label>
                        <select
                          value={jenisAtribut}
                          onChange={(e) => setJenisAtribut(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                        >
                          <option value="BENEFIT">BENEFIT</option>
                          <option value="COST">COST</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Bobot (S/W/T)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={bobot}
                          onChange={(e) => setBobot(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={createKriteriaMutation.isPending || updateKriteriaMutation.isPending}
                        className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        {createKriteriaMutation.isPending || updateKriteriaMutation.isPending ? "Menyimpan..." : "Simpan"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </GlassCard>
              )}

              <GlassCard className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/3 text-[10px] text-slate-400 font-bold uppercase">
                      <th className="p-4">Kode</th>
                      <th className="p-4">Nama Kriteria</th>
                      <th className="p-4">Target (PM)</th>
                      <th className="p-4">Faktor (PM)</th>
                      <th className="p-4">Atribut (SWT)</th>
                      <th className="p-4">Bobot (SWT)</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {loadKriteria ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-500 text-xs">Memuat data kriteria...</td>
                      </tr>
                    ) : kriterias?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-500 text-xs">Belum ada data kriteria.</td>
                      </tr>
                    ) : (
                      kriterias?.map((k) => (
                        <tr key={k.idKriteria} className="hover:bg-white/1 text-slate-300">
                          <td className="p-4 font-mono text-cyan-400">{k.kodeKriteria}</td>
                          <td className="p-4 font-semibold text-white">{k.namaKriteria}</td>
                          <td className="p-4 font-bold text-white">{k.nilaiTarget}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.jenisFaktor === "CORE" ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-500/10 text-slate-400"}`}>
                              {k.jenisFaktor}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.jenisAtribut === "BENEFIT" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                              {k.jenisAtribut}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-cyan-400">{Number(k.bobot).toFixed(2)}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditKriteria(k)}
                              className="text-cyan-400 hover:text-cyan-300 text-xs font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Hapus kriteria ini beserta seluruh sub-kriteria terkait?")) {
                                  deleteKriteriaMutation.mutate(k.idKriteria);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 text-xs font-bold"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* TAB CONTENT: SUB KRITERIA */}
          {activeTab === "subKriteria" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kolom Kiri: Pilih Kriteria */}
              <GlassCard className="p-6 h-fit space-y-4">
                <h3 className="text-md font-bold text-white mb-2">1. Pilih Kriteria</h3>
                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {kriterias?.map((k) => (
                    <button
                      key={k.idKriteria}
                      onClick={() => setSelectedKriteriaId(k.idKriteria)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${
                        selectedKriteriaId === k.idKriteria
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-500/5"
                          : "bg-white/3 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="font-mono text-[10px] text-cyan-500 mb-0.5">{k.kodeKriteria} - {k.jenisFaktor}</div>
                      <div className="truncate text-white">{k.namaKriteria}</div>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Kolom Kanan: Manage Sub-Kriteria */}
              <div className="md:col-span-2 space-y-6">
                {selectedKriteriaId > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-white">Sub-Kriteria Pilihan Dropdown</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Kelola pilihan rating yang nantinya diisi oleh surveyor Penyedia Jasa.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          resetForm();
                          setIsOpenForm(true);
                        }}
                        className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition cursor-pointer"
                      >
                        + Tambah Opsi
                      </button>
                    </div>

                    {isOpenForm && (
                      <GlassCard className="p-6">
                        <h4 className="text-sm font-bold text-white mb-4">
                          {editingId ? "Edit Opsi Sub-Kriteria" : "Tambah Opsi Sub-Kriteria Baru"}
                        </h4>
                        <form onSubmit={handleSubSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            <div className="sm:col-span-2">
                              <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Deskripsi Opsi</label>
                              <input
                                type="text"
                                value={deskripsiSub}
                                onChange={(e) => setDeskripsiSub(e.target.value)}
                                placeholder="Contoh: Pegawai Tetap Swasta"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-400 mb-2 font-bold uppercase">Nilai Rating (1-5)</label>
                              <select
                                value={nilaiRatingSub}
                                onChange={(e) => setNilaiRatingSub(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-[#0f172a] border border-white/10 rounded-xl text-white text-sm"
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={createSubMutation.isPending || updateSubMutation.isPending}
                              className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
                            >
                              {createSubMutation.isPending || updateSubMutation.isPending ? "Menyimpan Opsi..." : "Simpan Opsi"}
                            </button>
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg text-xs"
                            >
                              Batal
                            </button>
                          </div>
                        </form>
                      </GlassCard>
                    )}

                    <GlassCard className="overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/3 text-[10px] text-slate-400 font-bold uppercase">
                            <th className="p-4">Nilai Rating</th>
                            <th className="p-4">Deskripsi Opsi</th>
                            <th className="p-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {loadSub ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center text-slate-500 text-xs">Memuat data sub-kriteria...</td>
                            </tr>
                          ) : subKriterias?.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center text-slate-500 text-xs">Belum ada opsi dropdown. Tambahkan opsi rating 1-5 terlebih dahulu.</td>
                            </tr>
                          ) : (
                            subKriterias?.map((sub) => (
                              <tr key={sub.idSub} className="hover:bg-white/1 text-slate-300">
                                <td className="p-4 font-bold text-cyan-400">{sub.nilaiRating}</td>
                                <td className="p-4 text-white font-semibold">{sub.deskripsi}</td>
                                <td className="p-4 text-right space-x-2">
                                  <button
                                    onClick={() => handleEditSub(sub)}
                                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm("Hapus opsi ini?")) {
                                        deleteSubMutation.mutate({ idSub: sub.idSub, idKriteria: selectedKriteriaId });
                                      }
                                    }}
                                    className="text-red-400 hover:text-red-300 text-xs font-bold"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </GlassCard>
                  </>
                ) : (
                  <div className="py-20 text-center text-slate-500 text-sm">
                    👈 Silakan pilih salah satu kriteria di sebelah kiri untuk mengelola opsi sub-kriteria.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center text-slate-500 text-sm">
          💡 Silakan pilih salah satu Penyedia Jasa di atas untuk memuat data pengaturan SPK.
        </div>
      )}
    </div>
  );
};
export default ManageSpk;

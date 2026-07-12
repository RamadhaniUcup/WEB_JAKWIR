import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../api/axiosClient.js";
import { useAuthStore, type AuthUser, type UserRole } from "../store/useAuthStore.js";

// === INTERFACE REQUEST & RESPONSE ===
export interface LoginPayload {
  email: string;
  password?: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface SurveyPayload {
  idPengajuan: number;
  subIds: number[]; // Array of selected subKriteria IDs
}

/**
 * 1. Hook untuk Login Mutasi (Admin & Nasabah)
 */
export function useLoginMutation() {
  const loginToStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const path = payload.isAdmin ? "/auth/login/admin" : "/auth/login/nasabah";
      const response = await axiosClient.post<LoginResponse>(path, {
        email: payload.email,
        password: payload.password,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      let resolvedRole: UserRole = "NASABAH";
      if (variables.isAdmin) {
        resolvedRole = (data.user as any).role || "ADMIN";
      }
      loginToStore(data.token, data.user, resolvedRole);
    },
  });
}

/**
 * 2. Hook untuk Mengambil Daftar Pengajuan Masuk (Role Admin Penyedia Jasa)
 */
export function useGetPengajuan() {
  return useQuery({
    queryKey: ["pengajuanList"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/pengajuan");
      return response.data.data;
    },
  });
}

/**
 * 3. Hook untuk Menginput Hasil Survey Lapangan (Pilihan Dropdown)
 */
export function useSubmitSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SurveyPayload) => {
      const { idPengajuan, subIds } = payload;
      const response = await axiosClient.post(`/pengajuan/${idPengajuan}/survey`, { subIds });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanList"] });
      queryClient.invalidateQueries({ queryKey: ["pengajuanDetails", variables.idPengajuan] });
    },
  });
}

/**
 * 4. Hook untuk Mengambil Profil Nasabah
 */
export function useGetNasabahProfile() {
  return useQuery({
    queryKey: ["nasabahProfile"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any }>("/nasabah/profile");
      return response.data.data;
    },
  });
}

/**
 * 5. Hook untuk Memperbarui Profil Nasabah
 */
export function useUpdateNasabahProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { namaNasabah?: string; telepon?: string; nik?: string; alamat?: string }) => {
      const response = await axiosClient.put<{ message: string; data: any }>("/nasabah/profile", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nasabahProfile"] });
    },
  });
}

/**
 * 6. Hook untuk Mengambil Daftar Penyedia Jasa Publik
 */
export function useGetPenyediaJasaList() {
  return useQuery({
    queryKey: ["penyediaJasaList"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/auth/penyedia-jasa/public");
      return response.data.data;
    },
  });
}

/**
 * 6b. Hook untuk Mengambil Detail Satu Penyedia Jasa (Maksimal Limit & Tenor)
 */
export function useGetPenyediaJasaDetails(id: number) {
  return useQuery({
    queryKey: ["penyediaJasaDetails", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosClient.get<{ data: any }>(`/auth/penyedia-jasa/public/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * 7. Hook untuk Mengirim Pengajuan Kredit Baru (Nasabah)
 */
export function useSubmitPengajuan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { idPenyediaJasa: number; jumlahKredit: number; lamaTenor: number }) => {
      const response = await axiosClient.post<{ message: string; data: any }>("/pengajuan", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanHistory"] });
    },
  });
}

/**
 * 8. Hook untuk Mengambil Riwayat Pengajuan Kredit (Nasabah)
 */
export function useGetPengajuanHistory() {
  return useQuery({
    queryKey: ["pengajuanHistory"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/pengajuan/history");
      return response.data.data;
    },
  });
}

/**
 * 9. Hook untuk Melakukan Approval / Rejection Pengajuan (Admin)
 */
export function useUpdateApprovalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { idPengajuan: number; statusPeminjaman: string }) => {
      const response = await axiosClient.put<{ message: string; data: any }>(
        `/pengajuan/${payload.idPengajuan}/status`,
        { statusPeminjaman: payload.statusPeminjaman }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanList"] });
    },
  });
}

export interface RegisterNasabahPayload {
  namaNasabah: string;
  nik: string;
  telepon: string;
  alamat: string;
  email: string;
  password?: string;
}

/**
 * 10. Hook untuk Registrasi Akun Nasabah Baru
 */
export function useRegisterNasabahMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterNasabahPayload) => {
      const response = await axiosClient.post<{ message: string; data: any }>("/auth/register/nasabah", payload);
      return response.data;
    },
  });
}

// ==========================================
// 11. SUPER ADMIN OPERATIONS (CRUD USER, PENYEDIA JASA, NASABAH)
// ==========================================

export function useGetSuperAdminPenyediaJasas() {
  return useQuery({
    queryKey: ["superPenyediaJasas"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/super-admin/penyedia-jasa");
      return response.data.data;
    },
  });
}

export function useCreateSuperAdminPenyediaJasa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { namaPenyediaJasa: string; alamat: string; statusAktif?: string; limitPengajuan?: number; limitTenor?: number }) => {
      const response = await axiosClient.post("/super-admin/penyedia-jasa", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superPenyediaJasas"] });
      queryClient.invalidateQueries({ queryKey: ["penyediaJasaList"] });
    },
  });
}

export function useUpdateSuperAdminPenyediaJasa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idPenyediaJasa: number; namaPenyediaJasa?: string; alamat?: string; statusAktif?: string; limitPengajuan?: number; limitTenor?: number; persentaseCf?: number; persentaseSf?: number }) => {
      const { idPenyediaJasa, ...data } = payload;
      const response = await axiosClient.put(`/super-admin/penyedia-jasa/${idPenyediaJasa}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superPenyediaJasas"] });
      queryClient.invalidateQueries({ queryKey: ["penyediaJasaList"] });
    },
  });
}

export function useDeleteSuperAdminPenyediaJasa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idPenyediaJasa: number) => {
      const response = await axiosClient.delete(`/super-admin/penyedia-jasa/${idPenyediaJasa}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superPenyediaJasas"] });
      queryClient.invalidateQueries({ queryKey: ["penyediaJasaList"] });
    },
  });
}

export function useGetSuperAdminUsers() {
  return useQuery({
    queryKey: ["superUsers"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/super-admin/users");
      return response.data.data;
    },
  });
}

export function useCreateSuperAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { username: string; email: string; password?: string; role: string; idPenyediaJasa?: number | null }) => {
      const response = await axiosClient.post("/super-admin/users", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superUsers"] });
    },
  });
}

export function useUpdateSuperAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idUser: number; username?: string; email?: string; password?: string; role?: string; idPenyediaJasa?: number | null }) => {
      const { idUser, ...data } = payload;
      const response = await axiosClient.put(`/super-admin/users/${idUser}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superUsers"] });
    },
  });
}

export function useDeleteSuperAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idUser: number) => {
      const response = await axiosClient.delete(`/super-admin/users/${idUser}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superUsers"] });
    },
  });
}

export function useGetSuperAdminNasabahs() {
  return useQuery({
    queryKey: ["superNasabahs"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/super-admin/nasabah");
      return response.data.data;
    },
  });
}

export function useCreateSuperAdminNasabah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterNasabahPayload) => {
      const response = await axiosClient.post("/super-admin/nasabah", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superNasabahs"] });
    },
  });
}

export function useUpdateSuperAdminNasabah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idNasabah: number; namaNasabah?: string; email?: string; telepon?: string; nik?: string; alamat?: string; password?: string }) => {
      const { idNasabah, ...data } = payload;
      const response = await axiosClient.put(`/super-admin/nasabah/${idNasabah}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superNasabahs"] });
    },
  });
}

export function useDeleteSuperAdminNasabah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idNasabah: number) => {
      const response = await axiosClient.delete(`/super-admin/nasabah/${idNasabah}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superNasabahs"] });
    },
  });
}

// ==========================================
// 12. ADMIN/SUPER ADMIN SETTING OPERATIONS (PROFILE & SPK)
// ==========================================

export function useGetMyPenyediaJasaProfile() {
  return useQuery({
    queryKey: ["myPenyediaJasaProfile"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any }>("/penyedia-jasa-settings/profile");
      return response.data.data;
    },
  });
}

export function useUpdateMyPenyediaJasaProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { namaPenyediaJasa?: string; alamat?: string; limitPengajuan?: number; limitTenor?: number; persentaseCf?: number; persentaseSf?: number }) => {
      const response = await axiosClient.put("/penyedia-jasa-settings/profile", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPenyediaJasaProfile"] });
      queryClient.invalidateQueries({ queryKey: ["penyediaJasaList"] });
    },
  });
}

export function useGetKriterias(idPenyediaJasa?: number) {
  return useQuery({
    queryKey: ["myKriterias", idPenyediaJasa],
    queryFn: async () => {
      const url = idPenyediaJasa 
        ? `/penyedia-jasa-settings/kriteria?idPenyediaJasa=${idPenyediaJasa}` 
        : "/penyedia-jasa-settings/kriteria";
      const response = await axiosClient.get<{ data: any[] }>(url);
      return response.data.data;
    },
  });
}

export function useCreateKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idPenyediaJasa: number; kodeKriteria: string; namaKriteria: string; nilaiTarget: number; jenisFaktor: string }) => {
      const response = await axiosClient.post("/penyedia-jasa-settings/kriteria", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myKriterias"] });
    },
  });
}

export function useUpdateKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idKriteria: number; kodeKriteria?: string; namaKriteria?: string; nilaiTarget?: number; jenisFaktor?: string }) => {
      const { idKriteria, ...data } = payload;
      const response = await axiosClient.put(`/penyedia-jasa-settings/kriteria/${idKriteria}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myKriterias"] });
    },
  });
}

export function useDeleteKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idKriteria: number) => {
      const response = await axiosClient.delete(`/penyedia-jasa-settings/kriteria/${idKriteria}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myKriterias"] });
    },
  });
}

export function useGetSubKriterias(idKriteria: number) {
  return useQuery({
    queryKey: ["mySubKriterias", idKriteria],
    queryFn: async () => {
      if (!idKriteria) return [];
      const response = await axiosClient.get<{ data: any[] }>(`/penyedia-jasa-settings/sub-kriteria/${idKriteria}`);
      return response.data.data;
    },
    enabled: !!idKriteria,
  });
}

export function useCreateSubKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idKriteria: number; deskripsi: string; nilaiRating: number }) => {
      const response = await axiosClient.post("/penyedia-jasa-settings/sub-kriteria", payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mySubKriterias", variables.idKriteria] });
    },
  });
}

export function useUpdateSubKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idSub: number; idKriteria: number; deskripsi?: string; nilaiRating?: number }) => {
      const { idSub, ...data } = payload;
      const response = await axiosClient.put(`/penyedia-jasa-settings/sub-kriteria/${idSub}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mySubKriterias", variables.idKriteria] });
    },
  });
}

export function useDeleteSubKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idSub: number; idKriteria: number }) => {
      const response = await axiosClient.delete(`/penyedia-jasa-settings/sub-kriteria/${payload.idSub}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mySubKriterias", variables.idKriteria] });
    },
  });
}

// ==========================================
// 13. SPK CALCULATIONS
// ==========================================

export function useCalculateSpk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idPengajuan: number) => {
      const response = await axiosClient.post(`/spk/hitung/${idPengajuan}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanList"] });
    },
  });
}

export function useCalculateBulkSpk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post("/spk/hitung-bulk");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanList"] });
    },
  });
}

export function useGetPublicStats() {
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: { totalPenyediaJasa: number; totalNasabah: number; totalDanaDisalurkan: number } }>("/auth/stats/public");
      return response.data.data;
    },
  });
}

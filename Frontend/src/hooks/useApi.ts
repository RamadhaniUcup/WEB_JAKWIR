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
  totalAset: number;
  pendapatanBersih: number;
  statusHunian: "MILIK_SENDIRI" | "SEWA" | "KONTRAK" | "BERSAMA_ORANG_TUA";
  statusPekerjaan: "KARYAWAN_TETAP" | "KARYAWAN_KONTRAK" | "WIRAUSAHA" | "TIDAK_BEKERJA";
  jumlahTanggungan: number;
  nilaiJaminanAset: number;
  // Field pemetaan sub-kriteria dinamis tambahan
  idSubPendapatan?: number;
  idSubHunian?: number;
  idSubPekerjaan?: number;
  idSubTanggungan?: number;
}

/**
 * 1. Hook untuk Login Mutasi (Admin & Debitur)
 */
export function useLoginMutation() {
  const loginToStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const path = payload.isAdmin ? "/auth/login/admin" : "/auth/login/debitur";
      const response = await axiosClient.post<LoginResponse>(path, {
        email: payload.email,
        password: payload.password,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      let resolvedRole: UserRole = "DEBITUR";
      if (variables.isAdmin) {
        resolvedRole = (data.user as any).role || "ADMIN";
      }
      loginToStore(data.token, data.user, resolvedRole);
    },
  });
}

/**
 * 2. Hook untuk Mengambil Daftar Pengajuan Masuk (Role Admin Kreditur)
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
 * 3. Hook untuk Menginput Hasil Survey Lapangan & Memicu Hitung SPK (Role Admin Kreditur)
 */
export function useSubmitSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SurveyPayload) => {
      const { idPengajuan, ...surveyData } = payload;
      const response = await axiosClient.post(`/pengajuan/${idPengajuan}/survey`, surveyData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanList"] });
      queryClient.invalidateQueries({ queryKey: ["pengajuanDetails", variables.idPengajuan] });
    },
  });
}

/**
 * 4. Hook untuk Mengambil Profil Debitur
 */
export function useGetDebiturProfile() {
  return useQuery({
    queryKey: ["debiturProfile"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any }>("/debitur/profile");
      return response.data.data;
    },
  });
}

/**
 * 5. Hook untuk Memperbarui Profil Debitur
 */
export function useUpdateDebiturProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { namaDebitur?: string; telepon?: string; nik?: string; alamat?: string }) => {
      const response = await axiosClient.put<{ message: string; data: any }>("/debitur/profile", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debiturProfile"] });
    },
  });
}

/**
 * 6. Hook untuk Mengambil Daftar Kreditur Publik (Untuk drop-down pilihan di frontend)
 */
export function useGetKrediturList() {
  return useQuery({
    queryKey: ["krediturList"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/auth/kreditur/public");
      return response.data.data;
    },
  });
}

/**
 * 6b. Hook untuk Mengambil Detail Satu Kreditur (Maksimal Limit & Tenor)
 */
export function useGetKrediturDetails(id: number) {
  return useQuery({
    queryKey: ["krediturDetails", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosClient.get<{ data: any }>(`/auth/kreditur/public/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * 7. Hook untuk Mengirim Pengajuan Kredit Baru (Debitur)
 */
export function useSubmitPengajuan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { idKreditur: number; jumlahKredit: number; lamaTenor: number }) => {
      const response = await axiosClient.post<{ message: string; data: any }>("/pengajuan", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengajuanHistory"] });
    },
  });
}

/**
 * 8. Hook untuk Mengambil Riwayat Pengajuan Kredit (Debitur)
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
    mutationFn: async (payload: { idPengajuan: number; statusPeminjaman: "DITERIMA" | "DITOLAK" }) => {
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

export interface RegisterDebiturPayload {
  namaDebitur: string;
  nik: string;
  telepon: string;
  alamat: string;
  email: string;
  password?: string;
}

/**
 * 10. Hook untuk Registrasi Akun Debitur Baru (Nasabah)
 */
export function useRegisterDebiturMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterDebiturPayload) => {
      const response = await axiosClient.post<{ message: string; data: any }>("/auth/register/debitur", payload);
      return response.data;
    },
  });
}

// ==========================================
// 11. SUPER ADMIN OPERATIONS (CRUD USER, KREDITUR, DEBITUR)
// ==========================================

export function useGetSuperAdminKrediturs() {
  return useQuery({
    queryKey: ["superKrediturs"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/super-admin/kreditur");
      return response.data.data;
    },
  });
}

export function useCreateSuperAdminKreditur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { namaPerusahaan: string; alamat: string; statusAktif?: string; limitPengajuan?: number; limitTenor?: number }) => {
      const response = await axiosClient.post("/super-admin/kreditur", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superKrediturs"] });
      queryClient.invalidateQueries({ queryKey: ["krediturList"] });
    },
  });
}

export function useUpdateSuperAdminKreditur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idKreditur: number; namaPerusahaan?: string; alamat?: string; statusAktif?: string; limitPengajuan?: number; limitTenor?: number }) => {
      const { idKreditur, ...data } = payload;
      const response = await axiosClient.put(`/super-admin/kreditur/${idKreditur}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superKrediturs"] });
      queryClient.invalidateQueries({ queryKey: ["krediturList"] });
    },
  });
}

export function useDeleteSuperAdminKreditur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idKreditur: number) => {
      const response = await axiosClient.delete(`/super-admin/kreditur/${idKreditur}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superKrediturs"] });
      queryClient.invalidateQueries({ queryKey: ["krediturList"] });
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
    mutationFn: async (payload: { username: string; email: string; password?: string; role: string; idKreditur?: number | null }) => {
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
    mutationFn: async (payload: { idUser: number; username?: string; email?: string; password?: string; role?: string; idKreditur?: number | null }) => {
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

export function useGetSuperAdminDebiturs() {
  return useQuery({
    queryKey: ["superDebiturs"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/super-admin/debitur");
      return response.data.data;
    },
  });
}

export function useCreateSuperAdminDebitur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterDebiturPayload) => {
      const response = await axiosClient.post("/super-admin/debitur", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superDebiturs"] });
    },
  });
}

export function useUpdateSuperAdminDebitur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idDebitur: number; namaDebitur?: string; email?: string; telepon?: string; nik?: string; alamat?: string; password?: string }) => {
      const { idDebitur, ...data } = payload;
      const response = await axiosClient.put(`/super-admin/debitur/${idDebitur}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superDebiturs"] });
    },
  });
}

export function useDeleteSuperAdminDebitur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idDebitur: number) => {
      const response = await axiosClient.delete(`/super-admin/debitur/${idDebitur}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superDebiturs"] });
    },
  });
}

// ==========================================
// 12. ADMIN KREDITUR SETTING OPERATIONS (PROFILE & SPK)
// ==========================================

export function useGetMyKrediturProfile() {
  return useQuery({
    queryKey: ["myKrediturProfile"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any }>("/kreditur-settings/profile");
      return response.data.data;
    },
  });
}

export function useUpdateMyKrediturProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { namaPerusahaan?: string; alamat?: string; limitPengajuan?: number; limitTenor?: number }) => {
      const response = await axiosClient.put("/kreditur-settings/profile", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myKrediturProfile"] });
      queryClient.invalidateQueries({ queryKey: ["krediturList"] });
    },
  });
}

export function useGetAspeks() {
  return useQuery({
    queryKey: ["myAspeks"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/kreditur-settings/aspek");
      return response.data.data;
    },
  });
}

export function useCreateAspek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { namaAspek: string; persentaseCf: number; persentaseSf: number; bobotAspek: number }) => {
      const response = await axiosClient.post("/kreditur-settings/aspek", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAspeks"] });
    },
  });
}

export function useUpdateAspek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idAspek: number; namaAspek?: string; persentaseCf?: number; persentaseSf?: number; bobotAspek?: number }) => {
      const { idAspek, ...data } = payload;
      const response = await axiosClient.put(`/kreditur-settings/aspek/${idAspek}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAspeks"] });
    },
  });
}

export function useDeleteAspek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idAspek: number) => {
      const response = await axiosClient.delete(`/kreditur-settings/aspek/${idAspek}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAspeks"] });
    },
  });
}

export function useGetKriterias() {
  return useQuery({
    queryKey: ["myKriterias"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: any[] }>("/kreditur-settings/kriteria");
      return response.data.data;
    },
  });
}

export function useCreateKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idAspek: number; kodeKriteria: string; namaKriteria: string; nilaiTarget: number; jenisFaktor: string }) => {
      const response = await axiosClient.post("/kreditur-settings/kriteria", payload);
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
      const response = await axiosClient.put(`/kreditur-settings/kriteria/${idKriteria}`, data);
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
      const response = await axiosClient.delete(`/kreditur-settings/kriteria/${idKriteria}`);
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
      const response = await axiosClient.get<{ data: any[] }>(`/kreditur-settings/sub-kriteria/${idKriteria}`);
      return response.data.data;
    },
    enabled: !!idKriteria,
  });
}

export function useCreateSubKriteria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { idKriteria: number; deskripsi: string; nilaiRating: number }) => {
      const response = await axiosClient.post("/kreditur-settings/sub-kriteria", payload);
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
      const response = await axiosClient.put(`/kreditur-settings/sub-kriteria/${idSub}`, data);
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
      const response = await axiosClient.delete(`/kreditur-settings/sub-kriteria/${payload.idSub}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mySubKriterias", variables.idKriteria] });
    },
  });
}

export function useGetPublicStats() {
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: { totalKreditur: number; totalDebitur: number; totalDanaDisalurkan: number } }>("/auth/stats/public");
      return response.data.data;
    },
  });
}

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
      // Tentukan role berdasarkan boolean login admin/debitur
      let resolvedRole: UserRole = "DEBITUR";
      if (variables.isAdmin) {
        // Jika data user berisi role SUPER ADMIN atau ADMIN
        resolvedRole = (data.user as any).role || "ADMIN";
      }
      // Simpan token, user, dan role di Zustand store
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
      // Bersihkan cache data pengajuan untuk memicu update visual di dashboard
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

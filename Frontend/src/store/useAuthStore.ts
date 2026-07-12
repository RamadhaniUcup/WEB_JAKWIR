import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "SUPER ADMIN" | "ADMIN" | "NASABAH";

export interface AuthUser {
  id: number;
  username?: string;
  namaNasabah?: string;
  email: string;
  telepon?: string;
  nik?: string;
  alamat?: string;
  penyediaJasa?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  role: UserRole | null;
  login: (token: string, user: AuthUser, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      login: (token, user, role) => set({ token, user, role }),
      logout: () => set({ token: null, user: null, role: null }),
    }),
    {
      name: "jakwir-auth-session", // Key di localStorage
    }
  )
);

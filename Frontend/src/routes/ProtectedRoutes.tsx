import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, type UserRole } from "../store/useAuthStore.js";
import type { FC } from "react";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  // Jika token belum terdaftar, alihkan pengguna ke login Nasabah
  if (!token) {
    return <Navigate to="/nasabah/login" replace />;
  }

  // Jika role pengguna tidak diizinkan mengakses halaman ini, alihkan ke beranda utama
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Izinkan akses rute anak
  return <Outlet />;
};

export default ProtectedRoute;

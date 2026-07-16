import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import MainLayout from "./layouts/mainLayouts.tsx";
import { PenyediaJasaDashboardLayout } from "./layouts/PenyediaJasaDashboardLayouts.tsx";
import { SuperAdminDashboardLayout } from "./layouts/SuperAdminDashboardLayouts.tsx";

// Protected Route Wrapper
import ProtectedRoute from "./routes/ProtectedRoutes.tsx";

// Pages - Publik & Nasabah
import Beranda from "./pages/beranda.tsx";
import { InfoAplikasi } from "./pages/InfoAplikasi.tsx";
import { DataPenyediaJasa } from "./pages/nasabah/DataPenyediaJasa.tsx";
import { HistoryPengajuan } from "./pages/nasabah/HistoryPengajuan.tsx";
import { EditProfile } from "./pages/nasabah/EditProfile.tsx";
import { PengajuanKredit } from "./pages/nasabah/PengajuanKredit.tsx";
import { LoginNasabah } from "./pages/auth/LoginNasabah.tsx";
import { RegisterNasabah } from "./pages/auth/RegisterNasabah.tsx";
import { LoginPenyediaJasa } from "./pages/auth/LoginPenyediaJasa.tsx";

// Pages - Penyedia Jasa
import { LandingPenyediaJasa } from "./pages/kreditur/LandingPenyediaJasa.tsx";
import { DashboardPenyediaJasa } from "./pages/kreditur/DashboardPenyediaJasa.tsx";
import { DataPengajuan } from "./pages/kreditur/DataPengajuan.tsx";
import { KalkulasiSpk } from "./pages/kreditur/KalkulasiSpk.tsx";
import { PengaturanPenyediaJasa } from "./pages/kreditur/PengaturanPenyediaJasa.tsx";
import { LaporanSpk } from "./pages/kreditur/LaporanSpk.tsx";

// Pages - Super Admin
import { DashboardSuperAdmin } from "./pages/super-admin/DashboardSuperAdmin.tsx";
import { ManagePenyediaJasa } from "./pages/super-admin/ManagePenyediaJasa.tsx";
import { ManageUsers } from "./pages/super-admin/ManageUsers.tsx";
import { ManageNasabah } from "./pages/super-admin/ManageNasabah.tsx";
import { ManageSpk } from "./pages/super-admin/ManageSpk.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          {/* Rute Publik & Nasabah */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Beranda />} />
            <Route path="info" element={<InfoAplikasi />} />
            <Route path="nasabah/penyedia-jasa" element={<DataPenyediaJasa />} />
            
            {/* Rute khusus nasabah yang masuk ke sistem */}
            <Route element={<ProtectedRoute allowedRoles={["NASABAH"]} />}>
              <Route path="nasabah/pengajuan" element={<PengajuanKredit />} />
              <Route path="nasabah/history" element={<HistoryPengajuan />} />
              <Route path="nasabah/edit-profile" element={<EditProfile />} />
            </Route>
          </Route>

          {/* Rute Bebas (Tanpa MainLayout) */}
          <Route path="/nasabah/login" element={<LoginNasabah />} />
          <Route path="/nasabah/register" element={<RegisterNasabah />} />
          <Route path="/penyedia-jasa/login" element={<LoginPenyediaJasa />} />
          <Route path="/penyedia-jasa/landing" element={<LandingPenyediaJasa />} />

          {/* Rute khusus admin penyedia jasa yang terproteksi */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER ADMIN"]} />}>
            <Route 
              path="/penyedia-jasa/dashboard" 
              element={
                <PenyediaJasaDashboardLayout>
                  <DashboardPenyediaJasa />
                </PenyediaJasaDashboardLayout>
              } 
            />
            <Route 
              path="/penyedia-jasa/pengajuan" 
              element={
                <PenyediaJasaDashboardLayout>
                  <DataPengajuan />
                </PenyediaJasaDashboardLayout>
              } 
            />
            <Route 
              path="/penyedia-jasa/kalkulasi" 
              element={
                <PenyediaJasaDashboardLayout>
                  <KalkulasiSpk />
                </PenyediaJasaDashboardLayout>
              } 
            />
            <Route 
              path="/penyedia-jasa/laporan" 
              element={
                <PenyediaJasaDashboardLayout>
                  <LaporanSpk />
                </PenyediaJasaDashboardLayout>
              } 
            />
            <Route 
              path="/penyedia-jasa/settings/profil" 
              element={
                <PenyediaJasaDashboardLayout>
                  <PengaturanPenyediaJasa />
                </PenyediaJasaDashboardLayout>
              } 
            />
          </Route>

          {/* Rute khusus Super Admin */}
          <Route element={<ProtectedRoute allowedRoles={["SUPER ADMIN"]} />}>
            <Route 
              path="/super-admin/dashboard" 
              element={
                <SuperAdminDashboardLayout>
                  <DashboardSuperAdmin />
                </SuperAdminDashboardLayout>
              } 
            />
            <Route 
              path="/super-admin/penyedia-jasa" 
              element={
                <SuperAdminDashboardLayout>
                  <ManagePenyediaJasa />
                </SuperAdminDashboardLayout>
              } 
            />
            <Route 
              path="/super-admin/settings/spk" 
              element={
                <SuperAdminDashboardLayout>
                  <ManageSpk />
                </SuperAdminDashboardLayout>
              } 
            />
            <Route 
              path="/super-admin/users" 
              element={
                <SuperAdminDashboardLayout>
                  <ManageUsers />
                </SuperAdminDashboardLayout>
              } 
            />
            <Route 
              path="/super-admin/nasabah" 
              element={
                <SuperAdminDashboardLayout>
                  <ManageNasabah />
                </SuperAdminDashboardLayout>
              } 
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import MainLayout from "./layouts/mainLayouts.tsx";
import { KrediturDashboardLayout } from "./layouts/KrediturDashboardLayouts.tsx";
import { SuperAdminDashboardLayout } from "./layouts/SuperAdminDashboardLayouts.tsx";

// Protected Route Wrapper
import ProtectedRoute from "./routes/ProtectedRoutes.tsx";

// Pages - Publik & Debitur
import Beranda from "./pages/beranda.tsx";
import { InfoAplikasi } from "./pages/InfoAplikasi.tsx";
import { DataKreditur } from "./pages/debitur/DataKreditur.tsx";
import { HistoryPengajuan } from "./pages/debitur/HistoryPengajuan.tsx";
import { EditProfile } from "./pages/debitur/EditProfile.tsx";
import { PengajuanKredit } from "./pages/debitur/PengajuanKredit.tsx";
import { LoginDebitur } from "./pages/auth/LoginDebitur.tsx";
import { RegisterDebitur } from "./pages/auth/RegisterDebitur.tsx";
import { LoginKreditur } from "./pages/auth/LoginKreditur.tsx";

// Pages - Kreditur
import { LandingKreditur } from "./pages/kreditur/LandingKreditur.tsx";
import { DashboardKreditur } from "./pages/kreditur/DashboardKreditur.tsx";
import { DataPengajuan } from "./pages/kreditur/DataPengajuan.tsx";
import { PengaturanSpk } from "./pages/kreditur/PengaturanSpk.tsx";
import { PengaturanInstansi } from "./pages/kreditur/PengaturanInstansi.tsx";

// Pages - Super Admin
import { DashboardSuperAdmin } from "./pages/super-admin/DashboardSuperAdmin.tsx";
import { ManageKreditur } from "./pages/super-admin/ManageKreditur.tsx";
import { ManageUsers } from "./pages/super-admin/ManageUsers.tsx";
import { ManageDebitur } from "./pages/super-admin/ManageDebitur.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          {/* Rute Publik & Debitur */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Beranda />} />
            <Route path="info" element={<InfoAplikasi />} />
            
            {/* Rute khusus nasabah / debitur yang masuk ke sistem */}
            <Route element={<ProtectedRoute allowedRoles={["DEBITUR"]} />}>
              <Route path="debitur/kreditur" element={<DataKreditur />} />
              <Route path="debitur/pengajuan" element={<PengajuanKredit />} />
              <Route path="debitur/history" element={<HistoryPengajuan />} />
              <Route path="debitur/edit-profile" element={<EditProfile />} />
            </Route>
          </Route>

          {/* Rute Bebas (Tanpa MainLayout) */}
          <Route path="/debitur/login" element={<LoginDebitur />} />
          <Route path="/debitur/register" element={<RegisterDebitur />} />
          <Route path="/kreditur/login" element={<LoginKreditur />} />
          <Route path="/kreditur/landing" element={<LandingKreditur />} />

          {/* Rute khusus admin kreditur yang terproteksi */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER ADMIN"]} />}>
            <Route 
              path="/kreditur/dashboard" 
              element={
                <KrediturDashboardLayout>
                  <DashboardKreditur />
                </KrediturDashboardLayout>
              } 
            />
            <Route 
              path="/kreditur/pengajuan" 
              element={
                <KrediturDashboardLayout>
                  <DataPengajuan />
                </KrediturDashboardLayout>
              } 
            />
            <Route 
              path="/kreditur/settings/spk" 
              element={
                <KrediturDashboardLayout>
                  <PengaturanSpk />
                </KrediturDashboardLayout>
              } 
            />
            <Route 
              path="/kreditur/settings/instansi" 
              element={
                <KrediturDashboardLayout>
                  <PengaturanInstansi />
                </KrediturDashboardLayout>
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
              path="/super-admin/kreditur" 
              element={
                <SuperAdminDashboardLayout>
                  <ManageKreditur />
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
              path="/super-admin/debitur" 
              element={
                <SuperAdminDashboardLayout>
                  <ManageDebitur />
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
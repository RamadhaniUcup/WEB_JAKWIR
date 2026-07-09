import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import MainLayout from "./layouts/mainLayouts.tsx";
import { KrediturDashboardLayout } from "./layouts/KrediturDashboardLayouts.tsx";

// Pages - Publik & Debitur
import Beranda from "./pages/beranda.tsx";
import { InfoAplikasi } from "./pages/InfoAplikasi.tsx";
import { DataKreditur } from "./pages/debitur/DataKreditur.tsx";
import { HistoryPengajuan } from "./pages/debitur/HistoryPengajuan.tsx";
import { EditProfile } from "./pages/debitur/EditProfile.tsx";
import { PengajuanKredit } from "./pages/debitur/PengajuanKredit.tsx";
import { LoginDebitur } from "./pages/auth/LoginDebitur.tsx";
import { LoginKreditur } from "./pages/auth/LoginKreditur.tsx";

// Pages - Kreditur
import { LandingKreditur } from "./pages/kreditur/LandingKreditur.tsx";
import { DashboardKreditur } from "./pages/kreditur/DashboardKreditur.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          {/* Rute Publik & Debitur (Menggunakan MainLayout bersarang) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Beranda />} />
            <Route path="info" element={<InfoAplikasi />} />
            <Route path="debitur/kreditur" element={<DataKreditur />} />
            <Route path="debitur/pengajuan" element={<PengajuanKredit />} />
            <Route path="debitur/history" element={<HistoryPengajuan />} />
            <Route path="debitur/edit-profile" element={<EditProfile />} />
          </Route>

          {/* Rute Bebas (Tanpa MainLayout) */}
          <Route path="/debitur/login" element={<LoginDebitur />} />
          <Route path="/kreditur/login" element={<LoginKreditur />} />
          <Route path="/kreditur/landing" element={<LandingKreditur />} />

          {/* Rute Khusus Admin Kreditur (Menggunakan Layout Dashboard) */}
          <Route 
            path="/kreditur/dashboard" 
            element={
              <KrediturDashboardLayout>
                <DashboardKreditur />
              </KrediturDashboardLayout>
            } 
          />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
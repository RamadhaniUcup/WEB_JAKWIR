import express from "express";
import cors from "cors";
import "dotenv/config";
// Import router
import authRoutes from "./routes/authRoutes.js";
import kriteriaRoutes from "./routes/kriteriaRoutes.js";
import spkRoutes from "./routes/spkRoutes.js";
import debiturRoutes from "./routes/debiturRoutes.js";
import pengajuanRoutes from "./routes/pengajuanRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import krediturSettingRoutes from "./routes/krediturSettingRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware global
app.use(cors());
app.use(express.json());
// Mounting Rute API
app.use("/api/auth", authRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/spk", spkRoutes);
app.use("/api/debitur", debiturRoutes);
app.use("/api/pengajuan", pengajuanRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/kreditur-settings", krediturSettingRoutes);
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server SPK Kelayakan Kredit JAKWIR aktif dan sehat.",
        timestamp: new Date()
    });
});
// Jalankan Server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Server JAKWIR API aktif di http://localhost:${PORT}`);
    console.log(`🔐 Enkripsi database, JWT, & RBAC aktif`);
    console.log(`📊 Modul SPK Profile Matching & Survey Lapangan diaktifkan`);
    console.log(`=================================================`);
});
//# sourceMappingURL=index.js.map
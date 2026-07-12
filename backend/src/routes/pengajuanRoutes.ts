import { Router } from "express";
import { 
  createPengajuan, 
  getPengajuanForAdmin, 
  inputSurvey, 
  updatePengajuanStatus, 
  getNasabahHistory 
} from "../controllers/pengajuanController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Semua rute di file ini membutuhkan autentikasi token JWT
router.use(verifyToken);

// 1. Submit Pengajuan Baru & Histori (Untuk Nasabah)
router.post("/", authorizeRoles("NASABAH"), createPengajuan);
router.get("/history", authorizeRoles("NASABAH"), getNasabahHistory);

// 2. Monitoring Pengajuan, Survey Lapangan, & Approval (Untuk Admin Penyedia Jasa)
router.get("/", authorizeRoles("ADMIN"), getPengajuanForAdmin);
router.post("/:id/survey", authorizeRoles("ADMIN"), inputSurvey);
router.put("/:id/status", authorizeRoles("ADMIN"), updatePengajuanStatus);

export default router;

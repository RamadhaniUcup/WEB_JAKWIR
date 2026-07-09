import { Router } from "express";
import { 
  createPengajuan, 
  getPengajuanForAdmin, 
  inputSurveyAndCalculate, 
  updatePengajuanStatus, 
  getDebiturHistory 
} from "../controllers/pengajuanController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Semua rute di file ini membutuhkan autentikasi token JWT
router.use(verifyToken);

// 1. Submit Pengajuan Baru & Histori (Untuk Debitur)
router.post("/", authorizeRoles("DEBITUR"), createPengajuan);
router.get("/history", authorizeRoles("DEBITUR"), getDebiturHistory);

// 2. Monitoring Pengajuan, Survey Lapangan, & Approval (Untuk Admin Kreditur)
router.get("/", authorizeRoles("ADMIN"), getPengajuanForAdmin);
router.post("/:id/survey", authorizeRoles("ADMIN"), inputSurveyAndCalculate);
router.put("/:id/status", authorizeRoles("ADMIN"), updatePengajuanStatus);

export default router;

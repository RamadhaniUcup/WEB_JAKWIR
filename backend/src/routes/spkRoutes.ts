import { Router } from "express";
import { getProfileMatchingScore } from "../controllers/spkController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Endpoint perhitungan SPK terproteksi (hanya admin/super admin)
router.get(
  "/hitung/:idPengajuan", 
  verifyToken, 
  authorizeRoles("SUPER ADMIN", "ADMIN"), 
  getProfileMatchingScore
);

export default router;

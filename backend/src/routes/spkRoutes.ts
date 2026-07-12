import { Router } from "express";
import { getProfileMatchingScore, calculateBulkSpk } from "../controllers/spkController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Semua endpoint perhitungan SPK terproteksi (hanya admin/super admin)
router.use(verifyToken);
router.use(authorizeRoles("SUPER ADMIN", "ADMIN"));

router.post("/hitung/:idPengajuan", getProfileMatchingScore);
router.post("/hitung-bulk", calculateBulkSpk);

export default router;

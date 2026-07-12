import { Router } from "express";
import { getNasabahProfile, updateNasabahProfile } from "../controllers/nasabahController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = Router();
// Semua endpoint membutuhkan autentikasi dan terbatas khusus role NASABAH
router.use(verifyToken);
router.use(authorizeRoles("NASABAH"));
router.get("/profile", getNasabahProfile);
router.put("/profile", updateNasabahProfile);
export default router;
//# sourceMappingURL=nasabahRoutes.js.map
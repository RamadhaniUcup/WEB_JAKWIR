import { Router } from "express";
import { getDebiturProfile, updateDebiturProfile } from "../controllers/debiturController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = Router();
// Semua endpoint membutuhkan autentikasi dan terbatas khusus role DEBITUR
router.use(verifyToken);
router.use(authorizeRoles("DEBITUR"));
router.get("/profile", getDebiturProfile);
router.put("/profile", updateDebiturProfile);
export default router;
//# sourceMappingURL=debiturRoutes.js.map
import { Router } from "express";
import { loginUser, loginNasabah, registerNasabah, registerUser, getPublicPenyediaJasaList, getPublicPenyediaJasaDetails, getPublicStats } from "../controllers/authController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = Router();
// Endpoint Login Publik
router.post("/login/admin", loginUser);
router.post("/login/nasabah", loginNasabah);
// Endpoint Daftar Penyedia Jasa Publik
router.get("/penyedia-jasa/public", getPublicPenyediaJasaList);
router.get("/penyedia-jasa/public/:id", getPublicPenyediaJasaDetails);
router.get("/stats/public", getPublicStats);
// Endpoint Registrasi Nasabah
router.post("/register/nasabah", registerNasabah);
// Endpoint Registrasi Admin Baru (Super Admin only)
router.post("/register/admin", verifyToken, authorizeRoles("SUPER ADMIN"), registerUser);
export default router;
//# sourceMappingURL=authRoutes.js.map
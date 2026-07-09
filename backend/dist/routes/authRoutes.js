import { Router } from "express";
import { loginUser, loginDebitur, registerDebitur, registerUser, getPublicKrediturList } from "../controllers/authController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = Router();
// Endpoint Login Publik
router.post("/login/admin", loginUser);
router.post("/login/debitur", loginDebitur);
// Endpoint Daftar Kreditur Publik (Untuk drop-down pilihan di frontend)
router.get("/kreditur/public", getPublicKrediturList);
// Endpoint Registrasi Debitur (Nasabah melakukan registrasi mandiri)
router.post("/register/debitur", registerDebitur);
// Endpoint Registrasi Admin Baru (Hanya dapat diakses oleh SUPER ADMIN yang terautentikasi)
router.post("/register/admin", verifyToken, authorizeRoles("SUPER ADMIN"), registerUser);
export default router;
//# sourceMappingURL=authRoutes.js.map
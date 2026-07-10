import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getKrediturs, createKreditur, updateKreditur, deleteKreditur, getUsers, createUser, updateUser, deleteUser, getDebiturs, createDebitur, updateDebitur, deleteDebitur, } from "../controllers/superAdminController.js";
const router = Router();
// Semua rute Super Admin membutuhkan token & role khusus SUPER ADMIN
router.use(verifyToken);
router.use(authorizeRoles("SUPER ADMIN"));
// 1. Rute CRUD Kreditur (Lembaga Pembiayaan)
router.get("/kreditur", getKrediturs);
router.post("/kreditur", createKreditur);
router.put("/kreditur/:id", updateKreditur);
router.delete("/kreditur/:id", deleteKreditur);
// 2. Rute CRUD Users (Admin Lembaga)
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
// 3. Rute CRUD Debitur (Nasabah Aggregator)
router.get("/debitur", getDebiturs);
router.post("/debitur", createDebitur);
router.put("/debitur/:id", updateDebitur);
router.delete("/debitur/:id", deleteDebitur);
export default router;
//# sourceMappingURL=superAdminRoutes.js.map
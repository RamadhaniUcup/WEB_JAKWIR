import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getPenyediaJasas, createPenyediaJasa, updatePenyediaJasa, deletePenyediaJasa, getUsers, createUser, updateUser, deleteUser, getNasabahs, createNasabah, updateNasabah, deleteNasabah, } from "../controllers/superAdminController.js";
const router = Router();
// Semua rute Super Admin membutuhkan token & role khusus SUPER ADMIN
router.use(verifyToken);
router.use(authorizeRoles("SUPER ADMIN"));
// 1. Rute CRUD Penyedia Jasa
router.get("/penyedia-jasa", getPenyediaJasas);
router.post("/penyedia-jasa", createPenyediaJasa);
router.put("/penyedia-jasa/:id", updatePenyediaJasa);
router.delete("/penyedia-jasa/:id", deletePenyediaJasa);
// 2. Rute CRUD Users (Admin Lembaga)
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
// 3. Rute CRUD Nasabah
router.get("/nasabah", getNasabahs);
router.post("/nasabah", createNasabah);
router.put("/nasabah/:id", updateNasabah);
router.delete("/nasabah/:id", deleteNasabah);
export default router;
//# sourceMappingURL=superAdminRoutes.js.map
import { Router } from "express";
import { getAllKriteria, getKriteriaById, createKriteria, updateKriteria, deleteKriteria } from "../controllers/kriteriaController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
const router = Router();
// Semua rute di file ini membutuhkan token valid (Autentikasi)
router.use(verifyToken);
// Hanya role SUPER ADMIN atau ADMIN yang boleh mengakses operasi-operasi ini (Otorisasi)
router.get("/", authorizeRoles("SUPER ADMIN", "ADMIN"), getAllKriteria);
router.get("/:id", authorizeRoles("SUPER ADMIN", "ADMIN"), getKriteriaById);
router.post("/", authorizeRoles("SUPER ADMIN", "ADMIN"), createKriteria);
router.put("/:id", authorizeRoles("SUPER ADMIN", "ADMIN"), updateKriteria);
router.delete("/:id", authorizeRoles("SUPER ADMIN", "ADMIN"), deleteKriteria);
export default router;
//# sourceMappingURL=kriteriaRoutes.js.map
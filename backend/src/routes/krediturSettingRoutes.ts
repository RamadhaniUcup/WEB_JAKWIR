import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  updateKrediturProfile,
  getMyKrediturProfile,
  getAspeks,
  createAspek,
  updateAspek,
  deleteAspek,
  getKriterias,
  createKriteria,
  updateKriteria,
  deleteKriteria,
  getSubKriterias,
  createSubKriteria,
  updateSubKriteria,
  deleteSubKriteria,
} from "../controllers/krediturSettingController.js";

const router = Router();

// Semua rute membutuhkan token JWT dan khusus role ADMIN (Lembaga Kreditur)
router.use(verifyToken);
router.use(authorizeRoles("ADMIN"));

// 1. Profil & Limit Kreditur
router.get("/profile", getMyKrediturProfile);
router.put("/profile", updateKrediturProfile);

// 2. CRUD Aspek
router.get("/aspek", getAspeks);
router.post("/aspek", createAspek);
router.put("/aspek/:id", updateAspek);
router.delete("/aspek/:id", deleteAspek);

// 3. CRUD Kriteria
router.get("/kriteria", getKriterias);
router.post("/kriteria", createKriteria);
router.put("/kriteria/:id", updateKriteria);
router.delete("/kriteria/:id", deleteKriteria);

// 4. CRUD Sub-Kriteria
router.get("/sub-kriteria/:idKriteria", getSubKriterias);
router.post("/sub-kriteria", createSubKriteria);
router.put("/sub-kriteria/:id", updateSubKriteria);
router.delete("/sub-kriteria/:id", deleteSubKriteria);

export default router;

import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  updatePenyediaJasaProfile,
  getMyPenyediaJasaProfile,
  getKriterias,
  createKriteria,
  updateKriteria,
  deleteKriteria,
  getSubKriterias,
  createSubKriteria,
  updateSubKriteria,
  deleteSubKriteria,
} from "../controllers/penyediaJasaSettingController.js";

const router = Router();

// Semua rute membutuhkan token JWT dan role ADMIN atau SUPER ADMIN
router.use(verifyToken);
router.use(authorizeRoles("ADMIN", "SUPER ADMIN"));

// 1. Profil & Limit Penyedia Jasa
router.get("/profile", getMyPenyediaJasaProfile);
router.put("/profile", updatePenyediaJasaProfile);

// 2. CRUD Kriteria
router.get("/kriteria", getKriterias);
router.post("/kriteria", createKriteria);
router.put("/kriteria/:id", updateKriteria);
router.delete("/kriteria/:id", deleteKriteria);

// 3. CRUD Sub-Kriteria
router.get("/sub-kriteria/:idKriteria", getSubKriterias);
router.post("/sub-kriteria", createSubKriteria);
router.put("/sub-kriteria/:id", updateSubKriteria);
router.delete("/sub-kriteria/:id", deleteSubKriteria);

export default router;

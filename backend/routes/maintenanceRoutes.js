import express from "express";
import upload from "../middleware/multer.js";
import authUser from "../middleware/auth.js";
import {
  createMaintenance,
  getAllMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getTenantRequests, // <-- import this!
} from "../controllers/maintenanceController.js";

const router = express.Router();

// --- IMPORTANT: /my route BEFORE /:id ---
router.get("/my", authUser, getTenantRequests);

router.post("/", authUser, upload.single("image"), createMaintenance);
router.get("/", authUser, getAllMaintenance);
router.get("/:id", authUser, getMaintenance);
router.put("/:id", authUser, upload.single("image"), updateMaintenance);
router.delete("/:id", authUser, deleteMaintenance);

export default router;

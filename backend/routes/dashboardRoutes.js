import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboardData, updateProfile, updateStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, getDashboardData);
router.put("/profile", protect, updateProfile);
router.put("/stats", protect, updateStats);

export default router;
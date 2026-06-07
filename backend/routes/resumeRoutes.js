import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeResumeText, getLatestResume, getResumeHistory } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeResumeText);
router.get("/", protect, getLatestResume);
router.get("/history", protect, getResumeHistory);

export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeSkillGap } from "../controllers/skillGapController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeSkillGap);

export default router;
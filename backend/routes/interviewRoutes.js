import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateInterview, submitInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/generate", protect, generateInterview);
router.post("/submit", protect, submitInterview);

export default router;
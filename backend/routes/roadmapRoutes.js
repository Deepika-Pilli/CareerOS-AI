import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateRoadmap } from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/generate", protect, generateRoadmap);

export default router;
import express from "express";
import { generateInterview, submitInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/generate", generateInterview);
router.post("/submit", submitInterview);

export default router;
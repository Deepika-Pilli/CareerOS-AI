import mongoose from "mongoose";

const sectionScoresSchema = new mongoose.Schema(
  {
    skills: { type: Number, required: true },
    projects: { type: Number, required: true },
    education: { type: Number, required: true },
    contact: { type: Number, required: true },
    structure: { type: Number, required: true },
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  originalFileName: {
    type: String,
    default: null,
  },
  extractedText: {
    type: String,
    default: null,
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  sectionScores: {
    type: sectionScoresSchema,
    required: true,
  },
  skillsFound: {
    type: [String],
    default: [],
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  suggestions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
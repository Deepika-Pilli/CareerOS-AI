import mongoose from "mongoose";

const questionEvaluationSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  confidenceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  communicationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  technicalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  suggestions: {
    type: [String],
    default: [],
  },
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  targetRole: {
    type: String,
    required: [true, "Target role is required"],
    enum: [
      "Frontend Developer",
      "Full Stack Developer",
      "Data Analyst",
      "AI Engineer",
      "Cybersecurity Analyst",
    ],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
    enum: ["Easy", "Medium", "Hard"],
  },
  questions: [
    {
      id: { type: String, required: true },
      question: { type: String, required: true },
      type: { type: String, enum: ["behavioral", "technical", "situational"] },
      difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
      answer: { type: String, default: "" },
    },
  ],
  overallScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  confidenceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  communicationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  technicalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  evaluations: [questionEvaluationSchema],
  suggestions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
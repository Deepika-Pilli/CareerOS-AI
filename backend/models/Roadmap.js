import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  targetRole: {
    type: String,
    required: [true, "Target role is required"],
    trim: true,
  },
  currentStatus: {
    type: String,
    required: [true, "Current status is required"],
    trim: true,
  },
  estimatedTimeline: {
    type: String,
    required: [true, "Estimated timeline is required"],
  },
  skillsToLearn: {
    type: [String],
    default: [],
  },
  recommendedProjects: {
    type: [String],
    default: [],
  },
  interviewPrepPlan: {
    type: [String],
    default: [],
  },
  learningRoadmap: {
    type: [
      {
        phase: String,
        duration: String,
        title: String,
        description: String,
        topics: [String],
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;

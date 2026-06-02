import mongoose from "mongoose";

const skillGapSchema = new mongoose.Schema({
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
  matchPercent: {
    type: Number,
    required: [true, "Match percent is required"],
    min: 0,
    max: 100,
  },
  skillsAvailable: {
    type: [
      {
        name: String,
        matchedInput: String,
      },
    ],
    default: [],
  },
  missingSkills: {
    type: [
      {
        name: String,
        priority: String,
        weeksToLearn: Number,
      },
    ],
    default: [],
  },
  learningPriority: {
    type: [
      {
        priority: String,
        skills: [String],
      },
    ],
    default: [],
  },
  recommendedResources: {
    type: [
      {
        skill: String,
        resources: [String],
      },
    ],
    default: [],
  },
  estimatedLearningDuration: {
    type: String,
    required: [true, "Estimated learning duration is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SkillGap = mongoose.model("SkillGap", skillGapSchema);

export default SkillGap;

import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  atsScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  skillMatchPercent: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  interviewScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  roadmapProgress: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userStatsSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const UserStats = mongoose.model("UserStats", userStatsSchema);

export default UserStats;
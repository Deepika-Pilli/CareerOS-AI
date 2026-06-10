import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    default: "Career Explorer",
    trim: true,
  },
  currentGoal: {
    type: String,
    default: "Land your dream tech role",
    trim: true,
  },
  targetRole: {
    type: String,
    default: null,
  },
  currentStatus: {
    type: String,
    enum: ["Student", "Fresher", "Professional"],
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userProfileSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
import UserProfile from "../models/UserProfile.js";
import UserStats from "../models/UserStats.js";
import Interview from "../models/Interview.js";
import Roadmap from "../models/Roadmap.js";
import SkillGap from "../models/SkillGap.js";

/**
 * GET /api/dashboard
 * Returns real dashboard data from MongoDB for the authenticated user.
 * Creates default profile/stats if this is the user's first visit.
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    // Get or create profile
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = await UserProfile.create({
        userId,
        userName: req.user?.name || "Career Explorer",
        currentGoal: "Land your dream tech role",
      });
    }

    // Get or create stats
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    // Build recent activities from real database collections
    const activities = [];

    // Recent interviews
    const recentInterviews = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("targetRole overallScore createdAt")
      .lean();

    for (const interview of recentInterviews) {
      activities.push({
        id: `interview-${interview._id}`,
        type: "interview",
        title: "Interview completed",
        description: `Overall score: ${interview.overallScore}% · ${interview.targetRole}`,
        timestamp: interview.createdAt.getTime(),
      });
    }

    // Recent skill gap analyses
    const recentSkillGaps = await SkillGap.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("targetRole matchPercent createdAt")
      .lean();

    for (const sg of recentSkillGaps) {
      activities.push({
        id: `skill-gap-${sg._id}`,
        type: "skill-gap",
        title: "Skill gap analyzed",
        description: `${sg.matchPercent}% skill match for ${sg.targetRole}`,
        timestamp: sg.createdAt.getTime(),
      });
    }

    // Recent roadmaps
    const recentRoadmaps = await Roadmap.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("targetRole estimatedTimeline createdAt")
      .lean();

    for (const rm of recentRoadmaps) {
      activities.push({
        id: `roadmap-${rm._id}`,
        type: "roadmap",
        title: "Roadmap generated",
        description: `${rm.targetRole} · ${rm.estimatedTimeline}`,
        timestamp: rm.createdAt.getTime(),
      });
    }

    // Sort activities by timestamp (newest first) and limit to 10
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        profile: {
          userName: profile.userName,
          currentGoal: profile.currentGoal,
        },
        stats: {
          atsScore: stats.atsScore,
          skillMatchPercent: stats.skillMatchPercent,
          interviewScore: stats.interviewScore,
          roadmapProgress: stats.roadmapProgress,
        },
        activities: recentActivities,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dashboard data",
    });
  }
};

/**
 * PUT /api/dashboard/profile
 * Update user profile info (name, goal, target role, current status)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { userName, currentGoal, targetRole, currentStatus } = req.body;

    const updateFields = {};
    if (userName !== undefined) updateFields.userName = userName;
    if (currentGoal !== undefined) updateFields.currentGoal = currentGoal;
    if (targetRole !== undefined) updateFields.targetRole = targetRole;
    if (currentStatus !== undefined) updateFields.currentStatus = currentStatus;
    updateFields.updatedAt = Date.now();

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        userName: profile.userName,
        currentGoal: profile.currentGoal,
        targetRole: profile.targetRole,
        currentStatus: profile.currentStatus,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
};

/**
 * PUT /api/dashboard/stats
 * Update user stats (ATS score, skill match, interview score, roadmap progress)
 */
export const updateStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { atsScore, skillMatchPercent, interviewScore, roadmapProgress } = req.body;

    const updateFields = {};
    if (atsScore !== undefined) updateFields.atsScore = atsScore;
    if (skillMatchPercent !== undefined) updateFields.skillMatchPercent = skillMatchPercent;
    if (interviewScore !== undefined) updateFields.interviewScore = interviewScore;
    if (roadmapProgress !== undefined) updateFields.roadmapProgress = roadmapProgress;
    updateFields.updatedAt = Date.now();

    const stats = await UserStats.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Stats updated successfully",
      data: {
        atsScore: stats.atsScore,
        skillMatchPercent: stats.skillMatchPercent,
        interviewScore: stats.interviewScore,
        roadmapProgress: stats.roadmapProgress,
      },
    });
  } catch (error) {
    console.error("Stats update error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating stats",
    });
  }
};
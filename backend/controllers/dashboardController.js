export const getDashboardData = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        atsScore: 97,
        skillMatch: 38,
        interviewScore: 34,
        roadmapProgress: 50,
        recentActivities: [
          {
            title: "Resume analyzed",
            description: "ATS score: 97%",
          },
          {
            title: "Skill gap analyzed",
            description: "Frontend Developer",
          },
          {
            title: "Roadmap generated",
            description: "Full Stack Developer",
          },
        ],
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dashboard data",
    });
  }
};

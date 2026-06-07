import Resume from "../models/Resume.js";
import UserStats from "../models/UserStats.js";

// ---------------------------------------------------------------------------
// Analysis logic (ported from frontend src/lib/analyze-resume.ts)
// ---------------------------------------------------------------------------

const TRACKED_SKILLS = [
  "Java",
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "SQL",
  "Git",
];

const SKILL_PATTERNS = [
  { skill: "Java", pattern: /\bjava\b(?!script)/i },
  { skill: "Python", pattern: /\bpython\b/i },
  { skill: "JavaScript", pattern: /\b(javascript|js)\b/i },
  { skill: "React", pattern: /\breact(\.js|js)?\b/i },
  { skill: "Node.js", pattern: /\bnode(\.js)?\b/i },
  { skill: "MongoDB", pattern: /\bmongo(db)?\b/i },
  { skill: "SQL", pattern: /\bsql\b/i },
  { skill: "Git", pattern: /\bgit\b/i },
];

const SECTION_KEYWORDS = {
  skills: /\b(skills|technical skills|core competencies|technologies|tech stack)\b/i,
  projects: /\b(projects|personal projects|portfolio|key projects)\b/i,
  education: /\b(education|academic|university|college|degree|bachelor|master|ph\.?d)\b/i,
  experience: /\b(experience|work history|employment|professional experience)\b/i,
};

const ACTION_VERBS =
  /\b(built|developed|designed|implemented|led|managed|created|optimized|deployed|automated|engineered|architected)\b/gi;

function clampScore(value, max = 20) {
  return Math.min(max, Math.max(0, Math.round(value)));
}

function hasSection(text, pattern) {
  return pattern.test(text);
}

function detectSkills(text) {
  return SKILL_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ skill }) => skill);
}

function scoreSkillsSection(text, skillsFound) {
  let score = 0;
  if (hasSection(text, SECTION_KEYWORDS.skills)) score += 12;
  if (skillsFound.length >= 3) score += 4;
  if (skillsFound.length >= 5) score += 4;
  return clampScore(score);
}

function scoreProjectsSection(text) {
  let score = 0;
  if (hasSection(text, SECTION_KEYWORDS.projects)) score += 12;
  const projectVerbs = text.match(ACTION_VERBS);
  if (projectVerbs && projectVerbs.length >= 3) score += 8;
  else if (projectVerbs && projectVerbs.length >= 1) score += 4;
  return clampScore(score);
}

function scoreEducationSection(text) {
  let score = 0;
  if (hasSection(text, SECTION_KEYWORDS.education)) score += 14;
  if (/\b(20\d{2}|19\d{2})\b/.test(text) && hasSection(text, SECTION_KEYWORDS.education)) score += 6;
  return clampScore(score);
}

function scoreContactInfo(text) {
  let score = 0;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) score += 8;
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 6;
  if (/\b(linkedin|github|portfolio|www\.)/i.test(text)) score += 6;
  return clampScore(score);
}

function scoreStructure(text) {
  let score = 0;
  const length = text.length;
  if (length >= 400 && length <= 6000) score += 6;
  else if (length >= 200) score += 3;

  const sectionCount = [
    SECTION_KEYWORDS.skills,
    SECTION_KEYWORDS.projects,
    SECTION_KEYWORDS.education,
    SECTION_KEYWORDS.experience,
  ].filter((p) => hasSection(text, p)).length;

  if (sectionCount >= 3) score += 8;
  else if (sectionCount >= 2) score += 5;
  else if (sectionCount >= 1) score += 2;

  const verbs = text.match(ACTION_VERBS);
  if (verbs && verbs.length >= 5) score += 6;
  else if (verbs && verbs.length >= 2) score += 3;

  return clampScore(score);
}

function buildInsights(text, sectionScores, skillsFound, missingSkills) {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (sectionScores.skills >= 14) {
    strengths.push("Strong skills section that helps ATS keyword matching.");
  }
  if (sectionScores.projects >= 14) {
    strengths.push("Projects are highlighted with clear, action-oriented language.");
  }
  if (sectionScores.education >= 14) {
    strengths.push("Education section is present and easy for recruiters to scan.");
  }
  if (sectionScores.contact >= 14) {
    strengths.push("Contact details are complete and accessible.");
  }
  if (sectionScores.structure >= 14) {
    strengths.push("Resume structure is well-organized with clear sections.");
  }
  if (skillsFound.length >= 5) {
    strengths.push(`Solid technical stack coverage (${skillsFound.length} key skills detected).`);
  }

  if (sectionScores.skills < 12) {
    weaknesses.push("Skills section is weak or missing dedicated keywords.");
    suggestions.push('Add a "Skills" or "Technical Skills" section with relevant technologies.');
  }
  if (sectionScores.projects < 12) {
    weaknesses.push("Projects are underrepresented or lack measurable outcomes.");
    suggestions.push("Include 2-3 projects with tech stack, your role, and quantifiable results.");
  }
  if (sectionScores.education < 12) {
    weaknesses.push("Education details are incomplete or hard to find.");
    suggestions.push("List degree, institution, and graduation year in a dedicated Education section.");
  }
  if (sectionScores.contact < 12) {
    weaknesses.push("Contact information is incomplete.");
    suggestions.push("Add email, phone, and LinkedIn/GitHub links at the top of your resume.");
  }
  if (sectionScores.structure < 12) {
    weaknesses.push("Overall structure could be clearer for ATS parsers.");
    suggestions.push("Use consistent section headers, bullet points, and standard fonts.");
  }
  if (missingSkills.length > 0) {
    weaknesses.push(`Missing in-demand skills: ${missingSkills.join(", ")}.`);
    if (missingSkills.includes("Git")) {
      suggestions.push("Mention Git/version control in skills or project descriptions.");
    }
    if (missingSkills.some((s) => ["React", "Node.js", "JavaScript"].includes(s))) {
      suggestions.push("Highlight full-stack web skills (JavaScript, React, Node.js) if applicable.");
    }
    if (missingSkills.some((s) => ["Python", "SQL"].includes(s))) {
      suggestions.push("Add data-related skills (Python, SQL) if relevant to your target roles.");
    }
  }

  if (text.length < 300) {
    weaknesses.push("Resume content appears too short for comprehensive ATS parsing.");
    suggestions.push("Expand experience bullets with impact metrics and technologies used.");
  }

  if (strengths.length === 0) {
    strengths.push("Resume uploaded successfully - foundation is in place for improvement.");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Minor polish opportunities remain for competitive roles.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Tailor keywords to each job description before submitting applications.");
  }

  return {
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    suggestions: suggestions.slice(0, 6),
  };
}

function analyzeResume(text) {
  const normalized = text.trim();
  const skillsFound = detectSkills(normalized);
  const missingSkills = TRACKED_SKILLS.filter((skill) => !skillsFound.includes(skill));

  const sectionScores = {
    skills: scoreSkillsSection(normalized, skillsFound),
    projects: scoreProjectsSection(normalized),
    education: scoreEducationSection(normalized),
    contact: scoreContactInfo(normalized),
    structure: scoreStructure(normalized),
  };

  const atsScore = clampScore(
    sectionScores.skills +
      sectionScores.projects +
      sectionScores.education +
      sectionScores.contact +
      sectionScores.structure,
    100,
  );

  const insights = buildInsights(normalized, sectionScores, skillsFound, missingSkills);

  return {
    atsScore,
    sectionScores,
    skillsFound,
    missingSkills,
    ...insights,
  };
}

// ---------------------------------------------------------------------------
// Controller endpoints
// ---------------------------------------------------------------------------

/**
 * POST /api/resume/analyze
 * Accept resume text, run ATS analysis, persist result & update stats.
 */
export const analyzeResumeText = async (req, res) => {
  try {
    const userId = req.userId;
    const { extractedText, originalFileName } = req.body;

    if (!extractedText || typeof extractedText !== "string" || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required for analysis",
      });
    }

    const result = analyzeResume(extractedText);

    // Persist analysis to MongoDB
    const resumeRecord = await Resume.create({
      userId,
      originalFileName: originalFileName || null,
      extractedText: extractedText.slice(0, 10000), // cap storage
      atsScore: result.atsScore,
      sectionScores: result.sectionScores,
      skillsFound: result.skillsFound,
      missingSkills: result.missingSkills,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      suggestions: result.suggestions,
    });

    // Update UserStats with latest ATS score
    await UserStats.findOneAndUpdate(
      { userId },
      { $set: { atsScore: result.atsScore, updatedAt: Date.now() } },
      { upsert: true },
    );

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        id: resumeRecord._id,
        atsScore: result.atsScore,
        sectionScores: result.sectionScores,
        skillsFound: result.skillsFound,
        missingSkills: result.missingSkills,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
      },
    });
  } catch (error) {
    console.error("Resume analysis error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during resume analysis",
    });
  }
};

/**
 * GET /api/resume
 * Return the most recent resume analysis for the authenticated user.
 */
export const getLatestResume = async (req, res) => {
  try {
    const userId = req.userId;

    const latest = await Resume.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("-extractedText")
      .lean();

    if (!latest) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: latest._id,
        atsScore: latest.atsScore,
        sectionScores: latest.sectionScores,
        skillsFound: latest.skillsFound,
        missingSkills: latest.missingSkills,
        strengths: latest.strengths,
        weaknesses: latest.weaknesses,
        suggestions: latest.suggestions,
        createdAt: latest.createdAt,
      },
    });
  } catch (error) {
    console.error("Get resume error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching resume data",
    });
  }
};

/**
 * GET /api/resume/history
 * Return all resume analyses for the authenticated user.
 */
export const getResumeHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const records = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("atsScore skillsFound strengths weaknesses originalFileName createdAt")
      .lean();

    return res.status(200).json({
      success: true,
      data: records.map((r) => ({
        id: r._id,
        atsScore: r.atsScore,
        skillsFound: r.skillsFound,
        strengths: r.strengths,
        weaknesses: r.weaknesses,
        originalFileName: r.originalFileName,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Resume history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching resume history",
    });
  }
};
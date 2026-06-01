export const TRACKED_SKILLS = [
  "Java",
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "SQL",
  "Git",
] as const;

export type TrackedSkill = (typeof TRACKED_SKILLS)[number];

export type SectionScores = {
  skills: number;
  projects: number;
  education: number;
  contact: number;
  structure: number;
};

export type ResumeAnalysis = {
  atsScore: number;
  sectionScores: SectionScores;
  skillsFound: TrackedSkill[];
  missingSkills: TrackedSkill[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

const SKILL_PATTERNS: { skill: TrackedSkill; pattern: RegExp }[] = [
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

function clampScore(value: number, max = 20): number {
  return Math.min(max, Math.max(0, Math.round(value)));
}

function hasSection(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

function detectSkills(text: string): TrackedSkill[] {
  return SKILL_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ skill }) => skill);
}

function scoreSkillsSection(text: string, skillsFound: TrackedSkill[]): number {
  let score = 0;
  if (hasSection(text, SECTION_KEYWORDS.skills)) score += 12;
  if (skillsFound.length >= 3) score += 4;
  if (skillsFound.length >= 5) score += 4;
  return clampScore(score);
}

function scoreProjectsSection(text: string): number {
  let score = 0;
  if (hasSection(text, SECTION_KEYWORDS.projects)) score += 12;
  const projectVerbs = text.match(ACTION_VERBS);
  if (projectVerbs && projectVerbs.length >= 3) score += 8;
  else if (projectVerbs && projectVerbs.length >= 1) score += 4;
  return clampScore(score);
}

function scoreEducationSection(text: string): number {
  let score = 0;
  if (hasSection(text, SECTION_KEYWORDS.education)) score += 14;
  if (/\b(20\d{2}|19\d{2})\b/.test(text) && hasSection(text, SECTION_KEYWORDS.education)) score += 6;
  return clampScore(score);
}

function scoreContactInfo(text: string): number {
  let score = 0;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) score += 8;
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 6;
  if (/\b(linkedin|github|portfolio|www\.)/i.test(text)) score += 6;
  return clampScore(score);
}

function scoreStructure(text: string): number {
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

function buildInsights(
  text: string,
  sectionScores: SectionScores,
  skillsFound: TrackedSkill[],
  missingSkills: TrackedSkill[],
): Pick<ResumeAnalysis, "strengths" | "weaknesses" | "suggestions"> {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

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
    suggestions.push("Include 2–3 projects with tech stack, your role, and quantifiable results.");
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
    strengths.push("Resume uploaded successfully — foundation is in place for improvement.");
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

export function analyzeResume(text: string): ResumeAnalysis {
  const normalized = text.trim();
  const skillsFound = detectSkills(normalized);
  const missingSkills = TRACKED_SKILLS.filter((skill) => !skillsFound.includes(skill));

  const sectionScores: SectionScores = {
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

/** Brief delay so the analysis loading state is visible. */
export function analyzeResumeWithDelay(text: string, ms = 1200): Promise<ResumeAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(analyzeResume(text)), ms);
  });
}

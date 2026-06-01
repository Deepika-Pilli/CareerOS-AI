import { TARGET_ROLE_OPTIONS, type TargetRole } from "@/lib/generate-roadmap";

export { TARGET_ROLE_OPTIONS, type TargetRole };

export type SkillPriority = "High" | "Medium" | "Low";

export type RoleSkillRequirement = {
  name: string;
  aliases: string[];
  priority: SkillPriority;
  resources: string[];
  weeksToLearn: number;
};

export type MatchedSkill = {
  name: string;
  matchedInput: string;
};

export type MissingSkill = {
  name: string;
  priority: SkillPriority;
  weeksToLearn: number;
};

export type SkillGapAnalysis = {
  targetRole: TargetRole;
  matchPercent: number;
  skillsAvailable: MatchedSkill[];
  missingSkills: MissingSkill[];
  learningPriority: { priority: SkillPriority; skills: string[] }[];
  recommendedResources: { skill: string; resources: string[] }[];
  estimatedLearningDuration: string;
};

const ROLE_SKILLS: Record<TargetRole, RoleSkillRequirement[]> = {
  "Frontend Developer": [
    { name: "HTML & CSS", aliases: ["html", "css", "html5", "css3", "tailwind", "bootstrap"], priority: "High", weeksToLearn: 4, resources: ["freeCodeCamp Responsive Web Design", "MDN Web Docs — HTML/CSS"] },
    { name: "JavaScript", aliases: ["javascript", "js", "ecmascript", "es6"], priority: "High", weeksToLearn: 6, resources: ["javascript.info", "Eloquent JavaScript (book)"] },
    { name: "TypeScript", aliases: ["typescript", "ts"], priority: "Medium", weeksToLearn: 3, resources: ["TypeScript Handbook (official)", "Total TypeScript (Matt Pocock)"] },
    { name: "React", aliases: ["react", "react.js", "reactjs", "next.js", "nextjs"], priority: "High", weeksToLearn: 6, resources: ["React official docs", "Scrimba React course"] },
    { name: "Git & GitHub", aliases: ["git", "github", "version control"], priority: "High", weeksToLearn: 2, resources: ["GitHub Skills labs", "Pro Git book (free)"] },
    { name: "REST APIs", aliases: ["rest", "rest api", "fetch", "axios", "api integration"], priority: "Medium", weeksToLearn: 2, resources: ["REST API Tutorial", "JSONPlaceholder practice API"] },
    { name: "Responsive Design", aliases: ["responsive", "mobile-first", "flexbox", "grid", "media queries"], priority: "Medium", weeksToLearn: 2, resources: ["CSS-Tricks Flexbox/Grid guides", "Frontend Mentor challenges"] },
    { name: "Testing (Jest/RTL)", aliases: ["jest", "testing library", "rtl", "unit testing", "vitest"], priority: "Low", weeksToLearn: 3, resources: ["Testing Library docs", "Kent C. Dodds Testing JavaScript"] },
  ],
  "Full Stack Developer": [
    { name: "JavaScript / TypeScript", aliases: ["javascript", "js", "typescript", "ts"], priority: "High", weeksToLearn: 6, resources: ["javascript.info", "TypeScript Handbook"] },
    { name: "React", aliases: ["react", "react.js", "next.js"], priority: "High", weeksToLearn: 5, resources: ["React docs", "Full Stack Open (Helsinki)"] },
    { name: "Node.js & Express", aliases: ["node", "nodejs", "node.js", "express", "express.js"], priority: "High", weeksToLearn: 5, resources: ["Node.js docs", "Express.js guide"] },
    { name: "SQL Databases", aliases: ["sql", "postgresql", "postgres", "mysql", "sqlite"], priority: "High", weeksToLearn: 4, resources: ["SQLBolt", "PostgreSQL Tutorial"] },
    { name: "MongoDB / NoSQL", aliases: ["mongodb", "mongo", "nosql", "mongoose"], priority: "Medium", weeksToLearn: 3, resources: ["MongoDB University (free)", "Mongoose docs"] },
    { name: "REST API Design", aliases: ["rest", "restful", "api design", "swagger", "openapi"], priority: "High", weeksToLearn: 3, resources: ["REST API Tutorial", "Postman Learning Center"] },
    { name: "Authentication (JWT)", aliases: ["jwt", "oauth", "auth", "authentication", "passport"], priority: "Medium", weeksToLearn: 2, resources: ["JWT.io introduction", "Auth0 docs"] },
    { name: "Docker & Deployment", aliases: ["docker", "ci/cd", "aws", "vercel", "deployment", "kubernetes"], priority: "Medium", weeksToLearn: 4, resources: ["Docker Getting Started", "Railway / Render deploy guides"] },
    { name: "Git & GitHub", aliases: ["git", "github"], priority: "High", weeksToLearn: 2, resources: ["GitHub Skills", "Atlassian Git tutorials"] },
  ],
  "Data Analyst": [
    { name: "Excel / Spreadsheets", aliases: ["excel", "google sheets", "spreadsheet", "pivot tables"], priority: "High", weeksToLearn: 3, resources: ["Excel Exposure", "Google Sheets training"] },
    { name: "SQL", aliases: ["sql", "postgresql", "mysql", "bigquery", "sqlite"], priority: "High", weeksToLearn: 5, resources: ["SQLBolt", "Mode Analytics SQL Tutorial"] },
    { name: "Python (Pandas)", aliases: ["python", "pandas", "numpy", "jupyter"], priority: "High", weeksToLearn: 5, resources: ["Kaggle Python course", "Pandas official docs"] },
    { name: "Data Visualization", aliases: ["tableau", "power bi", "matplotlib", "seaborn", "plotly", "looker"], priority: "High", weeksToLearn: 4, resources: ["Tableau Public tutorials", "Storytelling with Data (book)"] },
    { name: "Statistics", aliases: ["statistics", "stats", "probability", "hypothesis testing", "a/b testing"], priority: "Medium", weeksToLearn: 4, resources: ["Khan Academy Statistics", "StatQuest (YouTube)"] },
    { name: "Business Intelligence", aliases: ["bi", "business intelligence", "dashboards", "kpis", "metrics"], priority: "Medium", weeksToLearn: 3, resources: ["Google Data Analytics Certificate", "Maven Analytics"] },
    { name: "Data Cleaning", aliases: ["data cleaning", "etl", "data wrangling", "preprocessing"], priority: "Medium", weeksToLearn: 2, resources: ["Kaggle datasets practice", "OpenRefine tutorials"] },
  ],
  "AI Engineer": [
    { name: "Python", aliases: ["python", "pip", "virtualenv", "conda"], priority: "High", weeksToLearn: 4, resources: ["Python official tutorial", "Automate the Boring Stuff"] },
    { name: "Mathematics (Linear Algebra & Stats)", aliases: ["linear algebra", "calculus", "statistics", "math", "probability"], priority: "High", weeksToLearn: 6, resources: ["3Blue1Brown Linear Algebra", "Khan Academy Statistics"] },
    { name: "Machine Learning", aliases: ["machine learning", "ml", "scikit-learn", "sklearn", "supervised learning"], priority: "High", weeksToLearn: 8, resources: ["Andrew Ng ML course (Coursera)", "scikit-learn docs"] },
    { name: "Deep Learning", aliases: ["deep learning", "pytorch", "tensorflow", "neural networks", "cnn", "rnn"], priority: "High", weeksToLearn: 8, resources: ["fast.ai", "PyTorch tutorials"] },
    { name: "NLP & Transformers", aliases: ["nlp", "natural language processing", "transformers", "hugging face", "bert", "gpt"], priority: "Medium", weeksToLearn: 6, resources: ["Hugging Face course", "Jay Alammar blog"] },
    { name: "LLMs & Prompt Engineering", aliases: ["llm", "prompt engineering", "rag", "openai", "langchain", "embeddings"], priority: "High", weeksToLearn: 4, resources: ["OpenAI Cookbook", "DeepLearning.AI LangChain course"] },
    { name: "MLOps Basics", aliases: ["mlops", "model deployment", "mlflow", "fastapi", "model serving"], priority: "Medium", weeksToLearn: 4, resources: ["Made With ML MLOps guide", "Full Stack Deep Learning"] },
    { name: "Cloud ML Tools", aliases: ["aws sagemaker", "gcp", "azure ml", "cloud", "gpu"], priority: "Low", weeksToLearn: 3, resources: ["AWS ML foundations", "Google Cloud Skills Boost"] },
  ],
  "Cybersecurity Analyst": [
    { name: "Networking (TCP/IP)", aliases: ["networking", "tcp/ip", "dns", "http", "osi model", "wireshark"], priority: "High", weeksToLearn: 5, resources: ["Professor Messer Network+", "Cisco Networking Basics"] },
    { name: "Linux & Command Line", aliases: ["linux", "bash", "shell", "ubuntu", "kali"], priority: "High", weeksToLearn: 4, resources: ["Linux Journey", "OverTheWire Bandit"] },
    { name: "Security Fundamentals", aliases: ["security", "cia triad", "risk assessment", "threat modeling"], priority: "High", weeksToLearn: 3, resources: ["Cybrary intro courses", "CompTIA Security+ study guide"] },
    { name: "SIEM & Log Analysis", aliases: ["siem", "splunk", "elk", "log analysis", "soc"], priority: "High", weeksToLearn: 4, resources: ["TryHackMe SOC Level 1", "Splunk Fundamentals"] },
    { name: "Vulnerability Assessment", aliases: ["vulnerability", "nessus", "nmap", "penetration testing", "pentest"], priority: "Medium", weeksToLearn: 5, resources: ["OWASP WebGoat", "Hack The Box Academy"] },
    { name: "Incident Response", aliases: ["incident response", "forensics", "ir", "dfir", "malware analysis"], priority: "Medium", weeksToLearn: 4, resources: ["SANS reading room papers", "TryHackMe Incident Response"] },
    { name: "OWASP Top 10", aliases: ["owasp", "web security", "xss", "sql injection", "csrf"], priority: "High", weeksToLearn: 3, resources: ["OWASP Top 10 docs", "PortSwigger Web Security Academy"] },
    { name: "Scripting (Python/Bash)", aliases: ["python", "bash", "scripting", "automation"], priority: "Medium", weeksToLearn: 3, resources: ["Automate the Boring Stuff", "Bash scripting guides"] },
  ],
};

function normalizeSkill(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseCurrentSkills(input: string): string[] {
  return input
    .split(/[,;\n]+/)
    .map(normalizeSkill)
    .filter((s) => s.length > 0);
}

function skillMatches(userSkill: string, requirement: RoleSkillRequirement): boolean {
  const terms = [requirement.name, ...requirement.aliases].map(normalizeSkill);
  return terms.some(
    (term) =>
      userSkill.includes(term) ||
      term.includes(userSkill) ||
      userSkill.split(" ").some((word) => word.length > 2 && term.includes(word)),
  );
}

function findMatch(
  requirement: RoleSkillRequirement,
  userSkills: string[],
): string | null {
  for (const userSkill of userSkills) {
    if (skillMatches(userSkill, requirement)) return userSkill;
  }
  return null;
}

const PRIORITY_ORDER: SkillPriority[] = ["High", "Medium", "Low"];

function formatDuration(totalWeeks: number): string {
  if (totalWeeks <= 0) return "No additional learning time needed — you're role-ready!";
  if (totalWeeks <= 4) return `~${totalWeeks} weeks of focused study`;
  const months = Math.ceil(totalWeeks / 4);
  return months === 1
    ? "~1 month of focused study"
    : `~${months} months of focused study (${totalWeeks} weeks)`;
}

export function analyzeSkillGap(targetRole: TargetRole, currentSkillsInput: string): SkillGapAnalysis {
  const userSkills = parseCurrentSkills(currentSkillsInput);
  const requirements = ROLE_SKILLS[targetRole];

  const skillsAvailable: MatchedSkill[] = [];
  const missingSkills: MissingSkill[] = [];

  for (const req of requirements) {
    const matchedInput = findMatch(req, userSkills);
    if (matchedInput) {
      skillsAvailable.push({ name: req.name, matchedInput });
    } else {
      missingSkills.push({
        name: req.name,
        priority: req.priority,
        weeksToLearn: req.weeksToLearn,
      });
    }
  }

  const matchPercent =
    requirements.length > 0
      ? Math.round((skillsAvailable.length / requirements.length) * 100)
      : 0;

  const learningPriority = PRIORITY_ORDER.map((priority) => ({
    priority,
    skills: missingSkills.filter((s) => s.priority === priority).map((s) => s.name),
  })).filter((g) => g.skills.length > 0);

  const recommendedResources = missingSkills
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority))
    .slice(0, 6)
    .map((missing) => {
      const req = requirements.find((r) => r.name === missing.name)!;
      return { skill: missing.name, resources: req.resources };
    });

  const totalWeeks = missingSkills.reduce((sum, s) => sum + s.weeksToLearn, 0);
  const estimatedLearningDuration = formatDuration(
    Math.round(totalWeeks * 0.7),
  );

  return {
    targetRole,
    matchPercent,
    skillsAvailable,
    missingSkills,
    learningPriority,
    recommendedResources,
    estimatedLearningDuration,
  };
}

export function analyzeSkillGapWithDelay(
  targetRole: TargetRole,
  currentSkillsInput: string,
  ms = 1200,
): Promise<SkillGapAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(analyzeSkillGap(targetRole, currentSkillsInput)), ms);
  });
}

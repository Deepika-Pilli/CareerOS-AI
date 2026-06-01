export const CURRENT_STATUS_OPTIONS = ["Student", "Fresher"] as const;
export type CurrentStatus = (typeof CURRENT_STATUS_OPTIONS)[number];

export const TARGET_ROLE_OPTIONS = [
  "Frontend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "AI Engineer",
  "Cybersecurity Analyst",
] as const;
export type TargetRole = (typeof TARGET_ROLE_OPTIONS)[number];

export type RoadmapPhase = {
  phase: string;
  duration: string;
  title: string;
  description: string;
  topics: string[];
};

export type CareerRoadmap = {
  targetRole: TargetRole;
  currentStatus: CurrentStatus;
  estimatedTimeline: string;
  skillsToLearn: string[];
  recommendedProjects: string[];
  interviewPrepPlan: string[];
  learningRoadmap: RoadmapPhase[];
};

type RoleTemplate = Omit<CareerRoadmap, "targetRole" | "currentStatus" | "estimatedTimeline"> & {
  studentMonths: number;
  fresherMonths: number;
};

const ROLE_TEMPLATES: Record<TargetRole, RoleTemplate> = {
  "Frontend Developer": {
    studentMonths: 8,
    fresherMonths: 5,
    skillsToLearn: [
      "HTML5, CSS3 & responsive design",
      "JavaScript (ES6+) & TypeScript basics",
      "React.js & component architecture",
      "State management (Context, Redux Toolkit)",
      "REST APIs & async JavaScript",
      "Git, GitHub & deployment (Vercel/Netlify)",
      "UI/UX fundamentals & accessibility (a11y)",
      "Testing with Jest & React Testing Library",
    ],
    recommendedProjects: [
      "Personal portfolio website with dark mode and animations",
      "Task manager app with drag-and-drop (React + local storage)",
      "E-commerce product listing page consuming a public API",
      "Weather dashboard with geolocation and chart visualizations",
      "Open-source contribution to a React component library",
    ],
    interviewPrepPlan: [
      "Week 1–2: Review HTML/CSS layout challenges (Flexbox, Grid)",
      "Week 2–3: Practice JavaScript fundamentals (closures, promises, arrays)",
      "Week 3–4: Build 2 small React apps under time constraints",
      "Week 4–5: Study system design basics for frontend (performance, caching)",
      "Ongoing: Mock interviews on behavioral + technical React questions",
      "Prepare STAR stories for teamwork, deadlines, and debugging wins",
    ],
    learningRoadmap: [
      {
        phase: "Phase 1",
        duration: "4–6 weeks",
        title: "Web foundations",
        description: "Master the building blocks every frontend role expects.",
        topics: ["HTML semantics", "CSS Flexbox & Grid", "Responsive design", "Git basics"],
      },
      {
        phase: "Phase 2",
        duration: "6–8 weeks",
        title: "JavaScript deep dive",
        description: "Build interactive UIs and understand async programming.",
        topics: ["DOM manipulation", "ES6+ features", "Fetch API", "Error handling"],
      },
      {
        phase: "Phase 3",
        duration: "8–10 weeks",
        title: "React ecosystem",
        description: "Ship component-based applications with modern tooling.",
        topics: ["JSX & hooks", "React Router", "Forms & validation", "API integration"],
      },
      {
        phase: "Phase 4",
        duration: "4–6 weeks",
        title: "Polish & job readiness",
        description: "Optimize performance and prepare your portfolio for hiring.",
        topics: ["Performance tuning", "Accessibility", "Portfolio deployment", "Interview prep"],
      },
    ],
  },
  "Full Stack Developer": {
    studentMonths: 12,
    fresherMonths: 7,
    skillsToLearn: [
      "HTML, CSS, JavaScript & TypeScript",
      "React.js for frontend development",
      "Node.js & Express.js",
      "RESTful API design & authentication (JWT)",
      "SQL (PostgreSQL) & NoSQL (MongoDB)",
      "Docker basics & cloud deployment",
      "Git workflows & CI/CD fundamentals",
      "System design & security best practices",
    ],
    recommendedProjects: [
      "Full-stack blog platform with auth (React + Node + MongoDB)",
      "SaaS dashboard with role-based access control",
      "Real-time chat application using WebSockets",
      "Job board API with search, filters, and pagination",
      "DevOps mini-pipeline: lint, test, and deploy on push",
    ],
    interviewPrepPlan: [
      "Week 1–2: Refresh DSA basics (arrays, trees, hash maps)",
      "Week 2–4: Practice full-stack system design (DB schema, API layers)",
      "Week 4–5: Build one end-to-end feature in 48 hours",
      "Week 5–6: Mock interviews covering backend + frontend trade-offs",
      "Review authentication flows, caching, and database indexing",
      "Document 3 projects with architecture diagrams for interviews",
    ],
    learningRoadmap: [
      {
        phase: "Phase 1",
        duration: "6–8 weeks",
        title: "Frontend fundamentals",
        description: "Learn to build user interfaces that connect to backends.",
        topics: ["HTML/CSS/JS", "React basics", "HTTP & REST", "Git"],
      },
      {
        phase: "Phase 2",
        duration: "8–10 weeks",
        title: "Backend & databases",
        description: "Create APIs, persist data, and handle authentication.",
        topics: ["Node.js & Express", "PostgreSQL", "MongoDB", "JWT auth"],
      },
      {
        phase: "Phase 3",
        duration: "8–10 weeks",
        title: "Full-stack integration",
        description: "Connect frontend and backend into production-ready apps.",
        topics: ["State + API layers", "File uploads", "Testing", "Error handling"],
      },
      {
        phase: "Phase 4",
        duration: "6–8 weeks",
        title: "Deploy & scale",
        description: "Ship to cloud and understand production concerns.",
        topics: ["Docker", "CI/CD", "Monitoring", "System design intro"],
      },
    ],
  },
  "Data Analyst": {
    studentMonths: 9,
    fresherMonths: 6,
    skillsToLearn: [
      "Excel & Google Sheets (advanced formulas, pivot tables)",
      "SQL for data extraction & aggregation",
      "Python (Pandas, NumPy) for data cleaning",
      "Data visualization (Tableau, Power BI, or Matplotlib)",
      "Statistics & probability fundamentals",
      "A/B testing & hypothesis testing",
      "Business intelligence storytelling",
      "Basic cloud data tools (BigQuery or similar)",
    ],
    recommendedProjects: [
      "Sales dashboard analyzing trends with SQL + visualization tool",
      "Customer churn analysis with Python and actionable insights report",
      "Public dataset EDA (Kaggle) with Jupyter notebook narrative",
      "A/B test simulation and recommendation for product team",
      "Automated weekly KPI report using Python scripts",
    ],
    interviewPrepPlan: [
      "Week 1–2: Practice SQL joins, window functions, and CTEs daily",
      "Week 2–3: Solve case studies (metric definition, funnel analysis)",
      "Week 3–4: Present 2 portfolio analyses as 10-minute stories",
      "Prepare answers for 'How did you drive a business decision?'",
      "Review statistics: distributions, correlation vs causation",
      "Mock technical screens with live SQL and Python exercises",
    ],
    learningRoadmap: [
      {
        phase: "Phase 1",
        duration: "4–6 weeks",
        title: "Data literacy",
        description: "Understand how businesses use data to make decisions.",
        topics: ["Spreadsheets", "Data types", "KPIs & metrics", "Data ethics"],
      },
      {
        phase: "Phase 2",
        duration: "6–8 weeks",
        title: "SQL mastery",
        description: "Query databases confidently for reports and analysis.",
        topics: ["SELECT & JOINs", "Aggregations", "Subqueries", "Window functions"],
      },
      {
        phase: "Phase 3",
        duration: "6–8 weeks",
        title: "Python for analytics",
        description: "Clean, transform, and analyze datasets programmatically.",
        topics: ["Pandas", "Data cleaning", "NumPy", "Jupyter workflows"],
      },
      {
        phase: "Phase 4",
        duration: "6–8 weeks",
        title: "Visualization & storytelling",
        description: "Communicate insights that stakeholders act on.",
        topics: ["Dashboards", "Charts best practices", "Case studies", "Interview prep"],
      },
    ],
  },
  "AI Engineer": {
    studentMonths: 14,
    fresherMonths: 9,
    skillsToLearn: [
      "Python programming & virtual environments",
      "Linear algebra, calculus & statistics refresher",
      "Machine learning (scikit-learn, model evaluation)",
      "Deep learning (PyTorch or TensorFlow)",
      "NLP basics & transformer models overview",
      "LLM APIs, prompt engineering & RAG patterns",
      "MLOps basics (model versioning, deployment)",
      "Cloud ML services (AWS/GCP ML tools intro)",
    ],
    recommendedProjects: [
      "Image classifier trained on a custom dataset with evaluation metrics",
      "Sentiment analysis API for product reviews",
      "RAG chatbot over your own documents using embeddings",
      "Fine-tuned small LLM for domain-specific Q&A",
      "End-to-end ML pipeline: train, evaluate, deploy with FastAPI",
    ],
    interviewPrepPlan: [
      "Week 1–3: Review ML fundamentals (bias-variance, regularization)",
      "Week 3–5: Implement classic algorithms from scratch once",
      "Week 5–7: Study LLM architecture, fine-tuning, and RAG trade-offs",
      "Prepare to explain 2 projects: problem, approach, metrics, failures",
      "Practice coding: NumPy operations, simple neural net forward pass",
      "Mock system design for ML serving (latency, batching, monitoring)",
    ],
    learningRoadmap: [
      {
        phase: "Phase 1",
        duration: "6–8 weeks",
        title: "Math & Python foundations",
        description: "Build the mathematical and coding base for ML work.",
        topics: ["Python", "NumPy", "Statistics", "Linear algebra essentials"],
      },
      {
        phase: "Phase 2",
        duration: "10–12 weeks",
        title: "Machine learning core",
        description: "Train, evaluate, and iterate on predictive models.",
        topics: ["scikit-learn", "Feature engineering", "Cross-validation", "Metrics"],
      },
      {
        phase: "Phase 3",
        duration: "10–12 weeks",
        title: "Deep learning & NLP",
        description: "Work with neural networks and modern language models.",
        topics: ["PyTorch basics", "CNNs/RNNs intro", "Transformers", "Hugging Face"],
      },
      {
        phase: "Phase 4",
        duration: "8–10 weeks",
        title: "LLMs & production AI",
        description: "Build applied AI systems and deploy them responsibly.",
        topics: ["Prompt engineering", "RAG", "API integration", "MLOps intro"],
      },
    ],
  },
  "Cybersecurity Analyst": {
    studentMonths: 10,
    fresherMonths: 7,
    skillsToLearn: [
      "Networking fundamentals (TCP/IP, DNS, HTTP/S)",
      "Linux command line & scripting (Bash/Python)",
      "Security principles (CIA triad, defense in depth)",
      "Threat modeling & vulnerability assessment",
      "SIEM tools & log analysis basics",
      "Incident response & digital forensics intro",
      "OWASP Top 10 & secure coding awareness",
      "Certifications path (Security+, CEH, or SOC analyst tracks)",
    ],
    recommendedProjects: [
      "Home lab: set up virtual network with firewall rules and monitoring",
      "Vulnerability assessment report for a deliberately vulnerable web app",
      "SIEM dashboard simulating alert triage from sample logs",
      "Phishing awareness training kit with metrics for a mock organization",
      "Write-up of a CTF challenge walkthrough (recon → exploit → remediate)",
    ],
    interviewPrepPlan: [
      "Week 1–2: Review networking and OSI model — expect diagram questions",
      "Week 2–4: Practice log analysis and incident timeline reconstruction",
      "Week 4–5: Study OWASP Top 10 with real-world breach examples",
      "Prepare STAR stories for handling security incidents under pressure",
      "Mock SOC analyst scenarios: prioritize alerts, escalate, document",
      "Research the company's compliance needs (SOC 2, ISO 27001, GDPR)",
    ],
    learningRoadmap: [
      {
        phase: "Phase 1",
        duration: "6–8 weeks",
        title: "IT & networking basics",
        description: "Understand how systems communicate before securing them.",
        topics: ["TCP/IP", "DNS & HTTP", "Linux CLI", "Virtualization"],
      },
      {
        phase: "Phase 2",
        duration: "8–10 weeks",
        title: "Security fundamentals",
        description: "Learn core concepts attackers exploit and defenders mitigate.",
        topics: ["CIA triad", "Cryptography basics", "Access control", "Malware types"],
      },
      {
        phase: "Phase 3",
        duration: "8–10 weeks",
        title: "Offensive & defensive skills",
        description: "Think like an attacker to build stronger defenses.",
        topics: ["Reconnaissance", "Vuln scanning", "SIEM", "Incident response"],
      },
      {
        phase: "Phase 4",
        duration: "6–8 weeks",
        title: "SOC readiness & certifications",
        description: "Prepare for analyst roles and industry credentials.",
        topics: ["Alert triage", "Reporting", "Security+", "Portfolio of labs"],
      },
    ],
  },
};

function formatTimeline(months: number, status: CurrentStatus): string {
  const label = months === 1 ? "1 month" : `${months} months`;
  if (status === "Student") {
    return `${label} (part-time study alongside academics)`;
  }
  return `${label} (full-time focused learning)`;
}

export function generateRoadmap(
  currentStatus: CurrentStatus,
  targetRole: TargetRole,
): CareerRoadmap {
  const template = ROLE_TEMPLATES[targetRole];
  const months =
    currentStatus === "Student" ? template.studentMonths : template.fresherMonths;

  return {
    targetRole,
    currentStatus,
    estimatedTimeline: formatTimeline(months, currentStatus),
    skillsToLearn: template.skillsToLearn,
    recommendedProjects: template.recommendedProjects,
    interviewPrepPlan: template.interviewPrepPlan,
    learningRoadmap: template.learningRoadmap,
  };
}

export function generateRoadmapWithDelay(
  currentStatus: CurrentStatus,
  targetRole: TargetRole,
  ms = 1400,
): Promise<CareerRoadmap> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateRoadmap(currentStatus, targetRole)), ms);
  });
}

import jwt from "jsonwebtoken";
import Interview from "../models/Interview.js";

const TARGET_ROLE_OPTIONS = [
  "Frontend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "AI Engineer",
  "Cybersecurity Analyst",
];

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

const QUESTION_BANK = {
  "Frontend Developer": [
    { question: "Tell me about yourself and why you want to be a frontend developer.", type: "behavioral", difficulty: "Easy" },
    { question: "What is the difference between HTML, CSS, and JavaScript?", type: "technical", difficulty: "Easy" },
    { question: "Explain the box model in CSS.", type: "technical", difficulty: "Easy" },
    { question: "What is the virtual DOM in React and why is it useful?", type: "technical", difficulty: "Medium" },
    { question: "How do you optimize a React application for performance?", type: "technical", difficulty: "Medium" },
    { question: "Describe a challenging UI bug you fixed. What was your approach?", type: "situational", difficulty: "Medium" },
    { question: "Explain closures in JavaScript with a practical example.", type: "technical", difficulty: "Medium" },
    { question: "How do you ensure accessibility in your frontend projects?", type: "technical", difficulty: "Hard" },
    { question: "Compare client-side rendering, SSR, and SSG. When would you use each?", type: "technical", difficulty: "Hard" },
    { question: "Design a real-time notification component. Walk through your architecture.", type: "situational", difficulty: "Hard" },
  ],
  "Full Stack Developer": [
    { question: "Walk me through a full-stack project you built end to end.", type: "behavioral", difficulty: "Easy" },
    { question: "What is the difference between SQL and NoSQL databases?", type: "technical", difficulty: "Easy" },
    { question: "How does JWT authentication work?", type: "technical", difficulty: "Medium" },
    { question: "Explain RESTful API design principles.", type: "technical", difficulty: "Medium" },
    { question: "How would you handle a production API that is suddenly slow?", type: "situational", difficulty: "Medium" },
    { question: "Describe how you structure a Node.js + React application.", type: "technical", difficulty: "Medium" },
    { question: "What strategies do you use for database indexing and query optimization?", type: "technical", difficulty: "Hard" },
    { question: "How would you design a scalable file upload system?", type: "situational", difficulty: "Hard" },
    { question: "Explain microservices vs monolith trade-offs.", type: "technical", difficulty: "Hard" },
    { question: "Tell me about a time you debugged a critical production issue.", type: "situational", difficulty: "Easy" },
  ],
  "Data Analyst": [
    { question: "Why are you interested in a data analyst role?", type: "behavioral", difficulty: "Easy" },
    { question: "What is the difference between INNER JOIN and LEFT JOIN?", type: "technical", difficulty: "Easy" },
    { question: "How do you handle missing or dirty data in a dataset?", type: "situational", difficulty: "Medium" },
    { question: "Explain the difference between mean, median, and mode.", type: "technical", difficulty: "Easy" },
    { question: "Walk me through an analysis you did that influenced a business decision.", type: "behavioral", difficulty: "Medium" },
    { question: "What is A/B testing and how would you design one?", type: "technical", difficulty: "Medium" },
    { question: "How do you choose the right chart type for a dashboard?", type: "technical", difficulty: "Medium" },
    { question: "Explain correlation vs causation with an example.", type: "technical", difficulty: "Hard" },
    { question: "A stakeholder wants a metric that you know is misleading. How do you respond?", type: "situational", difficulty: "Hard" },
    { question: "Write a SQL query approach to find customers who churned in the last 30 days.", type: "technical", difficulty: "Hard" },
  ],
  "AI Engineer": [
    { question: "What motivated you to pursue AI engineering?", type: "behavioral", difficulty: "Easy" },
    { question: "Explain the difference between supervised and unsupervised learning.", type: "technical", difficulty: "Easy" },
    { question: "What is overfitting and how do you prevent it?", type: "technical", difficulty: "Medium" },
    { question: "Describe how gradient descent works at a high level.", type: "technical", difficulty: "Medium" },
    { question: "What is RAG and when would you use it over fine-tuning?", type: "technical", difficulty: "Hard" },
    { question: "How do you evaluate an ML model beyond accuracy?", type: "technical", difficulty: "Medium" },
    { question: "Explain transformers in simple terms.", type: "technical", difficulty: "Hard" },
    { question: "Describe a project where you deployed an ML model to production.", type: "situational", difficulty: "Medium" },
    { question: "How do you handle bias and fairness in AI systems?", type: "situational", difficulty: "Hard" },
    { question: "Walk through building a chatbot with LLM APIs.", type: "technical", difficulty: "Easy" },
  ],
  "Cybersecurity Analyst": [
    { question: "Why do you want to work in cybersecurity?", type: "behavioral", difficulty: "Easy" },
    { question: "Explain the CIA triad.", type: "technical", difficulty: "Easy" },
    { question: "What is the difference between a vulnerability and an exploit?", type: "technical", difficulty: "Easy" },
    { question: "How would you respond to a suspected phishing incident?", type: "situational", difficulty: "Medium" },
    { question: "What is SIEM and how is it used in a SOC?", type: "technical", difficulty: "Medium" },
    { question: "Explain the OWASP Top 10 at a high level.", type: "technical", difficulty: "Medium" },
    { question: "How do you prioritize alerts during a high-volume incident?", type: "situational", difficulty: "Hard" },
    { question: "Describe the steps of a penetration test engagement.", type: "technical", difficulty: "Hard" },
    { question: "What is the difference between symmetric and asymmetric encryption?", type: "technical", difficulty: "Medium" },
    { question: "Tell me about a security lab or CTF challenge you completed.", type: "behavioral", difficulty: "Easy" },
  ],
};

const ROLE_KEYWORDS = {
  "Frontend Developer": ["react", "javascript", "css", "html", "component", "dom", "api", "responsive", "accessibility", "performance", "browser", "ui", "ux"],
  "Full Stack Developer": ["api", "database", "node", "react", "sql", "mongodb", "auth", "jwt", "server", "client", "deploy", "rest", "backend", "frontend"],
  "Data Analyst": ["sql", "python", "pandas", "data", "visualization", "metric", "dashboard", "analysis", "statistics", "hypothesis", "kpi", "excel", "tableau"],
  "AI Engineer": ["model", "training", "ml", "neural", "python", "pytorch", "tensorflow", "llm", "rag", "embedding", "accuracy", "dataset", "feature", "inference"],
  "Cybersecurity Analyst": ["security", "threat", "vulnerability", "incident", "siem", "log", "firewall", "encryption", "malware", "phishing", "owasp", "soc", "risk"],
};

const STRUCTURE_WORDS = [
  "first",
  "then",
  "next",
  "finally",
  "because",
  "therefore",
  "as a result",
  "for example",
  "in addition",
  "situation",
  "task",
  "action",
  "result",
];

const OWNERSHIP_PHRASES = ["i led", "i built", "i designed", "i implemented", "i created", "i improved", "my team"];

function clamp(n) {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function countMatches(text, patterns) {
  const lower = text.toLowerCase();
  return patterns.filter((p) => lower.includes(p)).length;
}

function getTargetWordCount(difficulty) {
  if (difficulty === "Easy") return 50;
  if (difficulty === "Medium") return 75;
  return 100;
}

function scoreAnswerLength(answer, difficulty) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const target = getTargetWordCount(difficulty);

  if (words.length === 0) return 0;
  if (words.length < 10) return clamp((words.length / 10) * 25);
  if (words.length >= target) return clamp(75 + Math.min(25, ((words.length - target) / target) * 25));

  return clamp((words.length / target) * 75);
}

function scoreTechnicalKeywords(answer, role, question) {
  const keywords = ROLE_KEYWORDS[role];
  const hits = countMatches(answer, keywords);
  const uniqueTerms = new Set(keywords.filter((k) => answer.toLowerCase().includes(k))).size;

  let score = clamp(uniqueTerms * 14 + hits * 6);

  if (question.type === "technical") score = clamp(score * 1.1);
  if (question.type === "behavioral" && hits === 0) score = clamp(score * 0.85);

  return Math.min(100, score);
}

function scoreSentenceStructure(answer) {
  const trimmed = answer.trim();
  if (!trimmed) return 0;

  let score = 0;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 8);
  const words = trimmed.split(/\s+/).filter(Boolean);

  if (sentences.length >= 1) score += 15;
  if (sentences.length >= 2) score += 20;
  if (sentences.length >= 4) score += 20;

  const avgSentenceLength = words.length / Math.max(sentences.length, 1);
  if (avgSentenceLength >= 8 && avgSentenceLength <= 28) score += 15;

  score += Math.min(30, countMatches(trimmed, STRUCTURE_WORDS) * 8);

  if (/^[A-Z]/.test(trimmed)) score += 5;
  if (/[.!?]$/.test(trimmed)) score += 5;

  if (trimmed.includes("\n") && sentences.length >= 2) score += 10;

  return clamp(score);
}

function computeAnswerMetrics(answer, role, question, difficulty) {
  return {
    length: scoreAnswerLength(answer, difficulty),
    keywords: scoreTechnicalKeywords(answer, role, question),
    structure: scoreSentenceStructure(answer),
  };
}

function scoreConfidenceFromMetrics(metrics, answer) {
  let score = metrics.length * 0.45 + metrics.structure * 0.35 + metrics.keywords * 0.2;

  if (countMatches(answer, OWNERSHIP_PHRASES) > 0) score += 8;
  if (/\b(\d+%|percent|increased|reduced|saved|improved)\b/i.test(answer)) score += 7;

  return clamp(score);
}

function scoreCommunicationFromMetrics(metrics) {
  return clamp(metrics.structure * 0.55 + metrics.length * 0.3 + metrics.keywords * 0.15);
}

function scoreTechnicalFromMetrics(metrics, question) {
  const typeWeight =
    question.type === "technical" ? 1 : question.type === "situational" ? 0.9 : 0.75;
  return clamp((metrics.keywords * 0.6 + metrics.length * 0.2 + metrics.structure * 0.2) * typeWeight);
}

function buildQuestionSuggestions(answer, question, metrics, scores) {
  const suggestions = [];

  if (metrics.length < 50) {
    suggestions.push("Expand your answer with more detail — aim for 1–2 minutes of spoken content.");
  }
  if (metrics.structure < 55) {
    suggestions.push("Structure answers with clear sentences and transitions (First…, Then…, As a result…).");
  }
  if (metrics.keywords < 50 && question.type === "technical") {
    suggestions.push("Include role-specific technical terms and a concrete example.");
  }
  if (scores.confidence < 65) {
    suggestions.push('Use decisive language and highlight your contributions ("I built", "I led").');
  }
  if (suggestions.length === 0) {
    suggestions.push("Strong answer — add one quantifiable outcome to stand out further.");
  }
  return suggestions.slice(0, 3);
}

function buildStrengthsWeaknesses(evaluations, role) {
  const answered = evaluations.filter((e) => e.isAnswered);
  const emptyCount = evaluations.length - answered.length;

  const strengths = [];
  const weaknesses = [];

  if (answered.length === evaluations.length) {
    strengths.push("You completed all interview questions in this session.");
  }

  if (answered.filter((e) => e.confidenceScore >= 75).length >= 3) {
    strengths.push("Confident, detailed answers with strong ownership language.");
  }
  if (answered.filter((e) => e.communicationScore >= 75).length >= 3) {
    strengths.push("Clear communication with well-structured sentences.");
  }
  if (answered.filter((e) => e.technicalScore >= 75).length >= 3) {
    strengths.push(`Solid use of ${role}-relevant technical vocabulary.`);
  }

  if (emptyCount > 0) {
    weaknesses.push(
      `${emptyCount} question${emptyCount > 1 ? "s were" : " was"} left unanswered — complete every prompt for a fair score.`,
    );
  }
  if (answered.filter((e) => e.confidenceScore < 45).length >= 2) {
    weaknesses.push("Several answers are too brief — expand with examples and outcomes.");
  }
  if (answered.filter((e) => e.communicationScore < 55).length >= 2) {
    weaknesses.push("Improve sentence structure — use STAR format and logical transitions.");
  }
  if (answered.filter((e) => e.technicalScore < 55).length >= 2) {
    weaknesses.push(`Add more ${role}-specific technical keywords to your responses.`);
  }

  if (strengths.length === 0 && answered.length > 0) {
    strengths.push("You engaged with the interview — keep practicing to sharpen your responses.");
  }
  if (weaknesses.length === 0 && answered.length > 0) {
    weaknesses.push("Fine-tune pacing and add metrics to make good answers exceptional.");
  }

  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
  };
}

function generateQuestions(role, difficulty) {
  const pool = QUESTION_BANK[role];
  const exact = pool.filter((q) => q.difficulty === difficulty);
  const fallback = pool.filter((q) => q.difficulty !== difficulty);

  const selected = [];
  const types = ["behavioral", "technical", "situational"];

  for (const type of types) {
    const match = exact.find((q) => q.type === type) ?? fallback.find((q) => q.type === type);
    if (match && !selected.includes(match)) selected.push(match);
  }

  const remaining = [...exact, ...fallback].filter((q) => !selected.includes(q));
  for (const q of remaining) {
    if (selected.length >= 5) break;
    if (!selected.includes(q)) selected.push(q);
  }

  return selected.slice(0, 5).map((q, i) => ({
    ...q,
    id: `${role}-${difficulty}-${i}`,
  }));
}

function evaluateInterview(role, difficulty, questions, answers) {
  const evaluations = questions.map((q) => {
    const answer = answers[q.id]?.trim() ?? "";
    const isAnswered = answer.length > 0;

    if (!isAnswered) {
      return {
        questionId: q.id,
        question: q.question,
        isAnswered: false,
        confidenceScore: 0,
        communicationScore: 0,
        technicalScore: 0,
        suggestions: ["Please answer this question."],
      };
    }

    const metrics = computeAnswerMetrics(answer, role, q, difficulty);
    const confidenceScore = scoreConfidenceFromMetrics(metrics, answer);
    const communicationScore = scoreCommunicationFromMetrics(metrics);
    const technicalScore = scoreTechnicalFromMetrics(metrics, q);
    const suggestions = buildQuestionSuggestions(answer, q, metrics, {
      confidence: confidenceScore,
      communication: communicationScore,
      technical: technicalScore,
    });

    return {
      questionId: q.id,
      question: q.question,
      isAnswered: true,
      confidenceScore,
      communicationScore,
      technicalScore,
      suggestions,
    };
  });

  const avg = (key) =>
    evaluations.length
      ? Math.round(evaluations.reduce((sum, e) => sum + e[key], 0) / evaluations.length)
      : 0;

  const overallInterviewScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce((sum, e) => sum + (e.confidenceScore + e.communicationScore + e.technicalScore) / 3, 0) / evaluations.length,
        )
      : 0;

  const { strengths, weaknesses } = buildStrengthsWeaknesses(evaluations, role);

  const overallSuggestions = [];
  const conf = avg("confidenceScore");
  const comm = avg("communicationScore");
  const tech = avg("technicalScore");

  if (evaluations.some((e) => !e.isAnswered)) {
    overallSuggestions.push("Answer every question — empty responses receive a score of 0.");
  }
  if (conf < 75) overallSuggestions.push("Practice speaking answers aloud to build confidence and reduce hesitation.");
  if (comm < 75) overallSuggestions.push("Use clear transitions (First…, Then…, As a result…) for better flow.");
  if (tech < 75) overallSuggestions.push(`Study ${role}-specific concepts and prepare 3 detailed project stories.`);
  if (overallSuggestions.length === 0) {
    overallSuggestions.push("Excellent session! Schedule mock interviews weekly to maintain momentum.");
  }

  return {
    role,
    difficulty,
    overallInterviewScore,
    confidenceScore: avg("confidenceScore"),
    communicationScore: avg("communicationScore"),
    technicalScore: avg("technicalScore"),
    strengths,
    weaknesses,
    evaluations,
    suggestions: overallSuggestions.slice(0, 5),
  };
}

/**
 * POST /api/interview/generate
 * Generate interview questions for a specific role and difficulty
 */
export const generateInterview = async (req, res) => {
  try {
    const { targetRole, difficulty } = req.body;

    if (!targetRole || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please provide targetRole and difficulty",
      });
    }

    if (!TARGET_ROLE_OPTIONS.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target role",
      });
    }

    if (!DIFFICULTY_OPTIONS.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const questions = generateQuestions(targetRole, difficulty);

    // Store the interview session in the database
    const interview = await Interview.create({
      userId,
      targetRole,
      difficulty,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        difficulty: q.difficulty,
        answer: "",
      })),
    });

    return res.status(200).json({
      success: true,
      message: "Interview questions generated successfully",
      data: {
        interviewId: interview._id,
        role: targetRole,
        difficulty,
        questions,
      },
    });
  } catch (error) {
    console.error("Interview generation error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error generating interview questions",
    });
  }
};

/**
 * POST /api/interview/submit
 * Submit answers and get evaluation
 */
export const submitInterview = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    if (!interviewId || !answers) {
      return res.status(400).json({
        success: false,
        message: "Please provide interviewId and answers",
      });
    }

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the interview session
    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    // Evaluate the answers
    const evaluation = evaluateInterview(
      interview.targetRole,
      interview.difficulty,
      interview.questions,
      answers
    );

    // Update the interview with answers and evaluation
    interview.questions = interview.questions.map((q) => ({
      ...q,
      answer: answers[q.id]?.trim() ?? "",
    }));
    interview.overallScore = evaluation.overallInterviewScore;
    interview.confidenceScore = evaluation.confidenceScore;
    interview.communicationScore = evaluation.communicationScore;
    interview.technicalScore = evaluation.technicalScore;
    interview.strengths = evaluation.strengths;
    interview.weaknesses = evaluation.weaknesses;
    interview.evaluations = evaluation.evaluations;
    interview.suggestions = evaluation.suggestions;

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview evaluated successfully",
      data: evaluation,
    });
  } catch (error) {
    console.error("Interview submission error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error evaluating interview",
    });
  }
};
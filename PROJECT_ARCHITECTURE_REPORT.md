# CareerOS AI — Project Architecture Overview

> **Full-stack AI-powered career development platform**  
> Helps users analyze resumes, identify skill gaps, practice interviews, generate career roadmaps, and track progress via a dashboard.

---

## Project Structure at a Glance

```
CareerOS-AI/
├── backend/          → Node.js / Express API server (MongoDB)
├── frontend/         → Next.js React web application (TypeScript)
├── docs/             → Reports, audit docs, verification docs
├── docker-compose.yml → Container orchestration
├── render.yaml       → Backend deployment config (Render)
└── .dockerignore
```

---

## 1. FRONTEND

**Tech Stack:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS  
**Entry Point:** `frontend/src/app/layout.tsx`  
**Role:** Browser-side UI — what the user sees and interacts with.

### Key Files & Their Purpose

| File / Folder | Purpose | Why It Exists | Feature |
|---|---|---|---|
| `frontend/src/app/page.tsx` | Landing/home page | Entry point for unauthenticated users | Home / Marketing |
| `frontend/src/app/layout.tsx` | Root layout with global CSS and providers | Wraps all pages with shared navigation, fonts, and auth context | App Shell |
| `frontend/src/app/globals.css` | Global Tailwind styles | Defines the app-wide visual theme | Styling |
| `frontend/src/app/login/page.tsx` | Login form | Allows users to sign in | Authentication |
| `frontend/src/app/register/page.tsx` | Registration form | Allows new users to create an account | Authentication |
| `frontend/src/app/forgot-password/page.tsx` | Forgot password form | Initiates password reset via email | Authentication |
| `frontend/src/app/reset-password/page.tsx` | Reset password form | Completes password reset with token | Authentication |
| `frontend/src/app/dashboard/Dashboard.tsx` | Main dashboard view | Shows profile, stats, recent activities, recommended actions | Dashboard |
| `frontend/src/app/resume/ResumeAnalyzer.tsx` | Resume upload & analysis UI | User pastes resume text and gets ATS scoring | Resume Analysis (AI) |
| `frontend/src/app/resume/ResumeAnalysisResults.tsx` | Resume results display | Shows ATS score, section scores, missing skills, suggestions | Resume Analysis (AI) |
| `frontend/src/app/skill-gap/SkillGapAnalyzer.tsx` | Skill gap analysis form | User enters current skills and target role | Skill Gap (AI) |
| `frontend/src/app/skill-gap/SkillGapResults.tsx` | Skill gap results display | Shows match %, missing skills, learning plan | Skill Gap (AI) |
| `frontend/src/app/interview/InterviewCoach.tsx` | Mock interview coach | Conducts a simulated interview with AI-generated questions | Interview Coach (AI) |
| `frontend/src/app/roadmap/page.tsx` | Career roadmap generator | User picks target role and current status to get a learning plan | Roadmap (AI) |
| `frontend/src/contexts/AuthContext.tsx` | React context for auth state | Provides `user`, `login`, `logout`, `loading` state to all components | Authentication |
| `frontend/src/lib/auth.ts` | Auth API client + localStorage helpers | Handles login, register, forgot/reset password API calls + token management | Authentication |
| `frontend/src/lib/dashboard-api.ts` | Dashboard API client | Fetches profile, stats, activities from backend | Dashboard |
| `frontend/src/lib/resume-api.ts` | Resume API client | Sends resume text for analysis, gets history | Resume Analysis (AI) |
| `frontend/src/lib/skill-gap-api` (via `analyze-skill-gap.ts`) | Skill gap analyzer logic | Defines role options, skill matching, analysis types | Skill Gap (AI) |
| `frontend/src/lib/interview-api.ts` | Interview API client | Generates questions, submits answers | Interview Coach (AI) |
| `frontend/src/lib/interview-coach.ts` | Interview coach types & logic | Defines question types, difficulty, scoring types | Interview Coach (AI) |
| `frontend/src/lib/roadmap-api.ts` | Roadmap API client | Sends generate request to backend | Roadmap (AI) |
| `frontend/src/lib/analyze-resume.ts` | Resume parsing types | Defines types for ATS scores, sections, strengths/weaknesses | Resume Analysis (AI) |
| `frontend/src/lib/extract-pdf-text.ts` | PDF text extraction utility | Extracts text from uploaded PDF resumes | Resume Analysis (AI) |
| `frontend/src/lib/generate-roadmap.ts` | Roadmap data types | Defines RoadmapPhase, CareerRoadmap, role types | Roadmap (AI) |
| `frontend/next.config.ts` | Next.js configuration | Sets build options, image domains, etc. | Build / Config |
| `frontend/tsconfig.json` | TypeScript config | Type-checking rules | Build / Config |
| `frontend/package.json` | Node dependencies | Lists all React, Next.js, utility packages | Build / Config |
| `frontend/vercel.json` | Vercel deployment config | Routes, headers, rewrites for production | Deployment |
| `frontend/Dockerfile` | Docker image definition | Containerizes the frontend for deployment | Deployment |
| `frontend/postcss.config.mjs` | PostCSS config for Tailwind | Processes CSS with Tailwind plugin | Build / Config |

---

## 2. BACKEND

**Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Nodemailer  
**Entry Point:** `backend/server.js`  
**Role:** REST API server — handles authentication, CRUD, and AI logic.

### 2a. Server & Configuration

| File | Purpose | Why It Exists | Category |
|---|---|---|---|
| `backend/server.js` | Express app initialization | Starts the HTTP server, connects MongoDB, mounts routes & middleware | Core Server |
| `backend/package.json` | Node dependencies | Lists Express, Mongoose, JWT, bcrypt, etc. | Build / Config |
| `backend/config/db.js` | MongoDB connection logic | Connects to MongoDB Atlas or local instance | Database |
| `backend/config/email.js` | Nodemailer transporter config | Configures email sending for password reset | Authentication |

### 2b. Routes (API Endpoints)

| File | Purpose | Why It Exists | Category |
|---|---|---|---|
| `backend/routes/authRoutes.js` | Auth API routes | Maps `/api/auth/login`, `/register`, `/forgot-password`, `/reset-password` | Authentication |
| `backend/routes/dashboardRoutes.js` | Dashboard API routes | Maps `/api/dashboard`, `/api/dashboard/profile`, `/api/dashboard/stats` | Dashboard |
| `backend/routes/resumeRoutes.js` | Resume API routes | Maps `/api/resume/analyze`, `/api/resume`, `/api/resume/history` | Resume Analysis (AI) |
| `backend/routes/skillGapRoutes.js` | Skill gap API routes | Maps `/api/skill-gap/analyze` | Skill Gap (AI) |
| `backend/routes/interviewRoutes.js` | Interview API routes | Maps `/api/interview/generate`, `/api/interview/submit` | Interview Coach (AI) |
| `backend/routes/roadmapRoutes.js` | Roadmap API routes | Maps `/api/roadmap/generate` | Roadmap (AI) |

### 2c. Controllers (Business Logic)

| File | Purpose | Why It Exists | Category |
|---|---|---|---|
| `backend/controllers/authController.js` | Auth logic | Handles login, register, forgot/reset password | Authentication |
| `backend/controllers/dashboardController.js` | Dashboard logic | Fetches/updates profile, stats, recent activities | Dashboard |
| `backend/controllers/resumeController.js` | Resume analysis logic | Stores resume data, returns ATS scores & feedback | Resume Analysis (AI) |
| `backend/controllers/skillGapController.js` | Skill gap logic | Compares user skills to role requirements | Skill Gap (AI) |
| `backend/controllers/interviewController.js` | Interview logic | Generates questions, scores answers | Interview Coach (AI) |
| `backend/controllers/roadmapController.js` | Roadmap logic | Generates step-by-step career learning plans | Roadmap (AI) |

### 2d. Models (Database Schemas)

| File | Purpose | Why It Exists | Category |
|---|---|---|---|
| `backend/models/User.js` | User model (email, password, name) | Stores user credentials (hashed password) | Authentication / Database |
| `backend/models/UserProfile.js` | Profile model (name, goal, target role) | Stores user's career preferences and profile info | Database |
| `backend/models/UserStats.js` | Stats model (ATS, skill match, interview, roadmap %) | Tracks aggregated scores across all features | Database |
| `backend/models/Resume.js` | Resume model (ATS scores, skills, suggestions) | Persists resume analysis history per user | Database |
| `backend/models/SkillGap.js` | Skill gap model (match %, missing skills) | Persists skill gap analysis results per user | Database |
| `backend/models/Interview.js` | Interview model (questions, scores, evaluations) | Persists interview sessions and results per user | Database |
| `backend/models/Roadmap.js` | Roadmap model (phases, timeline, skills) | Persists generated roadmaps per user | Database |

### 2e. Middleware

| File | Purpose | Why It Exists | Category |
|---|---|---|---|
| `backend/middleware/authMiddleware.js` | JWT verification middleware | Protects all authenticated routes by verifying Bearer token | Authentication / Security |

### 2f. Tests

| File | Purpose | Why It Exists | Category |
|---|---|---|---|
| `backend/tests/forgotPassword.test.js` | Jest test for forgot/reset password flow | Ensures password reset works end-to-end | Testing / Authentication |

---

## 3. DATABASE

**Tech Stack:** MongoDB (via Mongoose ODM)  
**Connection:** `backend/config/db.js` → Atlas or local instance  
**Models (collections):** `User`, `UserProfile`, `UserStats`, `Resume`, `SkillGap`, `Interview`, `Roadmap`

| Model | Stores | Linked To Feature |
|---|---|---|
| `User` | Email, hashed password, name | Authentication |
| `UserProfile` | Career goal, target role, current status | Dashboard |
| `UserStats` | ATS score %, skill match %, interview score %, roadmap progress % | Dashboard |
| `Resume` | Resume text, ATS scores, found/missing skills, suggestions | Resume Analysis |
| `SkillGap` | Target role, match %, missing skills, learning resources | Skill Gap Analysis |
| `Interview` | Questions, answers, scores, evaluations | Interview Coach |
| `Roadmap` | Phases, timeline, projects, skills to learn | Roadmap Generator |

**Key relationship:** Every document is linked to a user via `userId` (ObjectId reference to `User`).

---

## 4. AUTHENTICATION

**Flow:** JWT-based token authentication with password hashing (bcrypt).

| Component | Purpose |
|---|---|
| `backend/models/User.js` | Stores user with bcrypt-hashed password |
| `backend/controllers/authController.js` | Handles login (returns JWT), register (creates user), forgot/reset password |
| `backend/middleware/authMiddleware.js` | Verifies JWT on every protected request, attaches `userId` to `req` |
| `frontend/src/contexts/AuthContext.tsx` | React context that provides `user` state, login/logout/register functions |
| `frontend/src/lib/auth.ts` | API client for auth endpoints + localStorage token/user storage |
| `backend/config/email.js` | Nodemailer for sending password reset emails |
| `frontend/src/app/login/page.tsx` | Login form UI |
| `frontend/src/app/register/page.tsx` | Registration form UI |
| `frontend/src/app/forgot-password/page.tsx` | Email input to trigger reset |
| `frontend/src/app/reset-password/page.tsx` | New password form with token from email |

---

## 5. AI FEATURES

The platform provides four AI-powered career tools. Each follows the same pattern:  
**Frontend component** → **Lib API client** → **Backend route** → **Backend controller** → **MongoDB model**

| Feature | Frontend Component | API Client | Backend Route | Controller | Model |
|---|---|---|---|---|---|
| Resume Analysis | `ResumeAnalyzer.tsx` + `ResumeAnalysisResults.tsx` | `resume-api.ts` | `/api/resume/analyze` | `resumeController.js` | `Resume` |
| Skill Gap Analysis | `SkillGapAnalyzer.tsx` + `SkillGapResults.tsx` | (inline fetch) | `/api/skill-gap/analyze` | `skillGapController.js` | `SkillGap` |
| Interview Coach | `InterviewCoach.tsx` | `interview-api.ts` | `/api/interview/generate` + `/submit` | `interviewController.js` | `Interview` |
| Career Roadmap | `roadmap/page.tsx` | `roadmap-api.ts` | `/api/roadmap/generate` | `roadmapController.js` | `Roadmap` |

---

## 6. DASHBOARD

The dashboard consolidates data from all AI features.

| Component | Purpose |
|---|---|
| `frontend/src/app/dashboard/Dashboard.tsx` | Main dashboard page — shows profile, stats cards, recent activity feed, recommended next actions |
| `frontend/src/lib/dashboard-api.ts` | Fetches dashboard data, updates profile/stats |
| `backend/controllers/dashboardController.js` | Aggregates profile + stats + recent interviews/skill-gaps/roadmaps |
| `backend/models/UserProfile.js` | Stores user's display name and career goal |
| `backend/models/UserStats.js` | Stores aggregated scores (ATS, skill match, interview, roadmap progress) |
| `backend/routes/dashboardRoutes.js` | Routes for GET dashboard, PUT profile, PUT stats |

---

## 7. DEPLOYMENT

| File | Platform | Purpose |
|---|---|---|
| `frontend/Dockerfile` | Container | Builds Next.js app into a production Node image |
| `backend/Dockerfile` | Container | Builds Express server into a production Node image |
| `docker-compose.yml` | Local / Server | Orchestrates frontend + backend + MongoDB containers together |
| `render.yaml` | Render (PaaS) | Declarative config for deploying backend on Render (service type, env vars, build command) |
| `frontend/vercel.json` | Vercel | Configures frontend deployment on Vercel (framework preset, rewrites, headers) |
| `backend/.env.example` | Any | Template for required environment variables |
| `backend/.env` | Local | Actual environment variables (git-ignored) |

**Deployment architecture:**  
- Frontend → **Vercel** (static + serverless Next.js)  
- Backend → **Render** (Node.js web service)  
- Database → **MongoDB Atlas** (cloud-hosted)

---

## 8. SECURITY

| Measure | Where Implemented | Purpose |
|---|---|---|
| JWT authentication | `authMiddleware.js`, `auth.ts` | Protects all API endpoints from unauthenticated access |
| Password hashing (bcrypt) | `User.js` model (pre-save hook) | Plaintext passwords never stored |
| Password reset tokens | `authController.js` + `User.js` (resetToken, resetExpires) | Secure time-limited password reset via email |
| Bearer token in requests | All frontend API clients | Every API call after login includes `Authorization: Bearer <token>` |
| Auth context logout | `AuthContext.tsx` | Clears token on logout, redirects to login |
| `.env` for secrets | `backend/.env` (git-ignored) | JWT secret, DB URI, email credentials never committed |
| Input validation | Mongoose schemas (`required`, `enum`, `min`, `max`) | Prevents malformed data in database |

---

## 9. DOCUMENTATION (docs/)

| File | Topic |
|---|---|
| `PROJECT_ANALYSIS_REPORT.md` | Original codebase analysis and findings |
| `PROJECT_ARCHITECTURE_REPORT.md` | **This file** — high-level architecture overview |
| `MIGRATION_PLAN.md` | Plan for migrating from mock/local data to real backend |
| `MIGRATION_REPORT.md` | Report on migration progress and results |
| `FINAL_AUDIT_REPORT.md` | Final audit of the complete codebase |
| `SECURITY_REPORT.md` | Security audit findings |
| `DASHBOARD_PERSISTENCE_VERIFICATION.md` | Verification that dashboard data persists correctly |
| `FORGOT_PASSWORD_REPORT.md` | Forgot password feature analysis and testing results |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment instructions |

---

## Data Flow Summary (How a Feature Works)

```
User Clicks Button
    │
    ▼
Frontend Component (e.g. SkillGapAnalyzer.tsx)
    │  Shows UI, captures input
    ▼
Lib API Client (e.g. inline fetch, or lib/roadmap-api.ts)
    │  Builds HTTP request with auth token
    ▼
Backend Route (e.g. /api/skill-gap/analyze)
    │  Express router → calls controller
    ▼
authMiddleware
    │  Verifies JWT → attaches userId to req
    ▼
Controller (e.g. skillGapController.js)
    │  Business logic (compute match, generate plan)
    ▼
Mongoose Model (e.g. SkillGap.js)
    │  Reads/Writes to MongoDB
    ▼
Response flows back: Controller → Route → Frontend → Component
```

## Interview Summary (One-Liners)

| If asked about... | Say... |
|---|---|
| **Architecture** | Full-stack MERN (MongoDB, Express, React/Next.js, Node) with JWT auth |
| **Frontend** | Next.js 14 App Router with TypeScript, Tailwind CSS, deployed on Vercel |
| **Backend** | Express REST API with Mongoose ODM, deployed on Render |
| **Database** | MongoDB Atlas with 7 collections (User, Profile, Stats, Resume, SkillGap, Interview, Roadmap) |
| **Auth** | JWT-based with bcrypt password hashing, forgot/reset via Nodemailer |
| **AI Features** | 4 tools: Resume ATS analysis, Skill Gap analysis, Mock Interview Coach, Career Roadmap generator |
| **Dashboard** | Aggregates data from all 4 AI features into one profile + stats + activity feed view |
| **Deployment** | Frontend on Vercel, backend on Render, database on MongoDB Atlas, orchestrated with Docker |
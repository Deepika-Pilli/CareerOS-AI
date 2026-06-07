# CareerOS-AI Migration Report
**Date:** June 7, 2026  
**Scope:** Full analysis of frontend lib ↔ backend controller duplication, plus safe removal of one duplicate module.

---

## 1. Analysis Results: All Frontend Lib Files vs Backend Controllers

### 1.1 Massive Duplicate Logic (Frontend ↔ Backend)

Every analysis/generation library on the frontend has an **identical copy** on the backend:

| # | Frontend (`src/lib/`) | Backend (`controllers/`) | Lines Duplicated | Type |
|---|----------------------|------------------------|-----------------|------|
| 1 | `analyze-resume.ts` | `resumeController.js` (lines 8-218) | ~210 | ATS scoring algorithm, skill detection, insights builder |
| 2 | `analyze-skill-gap.ts` | `skillGapController.js` (lines 4-154) | ~150 | Role skill data, matching algorithm, duration formatting |
| 3 | `generate-roadmap.ts` | `roadmapController.js` (lines 4-334) | ~330 | Role templates (5 roles), timeline formatting |
| 4 | `interview-coach.ts` | `interviewController.js` (lines 4-368) | ~365 | Question bank, scoring functions, evaluation logic |

**> 1,000 lines of code duplicated across the stack.** This creates a significant maintenance burden — any fix to analysis logic must be applied in both places.

### 1.2 Duplicate Logic: Frontend ↔ Frontend

| Files | What's Duplicated | Status |
|-------|------------------|--------|
| `dashboard-api.ts` ↔ `dashboard-storage.ts` | **Identical types** (`DashboardProfile`, `DashboardStats`, `DashboardData`), **identical function signatures** (`getDashboardData`, `updateProfile`, `updateStats`) | **✅ Removed `dashboard-storage.ts`** |

### 1.3 Deprecated / Mock-Data Files

| File | Status | Reason | Replacement |
|------|--------|--------|-------------|
| `dashboard-storage.ts` | **✅ Removed** | localStorage-based. All CRUD should go through backend API. | `dashboard-api.ts` |
| `analyze-resume.ts` | **Deprecated** | Client-side ATS analysis duplicates backend. Frontend already has `resume-api.ts`. | `resume-api.ts` |
| `analyze-skill-gap.ts` | **Deprecated** | No API client exists yet — frontend calls this directly. | Create `skill-gap-api.ts` |
| `generate-roadmap.ts` | **Deprecated** | `roadmap-api.ts` exists but may not be used by components. | `roadmap-api.ts` |
| `interview-coach.ts` | **Deprecated** | `interview-api.ts` exists and IS used by components. | `interview-api.ts` |

---

## 2. Phase 1 Executed: Remove `dashboard-storage.ts` ✅

**Files modified:**
- `frontend/src/lib/dashboard-api.ts` — Added utility functions (`formatActivityTime`, `formatActivityTimestamp`, `getRecommendedActions`, `ACTIVITY_TITLES`) from `dashboard-storage.ts`
- `frontend/src/app/dashboard/Dashboard.tsx` — Updated imports to use `dashboard-api.ts` only
- `frontend/src/app/interview/InterviewCoach.tsx` — Removed `syncInterviewCompletion` import and call (backend already persists interview scores)

**Files deleted:**
- `frontend/src/lib/dashboard-storage.ts` — **256 lines removed**

**Build verification:** ✅ Frontend compiled successfully with all 12 pages.

**What was consolidated into `dashboard-api.ts`:**
- `ACTIVITY_TITLES` constant
- `formatActivityTime()` — relative time formatting
- `formatActivityTimestamp()` — absolute date/time formatting
- `getRecommendedActions()` — generates action recommendations based on stats

**What was removed (no longer needed):**
- `syncResumeAnalysis()` — backend saves this automatically
- `syncSkillGapAnalysis()` — backend saves this automatically
- `syncInterviewCompletion()` — backend saves this automatically
- `syncRoadmapGeneration()` — backend saves this automatically
- `updateStats()` (localStorage version) — use API version instead
- `updateProfile()` (localStorage version) — use API version instead
- `DASHBOARD_STORAGE_KEY`, `DASHBOARD_UPDATED_EVENT` constants
- All localStorage read/write logic

---

## 3. Migration Plan for Remaining Items

### Phase 2 (Frontend-Only Refactors)
1. **Update `SkillGapAnalyzer.tsx`** → call `POST /api/skill-gap/analyze` via new `skill-gap-api.ts`
2. **Update `RoadmapGenerator.tsx`** → use `roadmap-api.ts` instead of `generate-roadmap.ts`
3. **Update `ResumeAnalyzer.tsx`** → use `resume-api.ts` instead of `analyze-resume.ts`

### Phase 3 (Backend Consolidation - High Risk)
4. **Extract shared algorithms** into a shared package (e.g., `shared/`) that both frontend and backend can import
5. **Remove deprecated lib files**: `analyze-resume.ts`, `analyze-skill-gap.ts`, `generate-roadmap.ts`, `interview-coach.ts`

---

## 4. Key Files and Their Purpose

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/lib/auth.ts` | Auth API client + token storage | ✅ Active |
| `frontend/src/lib/dashboard-api.ts` | Dashboard API client + utility functions | ✅ Active (consolidated) |
| `frontend/src/lib/resume-api.ts` | Resume API client | ✅ Active |
| `frontend/src/lib/roadmap-api.ts` | Roadmap API client | ✅ Active |
| `frontend/src/lib/interview-api.ts` | Interview API client | ✅ Active |
| `frontend/src/lib/analyze-resume.ts` | Client-side ATS analysis (duplicate) | ⏳ Deprecated |
| `frontend/src/lib/analyze-skill-gap.ts` | Client-side skill gap analysis (duplicate) | ⏳ Deprecated |
| `frontend/src/lib/generate-roadmap.ts` | Client-side roadmap generation (duplicate) | ⏳ Deprecated |
| `frontend/src/lib/interview-coach.ts` | Client-side interview evaluation (duplicate) | ⏳ Deprecated |
| `frontend/src/lib/dashboard-storage.ts` | localStorage-based dashboard (removed) | ✅ Deleted |
| `frontend/src/lib/extract-pdf-text.ts` | PDF text extraction | ✅ Active (no backend equivalent) |
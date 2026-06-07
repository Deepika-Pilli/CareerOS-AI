# CareerOS-AI Migration Plan

## Analysis Summary

### 1. Duplicate Logic: Frontend ↔ Backend (Massive Code Duplication)

| File Pair | Duplication Type | Lines Duplicated | Risk |
|-----------|-----------------|------------------|------|
| `frontend/src/lib/analyze-resume.ts` ↔ `backend/controllers/resumeController.js` (lines 8-218) | **Identical analysis algorithms**: `TRACKED_SKILLS`, `SKILL_PATTERNS`, `SECTION_KEYWORDS`, `ACTION_VERBS`, all scoring functions, `buildInsights` | ~210 lines each | ⚠️ Drift risk: fixes must be applied to both files |
| `frontend/src/lib/analyze-skill-gap.ts` ↔ `backend/controllers/skillGapController.js` (lines 4-154) | **Identical analysis**: `ROLE_SKILLS` data, `parseCurrentSkills`, `skillMatches`, `findMatch`, `performSkillGapAnalysis` | ~150 lines each | ⚠️ Drift risk |
| `frontend/src/lib/generate-roadmap.ts` ↔ `backend/controllers/roadmapController.js` (lines 4-334) | **Identical templates**: `ROLE_TEMPLATES` with all 5 roles, `formatTimeline`, `performRoadmapGeneration` | ~330 lines each | ⚠️ Drift risk |
| `frontend/src/lib/interview-coach.ts` ↔ `backend/controllers/interviewController.js` (lines 4-368) | **Identical logic**: `QUESTION_BANK`, `ROLE_KEYWORDS`, `STRUCTURE_WORDS`, `OWNERSHIP_PHRASES`, all scoring functions | ~365 lines each | ⚠️ Drift risk |

### 2. Duplicate Logic: Frontend ↔ Frontend

| Files | Duplication | Impact |
|-------|------------|--------|
| `frontend/src/lib/dashboard-api.ts` ↔ `frontend/src/lib/dashboard-storage.ts` | **Identical types** (`DashboardProfile`, `DashboardStats`, `DashboardData`, `DashboardActivity`, `ActivityType`), **identical function signatures** (`getDashboardData`, `updateProfile`, `updateStats`). One calls API, the other uses localStorage. | **HIGH** - Both imported in `Dashboard.tsx` |

### 3. Deprecated Files

| File | Reason | Replacement |
|------|--------|-------------|
| **`frontend/src/lib/dashboard-storage.ts`** | All data management should go through backend API. The API-driven `dashboard-api.ts` already covers all CRUD operations. | `dashboard-api.ts` |
| **`frontend/src/lib/analyze-resume.ts`** | Client-side analysis is duplicated on backend. Frontend should call `resume-api.ts` instead. | `resume-api.ts` |
| **`frontend/src/lib/analyze-skill-gap.ts`** | Client-side analysis. Backend has `skillGapController.js`. No API client exists yet. | Create `skill-gap-api.ts` |
| **`frontend/src/lib/generate-roadmap.ts`** | Client-side generation. Backend has `roadmapController.js`. *Note: `roadmap-api.ts` already exists but may not be used.* | `roadmap-api.ts` |
| **`frontend/src/lib/interview-coach.ts`** | Client-side evaluation. Backend has `interviewController.js`. *Note: `interview-api.ts` already exists and is used.* | `interview-api.ts` |

### 4. Functions That Should Be Replaced by Backend APIs

| Frontend Module | Functions | Backend Endpoint | Migration Priority |
|----------------|-----------|-----------------|-------------------|
| `analyze-resume.ts` | `analyzeResume()`, `analyzeResumeWithDelay()` | `POST /api/resume/analyze` | **P1** - Already has `resume-api.ts` client |
| `analyze-skill-gap.ts` | `analyzeSkillGap()`, `analyzeSkillGapWithDelay()` | `POST /api/skill-gap/analyze` | **P1** - Needs new API client |
| `generate-roadmap.ts` | `generateRoadmap()`, `generateRoadmapWithDelay()` | `POST /api/roadmap/generate` | **P1** - `roadmap-api.ts` exists |
| `interview-coach.ts` | `generateQuestions()`, `evaluateInterview()`, `*WithDelay()` | `POST /api/interview/generate`, `POST /api/interview/submit` | **P1** - `interview-api.ts` exists |
| `dashboard-storage.ts` | `syncResumeAnalysis()`, `syncSkillGapAnalysis()`, `syncInterviewCompletion()`, `syncRoadmapGeneration()`, `getRecommendedActions()`, utility formatters | `PUT /api/dashboard/stats`, activity endpoints | **P2** - Utility functions (formatters, `getRecommendedActions`) should be preserved |

## Migration Steps (Prioritized)

### Phase 1 (Immediate - Safe Refactor)
1. **✅ Remove `dashboard-storage.ts`** by:
   - Moving utility functions (`formatActivityTime`, `formatActivityTimestamp`, `getRecommendedActions`) into `dashboard-api.ts`
   - Removing the `sync*` functions (these duplicate backend functionality)
   - Updating `Dashboard.tsx` to import everything from `dashboard-api.ts`

### Phase 2 (Frontend-Only Refactors)
2. **Update `SkillGapAnalyzer.tsx`** to call backend API instead of `analyzeSkillGap()`
   - Create `frontend/src/lib/skill-gap-api.ts`
   - Remove direct calls to `analyze-skill-gap.ts`

3. **Update `RoadmapGenerator.tsx`** to use `roadmap-api.ts` instead of `generate-roadmap.ts`

4. **Update `ResumeAnalyzer.tsx`** to use `resume-api.ts` instead of `analyze-resume.ts`

### Phase 3 (Backend Consolidation - High Risk)
5. **Extract shared libraries** from backend controllers into a shared package to eliminate the frontend↔backend duplication
6. **Remove deprecated frontend lib files** once all consumers are migrated

## Currently Executing: Phase 1

We are safely removing `dashboard-storage.ts` and consolidating its unique functionality into `dashboard-api.ts`.
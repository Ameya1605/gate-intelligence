# GATE Intelligence Platform

A **modular, plug-and-play analytics platform** for GATE 2026 Computer Science preparation. Built with a feature-module architecture where entire capabilities can be added or removed by deleting a single folder.

---

## Architecture Overview

```
gate-intelligence/
├── apps/
│   ├── client/               # React + Vite + TypeScript + TailwindCSS
│   └── server/               # Node.js + Express + TypeScript
├── packages/
│   ├── shared-types/         # Domain interfaces (no framework deps)
│   ├── analytics-engine/     # Pure functions — no Express, no MongoDB
│   ├── ui-components/        # (extensible)
│   └── config/               # (extensible)
└── docs/
```

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| Feature-based architecture | Each feature lives in one folder; delete it to remove the feature |
| Separation of concerns | Controller → HTTP only. Service → business logic. Model → DB schema |
| Analytics isolation | `@gate/analytics-engine` has zero Express/MongoDB dependencies — pure functions |
| Plugin-style features | `featureRegistry` and `widgetRegistry` auto-register/deregister features |
| Config-driven | `apps/server/src/config/features.ts` toggles entire features |
| UI consumes APIs only | No fetch calls inside React components — all in `api.ts` per feature |

---

## Tech Stack

**Frontend:** React 18 · Vite · TypeScript · TailwindCSS · React Query · Recharts  
**Backend:** Node.js · Express · TypeScript · Zod validation  
**Database:** MongoDB · Mongoose  
**Packages:** `@gate/shared-types` · `@gate/analytics-engine`

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or provide a URI)

### 1. Clone & Install

```bash
git clone <repo>
cd gate-intelligence
npm install
```

### 2. Configure Server

```bash
cp apps/server/.env.example apps/server/.env
# Edit MONGO_URI if needed
```

### 3. Run Dev Servers

```bash
npm run dev
# Client → http://localhost:5173
# Server → http://localhost:4000
```

---

## Feature Modules

### Backend Modules (`apps/server/src/modules/`)

Each module follows a strict 5-file pattern:

```
study/
├── study.controller.ts   # HTTP layer — validates input, calls service, sends response
├── study.service.ts      # Business logic — all data operations
├── study.model.ts        # Mongoose schema — no route dependencies
├── study.routes.ts       # Route registration — delete this file to kill API
└── study.types.ts        # Zod schemas + TypeScript types
```

**Active modules:**

| Module | Prefix | Description |
|--------|--------|-------------|
| `study` | `/api/study` | Session tracking, heatmaps |
| `mocks` | `/api/mocks` | Mock test management |
| `analytics` | `/api/analytics` | Readiness, accuracy, insights |
| `lifestyle` | `/api/lifestyle` | Sleep, mood, wellness logs |
| `users` | `/api/users` | User management |

### Enabling/Disabling Features

Edit `apps/server/src/config/features.ts`:

```typescript
export const FEATURE_CONFIG: FeatureConfig[] = [
  { name: 'STUDY',     enabled: true,  apiPrefix: '/api/study' },
  { name: 'MOCKS',     enabled: true,  apiPrefix: '/api/mocks' },
  { name: 'LIFESTYLE', enabled: false, apiPrefix: '/api/lifestyle' }, // ← disabled
  // ...
];
```

Routes are dynamically imported at startup — disabled features are never loaded.

### Frontend Feature Registry

```typescript
import { enableFeature, disableFeature } from '@/app/featureRegistry';

enableFeature('MOCKS');    // Shows Mocks nav link + enables /mocks route
disableFeature('LIFESTYLE'); // Hides from nav, redirects /lifestyle → /
```

---

## Analytics Engine (`packages/analytics-engine/`)

The analytics engine is a **pure TypeScript package** with zero framework dependencies.

```
analytics-engine/src/
├── metrics/
│   ├── accuracy.ts        # computeAccuracyMetrics(), computeSubjectAccuracy()
│   ├── effortScore.ts     # buildEffortScore(), computeConsistencyScore()
│   └── productivity.ts    # buildProductivityMetrics(), computeStudyEfficiency()
├── mockMetrics/           # computeAverageScore(), computeScoreTrend()
├── readiness/             # buildReadinessScore() → GATE AIR prediction
└── insights/              # generateInsights() → actionable recommendations
```

**Usage (server analytics.service.ts):**

```typescript
import { buildReadinessScore, generateInsights } from '@gate/analytics-engine';

const sessions = await studyService.getAllForUser(userId);
const mocks    = await mocksService.getAllForUser(userId);

const readiness = buildReadinessScore(sessions, mocks);
// → { overall: 72, gate_prediction: "AIR 500–1500", weakAreas: [...] }

const insights = generateInsights(sessions, mocks);
// → [{ type: 'warning', message: '...', priority: 'high' }]
```

This package can be imported by an ML service, a CLI script, or a test suite — with no server running.

---

## Dashboard Widget System

Widgets are registered at startup and rendered dynamically:

```typescript
// widgets/index.ts — add/remove imports here
registerWidget({
  id: 'study-heatmap',
  component: StudyHeatmapWidget,
  feature: 'STUDY',     // only shown if STUDY is enabled
  size: 'xl',
  order: 1,
});
```

**To remove a widget from the dashboard:** delete its file and remove its `registerWidget()` call. No other code changes needed.

---

## API Reference

### Study Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/study` | Log a study session |
| `GET` | `/api/study` | List sessions (paginated) |
| `GET` | `/api/study/heatmap` | Activity heatmap data (365 days) |
| `GET` | `/api/study/:id` | Get single session |
| `PATCH` | `/api/study/:id` | Update session |
| `DELETE` | `/api/study/:id` | Delete session |

**POST /api/study body:**
```json
{
  "subject": "Algorithms",
  "topic": "Dijkstra's Algorithm",
  "durationMinutes": 90,
  "sessionType": "practice",
  "questionsAttempted": 20,
  "questionsCorrect": 15,
  "date": "2025-12-01"
}
```

### Mock Tests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/mocks` | Record a mock test |
| `GET` | `/api/mocks` | List tests (paginated) |
| `GET` | `/api/mocks/:id` | Get single test |
| `DELETE` | `/api/mocks/:id` | Delete test |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/dashboard` | Full dashboard (all metrics in one call) |
| `GET` | `/api/analytics/accuracy` | Subject-wise accuracy + trend |
| `GET` | `/api/analytics/effort` | Effort scores (daily/weekly/monthly) |
| `GET` | `/api/analytics/productivity` | Study efficiency + distribution |
| `GET` | `/api/analytics/readiness` | GATE readiness score + AIR prediction |
| `GET` | `/api/analytics/insights` | AI-generated insights |

### Health Check

```bash
GET /health
# → { "status": "ok", "features": [{ "name": "STUDY", "enabled": true }, ...] }
```

---

## Frontend Structure

```
src/
├── app/
│   ├── featureRegistry.ts    # enableFeature() / disableFeature()
│   ├── providers.tsx          # React Query setup
│   └── router.tsx             # Feature-gated routes
│
├── features/                  # Mirrors backend modules
│   ├── study/
│   │   ├── api.ts             # All fetch calls (no fetch in components)
│   │   ├── hooks/useStudy.ts  # React Query hooks
│   │   ├── components/        # Pure UI — receives props, emits events
│   │   └── pages/             # Layout containers only
│   ├── mocks/
│   ├── analytics/
│   └── dashboard/
│       ├── widgetRegistry.ts  # Plugin engine for widgets
│       └── widgets/           # Self-contained widget components
│
├── shared/
│   ├── components/
│   │   ├── Layout.tsx         # Sidebar navigation
│   │   └── ui.tsx             # Card, StatCard, Badge, Spinner, etc.
│   └── utils/apiClient.ts     # Axios instance + typed helpers
│
└── styles/globals.css         # Design tokens + Tailwind base
```

### Data Flow

```
Page (layout only)
  └── Hook (useStudySessions)
        └── React Query
              └── api.ts (studyApi.getSessions)
                    └── apiClient (axios)
                          └── Express API
                                └── Controller (HTTP only)
                                      └── Service (business logic)
                                            └── Model (Mongoose)
```

---

## GATE Subjects Tracked

- Engineering Mathematics (15% weightage)
- General Aptitude (15% weightage)
- Data Structures · Algorithms (10% each)
- Computer Networks · Operating Systems (8% each)
- DBMS · Computer Organization · TOC · Compiler Design (7% each)
- Digital Logic (6% weightage)

Readiness scoring uses these exact GATE CS weightages.

---

## Adding a New Feature Module

### Backend

1. Create `apps/server/src/modules/myfeature/`
2. Add these files:
   - `myfeature.model.ts` — Mongoose schema
   - `myfeature.types.ts` — Zod validators
   - `myfeature.service.ts` — business logic class
   - `myfeature.controller.ts` — HTTP adapter
   - `myfeature.routes.ts` — `export default router`
3. Add to `apps/server/src/config/features.ts`:
   ```typescript
   { name: 'MYFEATURE', enabled: true, apiPrefix: '/api/myfeature', description: '...' }
   ```

### Frontend

1. Create `apps/client/src/features/myfeature/`
2. Add: `api.ts` · `hooks/useMyFeature.ts` · `components/` · `pages/MyFeaturePage.tsx`
3. Register route in `apps/client/src/app/router.tsx`
4. Add nav link in `apps/client/src/shared/components/Layout.tsx`
5. Register widget in `apps/client/src/features/dashboard/widgets/index.ts`

### Removing a Feature

1. Delete `apps/server/src/modules/myfeature/` (entire folder)
2. Set `enabled: false` in `features.ts`
3. Delete `apps/client/src/features/myfeature/` (entire folder)
4. Remove widget import from `widgets/index.ts`

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0A0B0F` | Page background |
| `--surface` | `#12141A` | Sidebar, panels |
| `--card` | `#1A1D26` | Card backgrounds |
| `--primary` | `#6C63FF` | Main accent, CTAs |
| `--accent` | `#00D4AA` | Success, strengths |
| `--warn` | `#FF6B6B` | Errors, weak areas |
| `--gold` | `#FFD166` | Highlights, warnings |

Typography: **Syne** (display/headings) · **DM Sans** (body) · **JetBrains Mono** (data/code)

---

## Testing Philosophy

Services are testable without starting the server:

```typescript
// Pure unit test — no HTTP, no DB needed
import { buildReadinessScore } from '@gate/analytics-engine';

const sessions = [/* mock data */];
const mocks    = [/* mock data */];
const result   = buildReadinessScore(sessions, mocks);

expect(result.overall).toBeGreaterThan(0);
expect(result.gate_prediction).toMatch(/AIR/);
```

All business logic lives in services and the analytics-engine package — both are testable in isolation.

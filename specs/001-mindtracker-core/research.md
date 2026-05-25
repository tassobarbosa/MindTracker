# Research: MindTracker Core App

**Phase 0 — Implementation Research**
**Branch**: `001-mindtracker-core` | **Date**: 2026-05-25

All items below were driven by the Technical Context unknowns and the library survey mandate in Constitution Principle II.

---

## 1. Storage: IndexedDB via Dexie.js

**Decision**: Dexie.js (`^4.x`) as the typed IndexedDB wrapper.

**Rationale**:
- Dexie 4 ships with full TypeScript generics — the schema and query results are typed end-to-end with no type assertions needed (satisfies Principle III).
- IndexedDB is the only browser-native storage mechanism that supports structured data at the scale required (≥730 entries, future extensible schema with additional columns).
- `localStorage` has a ~5 MB hard limit and only stores strings — unsuitable for typed entries.
- Dexie's `version().stores().upgrade()` migration API gives a safe, declarative path for adding new tracking dimensions in future without data loss (satisfies FR-013/SC-008).
- Bundle cost: ~40 KB gzipped — acceptable for a PWA used daily.

**Alternatives considered**:
- `localStorage` directly — rejected: no structured queries, 5 MB limit, synchronous (blocks render), no migration support.
- `OPFS` (Origin Private File System) — rejected: API is too low-level, no React-friendly wrapper at sufficient maturity.
- `PouchDB` — rejected: 140 KB min bundle, built for sync with remote CouchDB which is not needed here; overkill for a single-user local-first app.
- SQLite via WASM (`sql.js`, `wa-sqlite`) — rejected: adds ~1.5 MB WASM asset; Dexie achieves equivalent query capability at a fraction of the cost.

---

## 2. State Management: Zustand

**Decision**: Zustand (`^5.x`) for global app state (current date selection, filter state, UI state).

**Rationale**:
- Already mandated by the constitution.
- For a single-user app with no complex cross-component derived state, Zustand's lightweight slice model is sufficient.
- Works naturally alongside Dexie (Dexie handles persistence; Zustand handles in-memory UI state and selected filters).
- Fully typed with TypeScript strict mode without boilerplate.

**Alternatives considered**: Redux Toolkit — rejected: far more boilerplate for the scope; Context API — rejected: causes unnecessary re-renders at scale.

---

## 3. Charts: Recharts

**Decision**: Recharts (`^2.x`) for all data visualisations.

**Rationale**:
- Already mandated by the constitution.
- Native React component model; no imperative D3 manipulation required.
- Fully typed; no `any` escape hatches needed.
- Provides `LineChart`, `BarChart`, `PieChart` out of the box — covers all analytics requirements (FR-008, FR-009).
- Responsive containers work on mobile (satisfies FR-012).

**Alternatives considered**: Chart.js — rejected: imperative canvas API; React-specific wrapper (`react-chartjs-2`) loses type fidelity. Victory — rejected: heavier bundle without meaningful advantage.

---

## 4. Component Folder Architecture

**Decision**: Feature-scoped component folders under `src/components/`, each containing its own components, hooks, and co-located tests.

**Rationale** (responding to user constraint: "split components into folders to make it easier to extend/exchange/improve"):
- Each feature area (`entry/`, `timeline/`, `analytics/`, `layout/`, `ui/`) is independently portable: swapping the timeline implementation requires touching only `src/components/timeline/`.
- Co-located tests (`*.test.tsx` alongside each component) satisfy Constitution Principle IV without requiring a separate test tree to mirror the source tree.
- The `ui/` subfolder re-exports shadcn/ui primitives so that all other folders import from `@/components/ui/` without knowledge of Radix internals — satisfying Principle V (one design system source of truth).

**Folder structure decided**:
```
src/
├── components/
│   ├── entry/          # Daily entry form + sub-components
│   ├── timeline/       # Timeline list, card, filter bar
│   ├── analytics/      # Chart wrappers, date range picker, stat cards
│   ├── layout/         # AppShell, NavBar, PageContainer
│   └── ui/             # Re-exported & configured shadcn/ui primitives
├── pages/              # Route-level page components (thin wrappers)
├── stores/             # Zustand slices
├── db/                 # Dexie schema, typed table definitions, query helpers
├── hooks/              # Shared React hooks (e.g., useEntries, useFilters)
├── lib/                # Pure functions: validators, formatters, correlation utils
├── types/              # Shared enums and interface declarations
└── styles/             # design-tokens.css (CSS custom properties); tailwind.config.ts
```

**Rationale continued**: Pages import from feature-component folders; feature-component folders import from `stores/`, `db/`, `hooks/`, and `ui/`. No circular dependencies. Each folder is a vertical slice that can be unit-tested in isolation.

---

## 5. Form Validation: React Hook Form + Zod

**Decision**: React Hook Form (`^7.x`) with Zod (`^3.x`) for the daily entry form.

**Rationale**:
- Constitution mandates this combination.
- Zod schema doubles as the single source of truth for both runtime validation (FR-003: required headache intensity + work environment) and TypeScript types (inferred with `z.infer<>`), eliminating type/runtime drift.
- React Hook Form is uncontrolled-input based — avoids re-renders on every keystroke for a form with only ~4 fields.

---

## 6. Routing: React Router v6

**Decision**: React Router v6 (`react-router-dom ^6.x`) for SPA routing.

**Rationale**: Constitution mandates it. Three primary routes: `/` (today's entry), `/timeline`, `/analytics`. Optional deep-link: `/entry/:date` for direct date navigation.

---

## 7. PWA / Offline: Vite PWA Plugin (Workbox)

**Decision**: `vite-plugin-pwa` with Workbox `NetworkFirst` for HTML and `CacheFirst` for assets.

**Rationale**:
- Constitution requires offline support for all read operations.
- All data is in IndexedDB (available offline natively); only the JS/CSS assets need caching.
- Network-first for navigation ensures fresh deploys are picked up; cache-first for immutable hashed assets maximises load speed.

---

## 8. Date Handling: date-fns

**Decision**: `date-fns` (`^3.x`) for all date arithmetic and formatting.

**Rationale**: Constitution mandates it. Fully tree-shakeable (only imported functions land in bundle). Functions like `format`, `startOfDay`, `isWithinInterval`, `eachDayOfInterval` cover all analytics date-range needs.

---

## 9. Testing Strategy

**Decision**: Vitest + React Testing Library (RTL) + MSW for each component folder.

**Key test scopes per folder**:

| Area | Test Focus |
|------|-----------|
| `db/` | Dexie schema, upsert logic, query helpers (mocked IndexedDB via `fake-indexeddb`) |
| `lib/` | Correlation utility functions, formatters, validators (pure unit tests) |
| `stores/` | Zustand store actions and derived state |
| `components/entry/` | Form renders, validation error messages, save triggers |
| `components/timeline/` | Card rendering, filter logic, empty state |
| `components/analytics/` | Chart renders with stub data, date range filter |

---

## 10. No-Backend Confirmation

**Decision**: No backend required at any scope.

**Rationale**: Spec FR-011 mandates local-only storage. IndexedDB provides sufficient query capacity for 3+ years of daily entries (SC-007). A backend would violate the single-user / privacy-first constraint without adding any value.

---

## Resolved Unknowns Summary

| Item | Decision |
|------|----------|
| Persistence layer | IndexedDB via Dexie.js |
| State management | Zustand (mandated) |
| Charts | Recharts (mandated) |
| Component structure | Feature-scoped folders (entry, timeline, analytics, layout, ui) |
| Form validation | React Hook Form + Zod (mandated) |
| Routing | React Router v6 (mandated) |
| Offline | Vite PWA plugin + Workbox (mandated) |
| Date handling | date-fns (mandated) |
| Test runner | Vitest + RTL + MSW (mandated) |
| Backend | None required |

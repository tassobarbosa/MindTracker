# Tasks: MindTracker Core App

**Input**: Design documents from `specs/001-mindtracker-core/`

**Prerequisites**: [plan.md](./plan.md) · [spec.md](./spec.md) · [research.md](./research.md) · [data-model.md](./data-model.md) · [contracts/ui-contracts.md](./contracts/ui-contracts.md) · [quickstart.md](./quickstart.md)

**Tests**: Included — Constitution Principle IV mandates unit tests for every feature as a non-negotiable merge gate.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[US#]**: Which user story this task belongs to
- Exact file paths included in every task description

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold the Vite PWA project, install all dependencies, and establish dev tooling.

- [X] T001 Bootstrap Vite + React + TypeScript project at repository root via `pnpm create vite . --template react-ts`
- [X] T002 Install all runtime dependencies: `react-router-dom`, `zustand`, `dexie`, `react-hook-form`, `zod`, `@hookform/resolvers`, `recharts`, `date-fns`, `clsx`, `tailwind-merge`
- [X] T003 Install all dev/test dependencies: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `msw`, `fake-indexeddb`, `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `prettier`, `eslint-config-prettier`, `vite-plugin-pwa`
- [X] T004 [P] Initialise Tailwind CSS with `pnpm dlx tailwindcss init -p` and configure `tailwind.config.ts` with the `src/` content path
- [X] T005 [P] Run `pnpm dlx shadcn-ui@latest init` — select TypeScript, Tailwind, `@/` alias; configure `components.json`
- [X] T006 Configure `vite.config.ts`: add `@vitejs/plugin-react`, `vite-plugin-pwa` (Workbox `NetworkFirst` for HTML, `CacheFirst` for assets), and `@` path alias resolving to `src/`
- [X] T007 [P] Configure `tsconfig.json`: enable `"strict": true`, add `paths: { "@/*": ["./src/*"] }`
- [X] T008 [P] Configure `vitest.config.ts`: `jsdom` environment, `globals: true`, `setupFiles: ['./src/test/setup.ts']`, `@` alias
- [X] T009 [P] Configure ESLint with `@typescript-eslint` strict rules; enable `no-unused-vars` and `no-unreachable` as errors; add `prettier` last in extends
- [X] T010 [P] Create `src/test/setup.ts`: import `@testing-library/jest-dom/vitest`; configure `fake-indexeddb` global shim
- [X] T011 Create directory skeleton: `src/components/{entry,timeline,analytics,layout,ui}`, `src/pages`, `src/stores`, `src/db`, `src/hooks`, `src/lib`, `src/types`, `src/styles`
- [X] T012 [P] Add `pnpm` scripts in `package.json`: `dev`, `build`, `preview`, `test`, `test:run`, `lint`, `typecheck`

**Checkpoint**: `pnpm dev` launches the Vite dev server; `pnpm test --run` exits 0 (no tests yet); `pnpm typecheck` exits 0.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared type definitions, design tokens, database schema, and Zustand stores that ALL user stories depend on. No user story work begins until this phase is complete.

**⚠️ CRITICAL**: Completes before any Phase 3+ work.

- [X] T013 Create `src/types/enums.ts`: export `HeadacheIntensity` enum (`none | low | medium | high`) and `WorkEnvironment` enum (`office | home_office | remote_spot | no_work`) as per data-model.md
- [X] T014 Create `src/types/models.ts`: export `DailyEntry` interface (`dateKey: string`, `headacheIntensity: HeadacheIntensity`, `workEnvironment: WorkEnvironment`, `notes: string | null`, `createdAt: number`, `updatedAt: number`) using types from `enums.ts`
- [X] T015 [P] Create `src/lib/entrySchema.ts`: Zod schema `dailyEntrySchema` with `dateKey` regex, `nativeEnum` validators for both enums, `notes` optional max-2000; export `DailyEntryFormValues` inferred type
- [X] T016 [P] Create `src/lib/dateUtils.ts`: `todayKey(): string` (returns `YYYY-MM-DD`), `formatDisplay(dateKey: string): string` (human-readable), `parseRange(preset, customFrom?, customTo?): { from: string; to: string }` using `date-fns`
- [X] T017 Create `src/db/database.ts`: `MindTrackerDB extends Dexie` class; `version(1).stores({ dailyEntries: 'dateKey, headacheIntensity, workEnvironment, updatedAt' })`; export singleton `db`
- [X] T018 Create `src/db/queries.ts`: `getEntry(dateKey: string): Promise<DailyEntry | undefined>`, `upsertEntry(entry: DailyEntry): Promise<void>`, `getAllEntries(): Promise<DailyEntry[]>`, `getEntriesInRange(from: string, to: string): Promise<DailyEntry[]>` — all typed, no `any`
- [X] T019 [P] Create `src/stores/entryStore.ts`: Zustand slice with `selectedDate: string` (defaults to `todayKey()`), `draft: Partial<DailyEntry>`, `isSaving: boolean`, actions `setSelectedDate`, `setDraft`, `resetDraft`
- [X] T020 [P] Create `src/stores/filterStore.ts`: Zustand slice with `headacheFilter: HeadacheIntensity[]`, `environmentFilter: WorkEnvironment[]`, `dateRangePreset`, `customFrom/customTo`, and setter actions per data-model.md store shapes
- [X] T021 Create `src/styles/design-tokens.css`: CSS custom properties for all colours (background, surface, primary, danger, text variants), spacing scale (4px base), border-radii, and font-size scale
- [X] T022 Update `src/styles/globals.css`: `@tailwind` directives + `@import './design-tokens.css'`; update `tailwind.config.ts` to extend theme with token CSS vars as semantic colour names
- [X] T023 Add shadcn/ui primitives to `src/components/ui/`: run `pnpm dlx shadcn-ui@latest add button badge card textarea separator skeleton toast tooltip`; verify each re-exports cleanly from `@/components/ui/`
- [X] T024 [P] Write unit tests for `src/lib/entrySchema.ts`: valid entries pass, missing required fields fail, invalid enum values fail (`src/lib/entrySchema.test.ts`)
- [X] T025 [P] Write unit tests for `src/lib/dateUtils.ts`: `todayKey` returns correct format, `parseRange` returns correct bounds for each preset (`src/lib/dateUtils.test.ts`)
- [X] T026 [P] Write unit tests for `src/db/queries.ts` using `fake-indexeddb`: upsert creates, upsert updates (no duplicate), `getEntriesInRange` returns correct slice (`src/db/queries.test.ts`)
- [X] T027 [P] Write unit tests for `src/stores/entryStore.ts`: `setSelectedDate` updates state, `resetDraft` clears draft (`src/stores/entryStore.test.ts`)
- [X] T028 [P] Write unit tests for `src/stores/filterStore.ts`: filter setters update state correctly, date range preset updates both preset and clears custom fields (`src/stores/filterStore.test.ts`)

**Checkpoint**: `pnpm typecheck` exits 0; `pnpm test --run` passes all T024–T028; `db` singleton can be imported without error.

---

## Phase 3: User Story 1 — Daily Symptom Entry (Priority: P1) 🎯 MVP

**Goal**: A user can open the app, fill in headache intensity + work environment + optional notes for any date, and save the entry in under 30 seconds. Today's date is pre-selected. Saving an existing date performs an upsert.

**Independent Test**: Open the app → select headache intensity → select work environment → type a note → click Save. Reload the app. The entry is pre-populated. Change a field, save again. Confirm the updated value is shown. Test with a past date via the date navigator.

- [X] T029 [US1] Create `src/components/entry/HeadacheSelector.tsx`: segmented button group rendering all `HeadacheIntensity` values; accepts `value`, `onChange`, `error` props; uses `Button` from `@/components/ui/`; no hardcoded colours
- [X] T030 [US1] Create `src/components/entry/EnvironmentSelector.tsx`: segmented button group rendering all `WorkEnvironment` values; same prop shape as `HeadacheSelector`
- [X] T031 [US1] Create `src/components/entry/NotesField.tsx`: controlled `Textarea` from `@/components/ui/` with char-count display and optional error message; max 2000 chars
- [X] T032 [US1] Create `src/components/entry/DateNavigator.tsx`: displays `selectedDate` with prev-day / next-day arrow buttons and navigates to `/entry/:dateKey` on change; uses `date-fns` `formatDisplay`
- [X] T033 [US1] Create `src/components/entry/EntryForm.tsx`: root form using React Hook Form + `zodResolver(dailyEntrySchema)`; composes `HeadacheSelector`, `EnvironmentSelector`, `NotesField`; calls `upsertEntry` on submit; reads/writes `entryStore`; handles `loading`, `empty`, `prefilled`, `dirty`, `saving`, `saved` states per ui-contracts.md; shows `Skeleton` from `@/components/ui/` during load
- [X] T034 [US1] Create `src/hooks/useTodayEntry.ts`: calls `getEntry(todayKey())`, returns `{ entry, isLoading }`
- [X] T035 [US1] Create `src/pages/EntryPage.tsx`: reads `:dateKey` route param (falls back to `todayKey()`); syncs `entryStore.selectedDate`; renders `DateNavigator` + `EntryForm`; thin — no business logic
- [X] T036 [US1] Create `src/components/layout/BottomNav.tsx`: three nav items (Today `/`, Timeline `/timeline`, Analytics `/analytics`); active item highlighted using `useLocation()`; uses design tokens for colours; ARIA `nav` landmark + `aria-current="page"` on active item
- [X] T037 [US1] Create `src/components/layout/AppShell.tsx`: wraps `<Outlet />` with `BottomNav`; applies `PageContainer` max-width and padding
- [X] T038 [US1] Configure `src/main.tsx`: set up `BrowserRouter`; define routes: `/` → `EntryPage`, `/entry/:dateKey` → `EntryPage`, `/timeline` → `TimelinePage` (placeholder), `/analytics` → `AnalyticsPage` (placeholder); wrap in `AppShell`
- [X] T039 [P] [US1] Write unit tests for `src/components/entry/HeadacheSelector.tsx`: renders all 4 options, fires `onChange` on click, applies active style to selected value (`HeadacheSelector.test.tsx`)
- [X] T040 [P] [US1] Write unit tests for `src/components/entry/EnvironmentSelector.tsx`: same shape as T039 for work environment values (`EnvironmentSelector.test.tsx`)
- [X] T041 [P] [US1] Write unit tests for `src/components/entry/NotesField.tsx`: char count updates on input, error message renders when provided (`NotesField.test.tsx`)
- [X] T042 [US1] Write unit tests for `src/components/entry/EntryForm.tsx`: shows skeleton while loading, pre-populates from existing entry, save button disabled until required fields selected, calls `upsertEntry` with correct payload on submit, shows saved state after success (`EntryForm.test.tsx`)
- [X] T043 [P] [US1] Write unit tests for `src/components/layout/BottomNav.tsx`: renders 3 nav items, active item has `aria-current="page"` for the current route (`BottomNav.test.tsx`)

**Checkpoint**: Navigate to `/`. Select headache + environment, type a note, click Save. Refresh — form is pre-populated. Change the date with `DateNavigator` — blank form appears. All T039–T043 pass.

---

## Phase 4: User Story 2 — Edit Past Entries (Priority: P2)

**Goal**: A user can navigate to any past date (or future date), create a new entry if none exists, or edit and re-save an existing entry. The timeline and analytics reflect the update immediately.

**Independent Test**: Navigate to `/entry/2026-05-20`. No entry exists → blank form shown. Fill and save → entry created. Navigate away and back → form pre-populated. Change headache level, save → updated value persists. Navigate to a date that already has an entry via the timeline → form pre-populated and editable.

- [X] T044 [US2] Extend `src/components/entry/DateNavigator.tsx`: add a date-picker popover (shadcn `Popover` + HTML `<input type="date">`) allowing direct date selection in addition to prev/next arrows; navigates to `/entry/:dateKey` on selection
- [X] T045 [US2] Extend `src/pages/EntryPage.tsx`: render a visible "Editing [formatted date]" label when `selectedDate` ≠ today so the user knows which day they are editing
- [X] T046 [US2] Write unit tests for extended `DateNavigator` date-picker behaviour: opening picker, selecting a past date, verifying navigation to correct route (`DateNavigator.test.tsx`)
- [X] T047 [US2] Write integration-style test for edit round-trip: seed `fake-indexeddb` with an entry, render `EntryForm` for that `dateKey`, change headache value, submit, re-query DB and assert updated value (`EntryForm.edit.test.tsx`)

**Checkpoint**: Navigate to `/entry/2026-01-01` (no entry) → blank form. Save → entry created. Return to `/entry/2026-01-01` → form pre-populated. Modify + save → change persists. T046–T047 pass.

---

## Phase 5: User Story 3 — Timeline View (Priority: P3)

**Goal**: A user can browse all entries as reverse-chronological cards showing date, headache level badge, work environment badge, and a 80-char note preview. Filter by headache level and/or work environment. Tap a card to edit that entry. Empty states shown when no entries exist or no entries match filters.

**Independent Test**: Seed 10+ entries across multiple headache levels and environments. Navigate to `/timeline`. Verify all cards appear newest-first. Apply "High headache" filter — only matching cards visible. Apply "Home Office" filter on top — combined result correct. Click a card — navigates to `/entry/:dateKey`. Clear filters — all cards return.

- [X] T048 [US3] Create `src/hooks/useEntries.ts`: calls `getAllEntries()`, returns `{ entries: DailyEntry[], isLoading: boolean }`, sorted newest-first by `dateKey`
- [X] T049 [US3] Create `src/components/timeline/EntryCard.tsx`: renders `dateKey` (formatted), `HeadacheIntensity` `Badge`, `WorkEnvironment` `Badge`, note preview truncated to 80 chars; calls `onEdit(dateKey)` on click; fully accessible (keyboard-focusable, `role="button"` or `<button>`)
- [X] T050 [US3] Create `src/components/timeline/TimelineFilters.tsx`: renders multi-select filter toggles for all `HeadacheIntensity` and `WorkEnvironment` values; reads/writes `filterStore`; shows active filter count badge; includes "Clear all" button
- [X] T051 [US3] Create `src/components/timeline/TimelineList.tsx`: reads `useEntries()` and `filterStore`; applies in-memory filter (headache + environment); renders list of `EntryCard`; shows `Skeleton` cards while loading; shows `empty-all` state with CTA when no entries exist; shows `empty-filtered` state with clear-filters link when filters produce no results
- [X] T052 [US3] Create `src/pages/TimelinePage.tsx`: renders `TimelineFilters` + `TimelineList`; on `onEdit` navigates to `/entry/:dateKey`
- [X] T053 [P] [US3] Write unit tests for `src/components/timeline/EntryCard.tsx`: renders all fields, truncates notes at 80 chars, fires `onEdit` on click and Enter key (`EntryCard.test.tsx`)
- [X] T054 [P] [US3] Write unit tests for `src/components/timeline/TimelineFilters.tsx`: filter toggle updates `filterStore`, clear-all resets all filters, active count badge reflects active filter count (`TimelineFilters.test.tsx`)
- [X] T055 [US3] Write unit tests for `src/components/timeline/TimelineList.tsx`: shows skeleton while loading, renders N cards for N entries, empty-all state with zero entries, empty-filtered state when filters match nothing, filtered count correct for headache+environment combination (`TimelineList.test.tsx`)

**Checkpoint**: Navigate to `/timeline`. All seeded entries visible as cards. Filters reduce results correctly. Clicking a card opens `/entry/:dateKey` with correct date. T053–T055 pass.

---

## Phase 6: User Story 4 — Analytics & Correlations (Priority: P4)

**Goal**: A user with ≥7 entries can view a headache frequency chart over time and a headache level breakdown by work environment. Date range presets (last 7 / 30 / 90 / all / custom) are available. Fewer than 7 entries shows a progress message instead of charts.

**Independent Test**: Seed 30 entries with varied headache levels and environments across 30 days. Navigate to `/analytics`. Verify both charts render with correct data. Switch to "Last 7 days" — charts update. Set a custom date range — charts update. Clear to 3 entries — insufficient-data message appears with correct remaining count.

- [X] T056 [US4] Create `src/lib/chartData.ts`: `toFrequencySeries(entries: DailyEntry[]): FrequencyPoint[]` (one point per entry, x=dateKey, y=headache ordinal 0–3); `toEnvironmentBreakdown(entries: DailyEntry[]): EnvironmentBreakdownRow[]` (one row per environment, columns per headache level count); both fully typed, pure functions with no side effects
- [X] T057 [US4] Create `src/hooks/useEntries.ts` extension (or new `useFilteredEntries.ts`): accepts `{ from, to }` range, calls `getEntriesInRange()`, returns `{ entries, isLoading }`
- [X] T058 [US4] Create `src/components/analytics/DateRangePicker.tsx`: renders preset buttons (Last 7, Last 30, Last 90, All, Custom); when Custom selected, shows two `<input type="date">` fields for from/to; reads/writes `filterStore` date range fields
- [X] T059 [US4] Create `src/components/analytics/InsufficientDataMessage.tsx`: accepts `currentCount: number`, `required: number`; renders a calm message showing how many more entries are needed before charts unlock; uses `Card` from `@/components/ui/`
- [X] T060 [US4] Create `src/components/analytics/HeadacheFrequencyChart.tsx`: Recharts `ResponsiveContainer` + `BarChart`; x-axis = date labels, y-axis = headache ordinal (0–3) with custom tick labels (none/low/medium/high); uses `toFrequencySeries()` output; design-token colours for bars
- [X] T061 [US4] Create `src/components/analytics/EnvironmentBreakdownChart.tsx`: Recharts `ResponsiveContainer` + `BarChart` grouped; x-axis = work environment; stacked or grouped bars per headache level; uses `toEnvironmentBreakdown()` output; legend matches design tokens
- [X] T062 [US4] Create `src/pages/AnalyticsPage.tsx`: reads `filterStore` date range; calls `useFilteredEntries`; if `entries.length < 7` renders `InsufficientDataMessage`; otherwise renders `DateRangePicker` + `HeadacheFrequencyChart` + `EnvironmentBreakdownChart`
- [X] T063 [P] [US4] Write unit tests for `src/lib/chartData.ts`: `toFrequencySeries` maps headache levels to correct ordinals, handles empty array; `toEnvironmentBreakdown` groups counts correctly for mixed data (`chartData.test.ts`)
- [X] T064 [P] [US4] Write unit tests for `src/components/analytics/InsufficientDataMessage.tsx`: renders correct "N more entries needed" text for various counts (`InsufficientDataMessage.test.tsx`)
- [X] T065 [P] [US4] Write unit tests for `src/components/analytics/DateRangePicker.tsx`: clicking preset updates `filterStore`, custom inputs appear only when Custom selected, from/to values update store (`DateRangePicker.test.tsx`)
- [X] T066 [US4] Write unit tests for `src/components/analytics/HeadacheFrequencyChart.tsx`: renders with stub data (≥7 entries), chart container present in DOM, no crash on empty array (`HeadacheFrequencyChart.test.tsx`)
- [X] T067 [US4] Write unit tests for `src/components/analytics/EnvironmentBreakdownChart.tsx`: renders with stub grouped data, all 4 environment labels present (`EnvironmentBreakdownChart.test.tsx`)

**Checkpoint**: Navigate to `/analytics` with <7 entries → insufficient data message. Seed 30 entries → both charts render. Switch date range presets → charts update. T063–T067 pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: PWA completion, accessibility pass, performance validation, and build verification.

- [X] T068 Complete `vite-plugin-pwa` manifest in `vite.config.ts`: set `name`, `short_name`, `theme_color`, `background_color`, `icons` (192px + 512px), `display: standalone`, `start_url: /`
- [X] T069 [P] Create `public/manifest.webmanifest` (or confirm Vite PWA generates it) and add placeholder app icons at `public/icons/icon-192.png` and `public/icons/icon-512.png`
- [X] T070 [P] Accessibility audit pass: verify all interactive elements have accessible names (`aria-label` or visible text); verify `BottomNav` keyboard navigation; verify colour contrast meets WCAG 2.1 AA using design tokens
- [X] T071 [P] Run `pnpm typecheck` — resolve any remaining TypeScript strict errors introduced during implementation
- [X] T072 [P] Run `pnpm lint` — resolve any remaining ESLint errors (no-unused-vars, no-unreachable, no `any` without suppression comment)
- [X] T073 [P] Run `pnpm test --run --coverage` — confirm overall line coverage ≥80% on all changed files; address gaps if needed
- [X] T074 Run `pnpm build` — confirm production build exits 0 with no warnings about unresolved imports or circular dependencies
- [X] T075 [P] Run `pnpm preview` — manually verify the daily entry flow completes in under 30 seconds on a mobile viewport (375px wide) in Chrome DevTools; verify bottom nav is usable with touch targets ≥44px
- [X] T076 [P] Validate offline behaviour: load app in browser, go offline in DevTools, navigate all 3 routes — confirms service worker cache serves the app without network
- [X] T077 Update [quickstart.md](./quickstart.md) if any bootstrap steps deviated from the documented commands during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user story phases**
- **Phase 3 (US1)**: Depends on Phase 2 — can start as soon as Foundational is complete
- **Phase 4 (US2)**: Depends on Phase 3 (extends DateNavigator, requires EntryForm to exist)
- **Phase 5 (US3)**: Depends on Phase 2 — independently startable after Foundational; does not depend on US1 or US2 code, only on `db/queries.ts` and `types/`
- **Phase 6 (US4)**: Depends on Phase 2 — independently startable after Foundational; does not depend on US1–US3 component code, only on `db/queries.ts` and `types/`
- **Phase 7 (Polish)**: Depends on all desired user story phases being complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|-----------|-------|
| US1 (P1) | Phase 2 | No story dependencies — pure MVP |
| US2 (P2) | US1 | Extends `DateNavigator` and `EntryPage` from US1 |
| US3 (P3) | Phase 2 | Independently implementable; shares `db/queries.ts` and `types/` only |
| US4 (P4) | Phase 2 | Independently implementable; adds `lib/chartData.ts` only |

### Within Each User Story

1. Types and pure lib functions before components
2. Hooks before components that use them
3. Sub-components (`HeadacheSelector`, `EntryCard`) before parent form/list
4. Unit tests written alongside each module (co-located)

---

## Parallel Opportunities

### Phase 2 — Foundational (can all run in parallel once Phase 1 complete)

```
T013 types/enums.ts       | T015 lib/entrySchema.ts  | T019 stores/entryStore.ts
T014 types/models.ts      | T016 lib/dateUtils.ts     | T020 stores/filterStore.ts
T017 db/database.ts       | T021 styles/tokens.css    | T023 components/ui/ add
T018 db/queries.ts        | T022 styles/globals.css   |
```

### Phase 3 — US1 leaf components (parallel after T017, T019)

```
T029 HeadacheSelector.tsx + T039 test
T030 EnvironmentSelector.tsx + T040 test
T031 NotesField.tsx + T041 test
```

### Phase 5 — US3 (parallel after Phase 2)

```
T049 EntryCard.tsx + T053 test
T050 TimelineFilters.tsx + T054 test
```

### Phase 6 — US4 (parallel after Phase 2)

```
T056 lib/chartData.ts + T063 test
T059 InsufficientDataMessage.tsx + T064 test
T058 DateRangePicker.tsx + T065 test
```

---

## Implementation Strategy

### MVP First (User Story 1 Only — ~T001–T043)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: open app, log today's entry, reload, confirm persistence. Run `pnpm test --run`.
5. Ship/demo the MVP — a working daily log app.

### Incremental Delivery

| Milestone | Phases | Deliverable |
|-----------|--------|-------------|
| MVP | 1 + 2 + 3 | Daily entry + save + edit today |
| + Backfill | + 4 | Edit any past/future date |
| + History | + 5 | Timeline with filtering |
| + Insights | + 6 | Analytics charts |
| Production | + 7 | PWA, offline, accessibility, ≥80% coverage |

---

## Task Count Summary

| Phase | Tasks | User Story |
|-------|-------|-----------|
| Phase 1: Setup | T001–T012 | 12 tasks |
| Phase 2: Foundational | T013–T028 | 16 tasks |
| Phase 3: US1 Daily Entry | T029–T043 | 15 tasks |
| Phase 4: US2 Edit Past Entries | T044–T047 | 4 tasks |
| Phase 5: US3 Timeline View | T048–T055 | 8 tasks |
| Phase 6: US4 Analytics | T056–T067 | 12 tasks |
| Phase 7: Polish | T068–T077 | 10 tasks |
| **Total** | **T001–T077** | **77 tasks** |

| User Story | Task Count |
|-----------|-----------|
| US1 (Daily Entry) | 15 tasks (T029–T043) |
| US2 (Edit Past) | 4 tasks (T044–T047) |
| US3 (Timeline) | 8 tasks (T048–T055) |
| US4 (Analytics) | 12 tasks (T056–T067) |

**Parallel opportunities identified**: 30+ tasks marked `[P]`
**MVP scope**: Phases 1–3 (T001–T043, 43 tasks)

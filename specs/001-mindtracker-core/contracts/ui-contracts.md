# UI Contracts: MindTracker Core App

**Phase 1 — Interface Contracts**
**Branch**: `001-mindtracker-core` | **Date**: 2026-05-25

This document defines the public surface contracts for the major UI component folders. Each contract describes: route(s) served, required props (for shared components), user-visible state transitions, and the storage operations triggered.

---

## 1. Route Map

| Route | Component (page) | Description |
|-------|-----------------|-------------|
| `/` | `EntryPage` | Today's daily entry form (defaults `selectedDate` to today) |
| `/entry/:dateKey` | `EntryPage` | Entry form for a specific date (`YYYY-MM-DD`) |
| `/timeline` | `TimelinePage` | Scrollable history of all entries with filters |
| `/analytics` | `AnalyticsPage` | Charts and correlation views |

---

## 2. Entry Form Contract (`components/entry/`)

### Inputs (from store / route param)
- `selectedDate: string` — the date being edited (from `entryStore` or route param)
- Existing `DailyEntry | undefined` — loaded from Dexie on mount by date key

### User-visible states
| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| `loading` | On mount, before Dexie query resolves | Skeleton or spinner in form area |
| `empty` | No existing entry for selected date | Blank form, all controls reset |
| `prefilled` | Existing entry found | Form pre-populated with saved values |
| `dirty` | User changes any value | Save button becomes active |
| `validation-error` | Save attempted with missing required field | Inline error messages per field |
| `saving` | Save button pressed, Dexie upsert in flight | Button shows spinner, inputs disabled |
| `saved` | Dexie upsert resolves | Success toast; form reverts to `prefilled` |

### Storage operations
- `db.dailyEntries.get(dateKey)` on mount
- `db.dailyEntries.put(entry)` on save (upsert — creates or replaces)

### Required form fields

| Field | Control Type | Validation |
|-------|-------------|------------|
| `headacheIntensity` | Segmented button group (4 options) | Required |
| `workEnvironment` | Segmented button group (4 options) | Required |
| `notes` | Textarea | Optional, max 2000 chars |

### Date selection
- A date picker control above the form allows changing `selectedDate`.
- Changing the date navigates to `/entry/:dateKey` and re-loads the entry for the new date.

---

## 3. Timeline Contract (`components/timeline/`)

### Inputs (from store)
- `headacheFilter: HeadacheIntensity[]` — from `filterStore`
- `environmentFilter: WorkEnvironment[]` — from `filterStore`

### User-visible states
| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| `loading` | Initial Dexie query | Skeleton cards |
| `empty-all` | No entries exist | Empty state illustration + CTA to create first entry |
| `empty-filtered` | Entries exist but none match active filters | "No entries match these filters" with a clear-filters link |
| `populated` | Entries loaded and optionally filtered | List of `EntryCard` components, newest first |

### Storage operations
- `db.dailyEntries.orderBy('dateKey').reverse().toArray()` — full history, sorted newest-first
- Filtering is performed in-memory after fetch (dataset is small enough; no compound DB index needed in v1)

### `EntryCard` — sub-component contract

| Prop | Type | Notes |
|------|------|-------|
| `entry` | `DailyEntry` | The entry to render |
| `onEdit` | `(dateKey: string) => void` | Navigates to `/entry/:dateKey` |

Displayed fields: formatted date, headache intensity badge, work environment badge, note preview (truncated to 80 chars with ellipsis).

---

## 4. Analytics Contract (`components/analytics/`)

### Inputs (from store)
- `dateRangePreset` and `customFrom / customTo` — from `filterStore`

### Charts exposed

| Chart | Component | Data Source |
|-------|-----------|-------------|
| Headache frequency over time | `HeadacheFrequencyChart` | One bar per day in range, height = intensity ordinal (0–3) |
| Headache by work environment | `EnvironmentBreakdownChart` | Grouped or stacked bar: environment × headache level count |

### User-visible states
| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| `insufficient-data` | Fewer than 7 entries in selected range | Message + count of entries needed |
| `loading` | Dexie query in flight | Recharts empty/skeleton state |
| `populated` | ≥7 entries in range | All charts rendered |

### Date range presets

| Preset | Resolved Range |
|--------|---------------|
| `last7` | Today − 6 days → today |
| `last30` | Today − 29 days → today |
| `last90` | Today − 89 days → today |
| `all` | Earliest entry → today |
| `custom` | `customFrom` → `customTo` |

---

## 5. Layout Contract (`components/layout/`)

### `AppShell`
- Wraps every page.
- Renders a persistent bottom navigation bar (mobile-first) with three items: **Today** (`/`), **Timeline** (`/timeline`), **Analytics** (`/analytics`).
- Active route item is visually highlighted.
- No props required; reads active route from React Router.

### Design token constraints
- All spacing, colours, and typography values MUST come from `src/styles/design-tokens.css` (CSS custom properties) or `tailwind.config.ts` theme extension.
- No hardcoded hex values or pixel measurements in component files.

---

## 6. `ui/` Re-export Contract (`components/ui/`)

This folder re-exports and configures shadcn/ui primitives. All other component folders import from `@/components/ui/` exclusively — never directly from `@radix-ui/*` or other Radix internals.

Example exports: `Button`, `Badge`, `Card`, `Dialog`, `Select`, `Textarea`, `Skeleton`, `Toast`, `Separator`, `Tooltip`.

Any shadcn component used in the project MUST be added to this folder. No other folder may style or extend Radix primitives independently.

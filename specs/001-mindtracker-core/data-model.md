# Data Model: MindTracker Core App

**Phase 1 — Data Design**
**Branch**: `001-mindtracker-core` | **Date**: 2026-05-25

---

## Enumerations

### `HeadacheIntensity`

Ordered severity scale. Order matters for chart axes and comparisons.

```typescript
enum HeadacheIntensity {
  None   = 'none',
  Low    = 'low',
  Medium = 'medium',
  High   = 'high',
}
```

**Ordering** (ascending severity): `none < low < medium < high`
**Validation rule**: value MUST be one of the four members — open string not permitted.

---

### `WorkEnvironment`

Categorical location descriptor for the work day.

```typescript
enum WorkEnvironment {
  Office       = 'office',
  HomeOffice   = 'home_office',
  RemoteSpot   = 'remote_spot',  // cafés, co-working, libraries, etc.
  NoWork       = 'no_work',
}
```

**Validation rule**: value MUST be one of the four members.

---

## Core Entity: `DailyEntry`

Represents one day's biological and environmental snapshot. There is at most **one** `DailyEntry` per calendar day (`dateKey` is the unique primary key).

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dateKey` | `string` | ✅ PK | ISO date string `YYYY-MM-DD`. Primary key; unique per day. |
| `headacheIntensity` | `HeadacheIntensity` | ✅ | Reported headache severity for the day. |
| `workEnvironment` | `WorkEnvironment` | ✅ | Where the user worked (or did not work) that day. |
| `notes` | `string \| null` | — | Optional free-text observational note (no length limit enforced, UI suggests ≤500 chars). |
| `createdAt` | `number` | ✅ | Unix timestamp (ms) of first save. Set on creation; never mutated. |
| `updatedAt` | `number` | ✅ | Unix timestamp (ms) of most recent save. Updated on every edit. |

### Constraints

- `dateKey` uniqueness: inserting an entry for an existing `dateKey` performs an **upsert** (update), not a duplicate insert.
- `headacheIntensity` and `workEnvironment` are both required; saving without them MUST be rejected at the form-validation layer (FR-003).
- `notes` MAY be empty string or `null`; both are treated as "no note".
- `createdAt` and `updatedAt` are set by the application layer, not by user input.

### Dexie Schema Declaration (reference)

```typescript
// src/db/schema.ts
interface DailyEntry {
  dateKey: string;           // 'YYYY-MM-DD' — primary key
  headacheIntensity: HeadacheIntensity;
  workEnvironment: WorkEnvironment;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
}

// Dexie version 1 schema string:
//   'dateKey, headacheIntensity, workEnvironment, updatedAt'
// (dateKey is the implicit primary key; other fields are indexed for query filtering)
```

---

## Extensibility Model: `TrackingDimension` (future)

The `DailyEntry` table is designed for non-breaking extension. Future tracking dimensions (sleep quality, exercise, caffeine, heart palpitations, etc.) will be added as **optional fields** to `DailyEntry` via Dexie schema migrations.

### Migration strategy

Each new dimension follows this pattern:

1. The Dexie `version` number is incremented.
2. The new field is declared as optional (`fieldName?: Type`) on the `DailyEntry` interface.
3. No `upgrade()` function is required since pre-existing rows will simply have `undefined` for the new field — no data loss.
4. The form UI conditionally renders the new field.
5. Analytics components ignore `undefined` values (treated as "not recorded").

### Candidate future fields (informational only — not in v1)

| Candidate Field | Type |
|-----------------|------|
| `sleepHours` | `number \| null` |
| `sleepQuality` | `'poor' \| 'fair' \| 'good' \| null` |
| `exerciseMinutes` | `number \| null` |
| `caffeineServings` | `number \| null` |
| `stressLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| null` |
| `focusLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| null` |
| `heartPalpitations` | `boolean \| null` |
| `waterIntakeLitres` | `number \| null` |
| `medication` | `string[] \| null` |
| `bloodPressureSystolic` | `number \| null` |
| `bloodPressureDiastolic` | `number \| null` |

**Principle**: every future field MUST be `null`-able or `undefined`-able so that entries recorded before the field existed remain valid without migration.

---

## State Shapes (Zustand Stores)

### `entryStore` — current editing state

```typescript
interface EntryStore {
  selectedDate: string;           // 'YYYY-MM-DD', defaults to today
  draft: Partial<DailyEntry>;     // in-progress form values
  isSaving: boolean;
  setSelectedDate: (date: string) => void;
  setDraft: (patch: Partial<DailyEntry>) => void;
  resetDraft: () => void;
}
```

### `filterStore` — timeline and analytics filter state

```typescript
interface FilterStore {
  headacheFilter: HeadacheIntensity[];   // empty = show all
  environmentFilter: WorkEnvironment[];  // empty = show all
  dateRangePreset: 'last7' | 'last30' | 'last90' | 'all' | 'custom';
  customFrom: string | null;             // 'YYYY-MM-DD'
  customTo: string | null;               // 'YYYY-MM-DD'
  setHeadacheFilter: (v: HeadacheIntensity[]) => void;
  setEnvironmentFilter: (v: WorkEnvironment[]) => void;
  setDateRangePreset: (preset: FilterStore['dateRangePreset']) => void;
  setCustomRange: (from: string, to: string) => void;
}
```

---

## Validation Schema (Zod — reference)

```typescript
// src/lib/entrySchema.ts
import { z } from 'zod';
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums';

export const dailyEntrySchema = z.object({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  headacheIntensity: z.nativeEnum(HeadacheIntensity),
  workEnvironment: z.nativeEnum(WorkEnvironment),
  notes: z.string().max(2000).nullable().optional(),
});

export type DailyEntryFormValues = z.infer<typeof dailyEntrySchema>;
```

---

## Entity Relationships Diagram

```
DailyEntry (1 per day)
  ├── dateKey: YYYY-MM-DD (PK)
  ├── headacheIntensity → HeadacheIntensity enum
  ├── workEnvironment   → WorkEnvironment enum
  ├── notes (optional)
  ├── createdAt
  └── updatedAt
```

No foreign keys or relational joins required in v1. All data lives in a single Dexie object store (`dailyEntries`).

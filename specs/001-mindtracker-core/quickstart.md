# Quickstart: MindTracker Core App

**Phase 1 — Developer Quickstart**
**Branch**: `001-mindtracker-core` | **Date**: 2026-05-25

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20 LTS+ | [nodejs.org](https://nodejs.org) |
| pnpm | 8+ | `npm install -g pnpm` |
| Git | Any | system package manager |

---

## Project Bootstrap

```bash
# 1. Scaffold with Vite + React + TypeScript
pnpm create vite mindtracker --template react-ts

cd mindtracker

# 2. Install core dependencies
pnpm add \
  react-router-dom \
  zustand \
  dexie \
  react-hook-form \
  zod \
  @hookform/resolvers \
  recharts \
  date-fns \
  clsx \
  tailwind-merge

# 3. Install shadcn/ui + Tailwind
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
pnpm dlx shadcn-ui@latest init    # follow prompts: TypeScript=yes, Tailwind=yes

# 4. Install dev / test dependencies
pnpm add -D \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom \
  msw \
  fake-indexeddb \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  eslint-config-prettier

# 5. Install PWA plugin
pnpm add -D vite-plugin-pwa
```

---

## Source Directory Layout

```
src/
├── components/
│   ├── entry/              # Daily entry form
│   │   ├── EntryForm.tsx
│   │   ├── HeadacheSelector.tsx
│   │   ├── EnvironmentSelector.tsx
│   │   ├── NotesField.tsx
│   │   ├── DateNavigator.tsx
│   │   └── *.test.tsx
│   ├── timeline/           # Timeline history view
│   │   ├── TimelineList.tsx
│   │   ├── EntryCard.tsx
│   │   ├── TimelineFilters.tsx
│   │   └── *.test.tsx
│   ├── analytics/          # Charts and correlations
│   │   ├── HeadacheFrequencyChart.tsx
│   │   ├── EnvironmentBreakdownChart.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── InsufficientDataMessage.tsx
│   │   └── *.test.tsx
│   ├── layout/             # App shell and navigation
│   │   ├── AppShell.tsx
│   │   ├── BottomNav.tsx
│   │   └── *.test.tsx
│   └── ui/                 # shadcn/ui re-exports
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       └── ... (add as shadcn components are added)
├── pages/                  # Route-level wrappers
│   ├── EntryPage.tsx
│   ├── TimelinePage.tsx
│   └── AnalyticsPage.tsx
├── stores/
│   ├── entryStore.ts
│   ├── filterStore.ts
│   └── *.test.ts
├── db/
│   ├── database.ts         # Dexie instance + schema versioning
│   ├── queries.ts          # Typed query helpers
│   └── *.test.ts
├── hooks/
│   ├── useEntries.ts
│   ├── useTodayEntry.ts
│   └── *.test.ts
├── lib/
│   ├── entrySchema.ts      # Zod schema
│   ├── dateUtils.ts        # date-fns helpers
│   ├── chartData.ts        # data transform: DailyEntry[] → Recharts series
│   └── *.test.ts
├── types/
│   ├── enums.ts            # HeadacheIntensity, WorkEnvironment
│   └── models.ts           # DailyEntry interface
└── styles/
    ├── design-tokens.css   # CSS custom properties (colours, spacing, radii)
    └── globals.css         # Tailwind directives + token import
```

---

## Running the App

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Run tests (watch mode)
pnpm test

# Run tests once (CI)
pnpm test --run

# Type check
pnpm tsc --noEmit

# Lint
pnpm eslint src --ext .ts,.tsx
```

---

## Key Configuration Files

### `vite.config.ts` (excerpt)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [{ urlPattern: /^https:\/\/fonts\./, handler: 'CacheFirst' }],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### `tsconfig.json` (excerpt)
```json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### `vitest.config.ts` (excerpt)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

---

## Dexie Database Bootstrap

```typescript
// src/db/database.ts
import Dexie, { type EntityTable } from 'dexie';
import type { DailyEntry } from '@/types/models';

export class MindTrackerDB extends Dexie {
  dailyEntries!: EntityTable<DailyEntry, 'dateKey'>;

  constructor() {
    super('MindTrackerDB');
    this.version(1).stores({
      dailyEntries: 'dateKey, headacheIntensity, workEnvironment, updatedAt',
    });
  }
}

export const db = new MindTrackerDB();
```

---

## Minimum Viable First Slice (P1 — Daily Entry)

Implement in this order to reach a working P1 in the shortest path:

1. `src/types/enums.ts` + `src/types/models.ts` — define enums and `DailyEntry`
2. `src/db/database.ts` — Dexie schema
3. `src/lib/entrySchema.ts` — Zod validation schema
4. `src/stores/entryStore.ts` — Zustand entry store
5. `src/db/queries.ts` — `getEntry(dateKey)`, `upsertEntry(entry)`
6. `src/components/entry/` — form components
7. `src/pages/EntryPage.tsx` — wire everything together
8. `src/components/layout/AppShell.tsx` + `BottomNav.tsx`
9. Tests for each module above (co-located `*.test.ts(x)` files)

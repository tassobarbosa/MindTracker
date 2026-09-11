# MindTracker

> A minimalist, private log for spotting correlations between symptoms, routines, and environment — not a journal, not therapy.

MindTracker is a single-user, local-first web app for daily biological/cognitive self-tracking. Log a headache level, work environment, and a short note in under 30 seconds, then use the timeline and analytics views to see how they relate over weeks and months.

## Why This Exists

Pattern recognition across daily habits and symptoms is hard to do from memory. MindTracker removes the friction from logging — no accounts, no server, no clutter — so the only thing left to do is notice what's actually going on.

## Features

- **Daily entry** — record headache intensity, work environment, and notes for any date in seconds.
- **Timeline** — browse past entries in reverse-chronological order, filterable by headache level or environment.
- **Analytics** — charts for headache frequency over time and headache level breakdown by work environment.
- **Local-first** — all data stays on your device (IndexedDB via Dexie); nothing is sent to a server.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) on [Vite](https://vite.dev/)
- [Dexie](https://dexie.org/) (IndexedDB) for local persistence
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form handling and validation
- [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) for styling and accessible primitives
- [Recharts](https://recharts.org/) for analytics charts
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for testing

## Getting Started

**Prerequisites**: Node.js 18+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173` by default. All data is stored locally in your browser — nothing to configure.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server with hot reload |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run the test suite once (CI mode) |
| `pnpm lint` | Lint the codebase |
| `pnpm typecheck` | Type-check without emitting output |

## Project Structure

```
src/
├── components/   # UI building blocks (entry, timeline, analytics, layout)
├── pages/        # Route-level views (Entry, Timeline, Analytics)
├── db/           # Dexie database schema and queries
├── stores/       # Zustand state stores
├── lib/          # Schemas, date utilities, chart data helpers
├── hooks/        # Data-fetching hooks
└── types/        # Shared enums and models
```

For the full product specification and design decisions, see [specs/001-mindtracker-core/spec.md](specs/001-mindtracker-core/spec.md).

## Contributing

This is a personal project without a formal contribution process at this time.

## License

No license specified yet.

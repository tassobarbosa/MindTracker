<!--
SYNC IMPACT REPORT
==================
Version change: [template] → 1.0.0 (initial ratification)
Modified principles: N/A — first version, all principles are new
Added sections:
  - Core Principles (I–V)
  - Technology Stack
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md  ✅ Constitution Check gates align with I–V
  - .specify/templates/spec-template.md  ✅ Functional Requirements and test sections align
  - .specify/templates/tasks-template.md ✅ Test tasks are MANDATORY (not optional) per Principle IV
Follow-up TODOs: None — all placeholders resolved.
-->

# MindTracker Constitution

## Core Principles

### I. Readability First (NON-NEGOTIABLE)

Code MUST be written for human readers, not just for machines to execute.

- Every module, function, and variable MUST have a name that communicates intent without requiring a comment.
- Inline comments MUST explain *why*, never *what* — the code itself communicates what.
- Functions MUST do one thing; if a function requires a comment to explain its purpose, it MUST be refactored.
- Cyclomatic complexity per function MUST NOT exceed 10.
- PR reviewers MUST reject code whose intent cannot be understood within 30 seconds of reading.

**Rationale**: MindTracker is a long-lived personal health application. Readability prevents silent data
corruption caused by misread logic, and reduces maintenance burden as tracking features expand over time.

### II. Library-First (NON-NEGOTIABLE)

Existing, well-maintained libraries MUST be preferred over custom implementations.

- Before writing any new utility, data structure, or UI component, a library survey MUST be performed
  and documented in the feature's `research.md`.
- A custom implementation is only permitted when: (a) no suitable library exists, (b) an existing
  library introduces an unacceptable bundle size, or (c) a library's API conflicts with Principle III.
- UI components MUST be sourced from the project's chosen design system library (see Technology Stack).
  No bespoke styling that duplicates design-system primitives is permitted.

**Rationale**: Custom code is maintenance burden. For a single-user PWA, leveraging proven libraries
maximises reliability and development velocity without sacrificing user experience.

### III. Type Safety & Clean Code (NON-NEGOTIABLE)

The codebase MUST be fully type-safe and free of dead code at all times.

- TypeScript strict mode (`"strict": true`) MUST be enabled; `any` is forbidden without an explicit,
  reviewed suppression comment explaining why it is unavoidable.
- Dead code (unreachable branches, unused exports, unused variables) MUST be eliminated before merging.
  ESLint rules `no-unused-vars` and `no-unreachable` MUST be enabled and treated as errors.
- Type assertions (`as SomeType`) MUST be avoided; prefer type guards or proper typing.
- All API boundaries (service functions, hooks, store actions) MUST have explicit return types declared.

**Rationale**: MindTracker stores sensitive biological and cognitive data. Type safety prevents the class
of bugs that could corrupt personal health records. Dead code removal keeps the codebase navigable.

### IV. Unit Tests for Every Feature (NON-NEGOTIABLE)

Every feature MUST be accompanied by unit tests before the feature branch can be merged.

- Unit tests MUST cover all business-logic branches (happy path + all error paths).
- Mocks and stubs are permitted and encouraged for external dependencies (storage, sensors, network).
- Test file co-location: `*.test.ts` or `*.spec.ts` alongside the source file under test.
- A feature is not considered "done" until its tests pass in CI.
- Code coverage MUST NOT drop below 80% (line coverage) on changed files.
- Integration and end-to-end tests are encouraged but MUST NOT substitute for unit tests.

**Rationale**: Biological and cognitive tracking data directly informs personal health decisions.
Regressions in data recording or calculation logic have real-world consequences for the user.

### V. Consistent UX & Shared Design System (NON-NEGOTIABLE)

All UI components and interaction patterns MUST derive from a single shared design system.

- A design-token file (colors, spacing, typography, breakpoints) MUST be the single source of truth
  for all visual values; hardcoded hex codes or pixel values elsewhere are forbidden.
- Every new UI surface MUST use components from the approved design-system library; one-off styled
  elements require a documented exception and a proposal to promote the pattern to the design system.
- User-facing flows MUST provide feedback within 300 ms for any initiated action (loading states,
  optimistic updates).
- The app MUST work offline for all read operations (PWA service-worker cache strategy required).
- Accessible markup (WCAG 2.1 AA) is REQUIRED: semantic HTML, ARIA labels on interactive elements,
  full keyboard navigation support.

**Rationale**: MindTracker is a daily-use personal health tool. Visual and interaction inconsistency
erodes trust and increases cognitive load — the opposite of its therapeutic purpose.

## Technology Stack

MindTracker is a **Progressive Web App** targeting a single user (local-first, privacy-preserving).

| Concern            | Chosen Technology                                      |
|--------------------|--------------------------------------------------------|
| Language           | TypeScript (strict mode)                               |
| Framework          | React 18+ (via Vite)                                   |
| Design System      | shadcn/ui (Radix UI primitives + Tailwind CSS tokens)  |
| State Management   | Zustand (lightweight, typed stores)                    |
| Local Storage      | IndexedDB via Dexie.js (typed schema + migrations)     |
| Data Visualization | Recharts (native React, fully typed)                   |
| Forms              | React Hook Form + Zod (schema-first validation)        |
| Date/Time          | date-fns (tree-shakeable, no global side effects)      |
| Routing            | React Router v6                                        |
| Testing            | Vitest + React Testing Library + MSW (API mocks)       |
| Linting/Format     | ESLint (strict) + Prettier                             |
| Offline/PWA        | Vite PWA plugin (Workbox)                              |
| CI                 | GitHub Actions                                         |

Technology changes MUST be proposed via a constitution amendment and require an updated
`research.md` justification documenting why the replacement satisfies Principle II.

## Development Workflow

- **Branch naming**: `###-short-description` (e.g., `001-entry-logging`).
- **Definition of Done**: a feature branch may be merged only when:
  (a) all unit tests pass in CI, (b) coverage gate is met (≥80% on changed files),
  (c) `tsc --noEmit` reports zero errors, (d) ESLint reports zero errors,
  (e) PR has been reviewed for readability compliance (Principle I).
- **Constitution Check** (mandatory gate in every `plan.md`):
  - [ ] Library survey completed and documented in `research.md`
  - [ ] No `any` types introduced without reviewed suppression comment
  - [ ] Unit tests planned for all business-logic branches
  - [ ] UI components sourced from design system (shadcn/ui)
  - [ ] Design tokens used for all visual values; no hardcoded colours or sizes
- **Commit style**: Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`).
- **Exception tracking**: deliberate deviations MUST be marked
  `<!-- CONSTITUTION-EXCEPTION: reason -->` at the site and logged in the sprint backlog.

## Governance

This constitution supersedes all other coding guidelines, README instructions, or verbal agreements.

- Amendments REQUIRE: a written proposal in the PR description, reference to the affected
  principle(s), a migration note for existing code, and at least one explicit approval.
- Version is incremented per semver:
  - **MAJOR**: a principle is removed or its non-negotiable rule is redefined.
  - **MINOR**: a new principle or mandatory section is added.
  - **PATCH**: wording clarifications, typo fixes, or non-semantic refinements.
- Every `plan.md` MUST include a Constitution Check section that gates implementation on compliance.

**Version**: 1.0.0 | **Ratified**: 2026-05-25 | **Last Amended**: 2026-05-25

# Feature Specification: MindTracker Core App

**Feature Branch**: `001-mindtracker-core`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a minimalist personal app called MindTracker for biological/cognitive self-tracking — not journaling, therapy, or mental wellness. The goal is to help a single user identify correlations between symptoms, routines, work environments, and lifestyle habits over time."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Daily Symptom Entry (Priority: P1)

A user opens the app at the end of their day, selects today's date, records their headache intensity level, notes where they worked, adds brief observational notes, and saves the entry — all within 30 seconds.

**Why this priority**: This is the core value loop of the entire app. Without reliable, frictionless daily logging, no analysis or pattern discovery is possible. All other features depend on this data existing.

**Independent Test**: Can be fully tested by opening the app, filling in the daily entry form for today, saving it, reopening it to confirm it persisted correctly — delivering the core observability log.

**Acceptance Scenarios**:

1. **Given** the app is open on any device, **When** the user selects today's date and taps/clicks the headache intensity (e.g., "Medium"), work environment (e.g., "Home Office"), adds a short note, and saves, **Then** the entry is persisted and visible in the timeline.
2. **Given** a saved entry exists for today, **When** the user reopens the app, **Then** today's entry is pre-populated and editable.
3. **Given** a past date is selected, **When** the user fills in the form for that date and saves, **Then** the entry is stored under the selected date, not today's date.
4. **Given** an entry already exists for a given date, **When** the user edits it and saves, **Then** the updated values replace the previous ones without creating a duplicate.
5. **Given** no entry yet exists for today, **When** the user opens the app, **Then** they are presented with a clean, pre-focused form ready for quick input.

---

### User Story 2 - Edit Past Entries (Priority: P2)

A user realizes they forgot to log yesterday's headache. They navigate to the previous day in the app, fill in the details, and save it. Similarly, they can correct a mistaken headache level from three days ago.

**Why this priority**: Missed days and corrections are inevitable for any long-term tracking habit. Without easy backdating and editing, data integrity suffers and users abandon the tool.

**Independent Test**: Can be fully tested by creating an entry for a past date, saving it, then editing the same entry, saving again, and confirming the updated value persists.

**Acceptance Scenarios**:

1. **Given** the user navigates to a past date, **When** no entry exists, **Then** a blank entry form is shown for that date.
2. **Given** the user navigates to a past date, **When** an entry exists, **Then** the existing values are shown and fully editable.
3. **Given** the user submits an edited entry, **When** the save action completes, **Then** the updated entry appears in the timeline with the correct date and updated values.

---

### User Story 3 - Timeline View (Priority: P3)

A user wants to review the past month of entries to spot patterns at a glance. They scroll through a reverse-chronological timeline of cards showing date, headache level, work environment, and a short note preview.

**Why this priority**: The timeline provides visibility into logged data and enables qualitative pattern recognition. It is the primary view for reviewing history without needing charts.

**Independent Test**: Can be fully tested with at least 10 saved entries by verifying all entries appear as cards in correct order, and that filtering by headache level or work environment reduces the visible cards correctly.

**Acceptance Scenarios**:

1. **Given** multiple entries exist, **When** the user opens the timeline, **Then** entries are displayed as readable cards in reverse-chronological order (most recent first).
2. **Given** the timeline is open, **When** the user applies a filter (e.g., "High" headache only), **Then** only entries matching that filter are shown.
3. **Given** a timeline card is visible, **When** the user taps/clicks it, **Then** the full entry is opened in edit mode.
4. **Given** no entries exist, **When** the user opens the timeline, **Then** an empty state is shown with a prompt to create the first entry.

---

### User Story 4 - Analytics & Correlations (Priority: P4)

After several weeks of logging, the user opens the analytics view to understand whether their headaches correlate with work environment. They see a chart of headache frequency over time and a breakdown of headache levels by work environment.

**Why this priority**: This is the primary analytical payoff of the app — converting raw logs into actionable insights. However, it requires sufficient historical data to be meaningful and is secondary to the logging experience.

**Independent Test**: Can be fully tested with synthetic data (at least 30 entries across different headache levels and work environments) by verifying all charts render correctly, reflect the underlying data, and respond to date range and filter changes.

**Acceptance Scenarios**:

1. **Given** at least 7 days of entries exist, **When** the user opens analytics, **Then** a headache frequency over time chart is displayed.
2. **Given** entries exist across multiple work environments, **When** the user views the work environment chart, **Then** headache level distribution is broken down per environment.
3. **Given** the analytics view is open, **When** the user changes the date range, **Then** all charts update to reflect only the selected period.
4. **Given** fewer than 7 days of entries exist, **When** the user opens analytics, **Then** a message explains that more data is needed and how many entries remain before charts unlock.

---

### Edge Cases

- What happens when the user tries to save an entry with no headache intensity or work environment selected? → The form must require at minimum headache intensity and work environment before saving.
- What happens if the user attempts to create two entries for the same date? → The system treats any save for an existing date as an edit/update, not a new record.
- What happens when the app is used on very small screens (320px width)? → The layout must remain fully functional with no horizontal scrolling.
- What happens when 2+ years of data exist? → The timeline must remain performant (scrolling smooth, no janky loading) for at least 730 entries.
- What happens if local storage is cleared by the browser/OS? → The user sees an empty state; no crash or error message. Future versions may support export/backup.
- What happens when no entries exist yet for analytics? → Analytics view shows an empty/onboarding state, not an error or broken chart.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST allow entry creation for any date (past or future), with date defaulting to today when first opened.
- **FR-002**: Each entry MUST capture: date (day), headache intensity (none / low / medium / high), work environment (office / home office / remote spot / no work), and optional free-text notes.
- **FR-003**: The app MUST prevent saving an entry without a headache intensity and work environment selection.
- **FR-004**: The app MUST enforce one entry per calendar day — creating an entry for an existing date MUST update that entry.
- **FR-005**: The app MUST allow users to edit any previously saved entry via the timeline or by navigating to that date.
- **FR-006**: The app MUST display all saved entries in a reverse-chronological timeline with date, headache level, work environment, and a note preview (truncated to ~80 characters).
- **FR-007**: The timeline MUST support filtering by headache intensity level and/or work environment.
- **FR-008**: The analytics view MUST provide a headache frequency chart over time.
- **FR-009**: The analytics view MUST provide a headache level breakdown by work environment.
- **FR-010**: The analytics view MUST support date range filtering (e.g., last 7 days, last 30 days, last 90 days, or custom range).
- **FR-011**: The app MUST store all data locally on the user's device with no server-side persistence required.
- **FR-012**: The app MUST be fully functional on mobile screens (minimum 320px wide).
- **FR-013**: The data model MUST be designed to accommodate future tracking dimensions (e.g., sleep quality, exercise, caffeine, heart palpitations) without requiring breaking changes to existing entries.
- **FR-014**: The app MUST load and be fully interactive within 2 seconds on a standard mobile device.
- **FR-015**: The daily entry workflow (open → fill → save) MUST be completable in under 30 seconds.

### Key Entities

- **DailyEntry**: Represents one day's health and environment snapshot. Key attributes: date (unique per user), headache intensity, work environment, notes (optional), created timestamp, last-modified timestamp.
- **HeadacheIntensity**: An ordered enumeration — none < low < medium < high. Used for severity comparisons, chart axes, and filtering.
- **WorkEnvironment**: A categorical enumeration — office, home office, remote spot, no work. Used for grouping and correlation analysis.
- **TrackingDimension** *(extensibility concept)*: A future abstraction representing any additional trackable metric (sleep, exercise, caffeine, etc.) that can be associated with a DailyEntry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can complete the full daily entry flow (open app → select headache level → select work environment → add note → save) in under 30 seconds.
- **SC-002**: The app is fully interactive within 2 seconds of being opened on a typical mobile device.
- **SC-003**: The timeline correctly displays all historical entries with no data loss after 90 consecutive days of logging.
- **SC-004**: Filtering the timeline by any combination of headache level and work environment returns only matching entries with zero false positives.
- **SC-005**: Analytics charts accurately reflect the underlying data for any selected date range (verified against the raw entry log).
- **SC-006**: The app remains fully usable (no layout breakage, no horizontal scrolling required) on screens as narrow as 320px.
- **SC-007**: The timeline remains smooth and responsive with up to 730 entries loaded (approximately 2 years of daily data).
- **SC-008**: Adding new tracking dimensions in the future requires no changes to existing saved entry data.

## Assumptions

- The app serves exactly one user; no account system, login, or multi-user support is needed.
- All data is persisted locally on the user's device (e.g., browser local storage or equivalent native mechanism). No backend server is required for v1.
- Data export/backup is out of scope for v1 but should not be architecturally prohibited.
- The app is primarily a web or mobile web experience; native app packaging is out of scope for v1.
- Users have modern devices with sufficient local storage for at least 3 years of daily entries.
- Internet connectivity is not required to use the app after initial load.
- The app will not include user-facing notifications, reminders, or push alerts in v1.
- "Remote Spot" encompasses all non-home, non-office locations (cafés, co-working spaces, libraries, etc.).
- Analytics charts do not require more than 180 data points to render clearly; for smaller datasets, a minimum data threshold (7 days) is shown before charts appear.
- No accessibility (WCAG) compliance level is mandated for v1, but the app should avoid egregious accessibility failures (e.g., missing button labels, unreadable contrast).

# CLAUDE.md — JPG-PIT-App
**Version:** v1.1 | **Date:** 08/14/2026 | **Repo:** Doug2752/JPG-PIT-App

This file is a context loader for Claude Code. Read this first, then read actual source files for full technical detail. Do not replace this file with a stripped-down version — produce targeted updates only.

---

## APP IDENTITY

- App name: Personal Investment Time (PIT)
- Dev port: 5174
- Repo: Doug2752/JPG-PIT-App
- Local folder: C:\JPG-PROJECTS\JPG-PIT-App
- Framework: React + Vite, Class 3 modular structure
- Storage: localStorage (pre-Supabase)

## CREDENTIALS

- doug / jpg2026
- test / JPG2026
- Login comparison is case-insensitive on both sides

## NON-NEGOTIABLE WORKING RULES

1. Read this file first. Confirm you have read it before any action.
2. Investigation prompt before every build — read actual source files before writing any code.
3. One task at a time. Never bundle logic changes with styling or copy changes.
4. Never touch .md files in this repo during code builds.
5. Never start the dev server.
6. Never commit — Doug commits via GitHub Desktop only.
7. Opus for complex multi-file builds. Sonnet for small edits and investigations.
8. Plan mode always on — present plan, wait for approval before executing.

## BROWSER AND PORT

- Firefox is the test browser (localhost:5174)
- Brave auto-opens 5174 on startup — do not assume Brave is closed during dev work

## CURRENT BUILD STATE (as of 08/14/2026)

### Built and committed

- Full daily tracking form — 13 required fields (updated 08/14/2026)
- Daily Tracking restructured into two rows of 4 boxes (08/14/2026):
  - Row 1 (Sleep): sleepTime, wakeTime, hoursSlept (auto-calc, read-only), sleepScore
  - Row 2 (Daily Baseline): weight, energyLevel, workOff, location
- sleepTime and hoursSlept added to emptyForm() (08/14/2026)
- pitTimeFrame and meditation removed from emptyForm() and isDayComplete() (08/14/2026)
- REQUIRED_TOTAL = 13 (was 10) (08/14/2026)
- calcHoursSlept() — module-level pure function in DailyTrackingSection.jsx. Handles midnight crossing. Returns "Xh Ym". Called inline on render — no useEffect roundtrip.
- commitSleep() — mirrors commitWake(). Receives e.target.value from onBlur to avoid stale closure.
- saveCoachSnapshot(uid, date, formData, appts) — new function in PITApp.jsx (08/14/2026). Builds filtered coach snapshot and writes to pit_coach_{uid}_{date} on every save() and saveAppointments() call.
- coachKey helper: pit_coach_{uid}_{date} (08/14/2026)
- ArchiveView — backToday prop wired. Today button clears archiveMode correctly (08/14/2026)
- BooksView — backToday prop wired. Same fix as ArchiveView (08/14/2026)
- AppointmentsSection — canAddAppt prop added. Add button visibility matches addAppt() guard exactly (08/14/2026)
- SummarySection — onLimitHit unused prop removed (08/14/2026)
- DailyTrackingSection — MEDITATION_DURATIONS unused import removed (08/14/2026)
- styles.js — dbtn aliased to gbtn, duplicate body removed (08/14/2026)
- RED constant — all #b02020 hardcoded literals replaced across ToAccomplishSection, ImportantDiscoveriesSection, LoginScreen (08/14/2026)
- Fitness Yesterday — multi-entry, Rest and Recovery option, Track By hidden for Rest and Recovery
- Configure Recurring Fitness — confirmation dialog on Remove
- To Accomplish system — One Thing, Daily Tasks (2), Future Tasks (18)
- compactTasks() compaction at 6 sites
- Reverse-move system — all four directions
- One Thing manual check-off — First Action Step appended in parentheses, field cleared
- One Thing Remove button — two-stage inline confirmation
- Daily Tasks Remove — two-stage inline confirmation
- Future Tasks Remove — two-stage inline confirmation
- removeOneThing() function in PITApp.jsx
- applyCarryover() — unresolved To Accomplish items carry forward to next day
- Future Tasks cap message at 18 slots
- Move modal shows task text (40-char truncation)
- Clear Items nothing-selected inline red guard
- Appointments — lock/unlock, LOCKED badge in header, gold left border, date/time disabled when locked
- Important Discoveries — empty state message, add validation, edit cancel confirmation
- Book Study — page number min=0, green border + Completed badge when complete
- Devotional — scripture search preserves query on close, toggle colon removed
- Quotes — search preserves query on close
- WeekTracker — GREEN_COMPLETE constant wired
- BookSection — GREEN_COMPLETE constant wired
- GREEN_COMPLETE = #2ecc71 in constants.js
- HelpPanel — Lock Appointment paragraph updated. To Accomplish carryover copy correct.
- Open DOP button — localhost:5173 with hub_user param
- AI Summary — 7-day fixed lookback, once per rolling 7-day window
- Archive view, Books view
- Vitest — 1 passing test

### Known open items (not yet built)

- Stale AI model ID in services/ai.js — correct before real key is wired
- Rate limit message styling — defer until AI key live
- Coach Data Transmission — HUB display side — post-Supabase
- Coach Data Transmission — DOP spoke — future dedicated scoping session

### Post-Supabase (do not build)

- SMS reminder
- Coach-facing archive
- pit_instructions_seen user-scoping
- HUB Reports full data population
- Flag logic and auto-drafted messages in HUB

## STORAGE KEYS

| Key | Purpose |
|---|---|
| pit_{uid}_{date} | Daily form data |
| pit_arch_{uid} | Archive list |
| pit_sent_{uid} | Sent records |
| pit_books_{uid} | Books log |
| pit_appts_{uid} | Appointments |
| pit_devtype_{uid} | Prayer/Silence preference |
| pit_fitness_config_{uid} | Recurring fitness config |
| pit_discoveries_{uid} | Discoveries library |
| pit_day_complete_{uid} | Day complete dates |
| pit_ai_summary_last_used_{uid} | AI rate-limit timestamp |
| pit_coach_{uid}_{date} | Coach transmission snapshot — NEW 08/14/2026 |
| pit_instructions_seen | Global (not user-scoped — known bug, post-Supabase) |

## GOVERNING DOCUMENT

Code Logic doc: JPG-SYS-PIT-CodeLogic-WRK-v3.1
This file is a context loader only — do not reproduce the full Code Logic doc here.

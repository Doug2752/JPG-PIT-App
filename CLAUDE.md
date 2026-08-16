# CLAUDE.md — JPG-PIT-App
**Version:** v1.2 | **Date:** 08/16/2026 | **Repo:** Doug2752/JPG-PIT-App

This file is a context loader for Claude Code. Read this first, then read actual source files for full technical detail. Do not replace this file with a stripped-down version — produce targeted updates only.

---

## APP IDENTITY

- App name: Personal Investment Time (PIT)
- Dev port: 5174
- Repo: Doug2752/JPG-PIT-App
- Local folder: C:\JPG-PROJECTS\JPG-PIT-App
- Framework: React + Vite, Class 3 modular structure
- Storage: localStorage (pre-Supabase)

---

## CREDENTIALS

- doug / jpg2026
- test / JPG2026
- Login comparison is case-insensitive on both sides

---

## NON-NEGOTIABLE WORKING RULES

1. Read this file first. Confirm you have read it before any action.
2. Investigation prompt before every build — read actual source files before writing any code.
3. One task at a time. Never bundle logic changes with styling or copy changes.
4. Never touch .md files in this repo during code builds.
5. Never start the dev server.
6. Never commit — Doug commits via GitHub Desktop only.
7. Opus for complex multi-file builds. Sonnet for small edits and investigations.
8. Plan mode always on — present plan, wait for approval before executing.

---

## BROWSER AND PORT

- Firefox is the test browser (localhost:5174)
- Brave auto-opens 5174 on startup — do not assume Brave is closed during dev work

---

## CURRENT BUILD STATE (as of 08/16/2026)

### Built and committed

**Daily Tracking (restructured 08/14/2026):**
- 13 required fields total (REQUIRED_TOTAL = 13)
- Restructured into two rows of 4 boxes:
  - Row 1 (Sleep): sleepTime, wakeTime, hoursSlept (auto-calc read-only), sleepScore
  - Row 2 (Daily Baseline): weight, energyLevel, workOff, location
- sleepTime and hoursSlept added to emptyForm()
- pitTimeFrame and meditation removed from emptyForm() and isDayComplete()
- calcHoursSlept() — module-level pure function in DailyTrackingSection.jsx. Handles midnight crossing. Returns "Xh Ym". Called inline on render — no useEffect roundtrip.
- commitSleep() — mirrors commitWake(). Receives e.target.value from onBlur to avoid stale closure.

**Coach Data Snapshot (built 08/14/2026):**
- saveCoachSnapshot(uid, date, formData, appts) — function in PITApp.jsx
- Builds filtered coach snapshot, writes to pit_coach_{uid}_{date} on every save() and saveAppointments() call
- coachKey helper: pit_coach_{uid}_{date}
- Privacy filter applied — not all fields included in snapshot
- 3-consecutive-day flag thresholds locked (logic in place, HUB display post-Supabase)

**Bug fixes and cleanup (08/14/2026):**
- ArchiveView — backToday prop wired. Today button clears archiveMode correctly
- BooksView — backToday prop wired. Same fix as ArchiveView
- AppointmentsSection — canAddAppt prop added. Add button visibility matches addAppt() guard exactly
- SummarySection — onLimitHit unused prop removed
- DailyTrackingSection — MEDITATION_DURATIONS unused import removed
- styles.js — dbtn aliased to gbtn, duplicate body removed
- RED constant — all #b02020 hardcoded literals replaced across ToAccomplishSection, ImportantDiscoveriesSection, LoginScreen

**To Accomplish system:**
- One Thing, Daily Tasks (2), Future Tasks (18)
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

**Fitness tracking:**
- Fitness Yesterday — multi-entry, Rest and Recovery option, Track By hidden for Rest and Recovery
- Configure Recurring Fitness — confirmation dialog on Remove

**Appointments:**
- Lock/unlock, LOCKED badge in header, gold left border, date/time disabled when locked
- Real ISO date field, independent storage, date-filtered display

**Other built features:**
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

- Instructions-panel combined pass — ALL HELD as one combined pass (do not split). Items held:
  1. Q2/Q3 copy (To Accomplish has no carryover; checked items disappear next day; Archive is lookback)
  2. "Daily Trackables" sub-heading above first 5 required fields
  3. Panel-wide layout restructure (section title on own line, body below — all sections)
  4. Auto-save reminder text (mirror into instructions once global placement decided)
  5. AI Summary instructions update (every section, today + 7 most recent days, fixed/no client control)
- Future Tasks delete/remove button — isolated logic build. Do not combine with instructions-panel pass. Ask Doug which goes first.
- Stale AI model ID in services/ai.js — correct before real key is wired
- Rate limit message styling — defer until AI key live
- Coach Data Transmission — HUB display side — post-Supabase
- Coach Data Transmission — DOP spoke — future dedicated scoping session

### Pending browser verification

- One Thing check-off First Action Step append — built 07/23/2026. Verify in Brave daily session.
- Total Hours Slept auto-calculate — built 08/14/2026. Verify: enter sleep + wake time, confirm hours display updates.
- Coach snapshot key — after save, confirm pit_coach_{uid}_{date} key exists in localStorage with correct filtered structure.

### Post-Supabase (do not build)

- SMS reminder
- Coach-facing archive
- pit_instructions_seen user-scoping (known bug — key is not user-scoped, missing {uid})
- HUB Reports full data population
- Flag logic and auto-drafted messages in HUB

---

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
| pit_coach_{uid}_{date} | Coach transmission snapshot — built 08/14/2026 |
| pit_instructions_seen | Global (not user-scoped — known bug, post-Supabase fix) |

---

## LOCKED DECISIONS

- Daily Tracking: 8 required fields in two rows of 4. sleepTime and hoursSlept added. pitTimeFrame and meditation removed. REQUIRED_TOTAL = 13. (locked 08/14/2026)
- Total Hours Slept: auto-calculated from sleepTime and wakeTime via calcHoursSlept(). Read-only display. Handles midnight crossing. No useEffect — called inline on render. (locked 08/14/2026)
- Stale closure pattern: write persisted values inside action handlers using e.target.value from onBlur — do not read local state. Applied to commitSleep() and commitWake().
- Coach Transmission: auto-write on every save() and saveAppointments() call to pit_coach_{uid}_{date}. Privacy filter applied. 3-consecutive-day flag thresholds locked. HUB display post-Supabase. (locked 08/14/2026)
- To Accomplish carryover: BUILT. Unresolved items carry forward. Checked items disappear next day. Archive is the only lookback. (locked 08/12/2026)
- Persistent Prayer/Silence preference: write directly in action handler, not useEffect (avoids mount-time race condition).
- AI Summary: pulls all sections, today + 7 most recent days. Fixed — no client control over date range.

---

## GOVERNING DOCUMENT

Code Logic doc: JPG-SYS-PIT-CodeLogic-WRK-v3.1
This file is a context loader only — do not reproduce the full Code Logic doc here.

---

*CLAUDE.md v1.2 | JPG-PIT-App | 08/16/2026*

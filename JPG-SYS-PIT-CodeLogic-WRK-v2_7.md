# JPG — PIT CODE LOGIC
## Personal Investment Time — Full App Code Logic and Build Reference
**Document ID:** JPG-SYS-PIT-CodeLogic-WRK-v2.7
**Date:** 07/25/2026 | **Prepared by:** Claude | **State:** WRK
**Classification:** CLASS 1 — CONFIDENTIAL
**Supersedes:** JPG-SYS-PIT-CodeLogic-WRK-v2.6

---

## PURPOSE OF THIS DOCUMENT

This is the single source of truth for everything about the PIT app — logic rules, UI parameters, color values, component decisions, build status, and locked design decisions. One doc, one app, everything in it.

**Update rule:** at the end of every PIT session, add new decisions to the appropriate section before handoff. Nothing about PIT is decided in chat and not recorded here.

---

## SECTION A — PIT APP IDENTITY

- **App name:** Personal Investment Time (PIT)
- **Dev port:** 5174
- **Repo:** Doug2752/JPG-PIT-App
- **Local folder:** C:\JPG-PROJECTS\JPG-PIT-App
- **Framework:** React + Vite, Class 3 modular structure
- **Storage:** localStorage (pre-Supabase)
- **Test login:** `test` / `JPG2026` and `doug` / `jpg2026` (confirmed in utils/constants.js — case-insensitive)
- **Browser for testing:** Firefox (localhost:5174)
- **Daily-use browser:** Brave (auto-opens 5174 — stop Brave before starting dev server during work hours)
- **CLAUDE.md:** exists in repo root. Contains stale credential note (test123) — needs correction next PIT session.

---

## SECTION B — COLOR SYSTEM (LOCKED)

PIT is the visual reference standard all other apps align to.

| Constant | Hex | Role |
|---|---|---|
| GOLD_LIGHT | #ddb94a | Clickable/action elements. Black text + 1.5px solid black border on light backgrounds. |
| GOLD | #B8860B | Informational/non-interactive elements. Black text + 1.5px solid black border on light backgrounds. |
| DARK | #1a1a1a | Dark text, nav backgrounds. |
| MID | #4a4a4a | Mid-tone text. |
| BG | #f5f5f2 | App background. |
| BORDER | #d8d5cf | Box/table borders. |
| RED | #b02020 | Validation errors. |
| RED_LIGHT | #fff0f0 | Error field backgrounds. |

**Two-tier gold rule (locked):** GOLD_LIGHT (#ddb94a) = clickable/action. GOLD (#B8860B) = informational/non-interactive. Black text + 1.5px black border on light backgrounds. No border on dark nav bar elements.

**NEVER use #B8962E** — deprecated gold.

---

## SECTION C — CONFIRMED BUILT FEATURES

### Daily Tracking
- Wake Up Time combobox — 96 entries, 15-min increments, 12-hour AM/PM. normalizeWakeTime() validation.
- Weight field
- Work/Off selector
- Sleep Score field
- Fitness Yesterday multi-entry (recurring + manual)
- Location, PIT Time Frame, Energy Level, Mental Alignment — additional tracking, not required
- Persistent Prayer/Silence preference — `pit_devtype_{uid}` key, written inside action handler (not useEffect)

### Fitness Yesterday — Multi-Entry
- Selector: Yes / No / Rest Day
- Storage shape: fitnessEntries: [{...}]
- CRUD: updFitnessEntry(idOrIdx, patch, isRecurring), addFitnessEntry(), removeFitnessEntry(idOrIdx, isRecurring)
- Render order: recurring first, manual after
- RECURRING entry: confirm-done checkbox only, all other fields hidden
- MANUAL entry: full field set, Remove button when length > 1
- **Notes field (BUILT 07/19/2026):** optional, full-width textarea, rows 2, manual entries only. Placeholder: "Workout details, how it felt, etc." Not required.
- **Activity Type dropdown — manual entries:** built from `['Rest and Recovery', ...ACTIVITY_TYPES]` — "Rest and Recovery" prepended inline in DailyTrackingSection.jsx only. NOT in the shared ACTIVITY_TYPES constant. Configure Recurring Fitness dropdown uses plain ACTIVITY_TYPES and does NOT show "Rest and Recovery." (BUILT 07/23/2026)

### Configure Recurring Fitness
- Storage key: pit_fitness_config_{uid}
- Days of week toggle (SUN–SAT). Gold = selected.
- syncRecurringForToday() fires on Fitness Yesterday tab click

### To Accomplish System
- One Thing (required for day completion), Daily Tasks (2, hard cap), Future Tasks (18 effective slots)
- **One Thing manual check-off (BUILT 07/23/2026):** when user manually checks the One Thing checkbox (non-carried item), if oneThingSetup (First Action Step) has text, it is appended in parentheses to the oneThing text (`${fd.oneThing} (${setup})`), then oneThingSetup is cleared to ''. Matches the existing move-handler pattern. Uncheck path (v === false) falls through to plain oneThingDone: false — no append, no clear. Carried items (origin_date < today) still route to resolveCarriedItem — unchanged.
- **compactTasks()** — module-level, identity-preserving compaction. Uses lockstep toAccomplishItems re-keying. Wired at 5 trigger sites: loadToday, removeTask, updTask done-branch, all 4 move handlers.
- **Reverse-move system** — four move handlers: moveOneThingToDaily, moveOneThingToFuture, moveDailyToOneThing, moveDailyToFuture. All directions supported. Item identity preserved (id, origin_date, carried_dates). Resolution fields reset on move. First Action/Set-Up field text appended in parentheses to task text when One Thing is moved, then zeroed.
- Unchecked To Accomplish items carry forward to next day automatically.

### Day Complete System
- Mark Day Complete button — active when all 10 required fields are filled
- Three-state header pill: incomplete / required fields done / day complete
- Read-only lock on 10 required fields when marked complete
- Archive indicator — ✓ Day Complete
- Storage key: pit_day_complete_{uid}

### AI Summary
- Fixed 7-day lookback (today + 7 prior days)
- Pulls from every section
- Once per 7-day rolling window rate limit
- Header: "AI Summary"
- Cross-app DOP read: reads DOP form key `<dopUser>_dop7_form_<date>` for Tomorrow's Priorities data

### Appointments
- Real ISO date field, independent storage key `pit_appts_{uid}`
- Date-filtered view — future appointments persist, auto-drop once date passes
- Cap: 5 future-dated appointments

### Important Discoveries
- Persistent library — `pit_discoveries_{uid}`
- Entries persist across sessions

### Daily Book Study
- Title, author, page number carry forward when book is in progress

### Other Confirmed Built
- NIT field (Notes – Ideas – Thoughts) — free text, required
- Prayer/Silence mode selector — persistent
- Gratitude (Thankful For) section
- Quotes section
- Devotional section
- Week Tracker / coach submit stub
- HelpPanel — 16 sections
- Archive view
- Books view
- Never Twice display
- Vitest test infrastructure (1 smoke test)
- Open DOP button — opens localhost:5173 with hub_user param (FIXED 07/25/2026)

### HelpPanel — Copy Updates (07/25/2026)
- **Future Tasks section:** "Future tasks are for items not directly tied to today. Use the Add button to create a new slot. Tasks can be moved in any direction — One Thing, Daily, or Future — in any combination."
- **Thankful For section:** "Add the first 3 things that come to mind. Repeats are okay, but try to discover different things you are thankful for."

---

## SECTION D — STORAGE KEYS

All keys per-user unless noted.

| Key | Purpose |
|---|---|
| pit_{uid}_{date} | Daily form data |
| pit_arch_{uid} | Archive list |
| pit_sent_{uid} | Sent/submitted records |
| pit_books_{uid} | Books log |
| pit_appts_{uid} | Appointments |
| pit_devtype_{uid} | Prayer/Silence preference |
| pit_fitness_config_{uid} | Recurring fitness config |
| pit_discoveries_{uid} | Important Discoveries library |
| pit_day_complete_{uid} | Day complete dates list |
| pit_ai_summary_last_used_{uid} | AI Summary rate-limit timestamp |
| pit_instructions_seen | Global (not user-scoped — known bug, item 8 below) |

---

## SECTION E — COMPONENT ARCHITECTURE

| Component | File | Notes |
|---|---|---|
| PITApp | app\PITApp.jsx | Root orchestrator. compactTasks at module level. |
| AppointmentsSection | components\AppointmentsSection.jsx | No useEffect — no auto-add-on-mount |
| ArchiveView | components\ArchiveView.jsx | Hand-rolls own nav bar — Today button skips backToday() (known issue) |
| BookSection | components\BookSection.jsx | |
| BooksView | components\BooksView.jsx | Hand-rolls own nav bar — same backToday() issue |
| BrandBar | components\BrandBar.jsx | |
| DailyTrackingSection | components\DailyTrackingSection.jsx | Unused MEDITATION_DURATIONS import (dead). Activity Type manual dropdown prepends 'Rest and Recovery' inline. |
| DevotionalSection | components\DevotionalSection.jsx | |
| GratitudeSection | components\GratitudeSection.jsx | |
| Header | components\Header.jsx | |
| HelpPanel | components\HelpPanel.jsx | 16 sections. Future Tasks and Thankful For copy updated 07/25/2026. |
| ImportantDiscoveriesSection | components\ImportantDiscoveriesSection.jsx | |
| LoginScreen | components\LoginScreen.jsx | |
| NotesSection | components\NotesSection.jsx | |
| QuotesSection | components\QuotesSection.jsx | |
| SummarySection | components\SummarySection.jsx | onLimitHit destructured but unused (dead) |
| ToAccomplishSection | components\ToAccomplishSection.jsx | |
| WeekTracker | components\WeekTracker.jsx | isDayCompleteMarked prop passed but unused |
| styles.js | components\styles.js | gbtn and dbtn are byte-identical (dead duplication) |

**Services:** storage.js, sheet.js (callSheet → Google Apps Script, inert until WEBAPP_URL set), ai.js (inert until API key set — model: claude-sonnet-4-20250514)

**Utils:** constants.js — ACTIVITY_TYPES does NOT contain "Rest and Recovery" (manual dropdown only, prepended inline in DailyTrackingSection.jsx)

**Legacy file (dead):** JPG-PIT-App-main\JPG PIT v9 — Personal Investment Time.html — pre-modular monolith, not imported by anything.

---

## SECTION F — OPEN BUILD ITEMS

1. **WeekTracker isDayCompleteMarked prop cleanup** — prop passed but unused. Low priority, deferred indefinitely.
2. **Header pill color distinction** — future consideration only. Not pre-launch.
3. **removeFitnessEntry recurring safety** — gated at call site, manual entries only. Documentation note, not a bug.
4. ~~**Fitness entry Notes textbox**~~ — **BUILT 07/19/2026.**
5. ~~**Open DOP button opens wrong port**~~ — **FIXED 07/25/2026.** Now opens localhost:5173.
6. ~~**Future Tasks cap copy mismatch in HelpPanel**~~ — **FIXED 07/25/2026.** Copy updated.
7. **Appointment cap inconsistency** — Add button visibility check (total visible < 5) doesn't match addAppt() guard (future-dated only < 5). Can produce silently-inert Add button when past-due appointments present.
8. **pit_instructions_seen not user-scoped** — missing {uid} in key. Two users sharing a browser share this flag. Low priority, fix when multi-user testing begins.
9. **Stale AI model ID** in services/ai.js — model string is claude-sonnet-4-20250514. Correct before real key is wired.
10. **ArchiveView and BooksView hand-roll their own nav bars** instead of reusing Header, and their Today buttons skip backToday() — can leave archiveMode stuck true after Archive → Today navigation.
11. **Dead code catalogued:** SummarySection's unused onLimitHit destructure; DailyTrackingSection's unused MEDITATION_DURATIONS import; emptyForm()'s unused amWorkout/meditationDuration fields; styles.js gbtn/dbtn duplication; removeFitnessEntry's isRecurring param never passed by any caller.
12. **CLAUDE.md credential note is wrong** — states test/test123; actual is test/JPG2026 and doug/jpg2026. Needs correction next session.

### Pending natural verification
- **One Thing check-off First Action Step append** — built and committed 07/23/2026. Doug to verify in daily Brave session: tick One Thing, confirm First Action Step text appended in parentheses and field cleared.

---

## SECTION F2 — COACH DATA TRANSMISSION SPEC (LOCKED DESIGN — NOT YET BUILT)

**Status:** entirely unbuilt. No transmission code beyond the existing `callSheet` stub. Requires a dedicated scoping session before any code.

**Locked transmission rules by section:**

| Section | What goes to coach |
|---|---|
| Wake Up Time | Full value sent |
| Weight | Full value sent |
| Sleep Score | Full value sent |
| Fitness Yesterday | Full data sent (activity, distance, type, etc.) |
| Thankful For | Complete/not-complete flag only |
| To Accomplish | Complete/not-complete flags for each item |
| NIT | Word count only |
| Devotional | Word count only |
| Book Study | Word count only |
| Discoveries | Word count only |
| Quotes | Word count only |
| Appointments | Yes/no used flag only |

---

## SECTION G — CONFIRMED WORKING FEATURES (verified via full source read, 07/25/2026)

Login/Auth (case-insensitive, hub_user auto-login), two-tier gold color system, Wake Up Time combobox with validation, Fitness Yesterday multi-entry (with Notes field), Configure Recurring Fitness, To Accomplish carryover with identity preservation, Clear Items with origin memorialization, compactTasks compaction system (5 wired sites), reverse-move system (4 handlers), One Thing manual check-off with First Action Step append and clear (07/23/2026), Move to Daily Task forward promotion, removeTask dual-branch logic, Future Tasks 20-slot array (18 effective), Day Complete system, AI Summary with rate limit, Important Discoveries with persistent library, Appointments, SMS reminder UI placeholder (no backend), Daily Book Study with carryover, persistent Prayer/Silence preference, Week tracker/coach submit stub, HelpPanel (16 sections — Future Tasks and Thankful For copy updated 07/25/2026), Archive/Books views, Never Twice, Vitest test infrastructure (1 smoke test), "Rest and Recovery" activity type in manual fitness entry (07/23/2026), Open DOP button corrected to port 5173 (07/25/2026).

---

## SECTION H — PITButton / Open DOP Button

- **File:** app\PITApp.jsx — DOPBtn inline component at line 1359
- **Port:** opens `http://localhost:5173/?hub_user=${currentUser.id}` — FIXED 07/25/2026 (was 5174)
- **Rendered twice:** top (`<DOPBtn top />`) and bottom (`<DOPBtn />`) of the main form
- **Post-Supabase:** URL will change to production DOP domain; hub_user param goes away with central auth

---

## SECTION I — KNOWN DECISIONS AND CONSTRAINTS

**30-Day Cycle Architecture (locked 07/26/2026):**
- All client cycles are exactly 30 days anchored to the client's chosen start date — not the calendar month
- Client sets their start date when they are ready to begin tracking (not automatic on first login)
- Period close fires on day 30. New cycle starts day 31. No exceptions.
- No calendar month alignment, no app suggestion to align to the 1st, no client choice about cycle length
- Months with 28, 29, 31 days are irrelevant — the cycle is always 30 days
- Start date is shared across DOP, PIT, and OBT — one value, stored under `{username}_jpg_start_date`
- Coach can adjust a client's start date if needed
- Staggered start dates across clients is intentional — distributes coaching workload evenly across the month
- Impact on PIT: weekly and monthly rhythm anchors to client start date, not calendar dates
- Post-Supabase: start date moves to shared backend field

---

## VERSION HISTORY

| VERSION | DATE | CHANGES |
|---|---|---|
| v2.3 | 07/17/2026 | Reverse-move system, compaction system, test infrastructure, prior backlog. |
| v2.4 | 07/19/2026 | Fitness entry Notes textbox built. Full source investigation — corrected credentials, flagged 8 new issues. |
| v2.5 | 07/23/2026 | One Thing manual check-off updated — First Action Step text appended in parentheses and field cleared on check. Item 13 closed. |
| v2.6 | 07/23/2026 | "Rest and Recovery" added as first option in manual fitness entry Activity Type dropdown (DailyTrackingSection.jsx inline prepend — ACTIVITY_TYPES constant unchanged). Configure Recurring Fitness dropdown unaffected. |
| v2.7 | 07/25/2026 | Open DOP button port corrected from 5174 to 5173 (item 5 closed). HelpPanel Future Tasks copy updated — cap reference removed, move directions added. HelpPanel Thankful For copy updated — repeats note added (item 6 closed). PITButton section added. CLAUDE.md credential correction logged as item 12. Storage key pit_ai_summary_last_used_{uid} added to Section D. Component notes updated. |

---

*JPG-SYS-PIT-CodeLogic-WRK-v2.7 | Jones Performance Group LLC | CONFIDENTIAL | 07/25/2026*

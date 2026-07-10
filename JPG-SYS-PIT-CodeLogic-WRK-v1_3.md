# JPG — PIT CODE LOGIC
## Personal Investment Time — Full App Code Logic and Build Reference
**Document ID:** JPG-SYS-PIT-CodeLogic-WRK-v1.3
**Date:** 07/10/2026 | **Prepared by:** Claude | **State:** WRK
**Classification:** CLASS 1 — CONFIDENTIAL

---

## PURPOSE OF THIS DOCUMENT

This is the single source of truth for everything about the PIT
app — logic rules, UI parameters, color values, component
decisions, build status, and locked design decisions. One doc,
one app, everything in it.

**Update rule:** at the end of every PIT session, add new
decisions to the appropriate section before handoff. Nothing
about PIT is decided in chat and not recorded here.

---

## SECTION A — PIT APP IDENTITY

- **App name:** Personal Investment Time (PIT)
- **Dev port:** 5174
- **Repo:** Doug2752/JPG-PIT-App
- **Local folder:** C:\JPG-PROJECTS\JPG-PIT-App
- **Framework:** React + Vite, Class 3 modular structure
- **Storage:** localStorage (pre-Supabase)
- **Test login:** test / test123 (case-insensitive)
- **Browser for testing:** Firefox (localhost:5174)
- **Daily-use browser:** Brave (auto-opens 5174 — stop Brave
  before starting dev server during work hours)
- **CLAUDE.md:** exists in repo root, committed 07/06/2026

---

## SECTION B — COLOR SYSTEM (LOCKED)

PIT is the visual reference standard all other apps align to.

| Constant | Hex | Role |
|---|---|---|
| GOLD_LIGHT | #ddb94a | Clickable/action elements. Generate Summary, +Add, nav buttons, ENTER button, toggles, Open DOP button background. Black text + 1.5px solid black border on light backgrounds. |
| GOLD | #B8860B | Informational/non-interactive elements. Section headers, result panels, status bars. Black text + 1.5px solid black border on light backgrounds. |

**Two-tier gold rule (locked):**
- GOLD_LIGHT (#ddb94a) = clickable/action
- GOLD (#B8860B) = informational/non-interactive
- Both: black text + 1.5px solid black border on light/white
  backgrounds
- Exception: elements on dark/black nav bar get NO black border

**NEVER use #B8962E** — deprecated gold, must never appear.

**Past Due badge red (added v1.3):** #cc2222 — used only for the
Appointments "PAST DUE" pill (white text). Distinct from RED
(#c0392b) used for the One Thing box.

---

## SECTION C — UI PARAMETERS (LOCKED)

### Open DOP Button (DOPBtn)
- **File:** app\PITApp.jsx, DOPBtn component (line numbers drift
  as the file grows — reference by component name)
- **Component:** DOPBtn
- **Instances:** top (`<DOPBtn top />`) and bottom (`<DOPBtn />`)
- **Background:** GOLD_LIGHT (#ddb94a)
- **Border:** 1.5px solid #000
- **BorderRadius:** 5
- **Padding:** 5px 14px
- **Width:** 100%
- **Text color:** #000
- **FontSize:** 15
- **FontWeight:** 900
- **LetterSpacing:** 1
- **Cursor:** pointer
- **MarginBottom:** 14 when top=true, else 0
- **MarginTop:** 0 when top=true, else 14
- **Style reference:** matches NEVER TWICE box treatment
  (same as DOP's Open PIT button)
- **Committed:** 07/07/2026

### Wake Up Field (07/08/2026)
- **File:** components\DailyTrackingSection.jsx, Wake Up field
- **Control type:** combobox — `<input list>` + `<datalist>`
- **Options source:** utils\date.js WAKE_TIMES array
- **Options:** 96 entries, full 24-hour range in 15-min
  increments, 12-hour AM/PM format ("1:00 AM" style — no
  leading zero on hour)
- **Storage key:** `wakeTime`
- **Storage format:** 12-hour AM/PM string (e.g. "7:30 AM")
- **Legacy migration:** old 24-hr stored values ("07:30")
  display via `to12Hour()` helper. Underlying storage left
  alone until user re-saves; then normalized to AM/PM format.
- **Write-in validation** (via `normalizeWakeTime()`):
  - Accepted formats: "H:MM AM/PM" or "HH:MM AM/PM"
  - Case-insensitive on AM/PM
  - Tolerant of spaces
  - Minutes must be 00, 15, 30, or 45
  - AM/PM required
- **Invalid entry:** red inline error under field, bad value
  not persisted, `upd('wakeTime', ...)` skipped
- **Empty entry:** clears the stored value
- **Commit on:** blur
- **Committed:** 07/08/2026

### Fitness Yesterday — Multi-Entry (07/08/2026)
- **File:** components\DailyTrackingSection.jsx +
  app\PITApp.jsx + utils\form.js
- **Selector:** Yes / No / Rest Day (3 options)
- **Selector behavior:**
  - "Yes" → shows fitness entry blocks
  - "No" → hides entry blocks, resets entries
  - "Rest Day" → hides entry blocks, resets entries
  - "" (Select) → hides entry blocks, resets entries
  - Switching TO "Yes" preserves entries (nothing to preserve
    on first switch — just shows the single empty entry)
- **Storage shape:** `fitnessEntries: [ {...} ]` — array
  of entries. Each entry object contains: fitnessActivity,
  cardioDistance, terrain, yogaType, swimEnvironment,
  swimStroke, fitnessActivityOther
- **Empty entry helper:** `emptyFitnessEntry()` in utils\form.js
- **Migration on read:** `withFitnessMigration(d)` in
  utils\form.js — wraps legacy flat fields into
  fitnessEntries:[{...}] and strips old flat keys.
  Called at BOTH setFd(JSON.parse(...)) sites in PITApp.jsx:
  loadToday() and openArchive() (date jump).
- **CRUD handlers** (in PITApp.jsx, next to updTask/removeTask):
  - `updFitnessEntry(i, patch)` — patch-object signature
    (allows Activity Type change to clear that entry's
    dependents in one write)
  - `addFitnessEntry()` — appends emptyFitnessEntry()
  - `removeFitnessEntry(i)` — no-op when only 1 entry left
- **UI per entry:**
  - Entry N label
  - Activity Type dropdown (options: ACTIVITY_TYPES from
    utils\constants.js, now includes Hiking)
  - Distance + Terrain fields shown when isDistanceActivity()
  - Yoga Type shown when activity = Yoga
  - Swim fields shown when activity = Swim
  - Describe field shown when activity = Other
  - Remove button (Appointments styling: transparent bg,
    1px #ccc border, 4px radius, 10px font). Hidden when
    fd.fitnessEntries.length === 1.
- **"+ Add Fitness Activity" button:**
  - Below the last entry
  - Styling: full-width, GOLD_LIGHT, 1.5px solid #000,
    5px radius (Appointments +Add pattern)
- **Committed:** 07/08/2026

### Terrain Dropdown (07/08/2026)
- **File:** utils\constants.js TERRAIN_OPTIONS
- **Options:** ['Road', 'Trail', 'Beach', 'Treadmill', 'Other']
- **Trigger:** shown per-entry when isDistanceActivity()
  matches that entry's activity type
- **Committed:** 07/08/2026

### Activity Type Dropdown (07/08/2026)
- **File:** utils\constants.js ACTIVITY_TYPES
- **Change:** 'Hiking' added (fixes DISTANCE_ACTIVITIES
  mismatch — Hiking was in DISTANCE_ACTIVITIES but not in
  ACTIVITY_TYPES, so it could never be chosen)
- **Committed:** 07/08/2026

### AM Fitness Today Selector (07/08/2026)
- **File:** components\DailyTrackingSection.jsx, lines 221-231
- **Storage key:** `amWorkout`
- **Options:** "" (Select), "Yes", "No", "Rest Day"
- **Storage:** stores literal string of selection
- **Downstream logic:** amWorkout is NOT part of day-complete
  logic — pure stored string with no branching anywhere.
  Adding "Rest Day" cannot break any existing behavior.
- **Committed:** 07/08/2026

### To Accomplish — Clear Items button + modal + toast (07/09–07/10/2026)
- **Files:** components\ToAccomplishSection.jsx (button, modal,
  toast render) + app\PITApp.jsx (state + handler + derived list)
- **Button label (FINALIZED):** "Clear Items"
  (resolves H.6/H.15 wording non-decision)
- **Button location:** top-right of To Accomplish section header
  row, opposite the section title
- **Button visibility:** only when at least one slot has content
  (oneThing non-empty OR any tasks[0-4] has text)
- **Button styling:** GOLD_LIGHT (#ddb94a), 1.5px solid #000,
  borderRadius 5, black text, fontSize 12, fontWeight 700,
  padding 4px 10px
- **Modal:** fixed full-screen overlay (rgba(0,0,0,0.5)),
  centered white `card` with 2px solid GOLD border,
  maxWidth 420, maxHeight 80vh scroll. Lists occupied slots as
  checkbox rows (slot label + item text + "Origin: <day>").
  Checkboxes unchecked by default, reset on open. Cancel
  (transparent, #ccc border) / Confirm (GOLD_LIGHT).
- **Toast (FINALIZED):** singular-aware — "1 item cleared" when
  count is 1, "N items cleared" for 2+. GOLD background, black
  text, fixed bottom-center, borderRadius 5, padding 10px 20px,
  auto-clears after 2500ms. (resolves H.6/H.15 toast non-decision)
- **Props passed to ToAccomplishSection:** showClearModal,
  onClearModalOpen, clearModalItems, onClearConfirm,
  onClearCancel, toastMessage
- **Committed:** 07/09–07/10/2026 (commit cdba3c4)

### Appointments — resolution checkbox + Past Due badge (07/09–07/10/2026)
- **File:** components\AppointmentsSection.jsx
- **Resolution checkbox:** left of the "Appointment N" header
  label. onChange → resolveAppt(a.id). accentColor GOLD, 16x16.
- **Past Due badge (PLACEMENT FINALIZED — INSIDE the row):**
  in the appointment header row, right of "Appointment N".
  Shown when `a.date && a.date < todayStr()`.
  Styling: background #cc2222, white text, borderRadius 4,
  fontSize 10, fontWeight 700, padding 2px 8px, marginLeft 8.
  (resolves H.15 inside/outside non-decision → INSIDE)
- **Committed:** 07/09–07/10/2026 (commit f884a70)

### Archive — "No PIT entry for this day" message (07/09–07/10/2026)
- **File:** app\PITApp.jsx render logic (dedicated early-return
  branch when archiveMode && noEntryDate)
- **Message:** "No PIT entry for this day"
- **Styling:** fontSize 16, color #888, textAlign center,
  padding 40px 0
- **Committed:** 07/09–07/10/2026 (commit 6a1aa32)

---

## SECTION D — BUILD STATUS

### BUILT AND COMMITTED:
- Appointments with real ISO date field, independent storage
  key, date-filtering ✓
- AI Summary — pulls all sections, today + 7 prior days
  fixed, no client control ✓
- Persistent Prayer/Silence preference (pit_devtype_${uid}
  key, written in action handler not useEffect) ✓
- Open DOP button (DOPBtn) NEVER TWICE style ✓
- Wake Up combobox (24-hour AM/PM dropdown + write-in with
  validation, legacy 24-hr display fallback) ✓ 07/08/2026
- Fitness Yesterday multi-entry (array shape, Add/Remove per
  entry, migration-on-read at both setFd sites) ✓ 07/08/2026
- Fitness Yesterday Rest Day option ✓ 07/08/2026
- AM Fitness Today Rest Day option ✓ 07/08/2026
- Terrain: Treadmill added ✓ 07/08/2026
- Activity Type: Hiking added (mismatch fix) ✓ 07/08/2026
- **Future Tasks Remove button — works on ALL slots including
  the last (list can reach zero rows; "+ Add Future Task"
  re-adds). ✓ 07/09/2026 (commit 72247b2)**
- **Appointments: no default empty box — empty array renders
  only "+ Add Appointment"; removing the last row returns to
  the button-only state. Orphaned empty-placeholder rows from
  the old auto-add behavior filtered out on load in
  loadAppointments(). ✓ 07/09/2026 (commits 72247b2, b1fb3ad)**
- **TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM (Section H)
  — BUILT AND COMMITTED as Steps 2–9 (07/09–07/10/2026). ✓**
  As-built detail in Section H.16. Summary of what shipped:
  - Parallel `toAccomplishItems` item-ID field + migration-on-read
    (`withCarryoverMigration`) ✓ (commit 11651d0)
  - `rebuildToAccomplishItems` in save() — parallel field stays in
    sync on every write ✓ (commit ccc7816)
  - On-load carryover pull (`applyCarryover`) with origin lineage
    preserved ✓ (commits 9291ed0, b1fb3ad)
  - Check-off with origin-day memorialization (`resolveCarriedItem`,
    Option A — no reversible uncheck) ✓ (commit b1fb3ad)
  - Selective "Clear Items" modal + toast ✓ (commit cdba3c4)
  - Appointments carryover + Past Due badge + resolution checkbox
    ✓ (commit f884a70)
  - Appointment resolution_date on the scheduled-date record
    ✓ (commit aea0dce)
  - Archive read-only enforcement (13 write handlers guarded) +
    "No PIT entry for this day" state ✓ (commit 6a1aa32)

### KNOWN GAPS (not yet built):
- **Archive per-day carried-status indicator** — the DATA model
  supports H.5 (an item's origin day resolves to done/cleared
  while intermediate days retain resolution_status null, and
  `carried_dates[]` records every day an item appeared). But
  Archive does NOT yet render a visible "carried, unresolved"
  label per day. Archive shows the stored form read-only; the
  carry metadata is captured but not surfaced as a status
  indicator. See H.15 (remaining non-decision) and H.16.
- (Future Tasks Remove button — RESOLVED, now built. Removed
  from this list.)

### HELD — COMBINED PASS (do not send individually):
All PIT instructions-panel items held together:
1. Q2/Q3 copy update — **now UNBLOCKED** by the carryover build
   (old "no carryover — intentional" language is obsolete;
   see H.13). Still held as part of the combined pass until
   explicit go-ahead.
2. "Daily Trackables" sub-heading above first 5 Required
   Fields
3. Panel-wide layout restructure (section titles on own
   lines)
4. Auto-save reminder text (mirror from live app once
   placement decided)
5. AI Summary instructions update (pulls all sections,
   today + 7 days fixed, no client control)

### DESIGN LOCKED — NOT YET BUILT:
- (To Accomplish + Appointments carryover system — RESOLVED,
  BUILT AND COMMITTED as Steps 2–9. Moved to "Built and
  Committed" above. Section H retained as the locked design of
  record; H.16 records the as-built implementation.)
- None currently.

### POST-SUPABASE (do not build now):
- SMS reminder (UI placeholder only — no backend wired,
  no SMS actually sent)
- Coach-facing archive (Q5)
- Cross-app data transfer from DOP Tomorrow's Priorities

---

## SECTION E — PERSISTENCE PATTERNS (LOCKED)

**Persistent preference pattern:** write preference in
action handler, NOT in useEffect watcher. Prevents
mount-time race condition. Applied to Prayer/Silence
preference. Apply this pattern elsewhere as needed.

**Storage key pattern:** `pit_devtype_${uid}` — per-user
key scoped to uid. Related keys: `pit_${uid}_${date}` (per-day
record), `pit_arch_${uid}` (archive date list), `pit_appts_${uid}`
(per-user appointments array — NOT per-day).

**Migration-on-read pattern:** for storage-shape changes,
wrap raw stored JSON via a `withXMigration(d)` helper at
every setFd(JSON.parse(...)) site. Applied to fitness
entries AND (v1.3) to the To Accomplish carryover item-ID
field via `withCarryoverMigration(d)`, chained after
`withFitnessMigration` at both loadToday and openArchive.

**Parallel-field pattern (added v1.3):** when a new data model
would break the existing UI/consumers if it replaced the
source fields, store the new model as a PARALLEL array
alongside the untouched source fields rather than replacing
them. Used for `toAccomplishItems` (kept oneThing/tasks[] as
source-of-truth; added the item-ID array beside them). See
H.16 for why replacement was rejected.

**Rebuild-on-save pattern (added v1.3):** a parallel field is
kept in sync by rebuilding it from the source fields inside
`save()` on every write (`rebuildToAccomplishItems`), preserving
prior per-item metadata (id, origin_date, resolution fields,
carry history) and refreshing only the volatile values
(text/done).

**Archive read-only guard pattern (added v1.3):** every write
handler returns immediately when `archiveMode` is true
(`if (archiveMode) return;`). Applied to all 13 write handlers
(see H.16). Presentational-only state (`archiveMode`) gates
writes globally rather than per-control.

---

## SECTION F — KNOWN BEHAVIORS

**Appointments:** working Remove button confirmed live.
Per-row Remove is silent delete with no historical trace.
Under Section H design, Remove keeps this behavior — the
graceful "carry until acted on" model handles the historical
trace differently (via check-off or auto-carry with badge).
**BUILT (v1.3):** past-due appointments now carry forward with
a "PAST DUE" badge; a resolution checkbox marks them
resolved:true + resolution_date on the per-user array (see H.16).

**Future Tasks:** ~~no Remove button — confirmed gap.~~
**BUILT (v1.3):** Remove works on all slots including the last;
the list can reach zero visible rows and "+ Add Future Task"
re-adds one.

**AI Summary:** pulls every section of PIT, covers today
plus 7 most recent days. Fixed by design — no client
control. Button label and HelpPanel text updated. (Note:
AI Summary reads the source oneThing/tasks fields, not the
parallel toAccomplishItems metadata — unaffected by v1.3.)

**SMS Reminder:** UI placeholder only. No backend wired.
No SMS actually sent. Post-Supabase.

**Archive:** client-side lookback only. Coach-facing
version not possible without Supabase. **BUILT (v1.3):
Archive is strictly read-only** — all 13 write handlers no-op
under archiveMode. Days with no saved record show
"No PIT entry for this day."

**To Accomplish (Q2/Q3) — behavior REVERSED and BUILT (v1.3):**
~~checked items disappear from next day's view; unchecked items
do NOT auto-carry.~~ Now: unchecked items auto-carry forward to
the next PIT day at their original slot position; checking a
carried item memorializes it "done" on its origin day and frees
today's slot (Option A — no reversible in-place uncheck). Items
can also be dismissed via the "Clear Items" modal
(memorialized "cleared"). See H.16.

---

## SECTION G — PENDING REAL-WORLD VERIFICATION

**To Accomplish + Appointments carryover system (Steps 2–9)** —
committed 07/09–07/10/2026. Verified at the code level per step
(read-back of every handler/helper) and browser-checkable per
step. Full multi-calendar-day real-world verification — carry
across actual day boundaries, origin-day memorialization over a
multi-day lingering item, past-due appointment accrual — accrues
in normal daily use. Watch items during daily use:
- Carryover fires only when today has no saved record yet; the
  first edit of the day creates today's record and stops
  re-firing.
- Resolved/cleared items must not re-carry the next day.
- Archive controls must be fully inert (checkboxes snap back).

All prior committed PIT features remain browser-verified
end-to-end in daily use.

---

## SECTION H — TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM

**STATUS: DESIGN LOCKED 07/08/2026 — BUILT AND COMMITTED
07/09–07/10/2026 (Steps 2–9). H.1–H.15 below are the locked
design of record (unchanged). H.16 records the as-built
implementation, deviations, and resolved non-decisions.**

This section captures the full locked design for the To
Accomplish carryover system, selective clear behavior,
Appointments carryover, past-due handling, Archive states,
and the underlying data model. H.1–H.15 describe the target
design; H.16 describes what actually shipped.

### H.1 — Scope and reversal note

The current PIT locked behavior (Section F) is:
- Checked items disappear from next day's view
- Unchecked items do NOT auto-carry — intentional

This design REVERSES the second rule. Under the new design,
unchecked items WILL auto-carry forward to subsequent days
until they are either checked (marked done) or cleared
(dismissed via the selective clear modal). This applies to
both To Accomplish (Q2 One Thing + Item 2 + Item 3, and
whatever Q3 has) and Appointments.

### H.2 — Fixed slots (To Accomplish)

To Accomplish is NOT a growing list. It is a set of fixed
slots with defined semantic meaning:
- One Thing (primary priority — the priority, not just first)
- Item 2
- Item 3
- (Q3 slots follow the same fixed-slot model)

Slot semantics matter — "One Thing" is not interchangeable
with "Item 2." Carried items preserve their slot position
across days.

### H.3 — Carryover mechanic

- Fires when PIT opens on a date newer than the most recent
  PIT session date.
- Pulls unchecked items from the most recent PIT day and
  copies them into today's slots at their original position.
- No midnight rollover, no server-side scheduler — purely
  "on load, check date, if new, pull forward."

**Skipped days:** if Doug skips a day entirely (never opens
PIT), no PIT record exists for that day. When PIT next
opens, carryover pulls from the most recent day that had
a PIT session. Skipped days are not silently backfilled.

**Archive display for skipped days:** shows "No PIT entry
for this day" (or similar clear indicator). Not a blank
empty form.

### H.4 — Checking off and memorialization

Checking happens on today's screen against carried items,
not by navigating back to the origin day.

**Origin-day memorialization rule:** when an item is
checked done or cleared, history records the resolution
against the day the item was ORIGINALLY ADDED — not the
day the action happened.

- **To Accomplish origin day** = day the item was added
  to the slot
- **Appointment origin day** = the appointment's SCHEDULED
  DATE (not the add date). This is different from To
  Accomplish — for a calendared event, the scheduled date
  is the relevant historical anchor.

Trade-off accepted: this means the day an item was actually
resolved is not tracked. Rationale: most items are done the
day added or the next morning; adding a "which day did you
finish this?" prompt is over-engineering. Origin day is
good enough.

**When a carried item is checked off on today's screen:**
- History for the origin day updates: item marked done.
- Today's slot is freed and becomes empty (available for a
  new entry for today).
- The item does not carry to tomorrow.

### H.5 — Lingering items and Archive display

An item added Monday that carries unresolved through Tue,
Wed, Thu, and is finally checked Friday appears in Archive
as follows:

- **Monday:** item present in slot, status "carried,
  unresolved" (at end of day)
- **Tue/Wed/Thu:** item shown in slot, status "carried,
  unresolved" for each day it appeared
- **Friday:** item appears in original slot on Monday's
  record as "done" (origin-day memorialization). Tue/Wed/Thu
  records retain the "carried, unresolved" status they had
  at the time.

This gives Doug the visibility of "I had this hanging over
me for 4 days" while keeping resolution semantically tied
to origin.

### H.6 — Selective Clear (button, modal, behavior)

- **Button label:** "Clear Selective Items" (or similar —
  final wording confirmed at build time)
- **Location:** top-right of To Accomplish section,
  opposite the section title
- **Visibility:** only shown when at least one slot has an
  item in it (carried or added today). Hidden when all
  slots are empty.
- **Scope:** To Accomplish only. Does NOT appear on
  Appointments (Appointments use their existing per-row
  Remove button).

**Modal behavior:**
- Opens showing occupied slots as checkbox rows
- Each row displays: item text + origin day
- User checks items to clear, leaves others unchecked
- **Cancel button:** always present — closes without
  clearing anything
- **Confirm button:** applies clears

**Clear action:**
- Cleared items memorialize on origin day with status
  "cleared" (distinct from "done" and distinct from
  "carried, unresolved")
- Slots for cleared items become empty on today's screen
- Uncleared items remain in their slots and continue to
  carry
- Post-clear feedback: brief toast "N items cleared"
  (fades in 2–3 seconds)

**Same-day clear valid:** Doug can add an item to a slot
today and clear it the same day (e.g. priority change
mid-day). History records that item as "cleared" on today.

### H.7 — Appointments — shared carryover model

Appointments follow the same underlying carryover pattern
as To Accomplish, with these specific rules:

- **Origin day:** the scheduled date of the appointment
  (not the add date).
- **Past-due behavior:** appointments past their scheduled
  date carry forward with a visual "Past Due" badge.
  No auto-expiry. They follow Doug until he acts.
- **Check-off:** checking a past-due appointment
  memorializes it as "done" on the scheduled date.
- **Existing Remove button:** kept as-is (silent delete,
  no historical trace). No behavior change.
- **No selective clear modal on Appointments.** Remove
  per-row is sufficient.

### H.8 — Archive (read-only)

Archive is strictly read-only. View past days, cannot
check, uncheck, clear, add, or remove anything.

Rationale: once Archive is editable, retroactive changes
create propagation questions ("does un-checking an item on
Monday put it back on Tuesday's list?"). The whole design
assumes checking happens on today's screen. Archive is a
lookback tool only.

### H.9 — Order of carried items

Carried items preserve their slot position from the prior
day. Example: Monday had One Thing = X, Item 2 = Y, Item 3
= Z. Doug checks off One Thing. Tuesday shows One Thing
slot = empty, Item 2 = Y (carried), Item 3 = Z (carried).

User can change slot placement manually via the selective
clear modal (clear an item from one slot, add to another).
No automatic compression / reordering.

### H.10 — Data model (item-ID)

**Locked model: item-ID with unique IDs and resolution
metadata.** Each To Do item and each Appointment has:

- `id` — unique identifier
- `origin_date` — ISO date the item belongs to (add date
  for To Do, scheduled date for Appointments)
- `slot` — for To Do: which slot the item occupies (One
  Thing / Item 2 / Item 3 / Q3 slots). N/A for Appointments.
- `text` — the item text
- `resolution_status` — one of: null (still open),
  "done", "cleared"
- `resolution_date` — ISO date the resolution action was
  taken (informational — not used for memorialization
  display, since memorialization is on origin_date)
- `carried_dates[]` — list of ISO dates the item appeared
  in Archive (populated as it carries forward)

Each day's storage references items by ID rather than
duplicating the item text. Single source of truth per
item. Supabase-ready.

> **As-built amendment (see H.16):** the build kept the
> source fields (oneThing/oneThingDone/tasks[]) as the
> single source of truth and stored the item-ID model as a
> PARALLEL `toAccomplishItems` array alongside them, rather
> than replacing the per-day fields with pure ID references.
> Appointments store the resolution metadata (resolved,
> resolution_date) directly on the existing per-user
> appointment objects.

### H.11 — Migration considerations

**Existing PIT storage:** current To Accomplish and
Appointments data uses a per-day duplicate model (each
day's stored JSON contains the item text directly, not an
ID reference).

**Migration on read:** when a stored day is loaded, a
`withCarryoverMigration(d)` helper wraps existing per-day
fields into the item-ID model. Legacy items get IDs
generated at first read, resolution_status inferred from
the existing checked/unchecked state.

**Apply at every setFd(JSON.parse(...)) site** — same
pattern as the fitness migration. Confirm ALL read paths
before build (loadToday, openArchive, and any others
identified during investigation).

**Investigation-before-action required:** before build
begins, a read-only investigation pass must identify:
- Every read/write path for To Accomplish fields
- Every read/write path for Appointments fields
- Current storage shape and field names
- Any downstream code that depends on the current shape
  (AI summary, calcWeekStatus, calcStreak, etc.)
- Confirm no other consumers break under item-ID model

### H.12 — Build sequencing recommendation

This is a large build. Recommended sequencing when work
begins:

1. Investigation pass (read-only, comprehensive)
2. Data model + migration helper (utils\form.js or new file)
3. Storage layer updates (writes go through item-ID)
4. To Accomplish carryover mechanic (on-load pull)
5. To Accomplish check-off with origin-day memorialization
6. Selective Clear modal + toast feedback
7. Appointments carryover + Past Due badge
8. Appointments check-off with scheduled-date memorialization
9. Archive read-only enforcement + "No entry for this day"
   state
10. Full browser verification against every scenario in H.14

Each step commits separately via GitHub Desktop.

> **As-built:** this sequence was followed. Steps mapped to
> commits 11651d0 (Step 2), ccc7816 (Step 3), 9291ed0 /
> b1fb3ad (Step 4), b1fb3ad (Step 5), cdba3c4 (Step 6),
> f884a70 (Step 7), aea0dce (Step 8), 6a1aa32 (Step 9).
> Step 3 (storage sync) was implemented as rebuild-on-save
> rather than a separate storage layer.

### H.13 — Instructions-panel copy implications

When the To Accomplish carryover is built, the held
combined instructions-panel copy pass (Section D — Held)
Q2/Q3 copy item must be rewritten to reflect the new
behavior. The old "no carryover — intentional" language
becomes obsolete. Do not send the copy pass until the
carryover build is complete and verified.

> **As-built status:** the carryover build is now complete
> and committed. The Q2/Q3 copy rewrite is UNBLOCKED but
> remains held as part of the combined instructions-panel
> pass until explicit go-ahead.

### H.14 — Scenario decisions (traceable)

The following decisions were locked during the design
walk-through 07/08/2026. Each is traceable to a scenario
number.

- **S1:** Checking off a carried item on today's screen
  frees that slot for today's use. ✓ (built)
- **S2:** Skipped days show "No entry for this day" in
  Archive; carryover pulls from most recent PIT day. ✓ (built)
- **S3:** Lingering item shows "carried, unresolved" in
  Archive for every day it was open; "done" on origin
  day only. ✓ (data supports; visible Archive indicator
  NOT yet built — see H.16 / Section D Known Gaps)
- **S4a:** Selective-clear modal has Cancel button. ✓ (built)
- **S4b:** Post-clear feedback via brief toast "N items
  cleared." ✓ (built; singular-aware)
- **S4c:** Clear Selective Items button only visible when
  at least one slot has an item. ✓ (built)
- **S5:** Same-day add-and-clear is valid. ✓ (built)
- **S6:** Archive is strictly read-only. ✓ (built)
- **S7:** Appointment origin day = scheduled date. ✓ (built)
- **S8:** Past-due appointments carry forward with visual
  badge, no auto-expiry. ✓ (built)
- **S9:** Selective clear scope = To Accomplish only.
  Appointments keep existing per-row Remove. ✓ (built)
- **S10:** Carried items preserve slot position from
  prior day. ✓ (built)
- **S11:** Data model = item-ID with origin_date,
  resolution_status, resolution_date, carried_dates. ✓
  (built as a parallel field — see H.10 amendment / H.16)

### H.15 — Explicit non-decisions (deferred at design time)

- Exact button wording ("Clear Selective Items" vs
  alternatives) — **RESOLVED (v1.3): "Clear Items."**
- Toast styling and duration — **RESOLVED (v1.3): GOLD bg,
  black text, bottom-center, radius 5, padding 10px 20px,
  2500ms; copy singular-aware.**
- Whether "Past Due" badge sits inside or outside the
  appointment row — **RESOLVED (v1.3): INSIDE the row,
  in the header next to "Appointment N."**
- Whether "carried, unresolved" appears as literal text in
  Archive or as a visual state indicator — **STILL OPEN.**
  Not built in v1.3. The carry metadata (`carried_dates[]`,
  `resolution_status`) is stored, but Archive does not yet
  render a per-day carried-status label. Decide and build
  when the Archive status-display work is taken up.

### H.16 — AS-BUILT NOTES (Steps 2–9, 07/09–07/10/2026)

**Data model — PARALLEL FIELD (key deviation from H.10/H.11).**
The source-of-truth fields were NOT replaced. `oneThing`,
`oneThingDone`, `oneThingSetup`, and `tasks[0..4]` remain
exactly as before; the item-ID model lives in a PARALLEL
`toAccomplishItems` array on the same day record.
- Reason replacement was rejected: the entire UI plus
  `isDayComplete`/`countComplete` (`(d.oneThing || '').trim()`)
  and `services/ai.js` treat `oneThing` as a string and
  `tasks[i]` as `{text,done}`. Turning One Thing into an
  object would throw on `.trim()` (crash on load) and break
  the inputs. "Option A — parallel field" was chosen to keep
  the UI and all consumers untouched and non-breaking.
- Slot keys (as-built): `one_thing`, `daily_2`, `daily_3`
  (= Daily Tasks 2–3 = tasks[0], tasks[1]), `future_4`,
  `future_5`, `future_6` (= Future Tasks 4–6 = tasks[2..4]).
- `toAccomplishItems` entry shape:
  `{ id, slot, text, done, origin_date, resolution_status
  (null|'done'|'cleared'), resolution_date, carried_dates[] }`.
- `id` format: `` `${Date.now()}_${Math.random().toString(36).slice(2)}` ``
  (the random suffix guarantees uniqueness within a single
  millisecond map).

**Helpers (utils\form.js).**
- `withCarryoverMigration(d)` — on read, builds
  `toAccomplishItems` from occupied slots (text non-empty OR
  done). Idempotent (returns d unchanged if the array already
  exists). Applied at BOTH setFd(JSON.parse) sites
  (loadToday, openArchive), chained AFTER `withFitnessMigration`.
- `rebuildToAccomplishItems(d)` — called inside `save()` on
  EVERY write. Rebuilds from current oneThing/tasks; for a slot
  that already had an item, preserves id / origin_date /
  resolution_status / resolution_date / carried_dates and
  refreshes only text/done; new content gets a fresh id and
  origin_date = today; emptied slots are dropped.

**On-load carryover (`applyCarryover` in app\PITApp.jsx).**
- Fires only in loadToday's else-branch (no saved record for
  today).
- Prior day = max archive date strictly < today (robust to
  archive list order, not just archive[0]).
- Loads that day (migration-on-read), keeps items with
  `resolution_status === null`.
- Merges carried text into a fresh `emptyForm(today)` at the
  original slots, `done: false`.
- Seeds `today.toAccomplishItems` with the carried items,
  PRESERVING id / origin_date / resolution_status /
  resolution_date / carried_dates (only `done` reset) — so
  rebuild-on-save keeps the same id and origin lineage
  survives across the carry.
- Writes today's date into each carried item's
  `carried_dates` on the SOURCE day's record (dedup-guarded).
- Returns the merged form, or null → clean `emptyForm`.
- Future-slot visibility is automatic via ToAccomplishSection's
  content-floor; `futureTasksVisible` is untouched.

**Check-off — Option A (`resolveCarriedItem`).**
- Wired into `upd` (field `oneThingDone`) and `updTask` (field
  `done`): if the slot's item has `origin_date < today`
  (carried), the handler routes to `resolveCarriedItem`
  instead of the normal update; non-carried items
  (`origin_date === today`) take the unchanged path.
- On check-done: memorializes on the ORIGIN day (match by id)
  — `resolution_status = 'done'`, `resolution_date = today` —
  and CLEARS today's slot (text `''`, done false) so
  rebuild-on-save drops it → slot freed, will not re-carry.
- **DECISION (Option A, locked at build):** there is NO
  reversible in-place uncheck for carried items. Once checked
  done, the slot is empty; to undo, reopen the origin day.
  This resolves the inherent conflict between "clear/free the
  slot on done" and "restore on uncheck" (the two cannot
  coexist under the parallel-field/rebuild model).

**Selective Clear (Step 6).** See Section C for UI spec.
Clear action memorializes carried items as
`resolution_status = 'cleared'`, `resolution_date = today` on
the origin day (by id); today's slots are emptied; rebuild
drops them. State/handler in PITApp.jsx
(`showClearModal`, `toastMessage`, `handleClearConfirm`,
derived `clearModalItems`); modal + toast render inside
ToAccomplishSection.jsx.

**Appointments (Steps 7–8).**
- `resolved: false` added to the addAppt default shape.
- `visibleAppointments` no longer date-filters: shows ALL
  appointments where `resolved !== true`, sorted date
  ascending. Past / today / future all show; resolved hidden.
- Migration: a missing `resolved` field is treated as false
  (shown) — no data rewrite needed.
- `resolveAppt(id)` sets `resolved: true` AND
  `resolution_date: todayStr()` on the per-user appointments
  array, then saves.
- **Scheduled-date memorialization — clarification vs H.7:**
  appointments are a single per-user array
  (`pit_appts_${uid}`), NOT per-day. There is no separate
  per-day appointment record to write. "Memorialization on
  the scheduled date" is therefore realized by the resolved
  appointment RETAINING its original `date` (the scheduled
  date) and gaining `resolved` + `resolution_date`. No
  separate origin-day write is performed (none exists).
- Add-button cap left as-is: `addAppt` still caps on
  future+today `>= 5`; the AppointmentsSection "+ Add" button
  hides when `visibleAppointments.length >= 5`, which now
  includes past-due items — accepted trade-off, not changed.

**Archive read-only (Step 9).**
- `if (archiveMode) return;` guards added to ALL 13 write
  handlers: `upd`, `updMulti`, `updTask`, `handleClearConfirm`,
  `removeTask`, `updFitnessEntry`, `addFitnessEntry`,
  `removeFitnessEntry`, `updAppt`, `addAppt`, `removeAppt`,
  `resolveAppt`, `markBookComplete`. (Extended beyond the
  minimal set to `updMulti` and `markBookComplete` so archive
  is genuinely inert — those are live write paths for the
  Fitness/Devotional/Book/Quotes sections and the book-log.)
- No-entry state: `noEntryDate`. In `openArchive`, a missing
  record now sets `fd = emptyForm(date)` (so the Header shows
  the clicked date), `noEntryDate = date`, archiveMode true,
  form view; a dedicated render branch shows the Header plus
  a centered "No PIT entry for this day." `loadToday` clears
  `noEntryDate`.
- Deviation from H.11 premise: `openArchive` previously did
  NOTHING on a missing record (no blank form was ever shown);
  it now shows the no-entry message.

**Remaining gap (see H.15 / Section D):** the Archive per-day
"carried, unresolved" VISIBLE indicator (H.5) is not built.
The data supports it (`carried_dates[]`, `resolution_status`)
but Archive does not yet render a per-day carried-status label.

**Commits:** 72247b2 (Appointments no default box + Future
Tasks remove-last-slot), 11651d0 (Step 2), ccc7816 (Step 3),
9291ed0 / b1fb3ad (Step 4 + loadAppointments orphan filter),
b1fb3ad (Step 5), cdba3c4 (Step 6), f884a70 (Step 7),
aea0dce (Step 8), 6a1aa32 (Step 9). Each committed separately
via GitHub Desktop.

---

## VERSION HISTORY

| VERSION | DATE | CHANGES |
|---|---|---|
| v1.0 | 07/07/2026 | Initial version. PIT-specific Code Logic doc created. Covers app identity, color system, Open DOP button spec, build status, persistence patterns, known behaviors. Scope established: all PIT app info lives here going forward. |
| v1.1 | 07/07/2026 | No new PIT builds this session. Section G added: Pending Real-World Verification (currently empty). Document structure aligned to match DOP Code Logic v1.8. |
| v1.2 | 07/08/2026 | Wake Up 24-hour combobox with write-in validation BUILT AND COMMITTED (spec in Section C). Fitness Yesterday multi-entry array + Rest Day option BUILT AND COMMITTED (spec in Section C). Terrain Treadmill added, Activity Type Hiking added (mismatch fix) BUILT AND COMMITTED (spec in Section C). AM Fitness Today Rest Day option BUILT AND COMMITTED (spec in Section C). Section D updated: 6 new "built and committed" items, new "Design Locked — Not Yet Built" category added for carryover system. Section E updated: migration-on-read pattern locked as reusable persistence pattern. Section F updated: reversal note added to current To Accomplish behavior. Section H added in full: To Accomplish + Appointments Carryover System — complete locked design spec (scope, fixed slots, carryover mechanic, origin-day memorialization, lingering items, Selective Clear modal, Appointments shared model with scheduled-date rule, read-only Archive, item-ID data model, migration considerations, build sequencing, scenario decisions traceable to S1–S11, explicit non-decisions deferred to build time). |
| v1.3 | 07/10/2026 | **TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM (Section H) BUILT AND COMMITTED as Steps 2–9 (07/09–07/10/2026).** Section H moved from "Design Locked — Not Yet Built" to "Built and Committed"; H.1–H.15 preserved as the design of record; H.16 added with full as-built notes, deviations, and commit map. **Key build decisions recorded:** (1) PARALLEL-FIELD data model — `toAccomplishItems` item-ID array stored ALONGSIDE the untouched oneThing/tasks source fields (replacement rejected because it would crash isDayComplete/ai.js/UI); new patterns added to Section E (parallel-field, rebuild-on-save, archive read-only guard). (2) Check-off Option A — no reversible in-place uncheck for carried items; check-done memorializes on origin day and frees the slot. (3) Appointment memorialization = resolved:true + resolution_date on the per-user array retaining scheduled date (no per-day write; appointments are per-user, not per-day). (4) Archive strictly read-only via `if (archiveMode) return;` on all 13 write handlers (extended to updMulti + markBookComplete); "No PIT entry for this day" state added. **Also built/committed this session:** Future Tasks Remove works on all slots incl. the last; Appointments no default empty box + loadAppointments orphan-row filter. **Section C:** new UI-parameter subsections for Clear Items button/modal/toast, Appointments resolution checkbox + Past Due badge, and the no-entry message. **Section B:** Past Due badge red #cc2222 recorded. **H.15 non-decisions RESOLVED:** button label "Clear Items"; toast styling/duration + singular-aware copy; Past Due badge INSIDE the row. **H.15 still OPEN:** Archive per-day "carried, unresolved" VISIBLE indicator NOT built (data supports it via carried_dates[]/resolution_status; no status label rendered) — logged in Section D Known Gaps, H.14 S3, and H.16. **Section F/G updated** to reflect built behaviors and carryover real-world verification accruing in daily use. |

---

*JPG-SYS-PIT-CodeLogic-WRK-v1.3 | Jones Performance Group LLC | CONFIDENTIAL | 07/10/2026*

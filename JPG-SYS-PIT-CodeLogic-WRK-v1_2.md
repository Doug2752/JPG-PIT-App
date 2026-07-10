# JPG — PIT CODE LOGIC
## Personal Investment Time — Full App Code Logic and Build Reference
**Document ID:** JPG-SYS-PIT-CodeLogic-WRK-v1.2
**Date:** 07/08/2026 | **Prepared by:** Claude | **State:** WRK
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

---

## SECTION C — UI PARAMETERS (LOCKED)

### Open DOP Button (DOPBtn)
- **File:** app\PITApp.jsx, lines 417-426
- **Component:** DOPBtn
- **Instances:** line 501 (top, `<DOPBtn top />`),
  line 551 (bottom, `<DOPBtn />`)
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

### KNOWN GAPS (not yet built):
- Future Tasks delete/remove button — confirmed gap. No
  remove option exists. Appointments "Remove" button is
  the pattern to match. Logic/state change — keep isolated
  from instructions-panel copy pass.

### HELD — COMBINED PASS (do not send individually):
All PIT instructions-panel items held together:
1. Q2/Q3 copy update (see Section H for reversal —
   old "no carryover" language will change)
2. "Daily Trackables" sub-heading above first 5 Required
   Fields
3. Panel-wide layout restructure (section titles on own
   lines)
4. Auto-save reminder text (mirror from live app once
   placement decided)
5. AI Summary instructions update (pulls all sections,
   today + 7 days fixed, no client control)

### DESIGN LOCKED — NOT YET BUILT:
- **To Accomplish + Appointments carryover system** — full
  spec in Section H. Data model change (item-ID),
  memorialization rules, selective clear modal, past-due
  badges, Archive states. Do not start build without
  explicit go-ahead.

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
key scoped to uid.

**Migration-on-read pattern:** for storage-shape changes,
wrap raw stored JSON via a `withXMigration(d)` helper at
every setFd(JSON.parse(...)) site. Applied to fitness
entries. Apply this pattern for To Accomplish + Appointments
item-ID migration when that build starts.

---

## SECTION F — KNOWN BEHAVIORS

**Appointments:** working Remove button confirmed live.
Per-row Remove is silent delete with no historical trace.
Under Section H design, Remove keeps this behavior — the
graceful "carry until acted on" model handles the historical
trace differently (via check-off or auto-carry with badge).

**Future Tasks:** no Remove button — confirmed gap.

**AI Summary:** pulls every section of PIT, covers today
plus 7 most recent days. Fixed by design — no client
control. Button label and HelpPanel text updated.

**SMS Reminder:** UI placeholder only. No backend wired.
No SMS actually sent. Post-Supabase.

**Archive:** client-side lookback only. Coach-facing
version not possible without Supabase. **Under Section H
design, Archive is strictly read-only** — view past days,
no interaction.

**To Accomplish (Q2/Q3) — current behavior (to be reversed
per Section H):** checked items disappear from next day's
view. Unchecked items do NOT auto-carry — intentional.
Section H reverses this: unchecked items WILL auto-carry
forward; checked items memorialize on origin day and free
the slot.

---

## SECTION G — PENDING REAL-WORLD VERIFICATION

No PIT items currently pending real-world verification.
All committed PIT features have been browser-verified
end-to-end in daily use.

---

## SECTION H — TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM

**STATUS: DESIGN LOCKED 07/08/2026 — NOT YET BUILT.**

This section captures the full locked design for the To
Accomplish carryover system, selective clear behavior,
Appointments carryover, past-due handling, Archive states,
and the underlying data model. This is the target state,
not the current state. Do not build against this section
without explicit go-ahead.

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

### H.13 — Instructions-panel copy implications

When the To Accomplish carryover is built, the held
combined instructions-panel copy pass (Section D — Held)
Q2/Q3 copy item must be rewritten to reflect the new
behavior. The old "no carryover — intentional" language
becomes obsolete. Do not send the copy pass until the
carryover build is complete and verified.

### H.14 — Scenario decisions (traceable)

The following decisions were locked during the design
walk-through 07/08/2026. Each is traceable to a scenario
number.

- **S1:** Checking off a carried item on today's screen
  frees that slot for today's use. ✓
- **S2:** Skipped days show "No entry for this day" in
  Archive; carryover pulls from most recent PIT day. ✓
- **S3:** Lingering item shows "carried, unresolved" in
  Archive for every day it was open; "done" on origin
  day only. ✓
- **S4a:** Selective-clear modal has Cancel button. ✓
- **S4b:** Post-clear feedback via brief toast "N items
  cleared." ✓
- **S4c:** Clear Selective Items button only visible when
  at least one slot has an item. ✓
- **S5:** Same-day add-and-clear is valid. ✓
- **S6:** Archive is strictly read-only. ✓
- **S7:** Appointment origin day = scheduled date. ✓
- **S8:** Past-due appointments carry forward with visual
  badge, no auto-expiry. ✓
- **S9:** Selective clear scope = To Accomplish only.
  Appointments keep existing per-row Remove. ✓
- **S10:** Carried items preserve slot position from
  prior day. ✓
- **S11:** Data model = item-ID with origin_date,
  resolution_status, resolution_date, carried_dates. ✓

### H.15 — Explicit non-decisions (deferred)

- Exact button wording ("Clear Selective Items" vs
  alternatives) — finalize at build time.
- Toast styling and duration — pick during build within
  the two-tier gold system.
- Whether "Past Due" badge sits inside or outside the
  appointment row — visual decision at build time.
- Whether "carried, unresolved" appears as literal text in
  Archive or as a visual state indicator — visual
  decision at build time.

---

## VERSION HISTORY

| VERSION | DATE | CHANGES |
|---|---|---|
| v1.0 | 07/07/2026 | Initial version. PIT-specific Code Logic doc created. Covers app identity, color system, Open DOP button spec, build status, persistence patterns, known behaviors. Scope established: all PIT app info lives here going forward. |
| v1.1 | 07/07/2026 | No new PIT builds this session. Section G added: Pending Real-World Verification (currently empty). Document structure aligned to match DOP Code Logic v1.8. |
| v1.2 | 07/08/2026 | Wake Up 24-hour combobox with write-in validation BUILT AND COMMITTED (spec in Section C). Fitness Yesterday multi-entry array + Rest Day option BUILT AND COMMITTED (spec in Section C). Terrain Treadmill added, Activity Type Hiking added (mismatch fix) BUILT AND COMMITTED (spec in Section C). AM Fitness Today Rest Day option BUILT AND COMMITTED (spec in Section C). Section D updated: 6 new "built and committed" items, new "Design Locked — Not Yet Built" category added for carryover system. Section E updated: migration-on-read pattern locked as reusable persistence pattern. Section F updated: reversal note added to current To Accomplish behavior. Section H added in full: To Accomplish + Appointments Carryover System — complete locked design spec (scope, fixed slots, carryover mechanic, origin-day memorialization, lingering items, Selective Clear modal, Appointments shared model with scheduled-date rule, read-only Archive, item-ID data model, migration considerations, build sequencing, scenario decisions traceable to S1–S11, explicit non-decisions deferred to build time). |

---

*JPG-SYS-PIT-CodeLogic-WRK-v1.2 | Jones Performance Group LLC | CONFIDENTIAL | 07/08/2026*

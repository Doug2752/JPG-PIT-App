# JPG — PIT CODE LOGIC
## Personal Investment Time — Full App Code Logic and Build Reference
**Document ID:** JPG-SYS-PIT-CodeLogic-WRK-v1.4
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
  - "Yes" → shows fitness entry blocks (gated on fitnessTab === 'yesterday' as of v1.4)
  - "No" → hides entry blocks, resets entries
  - "Rest Day" → hides entry blocks, resets entries
  - "" (Select) → hides entry blocks, resets entries
  - Switching TO "Yes" preserves entries (nothing to preserve
    on first switch — just shows the single empty entry)
- **Storage shape:** `fitnessEntries: [ {...} ]` — array
  of entries. Each entry object contains all fields from
  `emptyFitnessEntry()` — see extended field list below (v1.4).
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
  - Confirm-done checkbox (when entry.recurringId non-empty — see Configure Recurring Fitness Tab below)
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

### emptyFitnessEntry() — Extended Fields (v1.4 — 07/10/2026)
- **File:** utils\form.js
- **Original fields (v1.2):** fitnessActivity,
  fitnessActivityOther, cardioDistance, terrain, yogaType,
  swimEnvironment, swimStroke
- **New fields added v1.4 for recurring fitness support:**
  - `recurringId: ''` — links entry to a recurring config
    item. Empty string for manually-added entries. When
    non-empty, triggers the confirm-done checkbox in
    renderFitnessEntry().
  - `recurringName: ''` — display name of the recurring
    activity (used in the confirm-done checkbox label).
  - `distanceOrDuration: 'distance'` — per-activity metric
    preference (values: 'distance', 'duration', 'both').
  - `defaultDuration: ''` — default duration value seeded
    from the recurring config.
  - `confirmedDone: false` — checkbox state for the
    confirm-done row on seeded entries.
- **withFitnessMigration():** NOT changed — legacy records
  safe. New fields default via emptyFitnessEntry() spread.

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

### AM Fitness Today Selector (07/08/2026 — UI REMOVED 07/10/2026)
- **Original build (07/08/2026):** selector with options
  "", "Yes", "No", "Rest Day" in Additional Tracking grid.
  Storage key: `amWorkout`. No downstream logic.
- **v1.4 update (07/10/2026):** The UI selector has been
  removed from Additional Tracking. The `amWorkout: ''`
  field is RETAINED in `emptyForm()` for storage compatibility.
  Stored days with a saved `amWorkout` value load without error;
  the value is simply not editable or displayed.
- **Status:** Field preserved for storage compatibility; no UI.
- **Committed (removal):** 07/10/2026 (commit ec35c90)

### Configure Recurring Fitness Tab (NEW 07/10/2026)
- **Files:** app\PITApp.jsx + components\DailyTrackingSection.jsx
- **Storage key:** `pit_fitness_config_${uid}` — per-user
  recurring fitness config array (NOT per-day; persists
  across days like `pit_appts_${uid}`)
- **State (PITApp.jsx):** `recurringFitness` — loaded from
  storage on mount alongside loadAppointments()
- **Handlers (PITApp.jsx — all with archiveMode guard):**
  - `loadRecurringFitness()` — reads fcKey from storage,
    sets recurringFitness state; defaults to [] on miss
  - `saveRecurringFitness(list)` — writes fcKey to storage
    AND calls setRecurringFitness(list) in one call
  - `addRecurringActivity()` — appends new config object
    (generated id, empty name/activityType/fitnessActivityOther/
    terrain, distanceOrDuration:'distance', defaultDistance:'',
    defaultDuration:''); calls saveRecurringFitness
  - `updateRecurringActivity(id, patch)` — merges patch by id; saves
  - `removeRecurringActivity(id)` — filters by id; saves
- **seedRecurringFitness(form) (PITApp.jsx):**
  - Reads config directly from storage via fcKey (mirrors
    applyCarryover pattern — avoids stale-closure on mount).
  - Checks hasContent: if the form already has any fitness
    text, returns unchanged (no override of existing data).
  - Maps config items to emptyFitnessEntry() + config field
    overrides, sets confirmedDone: false.
  - Sets fitnessYesterday: 'Yes' so the detail block opens.
  - Called ONLY in loadToday()'s no-record else-branch
    (new-day path). NEVER called when a saved record exists.
- **Tab row (DailyTrackingSection):**
  - Two-tab row above Fitness Yesterday selector.
  - Labels: "Fitness Yesterday" / "Configure Recurring Fitness"
  - Tab styling (tabBtn(active)):
    - Inactive: background #666666, color #ffffff
    - Active: background GOLD (#B8860B), color #000000
    - Common: fontWeight 700, fontSize 10, textTransform uppercase,
      letterSpacing 1.5, padding 6px 16px, border 1px solid #333,
      borderRadius 4px 4px 0 0, cursor pointer, marginRight 4
  - Local state: `const [fitnessTab, setFitnessTab] = useState('yesterday');`
- **Configure tab content:**
  - "Changes save automatically." — italic note at top
    (fontSize 11, color #888, italic, marginBottom 8)
  - Config items via renderRecurringActivity()
  - "+ Add Recurring Activity" button (GOLD_LIGHT, full-width,
    1.5px solid #000, 5px radius)
- **renderRecurringActivity(activity) UI (white-bg inputs):**
  - Activity Name: full-width text input
  - Activity Type: dropdown (ACTIVITY_TYPES)
  - Describe Activity: full-width text input (only when activityType === 'Other')
  - Terrain: dropdown (TERRAIN_OPTIONS — only when isDistanceActivity)
  - Track By: dropdown (Distance / Duration / Both)
  - Distance field: shown when distanceOrDuration is 'distance' or 'both'
  - Time field: shown when distanceOrDuration is 'duration' or 'both'
  - When 'both': Distance and Time side-by-side (flex row, flex:1 each)
  - Remove button: transparent bg, #ccc border (matches fitness entry Remove)
- **Confirm-done checkbox (renderFitnessEntry):**
  - Rendered above Activity Type when entry.recurringId non-empty
  - accentColor GOLD (#B8860B), 16x16
  - Label: "{entry.recurringName || entry.fitnessActivity} — confirm done today"
  - onChange: updFitnessEntry(i, { confirmedDone: ... })
- **Props passed to DailyTrackingSection:** recurringFitness,
  onAddRecurring, onUpdateRecurring, onRemoveRecurring
- **Committed:** 07/10/2026 (commit 0410cf3)

### Additional Tracking — Reorder + Energy Level + Mental Alignment (07/10/2026)
- **File:** components\DailyTrackingSection.jsx
- **Column order (v1.4):** Location → PIT Time Frame →
  Energy Level → Mental Alignment
  (AM Fitness Today removed; Meditation renamed)
- **Grid container:** alignItems: 'stretch'; each column div:
  display flex, flexDirection column; label wrapper: minHeight 36
- **Energy Level (NEW):**
  - Storage key: `energyLevel` (added to emptyForm())
  - Control: select dropdown, options 1–10 (stored as string)
  - Helper text: "10 = highest energy" inside label wrapper
  - Label style: {...dimLbl, marginBottom: 0}
- **Mental Alignment (RENAMED from Meditation):**
  - Label: "Mental Alignment" (was "Meditation")
  - Subtext: "Completing all aspects of PIT makes this complete."
    inside label wrapper below label
  - Options: Yes / No
  - Storage key: meditation (unchanged)
  - meditationDuration retained in emptyForm() for storage compat;
    no UI control (Med Duration UI removed)
  - Label style: {...dimLbl, marginBottom: 0}
- **PIT Time Frame:** unchanged; &nbsp; placeholder in label wrapper
- **Location:** unchanged; subtext inside label wrapper
- **Known cosmetic gap:** four-column label/dropdown baseline
  alignment not fully resolved — functional, visual fix deferred
- **Committed:** 07/10/2026 (commit ec35c90)

### To Accomplish — Clear Items button + modal + toast (07/09–07/10/2026)
- **Files:** components\ToAccomplishSection.jsx + app\PITApp.jsx
- **Button label:** "Clear Items"
- **Button location:** top-right of To Accomplish section header
- **Button visibility:** only when at least one slot has content
- **Button styling:** GOLD_LIGHT (#ddb94a), 1.5px solid #000,
  borderRadius 5, black text, fontSize 12, fontWeight 700,
  padding 4px 10px
- **Modal:** fixed overlay, white card, 2px solid GOLD border,
  maxWidth 420, maxHeight 80vh. Slot rows (label + text + Origin).
  Checkboxes unchecked by default. Cancel / Confirm (GOLD_LIGHT).
- **Toast:** singular-aware — "1 item cleared" / "N items cleared".
  GOLD bg, black text, bottom-center, radius 5, 2500ms auto-clear.
- **Props:** showClearModal, onClearModalOpen, clearModalItems,
  onClearConfirm, onClearCancel, toastMessage
- **Committed:** 07/09–07/10/2026 (commit cdba3c4)

### Appointments — resolution checkbox + Past Due badge (07/09–07/10/2026)
- **File:** components\AppointmentsSection.jsx
- **Resolution checkbox:** left of "Appointment N" header.
  onChange → resolveAppt(a.id). accentColor GOLD, 16x16.
- **Past Due badge:** inside the row, right of "Appointment N".
  Shown when a.date && a.date < todayStr().
  Styling: background #cc2222, white text, borderRadius 4,
  fontSize 10, fontWeight 700, padding 2px 8px, marginLeft 8.
- **Committed:** 07/09–07/10/2026 (commit f884a70)

### Archive — "No PIT entry for this day" message (07/09–07/10/2026)
- **File:** app\PITApp.jsx
- **Message:** "No PIT entry for this day"
- **Styling:** fontSize 16, color #888, textAlign center, padding 40px 0
- **Committed:** 07/09–07/10/2026 (commit 6a1aa32)

### Archive — "carried, unresolved" label per slot (BUILT 07/10/2026)
- **File:** components\ToAccomplishSection.jsx
- **Helper:** isCarriedUnresolved(slotKey) — returns true only when:
  archiveMode is true, archiveDateStr is non-empty,
  fd.toAccomplishItems exists, item at that slot has
  origin_date < archiveDateStr AND resolution_status === null.
- **Rendered:** italic "carried, unresolved" below each slot's
  input in archive mode when helper returns true.
  Style: fontStyle italic, fontSize 12, color #888, marginTop 3.
- **Slots covered:** one_thing, daily_2, daily_3, future_4,
  future_5, future_6.
- **Display only:** no interactive controls.
- **Props added to ToAccomplishSection:** archiveMode, archiveDateStr.
- **Resolves:** H.14 S3, H.15 final open non-decision, Section D Known Gap.
- **Committed:** 07/10/2026 (commit 68228a3)

---

## SECTION D — BUILD STATUS

### BUILT AND COMMITTED:
- Appointments with real ISO date field, independent storage key ✓
- AI Summary — pulls all sections, today + 7 prior days fixed ✓
- Persistent Prayer/Silence preference ✓
- Open DOP button (DOPBtn) NEVER TWICE style ✓
- Wake Up combobox (24-hour AM/PM dropdown + write-in validation) ✓ 07/08/2026
- Fitness Yesterday multi-entry (array shape, Add/Remove per entry) ✓ 07/08/2026
- Fitness Yesterday Rest Day option ✓ 07/08/2026
- AM Fitness Today Rest Day option ✓ 07/08/2026
  (UI REMOVED 07/10/2026 — amWorkout field retained in emptyForm)
- Terrain: Treadmill added ✓ 07/08/2026
- Activity Type: Hiking added (mismatch fix) ✓ 07/08/2026
- **Future Tasks Remove button — all slots including last ✓ 07/09/2026 (commit 72247b2)**
- **Appointments: no default empty box ✓ 07/09/2026 (commits 72247b2, b1fb3ad)**
- **TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM — BUILT Steps 2–9 ✓ 07/09–07/10/2026**
  As-built detail in Section H.16.
- **Archive "carried, unresolved" label per slot ✓ 07/10/2026 (commit 68228a3)**
- **Configure Recurring Fitness tab — per-user config storage, CRUD,
  auto-seed on new day, confirm-done checkbox ✓ 07/10/2026 (commit 0410cf3)**
- **Additional Tracking reorder + new fields: AM Fitness Today UI removed,
  Energy Level added, Mental Alignment renamed, Med Duration UI removed,
  column order updated ✓ 07/10/2026 (commit ec35c90)**

### KNOWN GAPS:
- Additional Tracking four-column label/dropdown baseline alignment —
  cosmetic only, functional, deferred to next session.

### HELD — COMBINED PASS (do not send individually):
1. Q2/Q3 copy update — UNBLOCKED but held for combined pass
2. "Daily Trackables" sub-heading above first 5 Required Fields
3. Panel-wide layout restructure (section titles on own lines)
4. Auto-save reminder text
5. AI Summary instructions update

### DESIGN LOCKED — NOT YET BUILT:
- None currently.

### POST-SUPABASE (do not build now):
- SMS reminder (UI placeholder only — no backend wired)
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
(per-user appointments array — NOT per-day),
`pit_fitness_config_${uid}` (NEW v1.4 — per-user recurring
fitness config array, NOT per-day).

**Migration-on-read pattern:** wrap raw stored JSON via a
`withXMigration(d)` helper at every setFd(JSON.parse(...)) site.
Applied to fitness entries AND (v1.3) to the To Accomplish
carryover item-ID field via `withCarryoverMigration(d)`, chained
after `withFitnessMigration` at both loadToday and openArchive.

**Parallel-field pattern (added v1.3):** store new data model as
a PARALLEL array alongside untouched source fields rather than
replacing them. Used for toAccomplishItems. See H.16.

**Rebuild-on-save pattern (added v1.3):** parallel field kept in
sync by rebuilding from source fields inside save() on every write.

**Archive read-only guard pattern (added v1.3):** every write
handler returns immediately when archiveMode is true. Applied to
all 13 write handlers (see H.16).

**Auto-seed from config pattern (added v1.4):** when a per-user
config array should seed content into a new day's form, read the
config directly from storage inside the seed function rather than
from React state. Avoids stale-closure on mount. Applied to
seedRecurringFitness(form) — called only in loadToday()'s
no-record else-branch (new day path only).

---

## SECTION F — KNOWN BEHAVIORS

**Appointments:** working Remove button confirmed live.
**BUILT (v1.3):** past-due appointments carry forward with
"PAST DUE" badge; resolution checkbox marks them resolved.

**Future Tasks:** **BUILT (v1.3):** Remove works on all slots
including the last; list can reach zero rows.

**AI Summary:** pulls every section of PIT, covers today plus
7 most recent days. Fixed by design — no client control.

**SMS Reminder:** UI placeholder only. No backend wired. Post-Supabase.

**Archive:** **BUILT (v1.3): strictly read-only** — all 13 write
handlers no-op under archiveMode. Days with no saved record show
"No PIT entry for this day." **BUILT (v1.4): shows "carried,
unresolved" italic label below each To Accomplish slot where an
item was carried and unresolved at that archive date.**

**To Accomplish (Q2/Q3) — REVERSED and BUILT (v1.3):** unchecked
items auto-carry forward to the next PIT day at their original slot
position; checking a carried item memorializes "done" on its origin
day and frees today's slot. Items can also be dismissed via "Clear Items"
modal (memorialized "cleared"). See H.16.

**AM Fitness Today:** UI REMOVED (v1.4). amWorkout field retained in
emptyForm() for storage compatibility. Not editable or displayable.

**Additional Tracking (v1.4):** Column order is Location, PIT Time
Frame, Energy Level, Mental Alignment. Energy Level (1–10 select) and
Mental Alignment (Yes/No, renamed from Meditation with new subtext)
replace the former Meditation/Med Duration controls. Med Duration has
no UI control (meditationDuration retained in emptyForm for compat).

**Configure Recurring Fitness (v1.4):** client sets up recurring
activities once; they auto-seed into Fitness Yesterday on new days
that have no saved record. Confirm-done checkbox per seeded entry.
Config persists per-user across all days.

---

## SECTION G — PENDING REAL-WORLD VERIFICATION

**To Accomplish + Appointments carryover system (Steps 2–9)** —
committed 07/09–07/10/2026. Multi-calendar-day verification accrues
in normal daily use. Watch items:
- Carryover fires only when today has no saved record yet.
- Resolved/cleared items must not re-carry the next day.
- Archive controls must be fully inert.
- Archive "carried, unresolved" label (v1.4): verify renders
  on a slot that was carried and not yet resolved at that archive date.

**Configure Recurring Fitness (v1.4)** — committed 07/10/2026.
Real-world verification pending:
- Add recurring activity in Configure tab; confirm it seeds into
  fitnessEntries on the next new day (not today, which already has
  a saved record).
- Confirm-done checkbox saves and persists.
- Removing a recurring activity removes it from config; does not
  affect already-seeded entries on saved days.
- No seeding override when the day already has fitness content.

All prior committed PIT features remain browser-verified in daily use.

---

## SECTION H — TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM

**STATUS: DESIGN LOCKED 07/08/2026 — BUILT AND COMMITTED
07/09–07/10/2026 (Steps 2–9). H.1–H.15 below are the locked
design of record (unchanged). H.16 records the as-built
implementation, deviations, and resolved non-decisions.**

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
for this day." Not a blank empty form.

### H.4 — Checking off and memorialization

**Origin-day memorialization rule:** when an item is
checked done or cleared, history records the resolution
against the day the item was ORIGINALLY ADDED — not the
day the action happened.

- **To Accomplish origin day** = day the item was added to the slot
- **Appointment origin day** = the appointment's SCHEDULED DATE

**When a carried item is checked off on today's screen:**
- History for the origin day updates: item marked done.
- Today's slot is freed and becomes empty.
- The item does not carry to tomorrow.

### H.5 — Lingering items and Archive display

An item added Monday that carries unresolved through Tue,
Wed, Thu, and is finally checked Friday:

- **Monday:** item present in slot, status "carried, unresolved"
- **Tue/Wed/Thu:** item shown in slot, status "carried, unresolved"
- **Friday:** item appears on Monday's record as "done".
  Tue/Wed/Thu records retain the "carried, unresolved" status.

### H.6 — Selective Clear (button, modal, behavior)

- **Button label:** "Clear Items"
- **Location:** top-right of To Accomplish section
- **Visibility:** only when at least one slot has an item
- **Scope:** To Accomplish only

**Clear action:**
- Cleared items memorialize on origin day with status "cleared"
- Slots become empty on today's screen
- Post-clear feedback: brief toast "N items cleared"

### H.7 — Appointments — shared carryover model

- **Origin day:** the appointment's SCHEDULED DATE
- **Past-due behavior:** carry forward with "Past Due" badge. No auto-expiry.
- **Check-off:** memorializes as "done" on the scheduled date.
- **Existing Remove button:** kept as-is (silent delete, no historical trace).
- **No selective clear modal on Appointments.**

### H.8 — Archive (read-only)

Archive is strictly read-only. View past days, cannot
check, uncheck, clear, add, or remove anything.

### H.9 — Order of carried items

Carried items preserve their slot position from the prior day.
No automatic compression / reordering.

### H.10 — Data model (item-ID)

Each To Do item has: id, origin_date, slot, text,
resolution_status (null / "done" / "cleared"),
resolution_date, carried_dates[].

> **As-built amendment (see H.16):** item-ID model stored as
> PARALLEL toAccomplishItems array alongside untouched
> oneThing/tasks[] source fields.

### H.11 — Migration considerations

`withCarryoverMigration(d)` wraps existing per-day fields into
the item-ID model on read. Applied at both setFd(JSON.parse(...))
sites, chained after withFitnessMigration.

### H.12 — Build sequencing

Steps 1–9 followed as planned. See H.16 for commit map.

### H.13 — Instructions-panel copy implications

The Q2/Q3 copy rewrite is UNBLOCKED (carryover built and verified)
but remains held as part of the combined instructions-panel pass
until explicit go-ahead.

### H.14 — Scenario decisions (traceable)

- **S1:** Checking off a carried item frees that slot. ✓ (built)
- **S2:** Skipped days show "No entry for this day." ✓ (built)
- **S3:** Lingering item shows "carried, unresolved" in Archive. ✓ (built v1.4)
- **S4a:** Selective-clear modal has Cancel button. ✓ (built)
- **S4b:** Post-clear toast "N items cleared." ✓ (built)
- **S4c:** Clear button only visible when slot has an item. ✓ (built)
- **S5:** Same-day add-and-clear valid. ✓ (built)
- **S6:** Archive strictly read-only. ✓ (built)
- **S7:** Appointment origin day = scheduled date. ✓ (built)
- **S8:** Past-due appointments carry with badge. ✓ (built)
- **S9:** Selective clear = To Accomplish only. ✓ (built)
- **S10:** Carried items preserve slot position. ✓ (built)
- **S11:** Data model = item-ID parallel field. ✓ (built)

### H.15 — Explicit non-decisions (resolved)

- Button wording — **RESOLVED (v1.3): "Clear Items."**
- Toast styling — **RESOLVED (v1.3): GOLD bg, black text, bottom-center, 2500ms.**
- Past Due badge placement — **RESOLVED (v1.3): INSIDE the row.**
- "carried, unresolved" display — **RESOLVED (v1.4): italic grey
  subtext (#888) below slot text, intermediate days only, origin
  day excluded. Commit 68228a3.**

### H.16 — AS-BUILT NOTES (Steps 2–9, 07/09–07/10/2026)

**Data model — PARALLEL FIELD.** Source fields (oneThing,
oneThingDone, oneThingSetup, tasks[0..4]) NOT replaced.
toAccomplishItems item-ID model stored as a PARALLEL array.

Slot keys: one_thing, daily_2, daily_3, future_4, future_5, future_6.

Entry shape: { id, slot, text, done, origin_date,
resolution_status (null|'done'|'cleared'), resolution_date,
carried_dates[] }.

**Helpers (utils\form.js):**
- withCarryoverMigration(d) — builds toAccomplishItems on read. Idempotent.
- rebuildToAccomplishItems(d) — called inside save() on every write.

**applyCarryover (PITApp.jsx):** fires only in loadToday else-branch
(new day). Reads prior day, keeps resolution_status === null items,
merges into fresh emptyForm(today), preserves origin lineage.

**resolveCarriedItem (Option A):** on check-done, memorializes on
ORIGIN day, clears today's slot. No reversible in-place uncheck.

**Selective Clear:** memorializes as 'cleared' on origin day by id;
empties today's slots; rebuild drops them.

**Appointments (Steps 7–8):** resolved:true + resolution_date on
per-user array retaining scheduled date. No per-day write.

**Archive read-only (Step 9):** if (archiveMode) return; on 13
write handlers. No-entry state via noEntryDate.

**Archive "carried, unresolved" display (v1.4):**
isCarriedUnresolved(slotKey) in ToAccomplishSection.jsx.
Italic label below each slot in archive mode when applicable.
Fulfills S3. Commit 68228a3.

**Commits:** 72247b2, 11651d0, ccc7816, 9291ed0, b1fb3ad,
cdba3c4, f884a70, aea0dce, 6a1aa32, 68228a3, 0410cf3, ec35c90.

---

## VERSION HISTORY

| VERSION | DATE | CHANGES |
|---|---|---|
| v1.0 | 07/07/2026 | Initial version. PIT-specific Code Logic doc created. |
| v1.1 | 07/07/2026 | Section G added. Document structure aligned to DOP Code Logic v1.8. |
| v1.2 | 07/08/2026 | Wake Up combobox, Fitness Yesterday multi-entry + Rest Day, Terrain Treadmill, Activity Type Hiking, AM Fitness Today Rest Day all BUILT AND COMMITTED. Section H added: full carryover system locked design spec. |
| v1.3 | 07/10/2026 | TO ACCOMPLISH + APPOINTMENTS CARRYOVER SYSTEM BUILT AND COMMITTED (Steps 2–9). H.16 as-built notes added. Future Tasks Remove + Appointments no-default-box also built. All H.15 non-decisions resolved except Archive carried-unresolved display. |
| v1.4 | 07/10/2026 | Three builds: (1) Archive "carried, unresolved" label per slot built (commit 68228a3) — resolves H.14 S3, H.15 final non-decision, Section D Known Gap. (2) Configure Recurring Fitness tab built (commit 0410cf3) — new per-user storage, config CRUD, auto-seed on new day, confirm-done checkbox, emptyFitnessEntry() extended with 5 new fields, new auto-seed-from-config persistence pattern. (3) Additional Tracking reorder + new fields (commit ec35c90) — AM Fitness Today UI removed (field kept), Energy Level 1–10 added, Mental Alignment renamed (subtext added), Med Duration UI removed, column order updated. One cosmetic known gap: four-column baseline alignment deferred. |

---

*JPG-SYS-PIT-CodeLogic-WRK-v1.4 | Jones Performance Group LLC | CONFIDENTIAL | 07/10/2026*

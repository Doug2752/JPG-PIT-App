# JPG — PIT CODE LOGIC
## Personal Investment Time — Full App Code Logic and Build Reference
**Document ID:** JPG-SYS-PIT-CodeLogic-WRK-v3.3
**Date:** 08/28/2026 | **Prepared by:** Claude | **State:** WRK
**Classification:** CLASS 1 — CONFIDENTIAL
**Supersedes:** JPG-SYS-PIT-CodeLogic-WRK-v3.2

---

## SECTION A — APP IDENTITY

- **App name:** Personal Investment Time (PIT)
- **Dev port:** 5174
- **Repo:** Doug2752/JPG-PIT-App
- **Local folder:** C:\JPG-PROJECTS\JPG-PIT-App
- **Framework:** React + Vite, Class 3 modular structure
- **Storage:** localStorage (pre-Supabase)
- **Coach login:** Doug / JPG2026
- **Test login:** test / JPG2026
- **Browser for testing:** Firefox (localhost:5174)
- **Daily-use browser:** Brave — stop Brave before dev server during work hours

---

## SECTION B — COLOR SYSTEM (LOCKED)

| Constant | Hex | Use |
|---|---|---|
| GOLD | #B8860B | Informational/non-interactive elements |
| GOLD_LIGHT | #ddb94a | Clickable/action elements |
| DARK | #1a1a1a | Dark backgrounds |
| MID | #555 | Secondary text |
| BORDER | #d0c8b8 | Box/table borders |
| RED | #c0392b | Validation errors, One Thing card border |
| GREEN_COMPLETE | #2ecc71 | Week complete state — WeekTracker and BookSection |

**Two-tier gold rule (locked):** GOLD_LIGHT = clickable/action. GOLD = informational/non-interactive. Both get black text + 1.5px black border on light backgrounds. No border on dark nav bar elements.

**NEVER use #B8962E** — deprecated gold.

---

## SECTION C — COMPONENT ARCHITECTURE

| Component | File | Notes |
|---|---|---|
| PITApp | app/PITApp.jsx | Root orchestrator. compactTasks at module level. removeOneThing function added 07/28/2026. applyCarryover() built — carries unresolved To Accomplish items forward. saveCoachSnapshot() added 08/14/2026. coachKey helper added 08/14/2026. moveFutureToOneThing() added 08/28/2026. moveFutureToDaily() added 08/28/2026. Never Twice full-width bar renders here replacing top DOPBtn 08/28/2026. hub_user URL passthrough built 09/03/2026 — currentUser set directly from hub_user param as { id: trimmed.toLowerCase(), name: trimmed }. No DEFAULT_USERS lookup for HUB clients. updOneThingDetail() and updTaskDetail() handlers added 09/03/2026. Both wired as props to ToAccomplishSection. |
| AppointmentsSection | components/AppointmentsSection.jsx | Lock feature. No useEffect — no auto-add-on-mount. canAddAppt prop wired 08/14/2026. |
| ArchiveView | components/ArchiveView.jsx | backToday prop wired 08/14/2026 — Today button now clears archiveMode correctly. |
| BookSection | components/BookSection.jsx | GREEN_COMPLETE wired 07/28/2026. page number min=0. |
| BooksView | components/BooksView.jsx | backToday prop wired 08/14/2026 — Today button now clears archiveMode correctly. |
| BrandBar | components/BrandBar.jsx | Three-zone flex layout 08/28/2026 — logo left (flex:1), PIT title center (flex:2), date picker right (flex:1). PIT heading 52px. Subtitle 15px. Bottom border 2px. Never Twice removed from BrandBar. |
| DailyTrackingSection | components/DailyTrackingSection.jsx | Full restructure 08/14/2026. Two rows of 4 tracking boxes. sleepTime field added. hoursSlept auto-calculated inline from fd.sleepTime and fd.wakeTime. PIT Time Frame removed. Mental Alignment removed. calcHoursSlept() module-level pure function. commitSleep() mirrors commitWake() pattern. Track By hidden for Rest and Recovery. |
| Header | components/Header.jsx | Flat text nav 08/28/2026 — Today, Archive, Book Log as spans. Active: GOLD underline. Inactive: rgba(255,255,255,0.5). Streak: gold text inline after Book Log with grey separator. Right group: Set-Up and Instructions / Doug / Logout with grey separator bars. PIT Completed Today status div removed. |
| HelpPanel | components/HelpPanel.jsx | Required field count corrected to 12 08/28/2026. Required fields list rewritten — 8 Daily Tracking + 4 Reflection & Priorities. Additional Tracking section rewritten — PIT Time Frame and Mental Alignment removed. Future Tasks move description updated. Rest and Recovery noted in Fitness section. Lock Appointment paragraph updated 07/28/2026. |
| ImportantDiscoveriesSection | components/ImportantDiscoveriesSection.jsx | Empty state, add validation, edit cancel confirmation. RED constant imported 08/14/2026. Layout fixes 08/22/2026. |
| LoginScreen | components/LoginScreen.jsx | RED constant imported 08/14/2026. |
| SummarySection | components/SummarySection.jsx | onLimitHit prop removed 08/14/2026 (was unused). canMarkComplete prop added 09/03/2026 — accepts external override of isDayComplete(fd). If prop passed and not undefined, uses it; else falls back to isDayComplete(fd). |
| ToAccomplishSection | components/ToAccomplishSection.jsx | Pure rendering component. Future Task move button opens modal (type: 'future') 08/28/2026. Future Task modal case added — Move to One Thing or Daily Task. Future Task checkbox 16x16, accentColor GOLD 08/28/2026. moveFutureToOneThing and moveFutureToDaily props added. Task Detail overlay triggers added 09/03/2026. noteBtn helper takes (disabled, hasDet) params. Pencil button indicator: dark border (1.5px solid #222) when detail exists, faint border (1px solid #aaa) when empty. |
| TaskDetailOverlay | components/TaskDetailOverlay.jsx | NEW 09/03/2026. Modal overlay for task detail text. Props: taskName, detailText, onChange, onClose. Dark card, GOLD border, auto-save textarea, X close button. |
| WeekTracker | components/WeekTracker.jsx | GREEN_COMPLETE wired 07/28/2026. Hardcoded #2ecc71 replaced with GREEN_COMPLETE constant in card border 08/28/2026. |

### hub_user URL Passthrough (BUILT 09/03/2026 — master branch only)
PITApp.jsx currentUser useState initializer reads hub_user from URL on mount. If present and non-empty after trim, returns { id: trimmed.toLowerCase(), name: trimmed } — no DEFAULT_USERS lookup. HUB has already authenticated the client. Falls through to null and shows login screen if absent or empty. Note: PIT-phase2-guided branch does NOT have this fix — still uses DEFAULT_USERS lookup. Fix needed when Guided branch work resumes.

### ImportantDiscoveriesSection Layout (UPDATED 08/22/2026)
- **Entry card:** maxHeight: 200, overflowY: 'auto' — individual entries capped.
- **Add form wrapper:** style={{ marginTop: 10 }} — sits outside scrollable entries container. Always visible.
- **Design decision (locked 08/22/2026):** no completed-tasks lookback view and no past-appointments history view. Archive covers edge cases.

---

## SECTION D — TO ACCOMPLISH SYSTEM

- One Thing (required for day completion), Daily Tasks (2, hard cap), Future Tasks (18 effective slots)
- **One Thing manual check-off (BUILT 07/23/2026):** when user checks One Thing, if oneThingSetup has text it is appended in parentheses to oneThing text, then oneThingSetup cleared to ''.
- **One Thing checkbox color (BUILT 07/28/2026):** accentColor GOLD_LIGHT.
- **One Thing Remove button (BUILT 07/28/2026):** two-stage confirmation. Confirm fires removeOneThing() — clears oneThing, oneThingSetup, sets oneThingDone: false.
- **Daily Tasks Remove button:** two-stage confirmation added 07/28/2026. Confirm fires removeTask(i).
- **Future Tasks Remove button:** two-stage confirmation added 07/28/2026. Confirm fires removeTask(i + 2).
- **compactTasks()** — module-level, identity-preserving compaction. Wired at 6 confirmed sites.
- **Full symmetric move system (BUILT 08/28/2026):** all six directions supported.
  - One Thing → Daily Task: moveOneThingToDaily()
  - One Thing → Future Task: moveOneThingToFuture()
  - Daily Task → One Thing: moveDailyToOneThing()
  - Daily Task → Future Task: moveDailyToFuture()
  - Future Task → One Thing: moveFutureToOneThing() — added 08/28/2026
  - Future Task → Daily Task: moveFutureToDaily() — added 08/28/2026
- **moveFutureToOneThing(futureIndex):** guards on archiveMode and oneThing already filled. Uses shift pattern to clear source future slot. Runs compactTasks. Closes modal.
- **moveFutureToDaily(futureIndex):** thin wrapper — calls promoteFutureTask, closes modal.
- **Future Task move button (UPDATED 08/28/2026):** opens modal (type: 'future'). Label: "Move to One Thing or Daily Task". Disabled when empty. Uses moveBtn() style.
- **Future Task modal (BUILT 08/28/2026):** Move to One Thing (disabled if oneThingFilled) + Move to Daily Task (disabled if dailySlotsFull).
- **Future Task checkbox (UPDATED 08/28/2026):** 16x16, accentColor GOLD — matches Daily Task exactly.
- **Future Tasks cap message:** when visibleFuture >= 18, cap message renders.
- **Move modal item name:** displays moving item text truncated at 40 characters.
- **Clear Items nothing-selected guard:** inline red error message if Confirm clicked with nothing checked.

### Carryover System (BUILT — confirmed in code 08/12/2026)

**applyCarryover(uid, todayStr)** — called in PITApp on new day load when no record exists for today.
- Reads archive list, finds most recent prior date with a record
- Reads that prior day's toAccomplishItems array
- Filters to items where resolution_status === null (unresolved/unchecked)
- Copies unresolved items forward: One Thing → oneThing, Daily/Future slots → tasks array
- Preserves original id, origin_date, carried_dates, resolution_status for audit trail
- Stamps prior day record with today's date in each item's carried_dates array
- Book data (title/author/page) also carries forward if book not completed

**Checked/completed items:** resolveCarriedItem() writes resolution_status: 'done' to origin day. Items with non-null resolution_status excluded from next day's carryover.

**Result:** unresolved items carry forward. Checked items disappear next day. Archive is only lookback.

**HelpPanel copy is correct** — matches live code. Do not change carryover copy.

### Task Detail Overlay (BUILT 09/03/2026)
- TaskDetailOverlay.jsx — new component. Modal overlay, centered, dark backdrop.
- Pencil button (✎) added to One Thing, Daily Tasks (fd.tasks[0] and fd.tasks[1]), and Future Tasks (fd.tasks[2] through fd.tasks[19]).
- Detail text storage: fd.oneThingDetail (string, default '') for One Thing. detail property (string, default '') added to each fd.tasks[i] object.
- No new storage keys — detail text rides existing pit_{uid}_{date} blob.
- Carryover: detail text carries forward with the task via applyCarryover().
- Auto-saves on every keystroke via updOneThingDetail(val) and updTaskDetail(i, val).
- Pencil button active only when task has text. Disabled on empty slots.

---

## SECTION E — APPOINTMENTS

- Real ISO date field, independent storage key pit_appts_{uid}
- Cap: 5 future-dated appointments
- **Lock Appointment (BUILT 07/28/2026):** per-appointment locked boolean. Lock/Unlock button in appointment header row. LOCKED badge in header row. Gold left border on locked card. date/time inputs disabled when locked.
- **canAddAppt prop (BUILT 08/14/2026):** Add button visibility uses exact same future-dated filter as addAppt() guard.
- **Design decision (locked 08/22/2026):** no past appointments history view.

---

## SECTION F — DAILY TRACKING

### Section F1 — Required Fields (RESTRUCTURED 08/14/2026)

**REQUIRED_TOTAL = 13** (constant in utils/form.js — used by isDayComplete and countComplete)

**isDayComplete checks 13 fields:** sleepTime, wakeTime, weight, fitnessYesterday, workOff, sleepScore, energyLevel, location, thankful1, thankful2, thankful3, oneThing, nit

**HelpPanel lists 12 required fields** (Total Hours Slept auto-calculated — excluded from client list):

Daily Tracking (Items 1–8):
1. Time Asleep Last Night
2. Wake Up Time
3. Sleep Score
4. Weight
5. Energy Level
6. Work / Off
7. Location
8. Fitness Yesterday

Reflection & Priorities (Items 9–12):
9. Thankful For #1
10. Thankful For #2
11. Thankful For #3
12. Notes — Ideas — Thoughts

Note: The One Thing is required for day completion and listed in To Accomplish section. Total Hours Slept is auto-calculated.

**Two-row layout:**
- Row 1 (Sleep): Time Asleep Last Night, Wake Up Time, Total Hours Slept (auto-calc read-only), Sleep Score
- Row 2 (Daily Baseline): Weight, Energy Level, Work/Off, Location

**Removed fields:** PIT Time Frame, Mental Alignment — removed from emptyForm() and isDayComplete().

**calcHoursSlept(sleepTime, wakeTime):** module-level pure function in DailyTrackingSection.jsx. Handles midnight crossing. Returns "Xh Ym". Returns '' if either field is empty.

**commitSleep():** mirrors commitWake() pattern. Accepts rawVal from onBlur (e.target.value). Stale closure fix: both functions receive e.target.value from onBlur — not local state.

### Section F2 — Coach Data Transmission (BUILT 08/14/2026)

**saveCoachSnapshot(uid, date, fd)** — called inside save() and saveAppointments() on every write.
- Filters fd to coach-relevant fields only
- Writes to pit_coach_{uid}_{date} storage key
- coachKey(uid, date) helper generates the key

**Flag system spec (locked — HUB display side post-Supabase):**
- Metrics: avg sleep time, avg wake time, avg hours slept, avg sleep score, avg weight, avg energy level, fitness completion %, To Accomplish completion %, Thankful For completion %
- Flag rule: 3 consecutive days triggers a flag per metric
- HUB Reports display side: post-Supabase

---

## SECTION G — UI DESIGN (UPDATED 08/28/2026)

### Header.jsx — Flat Text Nav
- Nav items: Today, Archive, Book Log — flat text spans, no buttons
- Active state: color GOLD (#B8860B), fontWeight 700, fontSize 13, borderBottom 2px solid #B8860B, paddingBottom 2
- Inactive state: color rgba(255,255,255,0.5), fontWeight 500, fontSize 13
- Streak: gold text (color GOLD, fontWeight 700, fontSize 12) inline after Book Log, preceded by grey separator (width 1.5, height 16, background rgba(255,255,255,0.25))
- Right group: Set-Up and Instructions | Doug | Logout — flat text spans with grey separator bars between each
- PIT Completed Today status div: REMOVED entirely

### BrandBar.jsx — Three-Zone Layout
- Outer container: background #fff, borderBottom 2px solid GOLD, padding 10px 20px
- Inner layout: display flex, justifyContent space-between
- Left zone (flex:1): JPG logo, width 260px
- Center zone (flex:2): PIT heading 52px fontWeight 900, "Personal Investment Time" subtitle 15px fontWeight 600
- Right zone (flex:1): date picker only — alignItems flex-end
- Never Twice block: REMOVED from BrandBar

### Never Twice Bar (BUILT 08/28/2026)
- Location: PITApp.jsx, renders as full-width bar replacing top DOPBtn
- Background: GOLD_LIGHT (#ddb94a)
- Layout: display flex, justifyContent space-between, alignItems center
- Left: "NEVER TWICE" bold (fontSize 15, fontWeight 900, uppercase) + tagline "Miss one — never miss the second." (fontSize 11)
- Right: checkbox wired to fd.neverTwiceRead via upd(), label "I've read this. Never twice."
- Bottom DOPBtn (Open DOP): UNCHANGED — still renders below content

---

## SECTION H — OPEN BACKLOG

### Active open items (not yet built)
- Stale AI model ID in services/ai.js — post-Supabase, do not build now

### Post-Supabase (do not build)
- SMS reminder backend
- Coach-facing archive (Q5)
- pit_instructions_seen user-scoping (not a real issue pre-Supabase — clients on separate URLs)
- HUB Reports full data population
- Flag logic and auto-drafted messages in HUB
- Coach Data Transmission — HUB display side
- Coach Data Transmission — DOP spoke — future dedicated scoping session
- DOP→PIT Tomorrow's Priorities transfer
- Tredict/Garmin auto-import into PIT daily tracking fields via Edge Function

---

## SECTION I — STORAGE KEYS

| Key | Purpose |
|---|---|
| pit_{uid}_{date} | Daily form data — date-scoped. To Accomplish data embedded in full fd object. |
| pit_arch_{uid} | Archive list — flat array of date strings |
| pit_sent_{uid} | Sent/submitted records |
| pit_books_{uid} | Books log |
| pit_appts_{uid} | Appointments |
| pit_devtype_{uid} | Prayer/Silence preference |
| pit_fitness_config_{uid} | Recurring fitness config |
| pit_discoveries_{uid} | Important Discoveries library |
| pit_day_complete_{uid} | Day complete dates list |
| pit_ai_summary_last_used_{uid} | AI Summary rate-limit timestamp |
| pit_coach_{uid}_{date} | Coach transmission snapshot — filtered daily data per client per day |
| pit_instructions_seen | Global (not user-scoped — acceptable pre-Supabase) |

No new keys added 09/03/2026. fd.oneThingDetail and tasks[].detail ride the existing pit_{uid}_{date} blob.

---

## SECTION J — LOCKED DECISIONS

- Daily Tracking: 8 required fields in two rows of 4. sleepTime and hoursSlept added. pitTimeFrame and meditation removed. REQUIRED_TOTAL = 13. (locked 08/14/2026)
- Total Hours Slept: auto-calculated from sleepTime and wakeTime via calcHoursSlept(). Read-only display. Handles midnight crossing. No useEffect — called inline on render. (locked 08/14/2026)
- Stale closure pattern: write persisted values inside action handlers using e.target.value from onBlur — do not read local state. Applied to commitSleep() and commitWake().
- Coach Transmission: auto-write on every save() and saveAppointments() call to pit_coach_{uid}_{date}. Privacy filter applied. 3-consecutive-day flag thresholds locked. HUB display post-Supabase. (locked 08/14/2026)
- To Accomplish carryover: BUILT. Unresolved items carry forward. Checked items disappear next day. Archive is the only lookback. (locked 08/12/2026)
- Persistent Prayer/Silence preference: write directly in action handler, not useEffect (avoids mount-time race condition).
- AI Summary: pulls all sections, today + 7 most recent days. Fixed — no client control over date range.
- Move matrix: One Thing ↔ Daily ↔ Future in all directions. Full symmetric move system. (locked 08/28/2026)
- Never Twice bar: GOLD_LIGHT full-width inline row. Renders in PITApp.jsx replacing top DOPBtn. Bottom DOPBtn unchanged. (locked 08/28/2026)
- BrandBar: three-zone flex layout. Logo left flex:1, title center flex:2, date picker right flex:1. Bottom border 2px. (locked 08/28/2026)
- HelpPanel required fields: 12 listed (Total Hours Slept auto-calculated, excluded from client list). (locked 08/28/2026)
- No completed-tasks lookback view. No past-appointments history view. (locked 08/22/2026)
- Task Detail overlay: auto-save, pencil button dark-border indicator when detail exists, faint border when empty. No new storage keys. SummarySection canMarkComplete prop added — external override of isDayComplete(fd). (locked 09/03/2026)

---

## SECTION K — VITEST TESTS

1 passing test. Run with npm test.

---

## VERSION HISTORY

| Version | Date | Changes |
|---|---|---|
| v2.8 | 07/23/2026 | Track By hidden for Rest and Recovery. Confirmation dialogs on fitness selector change and recurring Remove. Future Tasks cap message. Move modal item name. Clear Items nothing-selected guard. Discoveries empty state + validation + edit cancel confirmation. Scripture and Quotes close preserve query. One Thing checkbox RED → GOLD_LIGHT. Never Twice fontSize 8 → 11. Instructions toggle GOLD → GOLD_LIGHT. Book Study page number min=0. Devotional toggle colon removed. Color table corrected. GREEN_COMPLETE flagged as open item. |
| v2.9 | 07/28/2026 | GREEN_COMPLETE constant added to constants.js. Hardcoded #2ecc71 replaced in WeekTracker.jsx (5 hits) and BookSection.jsx (3 hits). HelpPanel Lock Appointment paragraph corrected. CLAUDE.md test credential corrected. One Thing Remove button built. Two-stage inline Remove confirmation added to Daily Tasks and Future Tasks. removeOneThing function added to PITApp.jsx. |
| v3.0 | 08/12/2026 | Investigation session — no code changes. Carryover system confirmed built. Instructions panel combined pass confirmed complete. Section D expanded with full carryover system documentation. |
| v3.1 | 08/14/2026 | Dead code cleanup. Logic bug fixes (ArchiveView/BooksView backToday wired, canAddAppt prop synced). RED constant reconciliation. Daily Tracking full restructure — two rows of 4 boxes, sleepTime and hoursSlept added, PIT Time Frame and Mental Alignment removed, REQUIRED_TOTAL updated to 13. Coach transmission snapshot built — saveCoachSnapshot(), coachKey helper, pit_coach_{uid}_{date} storage key. Full Coach Data Transmission spec locked. |
| v3.2 | 08/22/2026 | ImportantDiscoveriesSection layout fixes. Design decisions locked: no completed-tasks lookback, no past-appointments history. Post-Supabase item added: Tredict/Garmin auto-import. Future Tasks delete/remove button confirmed gap — added to active backlog. |
| v3.3 | 08/28/2026 | Full symmetric move system built — moveFutureToOneThing() and moveFutureToDaily() added to PITApp.jsx. Future Task move button opens modal matching Daily Task pattern. Future Task checkbox updated to 16x16 with GOLD accentColor. WeekTracker hardcoded #2ecc71 replaced with GREEN_COMPLETE constant. HelpPanel instructions corrected — 12 required fields, field list rewritten, Additional Tracking rewritten, Future Tasks move description updated, Rest and Recovery noted. Header redesigned — flat text nav, grey separators, gold streak text, PIT Completed Today removed. BrandBar redesigned — three-zone layout, 52px title, 15px subtitle, date picker right only, 2px bottom border. Never Twice moved to full-width GOLD_LIGHT bar in PITApp.jsx replacing top DOPBtn. Phase One complete — zero active build items. |
| v1.6 | 09/03/2026 | hub_user URL passthrough built — PITApp.jsx currentUser useState initializer now trusts hub_user URL param directly, returns { id, name } object. No DEFAULT_USERS lookup for HUB clients. master branch only. PIT-phase2-guided branch fix deferred. No new storage keys. No new components. |
| v3.5 | 09/03/2026 | Task Detail overlay built — TaskDetailOverlay.jsx new component. ToAccomplishSection.jsx updated with noteBtn indicator and overlay triggers for all three areas. PITApp.jsx: updOneThingDetail and updTaskDetail handlers added. SummarySection.jsx: canMarkComplete prop added. fd.oneThingDetail and tasks[].detail fields added to form data. Carryover carries detail text forward. No new storage keys. |

---

*JPG-SYS-PIT-CodeLogic-WRK-v1.6 | Jones Performance Group LLC | CONFIDENTIAL | 09/03/2026*

# CLAUDE.md — PIT (Personal Investment Time)

## APP IDENTITY
- Name: PIT — Personal Investment Time
- Full folder: C:\JPG-PROJECTS\JPG-PIT-App
- GitHub repo: Doug2752/JPG-PIT-App
- Dev port: 5174 (5175 fallback)
- Purpose: Internal alignment app — daily detail that sits 
  inside the DOP process.
- Architecture: React + Vite, Class 3 modular, localStorage.

## NON-NEGOTIABLE WORKING RULES
1. Investigation before action.
2. Never assume.
3. Never act without asking first.
4. One task at a time (logic / styling / copy stay isolated).
5. Plan mode always on.
6. GitHub Desktop is the only trusted push mechanism.
7. Browser-verify before commit.
8. Never redraft finalized copy from scratch.
9. Never touch .md files in the app folder during code builds.

## MODEL SELECTION
- Opus — complex multi-file logic.
- Sonnet — small edits, investigations, styling, cleanup.
- Model stated at top of every prompt.

## BROWSER AND PORT REFERENCE
- Firefox — code/build testing, OS default.
- Brave — daily DOP/PIT entries only (auto-opens 5174 on 
  startup — stop Brave before starting dev server).
- Edge — Claude.ai chat sessions.
- vite.config.js carries server: { open: false, port: 5174 }.

## CURRENT BUILD STATE (confirmed in source 07/17/2026)

### Built and verified
- Two-tier gold color system (GOLD_LIGHT #ddb94a action / 
  GOLD #B8860B informational)
- Login system — case-insensitive, hub_user URL param auto-login
- Wake Up Time combobox with validation (15-min increments, AM/PM)
- Fitness Yesterday multi-entry (Yes/No/Rest Day, recurring + 
  manual entries)
- Configure Recurring Fitness tab (daysOfWeek scheduler, 
  tab-open sync)
- To Accomplish carryover system (identity-preserving, 
  origin-day memorialization)
- Appointments carryover (past-due carry-forward, resolve checkbox)
- Future Tasks unlimited slots (20-slot tasks array, effective 
  cap 18, indices 2-19)
- Move to Daily Task (Future to Daily promotion, identity preserved)
- Reverse-move system (One Thing and Daily Tasks Move buttons, 
  destination modal, four move handlers: moveOneThingToDaily / 
  moveOneThingToFuture / moveDailyToOneThing / moveDailyToFuture)
- oneThingSetup carry on move — appended in parentheses to moved 
  task text; oneThingSetup explicitly zeroed in both 
  moveOneThing* handlers
- Compaction system — compactTasks helper (identity-preserving, 
  lockstep toAccomplishItems re-keying, one_thing passthrough); 
  wired into loadToday existing-record branch, removeTask early 
  branch (indices 0-1), updTask done-branch (non-carried only), 
  all four move handlers
- removeTask: early branch (indices 0-1) clears and compacts; 
  future-range branch (indices 2-19) retains original shift + 
  futureTasksVisible decrement
- Clear Items modal — "Cleared items" wording confirmed
- Daily Tasks rows — restructured to match Future Tasks layout 
  (Move + Remove buttons, both disable when row empty)
- Future Tasks Remove — now disables when row empty
- Day Complete system (10-field gate, read-only lock, header 
  pill, archive indicator)
- AI Summary (today + 7 prior days, once-per-7-day rate limit, 
  cross-app DOP read)
- HelpPanel 16-section instructions (includes Day Complete section)
- Important Discoveries with Other topic tag
- Daily Book Study carryover
- Appointments rebuild (real ISO dates, cap 5, Past Due badge)
- SMS reminder (UI placeholder only — no backend)
- Persistent Prayer/Silence preference
- Vitest Tier 1: 1 passing smoke test

### Held (do not touch without explicit direction)
- Instructions-panel combined copy pass (Q2/Q3 copy, Daily 
  Trackables sub-heading, panel-wide layout restructure, 
  auto-save reminder, AI Summary description update)
- Coach Data Transmission Spec — design locked in PIT Code 
  Logic Section F2, pre-build scoping required before any code

### Known credentials
- test / test123

## KEY ARCHITECTURAL FACTS
- React + Vite, npm run dev port 5174, localStorage, no backend
- Case-insensitive login matching per CS v1.8 §8.2
- compactTasks(tasks, toAccomplishItems) — module-level helper, 
  returns { tasks, toAccomplishItems }. All compaction routes 
  through this function. Non-grid items (one_thing) pass through 
  untouched.
- rebuildToAccomplishItems matches by slot position — always run 
  compactTasks and re-key items before save() when slots shift
- tasks array: index 0 = daily_2, index 1 = daily_3, 
  indices 2-19 = future_4 through future_21
- futureTasksVisible: incremented by Add button, decremented by 
  removeTask future-range branch, overridden to filled-future 
  count by all compaction sites
- DOP to PIT data transfer not possible until Supabase migration
- PIT is best used on desktop — more typing than DOP

## REFERENCED GOVERNING DOCUMENTS
Core Standard v1.8, Troubleshooting Guide v4.8, 
PIT Code Logic v2.3, Session Handoff Primer v3.0.

## SESSION START PROTOCOL
First instruction is always read-only:
"Read CLAUDE.md and confirm you understand — 
do not run any commands yet."

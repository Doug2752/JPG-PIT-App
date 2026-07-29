# CLAUDE.md — JPG-PIT-App

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

## CURRENT BUILD STATE (as of 07/28/2026)

### Built and committed

- Full daily tracking form — all 10 required fields
- Fitness Yesterday — multi-entry, Rest and Recovery option, Track By hidden for Rest and Recovery, confirmation on Yes→No with data
- Configure Recurring Fitness — confirmation dialog on Remove
- To Accomplish system — One Thing, Daily Tasks (2), Future Tasks (18)
- compactTasks() compaction at 6 sites
- Reverse-move system — all four directions
- One Thing manual check-off — First Action Step appended in parentheses, field cleared
- One Thing Remove button — two-stage inline confirmation, clears both text and First Action / Set-Up field
- Daily Tasks Remove — two-stage inline "Task will not be recorded" confirmation
- Future Tasks Remove — two-stage inline "Task will not be recorded" confirmation
- removeOneThing() function in PITApp.jsx
- Future Tasks cap message at 18 slots
- Move modal shows task text (40-char truncation)
- Clear Items nothing-selected inline red guard
- Appointments — lock/unlock, LOCKED badge in header, gold left border, date/time disabled when locked
- Important Discoveries — empty state message, add validation, edit cancel confirmation
- Book Study — page number min=0, green border + Completed badge when complete
- Devotional — scripture search preserves query on close, toggle colon removed
- Quotes — search preserves query on close
- WeekTracker — GREEN_COMPLETE constant wired (was hardcoded `#2ecc71`)
- BookSection — GREEN_COMPLETE constant wired (was hardcoded `#2ecc71`)
- GREEN_COMPLETE = `#2ecc71` in constants.js
- HelpPanel — Lock Appointment paragraph updated: "in the appointment header," LOCKED badge mentioned
- Never Twice fontSize 11
- Set-Up and Instructions button GOLD_LIGHT
- One Thing checkbox accentColor GOLD_LIGHT
- BrandBar "Never Twice" readable at fontSize 11
- Open DOP button — localhost:5173 with hub_user param
- AI Summary — 7-day fixed lookback, once per rolling 7-day window
- Day complete system — 10 required fields gate
- Archive view, Books view
- Vitest — 1 passing test

### Known open items (not yet built)

- Appointment cap inconsistency (Add button vs addAppt() guard mismatch)
- ArchiveView/BooksView Today button can leave archiveMode stuck
- Dead code cleanup pass — held for combined pass
- pit_instructions_seen not user-scoped — post-multi-user
- Stale AI model ID in services/ai.js
- Rate limit message styling — defer until AI key live
- RED constant vs `#b02020` inline literal — future cleanup pass
- Instructions-panel combined pass — ALL HELD until Doug says ready

### Post-Supabase (do not build)

- SMS reminder
- Coach-facing archive
- pit_instructions_seen user-scoping

## GOVERNING DOCUMENT

Code Logic doc: JPG-SYS-PIT-CodeLogic-WRK-v2.9
This file is a context loader only — do not reproduce the full Code Logic doc here.

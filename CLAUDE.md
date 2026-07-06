# CLAUDE.md — PIT (Personal Investment Time)

## APP IDENTITY
- Name: PIT — Personal Investment Time
- Full folder: C:\JPG-PROJECTS\JPG-PIT-App
- GitHub repo: Doug2752/JPG-PIT-App
- Dev port: 5174 (5175 fallback)
- Purpose: Internal alignment app — daily detail that sits inside the DOP process.
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

## MODEL SELECTION
- Opus — complex multi-file logic.
- Sonnet — small edits, investigations, styling, cleanup.
- Model stated at top of every prompt.

## BROWSER AND PORT REFERENCE
- Firefox — code/build testing, OS default.
- Brave — daily DOP/PIT entries only.
- Edge — Claude.ai chat sessions.
- vite.config.js carries server: { open: false, port: 5174 }.

## CURRENT BUILD STATE
Built and verified: Appointments rebuild (real ISO dates), AI Summary
(7-day fixed lookback), two-tier gold color system, persistent
Prayer/Silence preference, Future Tasks delete button (pending),
SMS reminder (UI placeholder only — no backend), stale-closure
bug fix, sleep score notes restructure.
Held (do not touch without explicit direction): instructions-panel
combined copy pass (Q2/Q3 copy, Daily Trackables sub-heading,
panel-wide layout restructure, auto-save reminder, AI Summary
description update).
Known credentials: test / test123.

## KEY ARCHITECTURAL FACTS
React + Vite, npm run dev port 5174, localStorage, no backend,
case-insensitive login matching per CS v1.8 §8.2.
PIT is best used on desktop — more typing than DOP.
DOP→PIT data transfer not possible until Supabase migration.

## REFERENCED GOVERNING DOCUMENTS
Core Standard v1.8, Troubleshooting Guide v3.2, Doc A, Doc B,
Session Handoff Primer.

## SESSION START PROTOCOL
First instruction is always read-only:
"Read CLAUDE.md and confirm you understand — do not run any commands yet."
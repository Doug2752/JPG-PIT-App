# CLAUDE.md — PIT-phase2-guided Branch
## Jones Performance Group LLC | JPG-PIT-App | PIT Guided Version
**Branch:** PIT-phase2-guided
**Port:** 5177
**Code Logic Doc:** JPG-SYS-PIT-Guided-CodeLogic-WRK-v1.1
**Date:** 08/30/2026

---

## PURPOSE OF THIS BRANCH
This branch contains the Guided version of the PIT (Personal Investment Time) app. It is a separate branch of the same JPG-PIT-App repo. The master branch contains the Structured version and is never touched during Guided build work.

---

## WHAT IS SHARED WITH STRUCTURED (master)
- Login screen, header, BrandBar, Never Twice bar, footer Open DOP button — identical, do not modify
- All storage keys and data shapes — identical
- isDayComplete() — same function, same 13 required fields, same REQUIRED_TOTAL
- All carryover logic (applyCarryover, compactTasks)
- All move handlers (moveOneThingToDaily, moveOneThingToFuture, moveDailyToOneThing, moveDailyToFuture, moveFutureToOneThing, moveFutureToDaily)
- saveCoachSnapshot() — identical fields and privacy filter
- Important Discoveries library (pit_discoveries_{uid}) — shared across versions
- All constants (GOLD, GOLD_LIGHT, RED, DARK, MID, BG, BORDER, GREEN_COMPLETE)
- Book carry-forward logic
- Prayer/Silence preference toggle

---

## WHAT IS DIFFERENT IN GUIDED
- Fitness entry: free-text area only — structured activity grid and Configure Recurring Fitness tab removed
- AI fitness parse (parseFitnessAI) added to services/ai.js — fires on blur of fitness text area
- AI Summary section removed entirely — SummarySection.jsx renders only Mark Day Complete bar and Open DOP button
- Appointment Lock/Unlock button removed — appointments always editable
- First Action Step field (oneThingSetup) removed from ToAccomplishSection.jsx
- Book notes field (bookNotes) removed from BookSection.jsx
- pit_fitness_config_{uid} key not used in Guided
- pit_ai_summary_last_used_{uid} key not used in Guided

---

## CRITICAL RULES FOR THIS BRANCH
- Never modify the master branch from this branch
- Never bundle multiple section changes into one prompt — one file or one concern per prompt
- Always read the actual file before editing it — never edit from memory
- Separation of concerns: logic changes, styling changes, and copy changes are isolated
- GitHub: Doug commits and pushes via GitHub Desktop only — Claude Code never commits

---

## BUILD SEQUENCE (from Code Logic doc v1.1 Section K)
1. Branch setup + CLAUDE.md — COMPLETE
2. services/ai.js — add parseFitnessAI() only
3. DailyTrackingSection.jsx — remove fitness grid, add free-text area, wire parseFitnessAI on blur
4. PITApp.jsx — remove genSummary, aiLoadSummary, pit_fitness_config usage; add fitnessParseMsg state
5. SummarySection.jsx — remove AI Summary UI, retain Mark Day Complete bar and Open DOP button
6. AppointmentsSection.jsx — remove Lock/Unlock button and lock state
7. BookSection.jsx — remove bookNotes field only
8. ToAccomplishSection.jsx — remove oneThingSetup field and handler
9. HelpPanel.jsx — update instructions for Guided (isolated, do not bundle)
10. Full browser verification

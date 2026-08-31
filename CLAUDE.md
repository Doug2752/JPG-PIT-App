# CLAUDE.md — PIT-phase2-guided Branch
## Jones Performance Group LLC | JPG-PIT-App | PIT Guided Version
**Branch:** PIT-phase2-guided
**Port:** 5177
**Code Logic Doc:** JPG-SYS-PIT-Guided-CodeLogic-WRK-v1.3
**Date:** 08/31/2026

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
- updMulti() — accepts plain object OR array of pairs (Array.isArray check)

---

## WHAT IS DIFFERENT IN GUIDED
- Fitness entry: free-text area only — label FITNESS ACTIVITY — YESTERDAY. Structured activity grid and Configure Recurring Fitness tab removed entirely.
- AI fitness parse (parseFitnessAI) in services/ai.js — fires on blur of fitnessNotesText via handleFitnessBlur internal to DailyTrackingSection. onFitnessParseMsg prop passed from PITApp.
- Thankful For: single free-text textarea (gratitudeText) — three numbered inputs removed. parseGratitudeAI fires on blur via handleGratitudeBlur in PITApp. onGratitudeBlur prop passed from PITApp. thankful1/2/3 populated by AI parse.
- Appointments: single free-text textarea (appointmentText) — structured card system removed. parseAppointmentsAI fires on blur via handleApptBlur in PITApp. onApptBlur prop passed from PITApp. Parsed appointments display as read-only cards.
- AI Summary section removed entirely — SummarySection.jsx renders only Mark Day Complete bar and Open DOP button. No genSummary, no aiLoadSummary.
- Devotional: Two-Minute Prayer checkbox removed. Toggle button inline with section title. Title toggles between "Daily Devotional" and "Silence and Reflection".
- Book Study: bookNotes field present (earlier removal reversed). Sub-label removed.
- First Action Step field (oneThingSetup) removed from ToAccomplishSection.jsx.
- pit_fitness_config_{uid} key not used in Guided.
- pit_ai_summary_last_used_{uid} key not used in Guided.
- pit_appt_text_{uid}_{date} key added — raw appointment free-text, localStorage only, not in coach snapshot.

---

## COMPONENT PROP SIGNATURES (GUIDED-SPECIFIC — DO NOT USE STRUCTURED SIGNATURES)
- GratitudeSection: { fd, updMulti, gratitudeParseMsg, onGratitudeBlur, isDayCompleteMarked }
- AppointmentsSection: { appointmentText, updAppointmentText, parsedAppointments, apptParseMsg, onApptBlur, isDayCompleteMarked }
- DailyTrackingSection: { fd, upd, updMulti, isDayCompleteMarked, fitnessParseMsg, onFitnessParseMsg }
- SummarySection: { fd, submitting, submitMsg, doSubmit, setSMsg, isDayCompleteMarked, onMarkDayComplete, onUnlockDay } — no AI Summary props

---

## AI INTEGRATION
- services/ai.js contains parseFitnessAI, parseGratitudeAI, parseAppointmentsAI
- anthropic() helper returns null (not a string) when API call fails — all parse functions handle null gracefully
- Markdown fence stripping applied before JSON.parse in all three parse functions
- API key: VITE_ANTHROPIC_API_KEY in .env.local at repo root — never committed. Claude Code must never read constants.js when a live key is present.
- generateSummaryAI is present in services/ai.js but not used in Guided

---

## CRITICAL RULES FOR THIS BRANCH
- Never modify the master branch from this branch
- Never bundle multiple section changes into one prompt — one file or one concern per prompt
- Always read the actual file before editing it — never edit from memory
- Separation of concerns: logic changes, styling changes, and copy changes are isolated
- GitHub: Doug commits and pushes via GitHub Desktop only — Claude Code never commits
- Never read or edit .env.local — API key file. Doug manages in Notepad only.

---

## BUILD STATE (AS OF 08/31/2026)
All nine sections built and committed. Prop wiring fixed and committed. AI parse verification pending API credits at console.anthropic.com. Non-AI browser verification pending.

| File | Status |
|---|---|
| CLAUDE.md | Updated 08/31/2026 |
| services/ai.js | All three parse functions — fence stripping — null-guard hardened |
| app/PITApp.jsx | All Guided handlers and prop pass-throughs wired |
| components/DailyTrackingSection.jsx | Free-text fitness — onFitnessParseMsg wired |
| components/GratitudeSection.jsx | Free-text with parseGratitudeAI — onGratitudeBlur wired |
| components/AppointmentsSection.jsx | Free-text with parseAppointmentsAI — onApptBlur wired |
| components/ToAccomplishSection.jsx | oneThingSetup removed |
| components/NotesSection.jsx | Unchanged from Structured |
| components/DevotionalSection.jsx | Checkbox removed — toggle inline with title |
| components/BookSection.jsx | bookNotes present — sub-label removed |
| components/ImportantDiscoveriesSection.jsx | Unchanged from Structured |
| components/QuotesSection.jsx | Unchanged from Structured |
| components/SummarySection.jsx | AI Summary removed — Mark Day Complete and Open DOP only |
| components/HelpPanel.jsx | Updated for Guided |
| utils/constants.js | VITE_ANTHROPIC_API_KEY env var — no hardcoded key |

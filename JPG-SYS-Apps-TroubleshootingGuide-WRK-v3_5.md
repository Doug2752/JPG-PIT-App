# **JPG — APPS TROUBLESHOOTING GUIDE**

## **Plain-Language Behavior & Troubleshooting Reference — DOP, PIT, OBT, HUB**

**Document ID:** JPG-SYS-Apps-TroubleshootingGuide-WRK-v3.5

**Date:** 07/08/2026 | **Prepared by:** Claude | **State:** WRK

**Classification:** CLASS 1 — CONFIDENTIAL

**Supersedes:** JPG-SYS-Apps-TroubleshootingGuide-WRK-v3.4

## **PURPOSE OF THIS DOCUMENT**

This document is written for Doug, not for building code. It describes
what a beta client actually sees and experiences across the four JPG
apps, in plain language.

**v3.5 update (07/08/2026):** Multiple PIT items added from the
07/08/2026 build session — Wake Up 24-hour combobox with write-in,
Fitness Yesterday multi-entry with Rest Day option, Terrain
Treadmill added, Activity Type Hiking added, AM Fitness Today Rest
Day option. New Section 2L added: To Accomplish + Appointments
carryover system design locked, not yet built.

**v3.4 update (07/07/2026):** Multiple DOP items added.

**v3.3 update (07/06/2026):** Migration to Claude Desktop Code tab
completed across all four apps.

**Format (locked):** short, bolded declarative statements —
"X now does Y" — never conditional "if X, then Y" phrasing.
No field names, no code, no technical jargon.

**Accuracy rule:** every entry reflects behavior actually built and
browser-verified. Where uncertain, flagged rather than asserted.

# **PART ONE — DOP (DAILY OPERATIONAL PROCESS)**

DOP is the client's daily roadmap — a lightweight checklist of AM
and PM items that houses the process for the day. Detail lives inside
PIT (which sits inside DOP); DOP itself confirms what is to be done,
what was done, and general alignment moving forward. The 4x4 Matrix
is a feature *inside* DOP, not a separate app.

## **SECTION 1A — LOGGING IN AND FIRST-VISIT INSTRUCTIONS**

DOP uses the shared JPG login screen — gold background, white card,
black-on-white logo, "EXISTING OUTSIDE OF BOUNDARIES" tagline, gold
Enter button. Login matching is case-insensitive across the app.

The Setup Instructions modal opens automatically the very first time
DOP is opened in a browser, and can be reopened at any time from the
Setup tab, Archive, or main Form view.

## **SECTION 1B — DAILY USE, AM AND PM BLOCKS**

The Today tab is the heart of DOP — a two-block layout, AM at the
top and PM below, with the 4x4 Matrix card appearing beneath PM once
4x4 is set up.

Each block has **Required** items (locked always-on) and **Recommended**
items (on by default but toggleable off during Configure).

**The AM Common Life Tasks default order has been updated (07/07/2026).**
The four recommended items now appear in this order at the top of AM
Common Life Tasks: Make Bed, then AM Fitness, then Personal Prep,
then Breakfast. AM Routine Complete has moved to the last position
in the optional pool.

**The PM block completion counter no longer inflates by one (07/07/2026).**
Previously the Evening Evaluation row was silently counted in the PM
denominator even though it renders as a scored item, not a checklist
row. The counter now excludes it from the "X of Y done" total.

**The Tomorrow's Priorities box now has fully square corners**
**(07/07/2026).** The outer wrapper, black header, and red block are
all square-cornered. The input field inside keeps its own rounded
corners intact.

**Marking a day complete** is defined by one canonical rule: score
both the AM and PM evaluations, and minimally check off the completed
required items.

## **SECTION 1C — PM CONFIGURE STRUCTURE (LOCKED 07/02/2026)**

The PM block is organized in a specific, locked order:

**PM Required (top of block, in order):**

- Evening Evaluation (formerly labeled "Day Evaluation" — renamed
  07/02/2026)

- PM PIT, shown as a single unit with two sub-items beneath it:
  What Went Well, and What to Improve

**PM Recommended:**

- Prep for Tomorrow
- Social Time / Relationships
- Personal Care
- Bed
- Lights Out

**PM "All Other":**

- Evening Meal / Snack

## **SECTION 1D — TOMORROW'S PRIORITIES**

The PM block includes a "Tomorrow's Priorities" section where the
client jots down what tomorrow's focus is.

**The actual carryover from DOP to PIT is not built.** DOP and PIT
live at separate browser origins, and browser security prevents one
origin from reading another's storage directly. A real carryover
requires the shared backend (planned for Supabase migration).

## **SECTION 1E — TODAY'S TAKEAWAY AND THE AM LOCK / QUOTE BOX**

The AM block includes a Today's Takeaway area intended to display a
daily quote. Underneath it sits an AM Lock box. Both are confirmed
good — no changes needed.

The Today's Takeaway fetches from an AI quote source that is
intentionally not wired to a real key. When the fetch fails, the app
silently falls back to a set of backup quotes — this is by design,
not a bug.

## **SECTION 1F — DOP 4x4 MATRIX FEATURE**

The 4x4 Matrix is DOP's monthly protocol system — 4 protocols per
month, one per Foundation Core, run inside a monthly budget cap.

### **1F.1 — Setting up a Protocol**

Each of the 4 protocol cards requires an explicit Foundation Core
assignment. Each Foundation Core can only be assigned to one of the
4 cards per month. DNA (no time value) and the numeric time-value
input are mutually exclusive.

A protocol is set as an Activation or a Deactivation, assigned to
AM, PM, or Both, and given a frequency of either Daily or a specific
weekly target.

### **1F.2 — Saving (What's Required, What Blocks It)**

Save requires all of the following to be true at once:

All 4 Foundation Core slots have a protocol assigned.

At least 1 of the 4 protocols is a Deactivation.

The combined added time fits the current monthly cap.

A protocol being continued (Keep-in-4x4) must grow by at least
   25% combined vs last month. **This rule is built and committed.**

### **1F.3 — Daily Use (the Today Card)**

4x4 protocols are checked off in the Today tab, in a card that
appears after the AM and PM blocks. There are always exactly 4
active protocols showing.

**Weekly-target protocols show a running tally — "X of Y this week"**
— below the protocol name on the Today card. **Built and committed.**

### **1F.4 — Weekly Scoring**

Weeks run Monday to Sunday, fixed to the calendar. A single miss in
a week is expected and fine. The NEVER TWICE standard applies to
repeated misses in a row.

### **1F.5 — The Time Budget and the Monthly Bands**

Every client starts at 30 minutes per day across all 4 protocols.

**The budget grows from 30 to 60 minutes when, for the month just**
finished, at least 2 of the 4 Foundation Cores hit 85% or higher
AND the other 2 are each still at 50% or better. **This evaluation**
runs automatically at period close. Built and committed. Real-world
verification pending — see verification list.

Monthly percentages map to three bands, per Core:

- 85% or higher = Unlocked
- 75–84% = Standard
- Below 75% = Remediate — the protocol automatically carries into
  next month. **Auto-carry is built and committed.**

**Promoting a protocol into permanent daily routine stops its time**
value from counting against the budget going forward.

### **1F.6 — Closing Out a Period**

A period is always anchored to a full calendar month, starting on
the 1st. A period cannot close before the last day of its target
month. The valid close window is the last day of the month through
5 calendar days after.

Closing a period writes a permanent History record per Foundation
Core — completion count, completion rate, audit outcome, and the
actual date range.

If nobody closes a period before the grace window runs out, the app
closes it automatically the next time DOP loads. The automatically-
closed period is flagged "Incomplete" — a distinct grey pill on the
History screen.

### **1F.7 — Grace Window Reminder Banner (NEW 07/07/2026)**

**A gold banner now appears in the PM block during the close window**
**(07/07/2026).** The banner shows every day the period is ready to be
manually closed, from the last day of the target month through the
end of the 5-day grace window, until either the client closes the
period or auto-close fires.

**Copy — days 5 through 1:** *"Your [Month] period is ready to
close — You have [X] days left before it auto-closes."*

**Copy — day 0 (final grace day):** *"Your [Month] period is ready
to close — 0 days left, closing today."*

The banner cannot be dismissed. It stays visible every day the
window is open, positioned near the PM close-the-day action. Real-
world verification pending — see verification list.

### **1F.8 — What Happens After a Period Closes**

**A Graduation Decision screen appears before anything else.**
The client sees one card per Foundation Core showing the protocol
name, its assigned Core, and the audit outcome. A Remediate card
shows a muted cream background and dashed gold border.

**The client must make a decision on all 4 cards before the screen**
will move forward.

### **1F.9 — Promote, Drop, and Keep in 4x4**

**PROMOTE** moves the protocol into the permanent daily AM or PM
checklist with a 4x4 GRADUATE badge (see 1F.13). Its time value no
longer counts against the 4x4 budget.

**DROP** ends the protocol. The result is recorded in History and
the slot opens for a new protocol next period.

**KEEP IN 4x4** continues the protocol into next month with the
prior period's settings pre-filled. Remediate pre-fills are
visually flagged in italics.

### **1F.10 — The 25% Growth Requirement for Keep in 4x4**

**A protocol kept in 4x4 must grow by at least 25% combined versus**
the prior month before Save is allowed. **If the combined growth**
falls short, the Save button does not work and the screen shows
the current growth percentage and how much more is needed.

**A protocol set to run every day cannot grow in frequency — all**
25% must come from increasing the time value instead.

### **1F.11 — After All 4 Decisions Are Made**

**A "Period Closed — Summary" screen appears** listing protocols
in three groups: Promoted, Dropped, and Continuing in 4x4.

A single DONE button returns the client to the DOP Today view.

### **1F.12 — Promoted Protocols Appear on Today Without Reload**

**Promoted protocols now show up on the Today checklist immediately**
after the DONE button is pressed — no page reload required (built
and committed). Real-world verification pending — see verification
list.

### **1F.13 — 4x4 GRADUATE Badge (NEW 07/07/2026)**

**Promoted 4x4 protocols now display a gold "4x4 GRADUATE" pill next**
to their label on the Today checklist and Archive view (07/07/2026).
The badge replaces the earlier plain-text "(Graduated from 4x4)"
suffix — labels are now clean and the badge does the visual work.

The badge is a small gold pill (background GOLD, black text, black
border) with the text "4x4 GRADUATE" in uppercase. It does not
appear on the 4x4 tab, Setup, or History views — only where the
graduated item shows up in the client's daily checklist. Real-world
verification pending — see verification list.

### **1F.14 — Editing a Protocol Mid-Month**

**A warning modal appears before any mid-month edit is saved.**
Locked copy: "Your current progress is saved. Changes apply from
today forward. Continue?" CONFIRM proceeds. CANCEL dismisses.

The warning only fires when an active period exists and the client
has actually changed a field. Built and committed.

### **1F.15 — Screen and Access Behavior**

The 4x4 Matrix tab is greyed out and disabled until DOP Configure
is completed. Hovering shows: "Complete DOP Configure setup to
unlock 4x4."

There is no fixed-day scheduling in 4x4 — only Daily or a weekly
target count.

### **1F.16 — Edge Cases and Confirmed Non-Bugs**

A period where every protocol is DNA is valid — net cost is zero.

A period where deactivation savings outweigh activation costs is
valid — net can be negative.

A period where a protocol was never completed is valid — records
a 0-out-of-however-many completion rate.

## **SECTION 1G — DOP FOOTER (RESOLVED 07/07/2026)**

**The DOP footer now shows the correct document ID**
(JPG-PROJ-APP-DOP-BUILD-v13) and CONFIDENTIAL is styled in GOLD
(07/07/2026). Previously the doc ID was wrong and CONFIDENTIAL
appeared in gray like the surrounding text — both fixed and
committed.

The PIT-link buttons in DOP still reload DOP instead of navigating
to PIT. **The URL constant is still a placeholder — not fixable**
until PIT has a real deployed URL (post-Supabase).

## **SECTION 1H — OPEN PIT BUTTON (UPDATED 07/07/2026)**

**The Open PIT button now uses the NEVER TWICE box treatment**
**(07/07/2026).** Same gold-light background as before, but now with
matching font size, weight, letter spacing, padding, and border
treatment as the NEVER TWICE box — visually consistent with the
JPG two-tier gold system across both DOP and PIT.

## **SECTION 1I — PENDING REAL-WORLD VERIFICATION (DOP)**

The following items are built and committed but have not yet been
verified through a real, natural period close. Verification will
happen automatically when the first real month-end arrives.

**Primary:**

Promoted protocols appearing on Today without reload

Time budget growing from 30 to 60 minutes when qualifying

Grace Window Reminder banner (07/07/2026 build)

4x4 GRADUATE badge (07/07/2026 build)

**Secondary (previously verified with simulated data):**

Graduation Decision screen

Period Closed — Summary screen

Period Close pieces — validation, history snapshot, auto-close

# **PART TWO — PIT (PERSONAL INVESTMENT TIME)**

PIT is the internal alignment app that sits inside the DOP daily
process. DOP is the checklist; PIT is where the detail lives.
PIT is best done on a computer — more typing than DOP.

## **SECTION 2A — LOGGING IN**

PIT uses the shared JPG login screen. Case-insensitive matching
applies. Working test account: test / test123.

## **SECTION 2B — REQUIRED FIELDS / DAILY TRACKABLES**

PIT has a set of Required Fields filled in each day. A "Daily
Trackables" sub-heading is planned but not yet built — held as part
of the combined instructions-panel copy pass.

### **2B.1 — Wake Up field (UPDATED 07/08/2026)**

**The Wake Up field is now a full 24-hour combobox.** The dropdown
shows all times in 15-minute increments from 12:00 AM through 11:45
PM, displayed in AM/PM format with no leading zero on the hour.

**The client can also type an entry directly instead of using the
dropdown.** Valid write-ins must be in H:MM AM/PM format, are
case-insensitive on AM/PM, and minutes must be one of 00, 15, 30,
or 45.

**Invalid write-ins show a red error message under the field and are
not saved.** The client can correct the entry or pick from the
dropdown.

**Old wake times saved before this change still display correctly.**
Legacy 24-hour values are converted to AM/PM format for display
without changing the underlying stored value until the client
re-saves.

## **SECTION 2C — TO ACCOMPLISH (Q2 / Q3 SECTIONS)**

**Current behavior (to be reversed by future carryover build — see
Section 2L):**

Checked-off items disappear from the following day's view.
Unchecked items do not automatically carry to the next day —
intentional. Q2/Q3 copy explaining this is not yet updated —
pending the combined instructions-panel copy pass.

## **SECTION 2D — ARCHIVE**

The Archive is a lookback view of past days' PIT entries.
Archive works fully client-side. A coach-facing version is
not built — not possible without Supabase migration.

## **SECTION 2E — APPOINTMENTS AND FUTURE TASKS**

Appointments has a working "Remove" button — confirmed live.

Future Tasks does not have a Remove button. **Confirmed gap.**
Fix follows the same Remove pattern in Appointments.

## **SECTION 2F — AI SUMMARY**

PIT's AI Summary pulls from every section of PIT and covers today
plus the 7 most recent days. Fixed by design — no client control.

## **SECTION 2G — PRAYER / SILENCE PREFERENCE**

Client preferences like Prayer or Silence persist correctly between
sessions.

## **SECTION 2H — SMS REMINDER**

PIT shows an SMS Reminder area. **UI placeholder only — no backend**
is wired. No SMS is actually sent. Post-Supabase.

## **SECTION 2I — OPEN DOP BUTTON (UPDATED 07/07/2026)**

**The Open DOP button in PIT now uses the NEVER TWICE box treatment**
**(07/07/2026).** Matches DOP's Open PIT button for cross-app visual
consistency.

## **SECTION 2J — INSTRUCTIONS PANEL**

A significant combined copy pass is held pending covering:
Q2/Q3 no-carryover wording (this language will change once Section
2L is built — see below), "Daily Trackables" sub-heading, panel-wide
layout restructure, auto-save reminder text, and AI Summary
description update. Do not send pieces individually.

## **SECTION 2K — VISUAL STANDARDS AND FITNESS FIELDS**

PIT uses the two-tier gold system:

- GOLD_LIGHT (#ddb94a) for clickable/action elements
- GOLD (#B8860B) for informational/non-interactive elements
- Both carry 1.5px black border on light backgrounds
- No black border on dark/black nav bar elements

PIT is the visual reference standard all other apps align to.

### **2K.1 — Fitness Yesterday multi-entry (NEW 07/08/2026)**

**The Fitness Yesterday selector now has three options instead of
two: Yes, No, and Rest Day.** Selecting Yes shows the fitness
detail block. Selecting No or Rest Day hides the detail block and
resets any entered detail.

**When Yes is selected, the client can now log more than one fitness
activity for yesterday.** Each activity gets its own detail block —
Activity Type, Distance, Terrain, and any activity-specific fields.

**An "Add Fitness Activity" button below the last entry adds another
activity block.** Each additional block has a Remove button beside
it. When only one activity block is present, the Remove button is
hidden.

**Old days saved before this change still display correctly.** The
old single-activity entry is automatically wrapped into the new
multi-entry format when the day is loaded, whether the day is
loaded from today's screen or by jumping to it in the Archive.

### **2K.2 — Terrain options (UPDATED 07/08/2026)**

**Treadmill is now an option in the Terrain dropdown.** The full
list is Road, Trail, Beach, Treadmill, Other.

### **2K.3 — Activity Type — Hiking (UPDATED 07/08/2026)**

**Hiking is now a selectable option in the Activity Type dropdown.**
Previously Hiking was recognized internally as a distance activity
but was not offered as a choice — so it could never actually be
selected. Now it is.

### **2K.4 — AM Fitness Today — Rest Day option (NEW 07/08/2026)**

**The AM Fitness Today selector now has three options: Yes, No, and
Rest Day.** The selector itself is a simple dropdown with no
detail block — Rest Day is treated as a valid answer for the day,
same as Yes or No.

## **SECTION 2L — TO ACCOMPLISH + APPOINTMENTS CARRYOVER (DESIGN LOCKED 07/08/2026 — NOT YET BUILT)**

This section describes the FUTURE behavior of the To Accomplish
and Appointments sections. The full locked design lives in the PIT
Code Logic doc, Section H. This is a summary in plain language.
None of this is built yet.

### **2L.1 — What will change**

**To Accomplish items that are not checked off will carry forward
to the next day automatically.** Today the unchecked items are lost
overnight. Under the new design, an item added today stays visible
tomorrow, and the day after, until the client either checks it as
done or clears it.

**Checking an item off records it as done on the day it was
originally added — not the day it was checked.** Same rule applies
to clearing an item.

**Appointments will follow the same carryover pattern.** An
appointment scheduled for a past date will keep showing up with a
visible "Past Due" indicator until the client acts on it — no
auto-expiry.

### **2L.2 — Fixed slots**

To Accomplish is not a growing list. It has fixed positions — One
Thing at the top, then Item 2, Item 3, and whatever Q3 has. Under
the new design, carried items stay in the same slot position they
had the day before.

### **2L.3 — Clearing items selectively**

**A new button will appear in the To Accomplish section — "Clear
Selective Items" (final wording confirmed at build time).** The
button only shows when at least one slot has an item in it.

Clicking the button opens a small window listing each occupied slot
with a checkbox. The client picks which items to clear and confirms.
Cleared items are removed from today's slots and recorded as
"cleared" on the day they were added.

**A Cancel option is always available in that window.** Confirming
shows a brief "N items cleared" notification.

### **2L.4 — Archive behavior**

**The Archive will be read-only under the new design.** The client
can view past days but cannot check, uncheck, clear, or edit any
item from a past day.

**Days the client skipped PIT entirely will show "No entry for this
day" in the Archive** instead of a blank empty form.

### **2L.5 — Instructions panel implications**

The current Q2/Q3 copy in the instructions panel explains the "no
carryover" behavior. Once Section 2L is built, that copy will need
rewriting. The held combined instructions-panel copy pass should
not be sent until this build is complete.

# **PART THREE — OBT (ONBOARDING & TRACKING)**

**Honest scope note:** OBT has a Class 3 modular structure and is
running, but most client-facing behavior is either unbuilt,
inconsistent, or known broken. This section stays deliberately short.

## **SECTION 3A — WHAT IS CONFIRMED LIVE**

OBT runs as a modular Class 3 app. Working login: Doug / JPG2026.
Whether the "test" user account works in OBT is not confirmed.
Dev port: 5175. CLAUDE.md created and committed 07/05/2026.

## **SECTION 3B — KNOWN ISSUES AND GAPS**

**Header inconsistency.** Does not match DOP/PIT standard.

**Section coloring.** Sections 1–3 gold, 4–5 blue, rest black.
  Target: all black — not yet applied.

**Missing centered title.** Not yet added.

**Top tab bar undersized.** Extends only ~half page width.

**"Reflect" tab breaks navigation.** Confirmed functional bug —
  clicking Reflect locks out all other tabs. Not yet fixed.

**Copy edits pending in Client Info.** Multiple items unfixed.

**File name shown at top of app.** Not compliant — not resolved.

## **SECTION 3C — WHAT'S NOT BUILT / NOT VERIFIED**

Anything beyond the items above is unbuilt, unverified, or not yet
aligned with the current standard.

# **PART FOUR — HUB (WORKSPACE HUB)**

**Honest scope note:** HUB is mostly architectural/planned, not
built. Very little live client-visible behavior to describe.

## **SECTION 4A — WHAT IS CONFIRMED**

HUB has a Class 3 modular structure and a monolith baseline
committed. The shared JPG login screen standard applies.
Dev port: 5176. CLAUDE.md created and committed 07/06/2026.
Login: Test/JPG2026.

## **SECTION 4B — WHAT IS DESIGNED BUT NOT BUILT**

The full 10-spoke model is defined in CS v1.8 Section 15 as the
target architecture. Spoke functionality is not yet built.

The Legal spoke gating rule (Spoke 1 must be signed before any
other spoke unlocks) is designed but not yet built at the
application level.

The client-journey tier and patch emblem system is a future task —
see the tier patch rendering item on the future-build list. This
was previously scoped as "belongs at HUB level, out of scope for
DOP." That scope is being revisited because visual rendering must
happen in the apps the client actually opens daily (DOP, PIT).

# **PART FIVE — CROSS-APP STANDING NOTES**

**Shared login standard.** All four apps use the same locked login
screen. Login matching is case-insensitive across all apps.

**Two-tier gold color system.** GOLD_LIGHT (#ddb94a) for clickable
elements, GOLD (#B8860B) for informational elements. Black border
on light backgrounds, no border on dark nav bars. Applied in PIT
and DOP; still pending in OBT and HUB.

**Cross-app data transfer.** Any behavior requiring data to move
between apps is not currently possible with localStorage alone.
All such features held for post-Supabase migration.

**AI features currently unwired.** DOP's Today's Takeaway and
PIT's AI Summary have no real API key wired. Keys must be
server-side — post-Supabase migration path.

**Desktop Code tab workflow.** All four apps are on Claude Desktop
Code tab. CLAUDE.md exists in each repo root. Each app has a
locked dev port (DOP 5173, PIT 5174, OBT 5175, HUB 5176).

## **MAINTENANCE RULES**

**Documentation style (locked):** short, bolded declarative
statements followed by 1–2 plain sentences — never conditional
"if X, then Y" phrasing. No field names, no code, no jargon.

**Coverage rule:** when a new behavior is built and browser-
verified, add it to the relevant section in the same session.

**Accuracy rule:** never fill an entry from assumption. Flag
uncertain behavior rather than asserting it.

## **KNOWN GAPS IN THIS DOCUMENT (FLAGGED, NOT FILLED)**

- The exact list of PIT Required Fields (count and label).
- OBT's exact live tab list and per-tab current behavior.
- HUB's current live functional state beyond login.
- Whether the "test" credential pair works in OBT.
- Whether the OBT "Reflect tab lockout" bug is still present.

## **VERSION HISTORY**

| VERSION | DATE | CHANGES |
| --- | --- | --- |
| v1.0 | 06/30/2026 | Initial version. DOP 4x4 only. |
| v2.0 | 07/02/2026 | Period Close pieces 1–3 documented as built. |
| v2.1 | 07/02/2026 | Documentation style locked. |
| v3.0 | 07/04/2026 | Expanded to all four apps. |
| v3.1 | 07/04/2026 | Graduation Workflow 1F.7–1F.12 added. Weekly tally, tier cap eval, mid-period edit warning marked built. |
| v3.2 | 07/05/2026 | Dead code removal in FourX4View.jsx noted. VERSION HISTORY section added. |
| v3.3 | 07/06/2026 | Migration to Claude Desktop Code tab completed across all four apps. |
| v3.4 | 07/07/2026 | DOP items from 07/07/2026 session added. Investigation findings 07/07/2026 corrected. New section 1I added: Pending Real-World Verification list for DOP. |
| v3.5 | 07/08/2026 | PIT items from 07/08/2026 session added. Section 2B.1 added: Wake Up 24-hour combobox with write-in validation. Section 2K restructured with 2K.1 (Fitness Yesterday multi-entry + Rest Day option), 2K.2 (Terrain Treadmill added), 2K.3 (Activity Type Hiking added — mismatch fix), 2K.4 (AM Fitness Today Rest Day option). Section 2C updated: added forward pointer noting current no-carryover behavior will be reversed by future build. New Section 2L added: To Accomplish + Appointments carryover system design locked, not yet built — plain-language summary of what will change, fixed slots, selective clear behavior, read-only Archive, skipped-day display, instructions-panel copy implications. |

*JPG-SYS-Apps-TroubleshootingGuide-WRK-v3.5 | Jones Performance
Group LLC | CONFIDENTIAL | 07/08/2026*

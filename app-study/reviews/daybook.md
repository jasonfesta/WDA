# Daybook — flow and interaction review

Jason Festa / WDA · 21 October 2026

Five visual states, with additional routes specified below. These are proposed product behaviors for later implementation; the review images are not functional app screens.

## Direction

One focused setup, then Today, a concrete plan-edit state, Week and Places. The editor changes the walk from 35 to 40 minutes so the saved result can be checked.

Original Daybook art direction: expansive warm cream, very large burgundy editorial serif with a little italic, quiet monospaced date/time labels, delicate landscape-and-sun-arc illustration, thin warm rules and open agenda rows. Coral and olive accents. Keep editorial air and avoid boxed dashboard grids.

Type: Cormorant Garamond, DM Sans, DM Mono. Palette: #FFF5E6, #6A1822, #ED9370, #939567.

## Reference chain

Original art direction: [saved screen](../references/originals/daybook.png). [Original prompt](../prompts/daybook.txt). Historical research: [mobile research](../research/archive/mobile-research-2026-10-20.md), [state plan](../research/archive/mobile-state-plan-2026-10-20.md), [expanded flow research](../research/archive/expanded-flow-research-2026-10-20.md).

Current product and interaction references were checked on 21 October 2026. Product documentation establishes features, not a hands-on audit of each native screen.

- [Structured](https://structured.app/) — A visual timeline and calendar integration inform Daybook’s planning structure. Its daylight landscape and saved places remain original to this study.
- [Structured · Create and edit tasks](https://help.structured.app/en/articles/338050) — Task creation, date/time/duration editing and saving back into the timeline support an explicit editor. Daybook additionally preserves drafts and derives the duration from start/end.
- [Apple · Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — Reference retained from the research plan. Full article could not be read through the text fetch, so no specific behavior is attributed to it. The proposed short setup sequences are WDA decisions.
- [W3C · Validating input](https://www.w3.org/WAI/tutorials/forms/validation/) — Label required fields and expose accessible validation feedback. Validate on the server as well as the client. Failed saves should keep the user’s draft.
- [W3C · Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Modal focus stays inside the dialog; Escape closes it. Restore useful focus on return. Dirty drafts require an explicit discard choice.

## Action flow

01 Give the daylight a place → 02 An evening worth keeping → 03 Make room for the light → 04 A week with breathing room → 05 Places for an open hour

The sequence shows representative states, not five mandatory steps on every visit. Returning users land on the last valid main destination; completed onboarding is skipped. Tab routes remain available independently of this reading order.

| Destination | Route | Return rule |
| --- | --- | --- |
| Today | `02-today` | Preserve its scroll, selection and draft; active destination does not reload. |
| Week | `04-week` | Preserve its scroll, selection and draft; active destination does not reload. |
| Places | `05-places` | Preserve its scroll, selection and draft; active destination does not reload. |

## Fixed review data

Demo date Thursday, 18 June 2026, timezone Europe/Lisbon. Current time 18:00; sunrise 06:12; sunset 20:58; daylight remaining 2h 58m. Walk starts 18:30 and initially ends 19:05 (35 min). Edited end 19:10 gives 40 min. Dinner stays 19:15–20:15 (60 min). Week 15–21 June, Thursday 18 selected. Three saved places.

- At 18:00, sunset 20:58 leaves 2h 58m.
- Before edit, walk 18:30–19:05 = 35 minutes; draft end 19:10 = 40.
- Save commits 40 minutes; Cancel keeps 35. Reminder 10 minutes before 18:30 is 18:20.
- Week is 15–21 June 2026; Thursday is 18 June. Preserve Europe/Lisbon.

## 01 · Give the daylight a place

Entry: First launch. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/daybook/01-setup.png) · [Exact prompt](../prompts/screens/daybook/01-setup.txt)

Pictured state: DAYBOOK, small "A lighter day starts here". Large serif title "Give the daylight a place." Warm landscape with a small sun arc. City field label "Where your day begins" value "Lisbon, Portugal". Small "Europe/Lisbon". Explanation "Start with a simple plan. Add your calendar when you are ready." Primary "Start with manual plans". Secondary "Connect a calendar". No tabs.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `daybook.01.01` · City field | Type/search then select | Select a real location and timezone; no permission required for manual entry. Route: `aux:city-search`. | Accessible combobox/listbox, clear action, arrow navigation, Enter select, Escape close. Distinguish query from selected record ID. |
| `daybook.01.02` · Start with manual plans | Tap/click or form Enter | Finish setup without calendar access; initial concept data is explicitly a demo fixture. Route: `02-today`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |
| `daybook.01.03` · Connect a calendar | Tap/click; Enter or Space | Explain read-only import first; denied/cancel returns to manual path, no false connected state. Route: `aux:calendar-permission`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 02 · An evening worth keeping

Entry: Complete setup / Today tab. Selected destination: Today.

[Screen image](../images/mobile/daybook/02-today.png) · [Exact prompt](../prompts/screens/daybook/02-today.txt)

Pictured state: DAYBOOK and "THU / 18 JUN". Large original-style heading "An evening worth keeping." with worth keeping italic. "Lisbon · Clear skies · 28°". Delicate landscape daylight arc with sunrise 06:12 sunset 20:58; exact label "2h 58m of daylight left". Two open agenda rows: "18:30 Walk by the water" / "35 MIN"; "19:15 Dinner on the terrace" / "60 MIN". Main outlined "Add an evening plan +". Bottom Today / Week / Places; ONLY Today active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `daybook.02.01` · Date header | Tap/click; Enter or Space | Choose day; preserve timezone and switch timeline; Today shortcut returns to fixture current day. Route: `aux:date-picker`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.02.02` · Daylight arc | Tap/click; Enter | Open sunrise/sunset and current-time details with accessible text values. Route: `aux:daylight-detail`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `daybook.02.03` · Walk by the water | Tap/click; Enter or Space | Open existing walk draft with 18:30–19:05 and 35 min. Route: `03-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.02.04` · Dinner on the terrace | Tap/click; Enter or Space | Open dinner record; avoid overwriting walk ID. Route: `aux:plan-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.02.05` · Add an evening plan | Tap/click; Enter or Space | Open same editor in create mode with a new ID and empty title; preview screen shows edit mode. Route: `03-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.02.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `daybook.02.nav.2` · Week | Tap/click or Enter | Open Week; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-week`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `daybook.02.nav.3` · Places | Tap/click or Enter | Open Places; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-places`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 03 · Make room for the light

Entry: Tap Walk then change end time. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/daybook/03-editor.png) · [Exact prompt](../prompts/screens/daybook/03-editor.txt)

Pictured state: Top "Cancel" left and "Edit plan" centered. Serif title "Make room for the light." Labeled fields: "Plan" value "Walk by the water"; "Date" value "Thursday, 18 June"; "Starts"18:30; "Ends"19:10; derived label "40 minutes"; "Place"Riverside path; "Reminder"10 minutes before. Small helper "Reminder at 18:20". Main "Save changes". Quiet "Delete plan". No keyboard; no tab bar while full-screen editor.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `daybook.03.01` · Cancel | Tap/click; Enter or Space | Dirty draft offers Keep editing / Discard; saved plan remains 35 min until Save. Route: `aux:discard-plan`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.03.02` · Plan title | Focus, type; blur validates | Required 1–80 trimmed characters; preserve draft on errors. Route: `self`. | Native labeled input; errors use aria-describedby and aria-invalid. Keyboard must not cover the active field. |
| `daybook.03.03` · Date | Tap picker or type | Select date in Europe/Lisbon; changing date does not silently change time. Route: `self`. | Calendar with keyboard support and typed alternative; keep timezone explicit. Selected date is not keyboard focus. |
| `daybook.03.04` · Starts / Ends | Tap/scroll picker or type | Recalculate duration; end must be after start or explicitly next day; show inline error. Route: `self`. | Native time input/numeric alternative; 24-hour storage with localized display. Validate and derive related labels from one value. |
| `daybook.03.05` · Place | Type/search then select | Open picker in return-to-editor mode; preserve unsaved fields. Route: `05-places`. | Accessible combobox/listbox, clear action, arrow navigation, Enter select, Escape close. Distinguish query from selected record ID. |
| `daybook.03.06` · Reminder | Tap then choose; keyboard | Choose off/atstart/5/10/30minutesbefore; derive 18:20 from 18:30 minus 10 minutes. Route: `self`. | Labeled select; preserve old value on Cancel and announce the chosen value. |
| `daybook.03.07` · Save changes | Tap/click or form Enter | Commit existing walk once as 18:30–19:10; Week now shows 40 min; failure retains draft. Route: `04-week`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |
| `daybook.03.08` · Delete plan | Tap/click; Enter or Space | Confirm; successful deletion returns toToday withUndo; cancel retains record. Route: `aux:delete-plan`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 04 · A week with breathing room

Entry: Save changes / Week tab. Selected destination: Week.

[Screen image](../images/mobile/daybook/04-week.png) · [Exact prompt](../prompts/screens/daybook/04-week.txt)

Pictured state: DAYBOOK. Heading "A week with breathing room". "15–21 June 2026". Seven day selectors exactly "Mon15 Tue16 Wed17 Thu18 Fri19 Sat20 Sun21" with ONLY Thu 18 selected. "Thursday, 18 June". Agenda "18:30–19:10 Walk by the water" / "40 min · Riverside path"; "19:15–20:15 Dinner on the terrace" / "60 min". Small success message "Plan updated". Quiet previous/next week arrows. Bottom Today / Week / Places; ONLY Week active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `daybook.04.01` · Day selectors | Tap picker or type | Update selected day and list; selected day has an explicit selected state distinct from focus. Route: `self`. | Calendar with keyboard support and typed alternative; keep timezone explicit. Selected date is not keyboard focus. |
| `daybook.04.02` · Previous / next week | Tap/click; Enter or Space | Move seven days, keep weekday selection; month/year labels recalculated. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.04.03` · Walk / Dinner rows | Tap/click; Enter or Space | Open selected record by ID; keep return Week and scroll position. Route: `03-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.04.04` · Plan updated message | No input | Live announcement after save; not a button; dismiss visually after 4 seconds without moving focus. Route: `none`. | Noninteractive text/status; polite live region only for changes, no focus move or clickable affordance. |
| `daybook.04.05` · Date header | Tap/click; Enter or Space | Open date picker; preserve the current destination and its return route. Route: `aux:date-picker`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.04.06` · Daylight arc | Tap/click; Enter | Open daylight details for the selected day; Back returns to Week. Route: `aux:daylight-detail`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `daybook.04.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `daybook.04.nav.2` · Week | Tap/click or Enter | Open Week; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-week`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `daybook.04.nav.3` · Places | Tap/click or Enter | Open Places; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-places`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 05 · Places for an open hour

Entry: Places tab. Selected destination: Places.

[Screen image](../images/mobile/daybook/05-places.png) · [Exact prompt](../prompts/screens/daybook/05-places.txt)

Pictured state: DAYBOOK. Title "Places for an open hour". Small "3 saved places". Three unequal airy landscape vignettes with open captions: "Riverside path" / "Walk by the water"; "Pocket park" / "A quiet chapter"; "Hill overlook" / "The last of the light". Each row has a small edit icon. Mainoutlined "Save a place +". Bottom Today / Week / Places; ONLY Places active. No fake map routes or GPS directions.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `daybook.05.01` · Place row | Tap/click; Enter or Space | Open saved details; when entered from the editor, select the place and return to its draft. Route: `aux:place-detail`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.05.02` · Edit place icon | Tap/click; Enter or Space | Edit name/note/location; validation and cancel preserve original. Route: `aux:place-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.05.03` · Save a place | Tap/click; Enter or Space | Create new place only on save; duplicates can merge after explicit choice;count updates. Route: `aux:place-editor`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.05.04` · Date header | Tap/click; Enter or Space | Open date picker; preserve the current destination and its return route. Route: `aux:date-picker`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `daybook.05.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `02-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `daybook.05.nav.2` · Week | Tap/click or Enter | Open Week; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-week`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `daybook.05.nav.3` · Places | Tap/click or Enter | Open Places; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-places`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## Additional routes and recovery

These states are specified, not additional image exports. Every `aux:` destination in the ledger is defined here. Shared loading, error, back and persistence behavior is in the [React handoff](../interaction/react-handoff.md).

### calendar-permission

Explain read-only calendar import → select provider/calendar → explicit Connect. Show loading and connected status only after success. Denied, cancelled or unavailable returns to manual planning. Imported items keep source IDs; editing read-only events opens the source or creates an explicitly separate local copy.

### city-search

Labeled city search, clear-query button, result list with country and timezone, loading/no-results/error states. Selection uses a stable city ID. Add/Use is explicit; duplicate saved city selects the existing record. Cancel restores the invoking route and draft.

### date-picker

Labeled month/year and date grid, previous/next month and Today. Keyboard date navigation and typed-date alternative. Apply selects day in Europe/Lisbon; Cancel preserves date and scroll.

### daylight-detail

Show sunrise, sunset and daylight window as readable times with timezone/source. Optional reminder requires its own explicit action. Close returns to the initiating row/arc; polar-day/no-data states need explanatory text.

### delete-plan

Confirm Delete / Keep plan. Success removes the selected record and returns to Today with Undo; failure keeps the form and record. Undo restores the original ID and times.

### discard-plan

Keep editing returns to the dirty form. Discard restores the saved 18:30–19:05 / 35-minute walk and returns to the caller. Never commit the displayed 40-minute draft implicitly.

### place-detail

Show saved name, description and location with Edit and Use in a plan. In editor-picker mode, Select this place returns its ID to the existing draft. Back never discards that draft.

### place-editor

Labeled name (1–80), note (0–500), city/location, Save and Cancel. Create increments saved count once; edit updates the same ID. Duplicate candidates offer Use existing / Keep separate. Dirty Cancel confirms discard.

### plan-editor

Use the plan editor for the selected record, including dinner; it carries recordId and returnTo. Save updates that record only. Cancel preserves saved values; errors keep the draft.

## Alternative to evaluate

**Plan before calendar.** Start with one local evening plan, then offer read-only calendar import after saving. Manual planning remains complete on its own. Compare first-plan save and duplicate imported events.

## Implementation acceptance

- Every visible control maps to a ledger ID; decorative and operating-system content is explicitly excluded.
- Resolve every route and carry `returnTo`, record ID and draft ID through editors.
- Test primary flow plus back/cancel, rejected permission, empty data, failed save/retry, offline resume and duplicate activation.
- Test keyboard-only, screen reader order, reduced motion, 200% text and a narrow viewport; no clipped controls or hidden essential actions.
- Verify the fixed data checks above with shared selectors rather than hardcoded repeated strings.

<!-- MOTION CONTRACT -->

## Motion, rollover and implementation prompts

Draw the daylight arc and its marker from the selected place, date and time. Let edits settle gently into the timeline while the editorial landscape, generous spacing and typography remain still.

[Complete motion contract](../interaction/motion/daybook.md) · [App interaction prompt](../prompts/interaction/daybook.txt) · [Asset preparation prompt](../prompts/motion/daybook-assets.txt) · [Motion direction prompt](../prompts/motion/daybook-direction.txt)

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

- [01 screen interaction prompt](../prompts/interaction/daybook/01-setup.txt) — Location control underlines on hover/focus. Manual plans enters Today; calendar connection is explicit and cannot move the arc before valid data returns.

- [02 screen interaction prompt](../prompts/interaction/daybook/02-today.txt) — Daylight arc hover/focus offers the same readable time details as tap. Plan row hover tints only the hit area; opening Walk retains its saved 35 minutes. Date heading opens a picker.

- [03 screen interaction prompt](../prompts/interaction/daybook/03-editor.txt) — Field focus gets an immediate border/underline. Changing Ends to 19:10 derives 40 minutes; Save commits then returns with feedback, Cancel retains 35 minutes. Never advance the arc based on an unsaved random animation.

- [04 screen interaction prompt](../prompts/interaction/daybook/04-week.txt) — Day hover gives a thin outline; only activation changes selection. A successful saved edit moves the plan endpoint over180ms and shows Plan updated. Week arrows never alter the selected plan contents.

- [05 screen interaction prompt](../prompts/interaction/daybook/05-places.txt) — Place row hover gives its title an underline; edit pencils are independent targets. Opening a place and editing it remain distinct. Saving inserts one row over180ms after success.

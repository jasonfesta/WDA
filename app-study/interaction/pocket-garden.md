# Pocket Garden — flow and interaction review

Jason Festa / WDA · 21 October 2026

Five visual states, with additional routes specified below. These are proposed product behaviors for later implementation; the review images are not functional app screens.

## Direction

Replace the already-registered early-access message with a usable first-run onboarding. Manual plant entry is the primary path; camera and reminders remain optional.

Original Pocket Garden art direction: beautiful tactile gouache illustration, leafy olive greens, peach flowers, coral overalls, soft warm sunlight, cream reading surfaces, burgundy humanist headings. Consistent dark-haired gardener and botanical brush texture. Avoid generic vector clip art or glass dashboards.

Type: DM Sans. Palette: #FFF9E9, #6A7044, #BC7352, #782E35.

## Reference chain

Original art direction: [saved screen](../references/originals/pocket-garden.png). [Original prompt](../prompts/pocket-garden.txt). Historical research: [mobile research](../research/archive/mobile-research-2026-10-20.md), [state plan](../research/archive/mobile-state-plan-2026-10-20.md), [expanded flow research](../research/archive/expanded-flow-research-2026-10-20.md).

Current product and interaction references were checked on 21 October 2026. Product documentation establishes features, not a hands-on audit of each native screen.

- [Planta](https://getplanta.com/) — Plant care, plant collections and journals inform a plant-centered structure. The painterly presentation remains Pocket Garden’s original direction.
- [Planta · Getting started](https://getplanta.com/discover/getstartedwithplanta) — Adding plants to sites, completing or postponing tasks, and keeping plant notes inform setup → garden → care → observation.
- [Planta · Custom care](https://getplanta.com/discover/iam/custom/care) — Custom tasks can have descriptions and recurrence. Pocket Garden uses an observation before recording care; it does not assume every reminder requires watering.
- [Apple · Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — Reference retained from the research plan. Full article could not be read through the text fetch, so no specific behavior is attributed to it. The proposed short setup sequences are WDA decisions.
- [W3C · Validating input](https://www.w3.org/WAI/tutorials/forms/validation/) — Label required fields and expose accessible validation feedback. Validate on the server as well as the client. Failed saves should keep the user’s draft.

## Action flow

01 Your little garden starts here → 02 Who is growing with you? → 03 Good morning, little garden → 04 Check the soil → 05 The things you notice

The sequence shows representative states, not five mandatory steps on every visit. Returning users land on the last valid main destination; completed onboarding is skipped. Tab routes remain available independently of this reading order.

| Destination | Route | Return rule |
| --- | --- | --- |
| Garden | `03-garden` | Preserve its scroll, selection and draft; active destination does not reload. |
| Care | `04-care` | Preserve its scroll, selection and draft; active destination does not reload. |
| Notes | `05-notes` | Preserve its scroll, selection and draft; active destination does not reload. |

## Fixed review data

One plant: Pip, an Olive at the Kitchen window, observed in Bright light. One soil check is due. Still damp is selected, so no watering is recorded. The note “Pip has two new leaves.” is an unsaved draft.

- Create Pip once; duplicate taps/retry keep one record.
- Still damp saves an observation, never a watering event.
- After Save soil check the due count becomes zero; Undo restores the task.
- Save note replaces the editor with one dated note; Cancel never deletes earlier notes.

## 01 · Your little garden starts here

Entry: First launch. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/pocket-garden/01-welcome.png) · [Exact prompt](../prompts/screens/pocket-garden/01-welcome.txt)

Pictured state: Pocket Garden brand. The original illustrated gardener among olive foliage and peach flowers fills the top 60%, extending fully to both side edges and top, fading into warm cream. Headline "Your little garden starts here." Body "Start with one plant. Learn its little rhythms." Main "Add my first plant". Secondary "Explore a sample garden". No early-access badge, no spot-saved claim. No tabs.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `pocket-garden.01.01` · Add my first plant | Tap/click; Enter or Space | Start a new empty plant draft. Route: `02-plant`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.01.02` · Explore a sample garden | Tap/click; Enter | Open clearly labeled Sample garden; keep demo records isolated until user chooses to create a real garden. Route: `03-garden`. | Route link; announce destination heading after navigation and restore scroll on Back. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 02 · Who is growing with you?

Entry: Add my first plant. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/pocket-garden/02-plant.png) · [Exact prompt](../prompts/screens/pocket-garden/02-plant.txt)

Pictured state: Back control, Pocket Garden, "Your first plant". Heading "Who is growing with you?" Small painterly olive plant. Labeled fields "Plant name" value "Pip"; "Plant type" value "Olive"; "Where it lives" value "Kitchen window". Light choices "Low" / "Indirect" / "Bright", ONLY Bright checked. Helper "A starting observation. You can change it later." Primary "Create my garden". No keyboard and no tabs.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `pocket-garden.02.01` · Back | Tap/click; Enter or Space | Keep plant draft; explicit discard only from a confirmation. Route: `01-welcome`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.02.02` · Plant name | Focus, type; blur validates | Required trimmed name, 1–40 characters; inline error on blur or submit. Route: `self`. | Native labeled input; errors use aria-describedby and aria-invalid. Keyboard must not cover the active field. |
| `pocket-garden.02.03` · Plant type | Type/search then select | Search known species or choose Unknown; selected Olive returns to draft. Route: `aux:plant-search`. | Accessible combobox/listbox, clear action, arrow navigation, Enter select, Escape close. Distinguish query from selected record ID. |
| `pocket-garden.02.04` · Where it lives | Focus, type; blur validates | Store a free-text location; optional empty state is allowed. Route: `self`. | Native labeled input; errors use aria-describedby and aria-invalid. Keyboard must not cover the active field. |
| `pocket-garden.02.05` · Light choices | Tap option; arrow keys | Select exactly one observation; labels and selected style update together. Route: `self`. | Native radio group with one selection and a visible legend; selected and focus states are distinct. |
| `pocket-garden.02.06` · Create my garden | Tap/click or form Enter | Validate then create Pip once; show pending state; errors retain draft and retry idempotently. Route: `03-garden`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 03 · Good morning, little garden

Entry: Create my garden / Garden tab. Selected destination: Garden.

[Screen image](../images/mobile/pocket-garden/03-garden.png) · [Exact prompt](../prompts/screens/pocket-garden/03-garden.txt)

Pictured state: Pocket Garden header, settings gear. "Good morning, little garden" and "1 plant, a little room to grow." One large airy painterly olive pot, name "Pip", "Olive · Kitchen window". Small label "Bright light". Context row "A soil check is waiting" with arrow. Main "Check on Pip". Secondary "Add a plant +". Bottom Garden / Care / Notes; ONLY Garden active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `pocket-garden.03.01` · Settings gear | Tap/click; Enter or Space | Open garden preferences and optional reminder settings. Route: `aux:settings`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.03.02` · Pip image / name | Tap/click; Enter | Open Pip details, care history and edit action; Back restores Garden scroll. Route: `aux:plant-detail`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `pocket-garden.03.03` · A soil check is waiting / Check on Pip | Tap/click; Enter or Space | Open the due task without recording completion. Route: `04-care`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.03.04` · Add a plant | Tap/click; Enter or Space | Open an empty additional-plant draft; cancel returns to Garden. Route: `02-plant`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.03.nav.1` · Garden | Tap/click or Enter | Open Garden; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-garden`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `pocket-garden.03.nav.2` · Care | Tap/click or Enter | Open Care; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-care`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `pocket-garden.03.nav.3` · Notes | Tap/click or Enter | Open Notes; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-notes`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 04 · Check the soil

Entry: Check on Pip / Care tab. Selected destination: Care.

[Screen image](../images/mobile/pocket-garden/04-care.png) · [Exact prompt](../prompts/screens/pocket-garden/04-care.txt)

Pictured state: Pocket Garden; heading "Check the soil". "Pip · Olive" and small olive-leaf vignette. Task "Check the soil". Instruction "Feel the soil before deciding to water." Choices "Still damp" / "Dry to the touch"; ONLY Still damp selected. Calm feedback "No water for now. Check again later." Primary "Save soil check". Secondary "Remind me later". Bottom Garden / Care / Notes; ONLY Care active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `pocket-garden.04.01` · Still damp / Dry to the touch | Tap option; arrow keys | Record an observation, not an automatic watering action; change guidance conditionally. Route: `self`. | Native radio group with one selection and a visible legend; selected and focus states are distinct. |
| `pocket-garden.04.02` · Save soil check | Tap/click or form Enter | Save dated observation once; mark this check complete, update care count; show undo snackbar. Route: `03-garden`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |
| `pocket-garden.04.03` · Remind me later | Tap/click; Enter or Space | Choose a date/time or cancel; no repeated permission prompt after denial. Route: `aux:snooze`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.04.nav.1` · Garden | Tap/click or Enter | Open Garden; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-garden`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `pocket-garden.04.nav.2` · Care | Tap/click or Enter | Open Care; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-care`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `pocket-garden.04.nav.3` · Notes | Tap/click or Enter | Open Notes; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-notes`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 05 · The things you notice

Entry: Notes tab / Add observation. Selected destination: Notes.

[Screen image](../images/mobile/pocket-garden/05-notes.png) · [Exact prompt](../prompts/screens/pocket-garden/05-notes.txt)

Pictured state: Pocket Garden, heading "The things you notice". "Pip · Kitchen window". One subtle botanical leaf illustration in corner. Labeled editor "New observation" with exact text "Pip has two new leaves." Optional outlined control "Add a photo". Primary "Save note". Secondary "Cancel". Quiet footer line "Your notes will grow here." Bottom Garden / Care / Notes; ONLY Notes active. Do not show a second copy of the unsaved note in history.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `pocket-garden.05.01` · Plant selector | Type/search then select | Select a plant; preserve draft text when switching and confirm reassignment if needed. Route: `aux:plant-picker`. | Accessible combobox/listbox, clear action, arrow navigation, Enter select, Escape close. Distinguish query from selected record ID. |
| `pocket-garden.05.02` · New observation | Focus/type; multiline Enter | Keep draft locally; 1–1000 characters; Save disabled for blank text. Route: `self`. | Labeled textarea; preserve line breaks, character limit and draft. Save is a separate explicit action. |
| `pocket-garden.05.03` · Add a photo | Tap/click; Enter or Space | Open platform picker; cancellation leaves draft untouched; show upload retry if needed. Route: `aux:photo-picker`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.05.04` · Save note | Tap/click or form Enter | Persist exactly one note and replace editor with dated history card; announce Saved. Route: `self`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |
| `pocket-garden.05.05` · Cancel | Tap/click; Enter or Space | If dirty, offer Keep editing / Discard; otherwise return to Notes list. Route: `aux:discard-note`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `pocket-garden.05.nav.1` · Garden | Tap/click or Enter | Open Garden; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-garden`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `pocket-garden.05.nav.2` · Care | Tap/click or Enter | Open Care; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-care`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `pocket-garden.05.nav.3` · Notes | Tap/click or Enter | Open Notes; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-notes`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## Additional routes and recovery

These states are specified, not additional image exports. Every `aux:` destination in the ledger is defined here. Shared loading, error, back and persistence behavior is in the [React handoff](react-handoff.md).

### discard-note

Keep editing returns focus to the draft. Discard clears only the unsaved note and returns to the Notes list; it never deletes a saved observation.

### photo-picker

Open the platform’s limited photo picker only on Add a photo. Selection shows a removable thumbnail and upload progress. Cancel changes nothing; failed upload retains the note and allows retry/removal before saving.

### plant-detail

Show Pip’s name, species, location, observation history and Edit. Edit uses the plant form with the same record ID; saving updates rather than creates. Back restores the source screen.

### plant-picker

List known plants with the current selection. Selecting a different plant confirms reassigning a dirty note, then returns to the same draft. Cancel keeps Pip and all entered text.

### plant-search

Search species with a labeled input, loading, no-results and retry states. Choose a result or Unknown; apply the species ID to the plant draft. Cancel preserves the previous value.

### settings

Show preference rows and account/help links in a sheet. Each switch exposes its actual saved value. Close returns to the invoking tab, scroll and focus; notification permission remains a separate explicit action.

### snooze

Choose later today, tomorrow or a date/time; Apply changes the task due time, not its completion status. Cancel preserves the old date. Reminder permission refusal does not prevent saving a new due time.

## Alternative to evaluate

**Sample garden first.** Let visitors explore an explicitly labeled demo before adding a plant. Demo care and notes remain in a separate namespace; Create my garden opens an empty plant form. Compare setup completion and accidental demo-record saves.

## Implementation acceptance

- Every visible control maps to a ledger ID; decorative and operating-system content is explicitly excluded.
- Resolve every route and carry `returnTo`, record ID and draft ID through editors.
- Test primary flow plus back/cancel, rejected permission, empty data, failed save/retry, offline resume and duplicate activation.
- Test keyboard-only, screen reader order, reduced motion, 200% text and a narrow viewport; no clipped controls or hidden essential actions.
- Verify the fixed data checks above with shared selectors rather than hardcoded repeated strings.

<!-- MOTION CONTRACT -->

## Motion, rollover and implementation prompts

Keep the painterly gardener, warm window and Pip recognizable. Let a few leaves and filtered light move within the picture; the care decisions and notes stay calm and easy to read.

[Complete motion contract](motion/pocket-garden.md) · [App interaction prompt](../prompts/interaction/pocket-garden.txt) · [Asset preparation prompt](../prompts/motion/pocket-garden-assets.txt) · [Motion direction prompt](../prompts/motion/pocket-garden-direction.txt)

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

- [01 screen interaction prompt](../prompts/interaction/pocket-garden/01-welcome.txt) — The primary start CTA deepens its terracotta tint on hover/press. No plant grows or becomes saved until setup succeeds.

- [02 screen interaction prompt](../prompts/interaction/pocket-garden/02-plant.txt) — Field border becomes olive on focus; Bright/Indirect/Low tint in 120 ms and select only on activation. Create my garden commits Pip once; pending state keeps field values visible.

- [03 screen interaction prompt](../prompts/interaction/pocket-garden/03-garden.txt) — Hover Check on Pip highlights only its button. Soil-check row gains a subtle outline; opening it does not mark it done. Add a plant opens a new draft, not a copy of Pip.

- [04 screen interaction prompt](../prompts/interaction/pocket-garden/04-care.txt) — Still damp selects an olive border and updates advice in 160 ms. Save soil check changes task state only on success, with readable Saved feedback. Dry to the touch is a different observation, not an automatic watering action.

- [05 screen interaction prompt](../prompts/interaction/pocket-garden/05-notes.txt) — Textarea caret is native; photo attachment fades in over 160 ms after selection. Save replaces the draft with one dated note after success; Cancel asks before discarding a dirty note.

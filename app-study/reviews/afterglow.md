# Afterglow — flow and interaction review

Jason Festa / WDA · 21 October 2026

Five visual states, with additional routes specified below. These are proposed product behaviors for later implementation; the review images are not functional app screens.

## Direction

Retain the evening-time concept and develop the routine-and-sound direction already explored in the saved research. Remove the unsupported promise about timing the last coffee.

Original Afterglow art direction: luminous localized peach and amber blooms on milk cream, deep burgundy rounded humanist typography, tiny polished amber crescent, frosted controls, generous calm negative space INSIDE the UI. Preserve warm light and type character of the original.

Type: Nunito Sans. Palette: #FFF6E9, #F4BE83, #E67450, #631C22.

## Reference chain

Original art direction: [saved screen](../references/originals/afterglow.png). [Original prompt](../prompts/afterglow.txt). Historical research: [mobile research](../research/archive/mobile-research-2026-10-20.md), [state plan](../research/archive/mobile-state-plan-2026-10-20.md), [expanded flow research](../research/archive/expanded-flow-research-2026-10-20.md).

Current product and interaction references were checked on 21 October 2026. Product documentation establishes features, not a hands-on audit of each native screen.

- [Headspace · Sleep](https://www.headspace.com/content/categories/sleep) — Sleepcasts, music, soundscapes and wind-down content support separate ritual and audio destinations. The specific routine, timer and navigation below are WDA proposals.
- [Apple · Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — Reference retained from the research plan. Full article could not be read through the text fetch, so no specific behavior is attributed to it. The proposed short setup sequences are WDA decisions.
- [W3C · Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — In-page tabs need matching panels and keyboard behavior. The study’s bottom destinations are route navigation: implement links with aria-current, rather than applying tab semantics to unrelated pages.
- [W3C · Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Modal focus stays inside the dialog; Escape closes it. Restore useful focus on return. Dirty drafts require an explicit discard choice.

## Action flow

01 A softer end to your day → 02 When does your evening slow down? → 03 Tonight can be simple → 04 Small rituals to return to → 05 Rain beyond the window

The sequence shows representative states, not five mandatory steps on every visit. Returning users land on the last valid main destination; completed onboarding is skipped. Tab routes remain available independently of this reading order.

| Destination | Route | Return rule |
| --- | --- | --- |
| Tonight | `03-tonight` | Preserve its scroll, selection and draft; active destination does not reload. |
| Rituals | `04-rituals` | Preserve its scroll, selection and draft; active destination does not reload. |
| Sounds | `05-sounds` | Preserve its scroll, selection and draft; active destination does not reload. |

## Fixed review data

Wind-down at 22:45. Reminders are optional and initially off. Breathe 2 min + Stretch 5 min + Read 8 min = 15 min, starting at 22:30. Rain is a separate 20-minute audio track.

- 2 + 5 + 8 = 15 minutes; routine runs 22:30–22:45.
- Library membership and Tonight derive from the same routine IDs; no duplicate entries.
- Sound image is a later playing state after explicit Play: 05:00 + 15:00 = 20:00. Opening Sounds alone is paused.
- Editing a saved time returns to Tonight; Back in edit mode does not reopen welcome.

## 01 · A softer end to your day

Entry: First launch. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/afterglow/01-welcome.png) · [Exact prompt](../prompts/screens/afterglow/01-welcome.txt)

Pictured state: Brand Afterglow. Small marker 1 / 2. Upper half: sculptural amber crescent floating in a warm peach light bloom. Headline "A softer end to your day." Body "A few small rituals between your day and your pillow." Main CTA "Find my rhythm". Secondary "I already have an account". No tab bar.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `afterglow.01.01` · Find my rhythm | Tap/click; Enter or Space | Start setup; preserve any local draft. Route: `02-time`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.01.02` · I already have an account | Tap/click; Enter | Open sign-in; return to welcome on cancel; restore saved settings only after success. Route: `aux:sign-in`. | Route link; announce destination heading after navigation and restore scroll on Back. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 02 · When does your evening slow down?

Entry: Find my rhythm. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/afterglow/02-time.png) · [Exact prompt](../prompts/screens/afterglow/02-time.txt)

Pictured state: Brand Afterglow; back arrow; 2 / 2. Headline "When does your evening slow down?" Readout "10:45 pm" and subtitle "Your wind-down time". Frosted picker hours 10, minutes 45, pm; adjacent muted values. Tiny amber crescent. Optional switch "Remind me 15 minutes before" OFF, helper "You can turn this on later." Main CTA "Set my evening". No tabs. Body: Make a little room for a calmer evening. No coffee claim.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `afterglow.02.01` · Back | Tap/click; Enter or Space | Keep draft time and reminder selection. Route: `01-welcome`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.02.02` · Hour / minute / am-pm | Tap/scroll picker or type | Update a single draft time; wheels and numeric alternative agree. Route: `self`. | Native time input/numeric alternative; 24-hour storage with localized display. Validate and derive related labels from one value. |
| `afterglow.02.03` · Remind me 15 minutes before | Tap or Space | If enabled, explain then request permission; denied leaves reminder off and setup available. Route: `aux:notification-permission`. | Native checkbox styled as switch; label and checked state agree. Permission-dependent value stays off until granted. |
| `afterglow.02.04` · Set my evening | Tap/click or form Enter | Commit time and completed setup; reminder is 22:30 only when permission succeeds. Route: `03-tonight`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 03 · Tonight can be simple

Entry: Set my evening / Tonight tab. Selected destination: Tonight.

[Screen image](../images/mobile/afterglow/03-tonight.png) · [Exact prompt](../prompts/screens/afterglow/03-tonight.txt)

Pictured state: Afterglow wordmark and a settings gear. Heading "Tonight can be simple". Amber moon vignette. "10:30–10:45 pm" and "15 minutes, just for you". Three spacious rows: "Breathe" / "2 min"; "Stretch" / "5 min"; "Read" / "8 min". All incomplete. CTA "Begin with two minutes". Quiet link "Change my evening". Bottom tabs Tonight / Rituals / Sounds, ONLY Tonight active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `afterglow.03.01` · Settings gear | Tap/click; Enter or Space | Open account/preferences sheet; retain current tab. Route: `aux:settings`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.03.02` · Breathe / Stretch / Read rows | Tap/click; Enter or Space | Open selected ritual; do not mark it complete on entry. Route: `04-rituals`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.03.03` · Begin with two minutes | Tap/click; Enter or Space | Start Breathe at 0:00 of 2:00; explicit pause/end; completion updates Tonight. Route: `aux:ritual-player`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.03.04` · Change my evening | Tap/click; Enter | Open time editor with saved 22:45; save returns to Tonight rather than rerunning welcome. Route: `02-time`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `afterglow.03.nav.1` · Tonight | Tap/click or Enter | Open Tonight; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-tonight`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `afterglow.03.nav.2` · Rituals | Tap/click or Enter | Open Rituals; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-rituals`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `afterglow.03.nav.3` · Sounds | Tap/click or Enter | Open Sounds; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-sounds`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 04 · Small rituals to return to

Entry: Rituals tab / routine row. Selected destination: Rituals.

[Screen image](../images/mobile/afterglow/04-rituals.png) · [Exact prompt](../prompts/screens/afterglow/04-rituals.txt)

Pictured state: Afterglow and settings gear. Heading "Small rituals to return to". Three airy editorial rows with small warm cream/amber illustrations: "Window breathing" / "2 min"; "Shoulder release" / "5 min"; "A chapter in low light" / "8 min". Each row has a checked membership action: all three already belong to Tonight. A selected detail region for Shoulder release reads "Let your shoulders settle." CTA "Start 5 minutes". Bottom Tonight / Rituals / Sounds; ONLY Rituals active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `afterglow.04.01` · Settings gear | Tap/click; Enter or Space | Open settings without losing library position. Route: `aux:settings`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.04.02` · Ritual row | Tap/click; Enter or Space | Select that ritual and update its detail and duration. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.04.03` · Routine membership checkmark | Tap/click; Enter or Space | Toggle routine membership with an explicit added label; recalculate total duration. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.04.04` · Start 5 minutes | Tap/click; Enter or Space | Start selected 300-second ritual; completing it updates Tonight. Route: `aux:ritual-player`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.04.nav.1` · Tonight | Tap/click or Enter | Open Tonight; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-tonight`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `afterglow.04.nav.2` · Rituals | Tap/click or Enter | Open Rituals; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-rituals`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `afterglow.04.nav.3` · Sounds | Tap/click or Enter | Open Sounds; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-sounds`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 05 · Rain beyond the window

Entry: Sounds tab / choose Rain. Selected destination: Sounds.

[Screen image](../images/mobile/afterglow/05-sounds.png) · [Exact prompt](../prompts/screens/afterglow/05-sounds.txt)

Pictured state: Afterglow and settings gear. Heading "Rain beyond the window". Large soft rain-glass and amber-light vignette, same warm materials. Label "Rain · 20 minutes". Progress track exactly one quarter filled; "05:00" left and "15:00 remaining" right. Large PAUSE icon (playing). Small "15 seconds back" and "15 seconds forward" controls. Timer row "Stop after 20 minutes". Bottom Tonight / Rituals / Sounds; ONLY Sounds active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `afterglow.05.01` · Settings gear | Tap/click; Enter or Space | Open settings; audio continues unless user pauses. Route: `aux:settings`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.05.02` · Pause / play | Tap/click; Enter or Space | Toggle playback without resetting elapsed time; never autoplay on entering tab. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.05.03` · Progress track | Tap track, drag or arrow keys | Seek within 0–1200 seconds; tap and keyboard alternatives; update remaining time. Route: `self`. | Native range with min/max and human-readable elapsed/remaining labels; clamp bounds and support larger keyboard steps. |
| `afterglow.05.04` · 15 seconds back / forward | Tap/click; Enter or Space | Seek ±15 seconds, clamped to track bounds. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.05.05` · Stop after 20 minutes | Tap/click; Enter or Space | Choose timer or off; cancel retains prior value; timer ends playback without navigation. Route: `aux:sleep-timer`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `afterglow.05.nav.1` · Tonight | Tap/click or Enter | Open Tonight; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-tonight`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `afterglow.05.nav.2` · Rituals | Tap/click or Enter | Open Rituals; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-rituals`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `afterglow.05.nav.3` · Sounds | Tap/click or Enter | Open Sounds; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-sounds`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## Additional routes and recovery

These states are specified, not additional image exports. Every `aux:` destination in the ledger is defined here. Shared loading, error, back and persistence behavior is in the [React handoff](../interaction/react-handoff.md).

### notification-permission

Explain the specific reminder; Continue invokes the platform prompt. Granted enables and schedules; denied or dismissed keeps reminders off with a Settings/help route. Cancel returns to the exact invoking control. Do not prompt on every visit.

### ritual-player

Show selected ritual title, duration and remaining time; Start is explicit. Pause retains elapsed time, Resume continues; End asks whether to end early. Only a completed ritual sets its completion flag. Return to the source tab with the same ritual selected.

### settings

Show preference rows and account/help links in a sheet. Each switch exposes its actual saved value. Close returns to the invoking tab, scroll and focus; notification permission remains a separate explicit action.

### sign-in

Email/sign-in method → explicit Continue → loading → restore account after success. Invalid credentials show an inline error. Cancel returns to welcome; never replace local data before a merge decision.

### sleep-timer

Offer Off / 10 / 20 / 30 minutes plus Cancel. Apply stores timer end independently of audio track length; expiry pauses audio and announces finished. The pictured 20-minute track has 15 minutes of audio remaining.

## Alternative to evaluate

**Routine first.** An alternative welcome can offer a two-minute breathing preview before asking for a time. On finishing, offer Save this rhythm or Continue without reminders. Compare first-session completion and time-to-first-ritual; keep guest use available.

## Implementation acceptance

- Every visible control maps to a ledger ID; decorative and operating-system content is explicitly excluded.
- Resolve every route and carry `returnTo`, record ID and draft ID through editors.
- Test primary flow plus back/cancel, rejected permission, empty data, failed save/retry, offline resume and duplicate activation.
- Test keyboard-only, screen reader order, reduced motion, 200% text and a narrow viewport; no clipped controls or hidden essential actions.
- Verify the fixed data checks above with shared selectors rather than hardcoded repeated strings.

<!-- MOTION CONTRACT -->

## Motion, rollover and implementation prompts

Let the peach and amber bloom breathe softly behind the crescent, while the milk-cream reading areas and burgundy type stay stable. A small amount of movement gives the evening a sense of warmth without turning the timer into a visualizer.

[Complete motion contract](../interaction/motion/afterglow.md) · [App interaction prompt](../prompts/interaction/afterglow.txt) · [Asset preparation prompt](../prompts/motion/afterglow-assets.txt) · [Motion direction prompt](../prompts/motion/afterglow-direction.txt)

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

- [01 screen interaction prompt](../prompts/interaction/afterglow/01-welcome.txt) — Find my rhythm warms its coral fill on hover; press adds a darker tint, then navigates immediately. Account link underlines without moving.

- [02 screen interaction prompt](../prompts/interaction/afterglow/02-time.txt) — Picker selection settles within 180 ms after direct input; 10:45 pm and the reminder preview update from one draft value. Switch thumb takes 140 ms only after the state is permitted.

- [03 screen interaction prompt](../prompts/interaction/afterglow/03-tonight.txt) — Ritual row hover adds a warm tint; empty completion rings do not fill on hover. Begin opens the real ritual player. A completed ritual fills its ring over 180 ms after completion state saves.

- [04 screen interaction prompt](../prompts/interaction/afterglow/04-rituals.txt) — Expand one ritual over 220 ms with the chevron rotating 90 degrees. Membership checks remain distinct from completion. Start 5 minutes enters the player without a decorative delay.

- [05 screen interaction prompt](../prompts/interaction/afterglow/05-sounds.txt) — Play/Pause changes icon in 100 ms; progress reflects audio currentTime, not an animation duration. Seek follows the finger directly and clamps; +/-15 sec updates elapsed/remaining together. Hover never plays audio.

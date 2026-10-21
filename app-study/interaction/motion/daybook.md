# Daybook — motion and interaction direction

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## Time moves; the page stays calm

**Production approach:** Programmatic SVG daylight and timeline.

Draw the daylight arc and its marker from the selected place, date and time. Let edits settle gently into the timeline while the editorial landscape, generous spacing and typography remain still.

“VO” is interpreted here as Veo for motion-reference studies; no voiceover or audio is planned. Soul, Petal and Daybook use the programmatic production approaches specified below.

[Full control ledger](../daybook.md) · [Visual review](../../reviews/daybook.html#motion) · [Implementation prompt](../../prompts/interaction/daybook.txt)

## Reference chain

[Original art direction](../../references/originals/daybook.png) → [archived research](../../research/archive/mobile-research-2026-10-20.md) → [current product findings](../../research/README.md) → the five approved PNGs below → this proposed motion contract. Reference findings and WDA design decisions are distinguished; no competitor interaction is claimed to have been copied from a verified native recording.

- [Motion · Gesture animation](https://motion.dev/docs/react-gestures) — Hover, press, focus and drag APIs support feedback on real controls. Specific timings and visual treatments in this study are WDA proposals.
- [Motion · Accessibility](https://motion.dev/docs/react-accessibility) — Reduced-motion policy can govern transforms and custom media behavior. The app must also stop its own shaders and decorative video.
- [MDN · Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) — Document visibility changes let the application suspend decorative media when the page is hidden. Resume from state rather than counting background frames.

## Interaction and lifecycle rules

**Input Policy.** Touch is primary. Enable rollover only for (hover: hover) and (pointer: fine). Every hover cue has a focus-visible equivalent; no action or information is available only on hover. Pointer exit restores the resting style without changing selection. Use native buttons, links and labeled fields, not clickable artwork.

**Timing.** Proposed tokens: hover 120 ms; press tint 80 ms; focus outline immediate; route crossfade 160 ms; small state changes 180 ms; expanded content 220 ms. Ease with cubic-bezier(0.2, 0, 0, 1), without overshoot. No animation delays navigation, saving or focus.

**Ambient.** Play at most one 4-second decorative introduction on first eligible entry per session, then settle to the approved still. Do not replay on field focus, typing, tab return or scroll. This is the default without adding new controls to the approved screens. Continuous motion is a later option only with a visible, keyboard-operable Pause animation control; record that as an additional control before implementation.

**Reduced.** effectiveReducedMotion = system preference OR saved app preference. When true, use a static poster, freeze shader time and 3D poses, remove parallax, and apply state changes immediately. Functional pointer-following remains direct, with no inertial or settling animation. Text and status feedback remain complete.

**Scroll.** Use normal document scroll; never hijack scrolling or move the foreground type with a background effect. Decorative layers stay inside their illustration region. Suspend them when offscreen, document-hidden, an editor has keyboard focus, or a modal covers the screen. Return to the same phase without catch-up bursts.

**Runtime.** Keep text, navigation and forms in the DOM above pointer-events:none, aria-hidden decorative layers. A missing asset, failed video, unavailable WebGL or context loss immediately shows the approved still. Media is muted, plays inline and does not request sound or device-motion permissions. Measure a target of 30 fps for ambient rendering; cap DPR at 1.5 initially and fall back when consistently slow. These are design budgets, not measured results.

## Screen-by-screen motion

### 01 · Give the daylight a place

[Approved PNG](../../images/mobile/daybook/01-setup.png) · [Screen interaction prompt](../../prompts/interaction/daybook/01-setup.txt)

- **Ambient:** Still landscape and a static preview arc until a location/date is confirmed.
- **Action:** Location control underlines on hover/focus. Manual plans enters Today; calendar connection is explicit and cannot move the arc before valid data returns.
- **Scroll and return:** Normal document scroll. Do not use scroll position to change the time of day.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `daybook.01.01` · City field | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.01.02` · Start with manual plans | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.01.03` · Connect a calendar | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 02 · An evening worth keeping

[Approved PNG](../../images/mobile/daybook/02-today.png) · [Screen interaction prompt](../../prompts/interaction/daybook/02-today.txt)

- **Ambient:** At the review instant the marker rests at p=708/886; the water stays still.
- **Action:** Daylight arc hover/focus offers the same readable time details as tap. Plan row hover tints only the hit area; opening Walk retains its saved 35 minutes. Date heading opens a picker.
- **Scroll and return:** Preserve timeline scroll on detail/editor return. Live minute ticks do not animate through missed background time.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `daybook.02.01` · Date header | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.02.02` · Daylight arc | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.02.03` · Walk by the water | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.02.04` · Dinner on the terrace | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.02.05` · Add an evening plan | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.02.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.02.nav.2` · Week | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.02.nav.3` · Places | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 03 · Make room for the light

[Approved PNG](../../images/mobile/daybook/03-editor.png) · [Screen interaction prompt](../../prompts/interaction/daybook/03-editor.txt)

- **Ambient:** Freeze decorative artwork while typing; a labeled draft-time preview is optional in implementation.
- **Action:** Field focus gets an immediate border/underline. Changing Ends to 19:10 derives 40 minutes; Save commits then returns with feedback, Cancel retains 35 minutes. Never advance the arc based on an unsaved random animation.
- **Scroll and return:** Keep the active time field above the keyboard. Cancel restores the source route and saved plan, including reminder 18:20.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `daybook.03.01` · Cancel | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.03.02` · Plan title | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.03.03` · Date | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.03.04` · Starts / Ends | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.03.05` · Place | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.03.06` · Reminder | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.03.07` · Save changes | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.03.08` · Delete plan | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 04 · A week with breathing room

[Approved PNG](../../images/mobile/daybook/04-week.png) · [Screen interaction prompt](../../prompts/interaction/daybook/04-week.txt)

- **Ambient:** The selected Thursday arc uses the same date and weather data as Today.
- **Action:** Day hover gives a thin outline; only activation changes selection. A successful saved edit moves the plan endpoint over180ms and shows Plan updated. Week arrows never alter the selected plan contents.
- **Scroll and return:** Return from another tab preserves selected day and week. Missing date data shows a readable empty state, not invented daylight.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `daybook.04.01` · Day selectors | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `daybook.04.02` · Previous / next week | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.04.03` · Walk / Dinner rows | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.04.04` · Plan updated message | No rollover or press affordance. This is display/state output; never focus it as a button. | Update text from real state; announce meaningful changes politely once. |
| `daybook.04.05` · Date header | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.04.06` · Daylight arc | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.04.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.04.nav.2` · Week | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.04.nav.3` · Places | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 05 · Places for an open hour

[Approved PNG](../../images/mobile/daybook/05-places.png) · [Screen interaction prompt](../../prompts/interaction/daybook/05-places.txt)

- **Ambient:** All three place landscapes are still; no perpetual shimmer.
- **Action:** Place row hover gives its title an underline; edit pencils are independent targets. Opening a place and editing it remain distinct. Saving inserts one row over180ms after success.
- **Scroll and return:** No image zoom on scroll. Return from editor keeps scroll and saved count; rejected saves keep the draft.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `daybook.05.01` · Place row | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.05.02` · Edit place icon | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.05.03` · Save a place | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.05.04` · Date header | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `daybook.05.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.05.nav.2` · Week | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `daybook.05.nav.3` · Places | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

## Asset preparation

- Landscape plate without the arc, sun marker, labels or controls.
- SVG arc and marker generated in code, with independent text for sunrise, sunset and remaining time.
- Separate Riverside, Pocket park and Hill overlook illustrations; keep them still while navigating.

[Exact extraction / reconstruction prompt](../../prompts/motion/daybook-assets.txt)

Use Daybook 02-today and 04-week as layout references. Isolate the warm landscape strip, removing the thin arc, marker, all text and controls. Preserve the watercolor-like paper, hills, water and small town. Retain an unmodified full-screen reference. The arc and all time labels must be created programmatically, not baked into artwork or video. The three Places illustrations are separate still assets with fixed crops matching the review.

## React production approach

Build DaylightArc as SVG over a still landscape. Given valid sunrise, sunset and current instant in Europe/Lisbon, compute p=clamp((now-sunrise)/(sunset-sunrise),0,1). Map x=cx-r*cos(pi*p), y=cy-r*sin(pi*p); derive remaining minutes=max(0,ceil((sunset-now)/60000)). The review fixture is 18 June 2026 at 18:00, sunrise 06:12, sunset 20:58, so remaining=178 minutes and p=708/886. State is canonical instants with timezone-aware formatting; do not rely on unzoned date parsing. On user-selected date/place change, interpolate the marker for 400 ms only when both data sets are valid. Do not animate a whole sunrise on entry. Minute ticks update the position directly; no perpetual render loop. For past/future dates say Daylight duration instead of live time left, using noon as the preview marker with a Preview label. Handle night, missing data and polar conditions explicitly.

## Motion direction prompt

[Download the exact prompt](../../prompts/motion/daybook-direction.txt)

```text
Programmatic animation prompt — implement Daybook as a stable editorial composition with SVG daylight geometry driven by data. At 18:00 show exactly 2h 58m left until 20:58. Do not run a simulated day or animate text counters. Date selection updates its burgundy selection immediately and interpolates valid arc position in 400 ms; timeline edits settle in 180 ms after Save. In the editor, a separate preview marker may reflect draft start time and is labeled Preview; Cancel restores saved state. Water and buildings remain still. No Veo clip is used for actual time, plan duration or daylight calculations.
```

## Acceptance

Check all five screens with touch, mouse, keyboard and 200% text. Confirm hover never commits data; press/cancel does not double-submit; focus is visible over every background frame; animation completion never grants progress. Check reduced motion on initial load and during playback, hidden/offscreen pause, poster fallback, resize, route return and canceled requests. Compare each resting frame with its approved PNG.

Verify this contract against the app’s fixed review data. The effect timings are proposed and still require device testing; this document does not claim measured frame rates or completed media.

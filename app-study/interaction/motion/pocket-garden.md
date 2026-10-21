# Pocket Garden — motion and interaction direction

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## A small garden, quietly alive

**Production approach:** Veo illustration study; layered motion fallback.

Keep the painterly gardener, warm window and Pip recognizable. Let a few leaves and filtered light move within the picture; the care decisions and notes stay calm and easy to read.

“VO” is interpreted here as Veo for motion-reference studies; no voiceover or audio is planned. Soul, Petal and Daybook use the programmatic production approaches specified below.

[Full control ledger](../pocket-garden.md) · [Visual review](../../reviews/pocket-garden.html#motion) · [Implementation prompt](../../prompts/interaction/pocket-garden.txt)

## Reference chain

[Original art direction](../../references/originals/pocket-garden.png) → [archived research](../../research/archive/mobile-research-2026-10-20.md) → [current product findings](../../research/README.md) → the five approved PNGs below → this proposed motion contract. Reference findings and WDA design decisions are distinguished; no competitor interaction is claimed to have been copied from a verified native recording.

- [Google · Video generation](https://ai.google.dev/gemini-api/docs/video) — Image-directed video is a motion-study option. Use a currently supported Veo endpoint at production time; these briefs intentionally do not pin a preview model. A generated clip is not editable 3D geometry.
- [Motion · Gesture animation](https://motion.dev/docs/react-gestures) — Hover, press, focus and drag APIs support feedback on real controls. Specific timings and visual treatments in this study are WDA proposals.
- [Motion · Accessibility](https://motion.dev/docs/react-accessibility) — Reduced-motion policy can govern transforms and custom media behavior. The app must also stop its own shaders and decorative video.
- [MDN · Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) — Document visibility changes let the application suspend decorative media when the page is hidden. Resume from state rather than counting background frames.
- [W3C · Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) — Automatically moving content lasting more than five seconds alongside other content needs a way to pause, stop or hide it. This proposal uses short ambient introductions that settle.

## Interaction and lifecycle rules

**Input Policy.** Touch is primary. Enable rollover only for (hover: hover) and (pointer: fine). Every hover cue has a focus-visible equivalent; no action or information is available only on hover. Pointer exit restores the resting style without changing selection. Use native buttons, links and labeled fields, not clickable artwork.

**Timing.** Proposed tokens: hover 120 ms; press tint 80 ms; focus outline immediate; route crossfade 160 ms; small state changes 180 ms; expanded content 220 ms. Ease with cubic-bezier(0.2, 0, 0, 1), without overshoot. No animation delays navigation, saving or focus.

**Ambient.** Play at most one 4-second decorative introduction on first eligible entry per session, then settle to the approved still. Do not replay on field focus, typing, tab return or scroll. This is the default without adding new controls to the approved screens. Continuous motion is a later option only with a visible, keyboard-operable Pause animation control; record that as an additional control before implementation.

**Reduced.** effectiveReducedMotion = system preference OR saved app preference. When true, use a static poster, freeze shader time and 3D poses, remove parallax, and apply state changes immediately. Functional pointer-following remains direct, with no inertial or settling animation. Text and status feedback remain complete.

**Scroll.** Use normal document scroll; never hijack scrolling or move the foreground type with a background effect. Decorative layers stay inside their illustration region. Suspend them when offscreen, document-hidden, an editor has keyboard focus, or a modal covers the screen. Return to the same phase without catch-up bursts.

**Runtime.** Keep text, navigation and forms in the DOM above pointer-events:none, aria-hidden decorative layers. A missing asset, failed video, unavailable WebGL or context loss immediately shows the approved still. Media is muted, plays inline and does not request sound or device-motion permissions. Measure a target of 30 fps for ambient rendering; cap DPR at 1.5 initially and fall back when consistently slow. These are design budgets, not measured results.

## Screen-by-screen motion

### 01 · Your little garden starts here

[Approved PNG](../../images/mobile/pocket-garden/01-welcome.png) · [Screen interaction prompt](../../prompts/interaction/pocket-garden/01-welcome.txt)

- **Ambient:** 4-second leaf-and-light introduction; one optional blink, then hold.
- **Action:** The primary start CTA deepens its terracotta tint on hover/press. No plant grows or becomes saved until setup succeeds.
- **Scroll and return:** No parallax; artwork and introduction scroll together. Returning does not replay.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `pocket-garden.01.01` · Add my first plant | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.01.02` · Explore a sample garden | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 02 · Who is growing with you?

[Approved PNG](../../images/mobile/pocket-garden/02-plant.png) · [Screen interaction prompt](../../prompts/interaction/pocket-garden/02-plant.txt)

- **Ambient:** Match the potting illustration; stop all decorative motion as soon as any form field receives focus.
- **Action:** Field border becomes olive on focus; Bright/Indirect/Low tint in 120 ms and select only on activation. Create my garden commits Pip once; pending state keeps field values visible.
- **Scroll and return:** Keyboard scrolls the active field into view. Failure restores focus and preserves Pip/Olive/Kitchen window/Bright.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `pocket-garden.02.01` · Back | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.02.02` · Plant name | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `pocket-garden.02.03` · Plant type | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `pocket-garden.02.04` · Where it lives | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `pocket-garden.02.05` · Light choices | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `pocket-garden.02.06` · Create my garden | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 03 · Good morning, little garden

[Approved PNG](../../images/mobile/pocket-garden/03-garden.png) · [Screen interaction prompt](../../prompts/interaction/pocket-garden/03-garden.txt)

- **Ambient:** The observing pose may use a first-entry 4-second leaf sway, then settle.
- **Action:** Hover Check on Pip highlights only its button. Soil-check row gains a subtle outline; opening it does not mark it done. Add a plant opens a new draft, not a copy of Pip.
- **Scroll and return:** No card drift as the user scrolls. Return from Care preserves the plant and task state.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `pocket-garden.03.01` · Settings gear | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.03.02` · Pip image / name | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.03.03` · A soil check is waiting / Check on Pip | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.03.04` · Add a plant | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.03.nav.1` · Garden | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.03.nav.2` · Care | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.03.nav.3` · Notes | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 04 · Check the soil

[Approved PNG](../../images/mobile/pocket-garden/04-care.png) · [Screen interaction prompt](../../prompts/interaction/pocket-garden/04-care.txt)

- **Ambient:** Soil-check hands remain still; no watering animation.
- **Action:** Still damp selects an olive border and updates advice in 160 ms. Save soil check changes task state only on success, with readable Saved feedback. Dry to the touch is a different observation, not an automatic watering action.
- **Scroll and return:** Freeze illustration while choosing care. Reduced motion shows the advice and task state immediately.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `pocket-garden.04.01` · Still damp / Dry to the touch | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `pocket-garden.04.02` · Save soil check | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.04.03` · Remind me later | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.04.nav.1` · Garden | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.04.nav.2` · Care | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.04.nav.3` · Notes | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 05 · The things you notice

[Approved PNG](../../images/mobile/pocket-garden/05-notes.png) · [Screen interaction prompt](../../prompts/interaction/pocket-garden/05-notes.txt)

- **Ambient:** Writing pose is a still poster while composing.
- **Action:** Textarea caret is native; photo attachment fades in over 160 ms after selection. Save replaces the draft with one dated note after success; Cancel asks before discarding a dirty note.
- **Scroll and return:** Keep focus and cursor position stable while the keyboard opens. Never animate the field or move the text while typing.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `pocket-garden.05.01` · Plant selector | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `pocket-garden.05.02` · New observation | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `pocket-garden.05.03` · Add a photo | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.05.04` · Save note | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.05.05` · Cancel | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `pocket-garden.05.nav.1` · Garden | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.05.nav.2` · Care | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `pocket-garden.05.nav.3` · Notes | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

## Asset preparation

- One illustration-only plate per pose: welcome, potting, observing, soil check and writing.
- Separate foreground olive leaves and background foliage where a layered implementation is preferable.
- A matched still poster for each picture; no baked-in field labels or buttons.

[Exact extraction / reconstruction prompt](../../prompts/motion/pocket-garden-assets.txt)

Use each approved Pocket Garden screen as a composition reference, then isolate ONLY its illustration region. Preserve the same gardener face, dark curls, clothing, Pip olive plant, pot, window and painterly texture. Remove all logos, text, controls and panels from the motion input, reconstructing only the small areas formerly covered by UI. Return the clean illustration plate and optional leaf layers with genuine alpha. Keep the full screenshot separately for compositing comparison.

## React production approach

Use a clipped IllustrationMotion region with a still poster and a short muted inline clip. The matching per-screen pose is required; never reuse the watering or potting action under a note editor. On first eligible entry play a 4-second excerpt once and settle to its matching still. If a clip has face drift, unstable hands or a visible endpoint jump, reject it and use low-amplitude leaf layers instead. Stop the clip on focus, keyboard or modal; forms are independent DOM controls.

## Motion direction prompt

[Download the exact prompt](../../prompts/motion/pocket-garden-direction.txt)

```text
Veo motion-study prompt — animate only the supplied Pocket Garden illustration plate. Locked camera, same painterly strokes, same gardener identity, exact clothing, olive plant and pot. Over four seconds let two or three leaf tips sway less than two degrees and window light shift softly; the gardener may blink once, with hands remaining in the approved pose. Return near the first-frame pose. No growth time-lapse, watering, changing leaf counts, lip movement, camera zoom, new objects, captions, interface, music or voice. The scene must not imply care has been completed.
```

## Acceptance

Check all five screens with touch, mouse, keyboard and 200% text. Confirm hover never commits data; press/cancel does not double-submit; focus is visible over every background frame; animation completion never grants progress. Check reduced motion on initial load and during playback, hidden/offscreen pause, poster fallback, resize, route return and canceled requests. Compare each resting frame with its approved PNG.

Verify this contract against the app’s fixed review data. The effect timings are proposed and still require device testing; this document does not claim measured frame rates or completed media.

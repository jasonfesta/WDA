# Afterglow — motion and interaction direction

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## Light that gently settles

**Production approach:** Programmatic background shader.

Let the peach and amber bloom breathe softly behind the crescent, while the milk-cream reading areas and burgundy type stay stable. A small amount of movement gives the evening a sense of warmth without turning the timer into a visualizer.

“VO” is interpreted here as Veo for motion-reference studies; no voiceover or audio is planned. Soul, Petal and Daybook use the programmatic production approaches specified below.

[Full control ledger](../afterglow.md) · [Visual review](../../reviews/afterglow.html#motion) · [Implementation prompt](../../prompts/interaction/afterglow.txt)

## Reference chain

[Original art direction](../../references/originals/afterglow.png) → [archived research](../../research/archive/mobile-research-2026-10-20.md) → [current product findings](../../research/README.md) → the five approved PNGs below → this proposed motion contract. Reference findings and WDA design decisions are distinguished; no competitor interaction is claimed to have been copied from a verified native recording.

- [Three.js · ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html) — A custom GLSL material can receive time and resolution uniforms. This supports a proposed procedural light field for Afterglow.
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

### 01 · A softer end to your day

[Approved PNG](../../images/mobile/afterglow/01-welcome.png) · [Screen interaction prompt](../../prompts/interaction/afterglow/01-welcome.txt)

- **Ambient:** 4-second amber swell behind the crescent on first welcome, then still.
- **Action:** Find my rhythm warms its coral fill on hover; press adds a darker tint, then navigates immediately. Account link underlines without moving.
- **Scroll and return:** The illustration scrolls naturally with the page; Back restores the still welcome.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `afterglow.01.01` · Find my rhythm | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.01.02` · I already have an account | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 02 · When does your evening slow down?

[Approved PNG](../../images/mobile/afterglow/02-time.png) · [Screen interaction prompt](../../prompts/interaction/afterglow/02-time.txt)

- **Ambient:** Hold the background completely still while choosing a time.
- **Action:** Picker selection settles within 180 ms after direct input; 10:45 pm and the reminder preview update from one draft value. Switch thumb takes 140 ms only after the state is permitted.
- **Scroll and return:** Keyboard/picker cannot be covered by the CTA. Returning from permission keeps the draft and focus.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `afterglow.02.01` · Back | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.02.02` · Hour / minute / am-pm | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `afterglow.02.03` · Remind me 15 minutes before | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `afterglow.02.04` · Set my evening | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 03 · Tonight can be simple

[Approved PNG](../../images/mobile/afterglow/03-tonight.png) · [Screen interaction prompt](../../prompts/interaction/afterglow/03-tonight.txt)

- **Ambient:** Use the resting bloom; do not replay the welcome effect.
- **Action:** Ritual row hover adds a warm tint; empty completion rings do not fill on hover. Begin opens the real ritual player. A completed ritual fills its ring over 180 ms after completion state saves.
- **Scroll and return:** Keep all three items readable in one normal scroll region; return from player to the invoking item.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `afterglow.03.01` · Settings gear | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.03.02` · Breathe / Stretch / Read rows | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.03.03` · Begin with two minutes | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.03.04` · Change my evening | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.03.nav.1` · Tonight | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.03.nav.2` · Rituals | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.03.nav.3` · Sounds | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 04 · Small rituals to return to

[Approved PNG](../../images/mobile/afterglow/04-rituals.png) · [Screen interaction prompt](../../prompts/interaction/afterglow/04-rituals.txt)

- **Ambient:** Crescent and bloom remain still while comparing rituals.
- **Action:** Expand one ritual over 220 ms with the chevron rotating 90 degrees. Membership checks remain distinct from completion. Start 5 minutes enters the player without a decorative delay.
- **Scroll and return:** Preserve the expanded Shoulder release row and scroll on return; reduce-motion expansion is immediate.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `afterglow.04.01` · Settings gear | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.04.02` · Ritual row | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.04.03` · Routine membership checkmark | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.04.04` · Start 5 minutes | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.04.nav.1` · Tonight | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.04.nav.2` · Rituals | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.04.nav.3` · Sounds | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 05 · Rain beyond the window

[Approved PNG](../../images/mobile/afterglow/05-sounds.png) · [Screen interaction prompt](../../prompts/interaction/afterglow/05-sounds.txt)

- **Ambient:** Rain artwork is still by default, independent of audio.
- **Action:** Play/Pause changes icon in 100 ms; progress reflects audio currentTime, not an animation duration. Seek follows the finger directly and clamps; +/-15 sec updates elapsed/remaining together. Hover never plays audio.
- **Scroll and return:** The audio may continue under the explicit playback policy while decorative frames stop offscreen. Tab return preserves playback; a fresh Sounds visit is paused.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `afterglow.05.01` · Settings gear | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.05.02` · Pause / play | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.05.03` · Progress track | Hover/focus previews an exact point/value; tap and keyboard expose the same information. Drag uses direct tracking; no spring on the pointer. | Clamp values and update readable labels from one source. Hover never changes saved data or starts playback. |
| `afterglow.05.04` · 15 seconds back / forward | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.05.05` · Stop after 20 minutes | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `afterglow.05.nav.1` · Tonight | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.05.nav.2` · Rituals | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `afterglow.05.nav.3` · Sounds | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

## Asset preparation

- Approved cream/peach background as a static fallback.
- Separate amber crescent with clean transparent edges and a reference for its highlight.
- Sounds screen: rain-glass artwork as a separate fixed image; UI remains real text and controls.

[Exact extraction / reconstruction prompt](../../prompts/motion/afterglow-assets.txt)

Use the approved Afterglow welcome and Tonight PNGs as art-direction references. Separate the amber crescent from the background into a transparent RGBA asset; preserve its exact silhouette, warm material, highlight and orientation. Export a clean cream/peach background plate with no type, cards, OS icons or app controls. Do not invent a moon face, stars, new scenery or extra glow over the reading zone. Keep a still fallback matching the approved composition.

## React production approach

Build an AfterglowLightField behind the content with one full-screen plane and a custom WebGL shader, using uTime, uResolution, uIntensity and a fixed palette. Combine two broad radial color fields with very low-amplitude smooth distortion; limit visible movement to the decorative bloom. Hold the cream text zone and avoid flashing, noise shimmer, blur on text or pointer-following light. Run a single 4-second swell and return to the resting phase. Stop requesting frames after settling; retain the still if WebGL is unavailable. The visual clock never drives ritual or audio time.

## Motion direction prompt

[Download the exact prompt](../../prompts/motion/afterglow-direction.txt)

```text
Implementation prompt — recreate the approved Afterglow peach/amber light using a restrained programmatic shader. Keep the crescent still, the camera fixed and all reading zones stable. Increase the bloom amplitude gently from zero to a small peak at 2 seconds and back to zero at 4 seconds. Do not animate the whole screenshot. For Sounds, keep rain-glass art static unless a separate short decorative pass is explicitly enabled; never synchronize UI values to arbitrary video frames.
```

## Acceptance

Check all five screens with touch, mouse, keyboard and 200% text. Confirm hover never commits data; press/cancel does not double-submit; focus is visible over every background frame; animation completion never grants progress. Check reduced motion on initial load and during playback, hidden/offscreen pause, poster fallback, resize, route return and canceled requests. Compare each resting frame with its approved PNG.

Verify this contract against the app’s fixed review data. The effect timings are proposed and still require device testing; this document does not claim measured frame rates or completed media.

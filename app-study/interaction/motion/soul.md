# Soul — motion and interaction direction

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## Weather with a little dimension

**Production approach:** Programmatic 3D objects; Veo motion reference.

Extract the sun and cloud language from the approved blue scene, then animate reconstructed objects with a fixed camera. The forecast stays data driven; the sculpture gives it character.

“VO” is interpreted here as Veo for motion-reference studies; no voiceover or audio is planned. Soul, Petal and Daybook use the programmatic production approaches specified below.

[Full control ledger](../soul.md) · [Visual review](../../reviews/soul.html#motion) · [Implementation prompt](../../prompts/interaction/soul.txt)

## Reference chain

[Original art direction](../../references/originals/sol.png) → [archived research](../../research/archive/mobile-research-2026-10-20.md) → [current product findings](../../research/README.md) → the five approved PNGs below → this proposed motion contract. Reference findings and WDA design decisions are distinguished; no competitor interaction is claimed to have been copied from a verified native recording.

- [React Three Fiber · Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — On-demand rendering and explicit invalidation support scenes that stop when still. Reuse geometry and materials; measure the actual mobile workload.
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

### 01 · Find the light in your day

[Approved PNG](../../images/mobile/soul/01-place.png) · [Screen interaction prompt](../../prompts/interaction/soul/01-place.txt)

- **Ambient:** A 4-second sun/cloud settling pass on first entry, unless system reduced motion is enabled.
- **Action:** Search field focus freezes the 3D scene. Result hover tints without selecting; activation checks Lisbon. Use Lisbon proceeds with its ID; Use my location has an explicit permission route.
- **Scroll and return:** No camera tilt from scrolling or device orientation. Keyboard opens over a still scene.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `soul.01.01` · Choose a city | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `soul.01.02` · Lisbon / Porto / Faro result | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.01.03` · Use Lisbon | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.01.04` · Use my location | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 02 · Weather, your way

[Approved PNG](../../images/mobile/soul/02-preferences.png) · [Screen interaction prompt](../../prompts/interaction/soul/02-preferences.txt)

- **Ambient:** Keep sun/cloud static during preference choices.
- **Action:** Segmented options tint on hover and animate the selected fill 140 ms after activation. Units remain real values; changing them never morphs the sculpture.
- **Scroll and return:** No automatic notification prompt. Return retains all draft options and visible focus.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `soul.02.01` · Back | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.02.02` · Temperature unit | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.02.03` · Wind unit | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.02.04` · Time format | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.02.05` · Golden-hour reminder | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.02.06` · See my forecast | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 03 · Bright until dusk

[Approved PNG](../../images/mobile/soul/03-today.png) · [Screen interaction prompt](../../prompts/interaction/soul/03-today.txt)

- **Ambient:** If motion is allowed, one small first-entry settle; otherwise the approved still.
- **Action:** Forecast hover/focus shows the exact hour and value without changing selection; tap opens detail. City change updates data and condition group only after a successful fetch; preserve old data with loading status.
- **Scroll and return:** Chart points have tap/keyboard equivalents and a readable table. Scroll does not scrub weather or time.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `soul.03.01` · Lisbon city selector | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.03.02` · Add city plus | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.03.03` · Hourly point / chart | Hover/focus previews an exact point/value; tap and keyboard expose the same information. Drag uses direct tracking; no spring on the pointer. | Clamp values and update readable labels from one source. Hover never changes saved data or starts playback. |
| `soul.03.04` · Wind / Humidity | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.03.05` · Best light row | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.03.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.03.nav.2` · Places | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.03.nav.3` · Settings | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 04 · Places you keep an eye on

[Approved PNG](../../images/mobile/soul/04-places.png) · [Screen interaction prompt](../../prompts/interaction/soul/04-places.txt)

- **Ambient:** Weather group stays still while choosing cities.
- **Action:** Saved-city rows tint on hover; More and Add are independent targets. Add Porto changes saved count only on success, with a 180 ms row appearance. Avoid duplicating a saved city.
- **Scroll and return:** Keep list position after menu close; no carousel or automatic city switching.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `soul.04.01` · Lisbon saved row | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.04.02` · Saved-city management | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.04.03` · Add another city | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `soul.04.04` · Porto / Faro plus | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.04.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.04.nav.2` · Places | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.04.nav.3` · Settings | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 05 · Make the forecast yours

[Approved PNG](../../images/mobile/soul/05-settings.png) · [Screen interaction prompt](../../prompts/interaction/soul/05-settings.txt)

- **Ambient:** Reduce motion is pictured ON: no cloud drift, ray rotation or transition travel.
- **Action:** Unit selection updates all derived values. Reduce motion immediately freezes the scene and persists; switching it off does not force a replay. Privacy and sources are route links.
- **Scroll and return:** No GPU frame loop while this still screen is displayed. Return from sheets restores Settings scroll.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `soul.05.01` · Temperature / wind / time | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.05.02` · Home city | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.05.03` · Location: Manual | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `soul.05.04` · Golden-hour reminder | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.05.05` · Reduce motion | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `soul.05.06` · Privacy / Data sources | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.05.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.05.nav.2` · Places | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `soul.05.nav.3` · Settings | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

## Asset preparation

- Separate sun sphere, each visible capsule-shaped ray and cream cloud lobe group.
- Transparent reference cutouts plus a combined still, with normalized placement and occlusion notes.
- Reconstructed GLB with named nodes Sun, Rays and Cloud; fixed-camera lighting reference and still fallback. These are future deliverables.

[Exact extraction / reconstruction prompt](../../prompts/motion/soul-assets.txt)

Use Soul 03-today as the primary visual reference and 01-place as supporting silhouette reference. Extract ONLY the orange sun sphere, each visible orange capsule ray and cream cloud as separate transparent RGBA cutouts, maintaining visible edges, overlap, clay-like grain, scale and upper-left light. Also export the combined group on transparency, a clean blue background plate, and normalized anchor/bounding-box notes. No title, temperatures, forecast chart, icons or OS chrome. Mark occluded surfaces as unknown; do not claim to recover hidden geometry. Next reconstruct editable 3D meshes to match the cutouts, with named Sun/Rays/Cloud nodes, local pivots, consistent material/light settings and a fixed camera. Deliver a GLB and a matching rendered poster. A cutout is a 2D source reference, not a recovered 3D model.

## React production approach

Implement WeatherObjects in React Three Fiber with the reconstructed named meshes. Use a fixed camera; no orbit controls. One 4-second introduction allows the cloud to drift at most 4 logical px and sun rays to turn at most 2 degrees before returning to rest. Keep all meshes outside text-safe bounds; decorative canvas is pointer-events:none. Forecast conditions choose the object group from real state; transitions crossfade 200 ms without inventing measurements. Reuse geometry/materials, render on demand when still, and stop the frame loop when reduced, hidden or offscreen. Settings with Reduce motion ON always shows the still.

## Motion direction prompt

[Download the exact prompt](../../prompts/motion/soul-direction.txt)

```text
Veo reference-only prompt — from the isolated Soul sun-and-cloud plate, show a locked-camera four-second micro-motion study. Preserve the orange textured sun, capsule rays, cream cloud, blue background and exact object hierarchy. Cloud moves a few pixels laterally, rays rotate by no more than two degrees, then return to the original pose. No camera movement, weather changes, text, UI, particles, sound or object morphing. Use the result only to judge pacing; recreate production behavior with the extracted/reconstructed 3D objects and real app state.
```

## Acceptance

Check all five screens with touch, mouse, keyboard and 200% text. Confirm hover never commits data; press/cancel does not double-submit; focus is visible over every background frame; animation completion never grants progress. Check reduced motion on initial load and during playback, hidden/offscreen pause, poster fallback, resize, route return and canceled requests. Compare each resting frame with its approved PNG.

Verify this contract against the app’s fixed review data. The effect timings are proposed and still require device testing; this document does not claim measured frame rates or completed media.

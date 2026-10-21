# Petal — motion and interaction direction

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## Every piece has a gentle place

**Production approach:** Programmatic puzzle motion.

Animate the actual botanical strips and their alignment. The pleasure comes from a small, precise snap and the whole picture coming together, with the calm illustration carrying the atmosphere.

“VO” is interpreted here as Veo for motion-reference studies; no voiceover or audio is planned. Soul, Petal and Daybook use the programmatic production approaches specified below.

[Full control ledger](../petal.md) · [Visual review](../../reviews/petal.html#motion) · [Implementation prompt](../../prompts/interaction/petal.txt)

## Reference chain

[Original art direction](../../references/originals/petal.png) → [archived research](../../research/archive/mobile-research-2026-10-20.md) → [current product findings](../../research/README.md) → the five approved PNGs below → this proposed motion contract. Reference findings and WDA design decisions are distinguished; no competitor interaction is claimed to have been copied from a verified native recording.

- [Motion · Gesture animation](https://motion.dev/docs/react-gestures) — Hover, press, focus and drag APIs support feedback on real controls. Specific timings and visual treatments in this study are WDA proposals.
- [W3C · Dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) — Dragging needs a single-pointer alternative. Petal retains tap-select and tap-target controls as well as keyboard input.
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

### 01 · Put the garden back together

[Approved PNG](../../images/mobile/petal/01-welcome.png) · [Screen interaction prompt](../../prompts/interaction/petal/01-welcome.txt)

- **Ambient:** One 2-second non-saved strip demonstration, then still; existing Pause stops immediately.
- **Action:** Try a little arrangement routes into the documented collection/play flow. Rollover shows a quiet coral tint, not an automatic game move.
- **Scroll and return:** Any scrolling pauses the demo. Replay tutorial restarts only on explicit activation.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `petal.01.01` · Tutorial piece / destination | Hover/focus outlines the active band; no movement until input. Direct horizontal tracking; tap-select/tap-target and keyboard are equivalent routes. | Use Petal’s 4% snap threshold and 180 ms settling rule. Cancel restores offset; no automatic progress from animation completion. |
| `petal.01.02` · Try a little arrangement | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.01.03` · I have played before | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.01.04` · Pause tutorial | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 02 · A shelf of small gardens

[Approved PNG](../../images/mobile/petal/02-collections.png) · [Screen interaction prompt](../../prompts/interaction/petal/02-collections.txt)

- **Ambient:** Collection art remains still.
- **Action:** Hover outlines the collection without changing the selected Citrus state. Selecting another collection updates its label/count; Open uses the selected ID. The count remains 0/12 before play.
- **Scroll and return:** Preserve selected collection and scroll on return. No perpetual card float.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `petal.02.01` · Citrus / Pear orchard / Wild rose | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.02.02` · Open Citrus | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.02.nav.1` · Play | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.02.nav.2` · Collections | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.02.nav.3` · Profile | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 03 · A little closer, piece by piece

[Approved PNG](../../images/mobile/petal/03-play.png) · [Screen interaction prompt](../../prompts/interaction/petal/03-play.txt)

- **Ambient:** No ambient background animation while solving.
- **Action:** Drag strip 2 or 4 with direct tracking; 1, 3 and 5 start aligned. Use the same snap rule for mouse, touch, tap-target and keyboard. Hint highlights a relevant target once without completing it. Pause retains offsets.
- **Scroll and return:** Horizontal drag does not steal vertical scroll. Keyboard focus has a visible band outline; leaving the route persists partial state.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `petal.03.01` · Five puzzle strips | Hover/focus outlines the active band; no movement until input. Direct horizontal tracking; tap-select/tap-target and keyboard are equivalent routes. | Use Petal’s 4% snap threshold and 180 ms settling rule. Cancel restores offset; no automatic progress from animation completion. |
| `petal.03.02` · Pause | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.03.03` · Show a hint | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.03.04` · Start again | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.03.05` · Final correct move | No rollover or press affordance. This is display/state output; never focus it as a button. | Update text from real state; announce meaningful changes politely once. |
| `petal.03.nav.1` · Play | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.03.nav.2` · Collections | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.03.nav.3` · Profile | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 04 · A small garden, whole again

[Approved PNG](../../images/mobile/petal/04-complete.png) · [Screen interaction prompt](../../prompts/interaction/petal/04-complete.txt)

- **Ambient:** One 300 ms edge-light fade on genuine final placement, then hold the whole Citrus image.
- **Action:** Next arrangement initializes the next valid puzzle; Back to collections shows 1/12. Hover does not replay completion. No count-up animation that suggests multiple completions.
- **Scroll and return:** Reduced motion skips the edge light; 5/5 and completion text remain. Refresh cannot increment the count.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `petal.04.01` · Next arrangement | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.04.02` · Back to collections | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.04.nav.1` · Play | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.04.nav.2` · Collections | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.04.nav.3` · Profile | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 05 · Your quiet collection

[Approved PNG](../../images/mobile/petal/05-profile.png) · [Screen interaction prompt](../../prompts/interaction/petal/05-profile.txt)

- **Ambient:** Reduce motion is pictured ON; collection art and 8.33% progress fill are static.
- **Action:** Haptics, sound and reduced-motion controls expose actual saved values. Save progress opens optional account linking. Replay tutorial is explicit and never resets completed IDs.
- **Scroll and return:** Return from account linking preserves guest progress and focus; no progress animation while syncing.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `petal.05.01` · Gentle haptics / Sound effects / Reduce motion | Hover: 120 ms outline/tint on the target. Focus-visible stays distinct from selected. Press: 80 ms tint; selection changes only on activation. | Selected fill/thumb changes in 140 ms after accepted state; permissions and save failures retain the last valid state. Reduced motion is immediate. |
| `petal.05.02` · Save my progress | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `petal.05.03` · Replay the tutorial | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.05.nav.1` · Play | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.05.nav.2` · Collections | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `petal.05.nav.3` · Profile | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

## Asset preparation

- One continuous approved Citrus illustration, without baked seams, text or UI.
- Five programmatic horizontal masks into that same source; do not generate five unrelated strips.
- Still full image and saved offsets for each puzzle ID; a drag target outline is code.

[Exact extraction / reconstruction prompt](../../prompts/motion/petal-assets.txt)

Use Petal 04-complete as the source for the continuous completed Citrus artwork, with 03-play as the offset/interaction reference. Separate the illustration from all headings, progress, buttons and navigation. Reconstruct one coherent full image where necessary, then verify continuous joins. Keep the lemon, leaves, cream paper and original palette; no new objects. Production will mask that one art file into five horizontal bands. Do not deliver independently redrawn strips or infer geometry from mismatched generated bands.

## React production approach

Build BotanicalPuzzle with one source illustration and five clipped horizontal bands. Store normalized x offsets per puzzle ID, selected strip and completed IDs. During horizontal drag use direct pointer movement and capture only after intent; keep vertical scroll available. Snap when within 4% of board width of the valid alignment, using 180 ms ease-out; invalid release returns to its last valid offset in 180 ms. Tap a strip then its alignment target, or keyboard arrows with Enter to place and Escape to cancel, performs the same move. No inertia, confetti, random progress or video-driven game state. Completion checks all five offsets and saves one ID; reduced motion places immediately.

## Motion direction prompt

[Download the exact prompt](../../prompts/motion/petal-direction.txt)

```text
Programmatic animation prompt — reproduce Petal with the one continuous botanical art source. Welcome can demonstrate one non-saved strip movement over 2 seconds and then stop, controlled by its existing pause action. In actual play only the active strip follows input; neighbors remain fixed. A valid move settles in 180 ms; final alignment gives a subtle 300 ms edge-light fade, then a static whole image. 3/5 becomes 4/5 and 5/5 only from real alignment. Profile 1/12 uses an 8.33% fill. Optional Veo pacing studies may show the same single-strip gesture, but no generated video ships as puzzle logic.
```

## Acceptance

Check all five screens with touch, mouse, keyboard and 200% text. Confirm hover never commits data; press/cancel does not double-submit; focus is visible over every background frame; animation completion never grants progress. Check reduced motion on initial load and during playback, hidden/offscreen pause, poster fallback, resize, route return and canceled requests. Compare each resting frame with its approved PNG.

Verify this contract against the app’s fixed review data. The effect timings are proposed and still require device testing; this document does not claim measured frame rates or completed media.

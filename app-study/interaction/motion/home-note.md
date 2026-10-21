# Home Note — motion and interaction direction

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## A home that feels inhabited

**Production approach:** Veo house study; precise UI transitions.

Bring the soft clay house to life with a little window warmth and foliage movement. Keep the adult avatar consistent and let handover actions, read states and invitations carry the functional feedback.

“VO” is interpreted here as Veo for motion-reference studies; no voiceover or audio is planned. Soul, Petal and Daybook use the programmatic production approaches specified below.

[Full control ledger](../home-note.md) · [Visual review](../../reviews/home-note.html#motion) · [Implementation prompt](../../prompts/interaction/home-note.txt)

## Reference chain

[Original art direction](../../references/originals/home-note.png) → [archived research](../../research/archive/mobile-research-2026-10-20.md) → [current product findings](../../research/README.md) → the five approved PNGs below → this proposed motion contract. Reference findings and WDA design decisions are distinguished; no competitor interaction is claimed to have been copied from a verified native recording.

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

### 01 · Leave the details. Keep the peace.

[Approved PNG](../../images/mobile/home-note/01-welcome.png) · [Screen interaction prompt](../../prompts/interaction/home-note/01-welcome.txt)

- **Ambient:** Optional 4-second house-light vignette, then still; all people illustrations retain their identities.
- **Action:** Primary CTA fill darkens on hover/press. Join household remains an explicit link. Illustration cards do not tilt or behave like buttons.
- **Scroll and return:** Natural scroll; no layered portrait parallax.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `home-note.01.01` · Create your home note | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.01.02` · I have an invitation | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 02 · Give your home a name

[Approved PNG](../../images/mobile/home-note/02-household.png) · [Screen interaction prompt](../../prompts/interaction/home-note/02-household.txt)

- **Ambient:** House light is still while household/name inputs are focused.
- **Action:** Household and Your name fields get an immediate visible border on focus. Open my home shows pending without hiding values; navigate only after successful creation.
- **Scroll and return:** Keyboard reveals Avery input and CTA. Back preserves the draft; no invitation is sent during setup.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `home-note.02.01` · Back | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.02.02` · Household name | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `home-note.02.03` · Your name | Hover: 120 ms border tint. Focus: immediate visible outline with stable label; no scale or placeholder movement. Touch opens the native editing affordance. | Freeze decoration during editing. Preserve draft, selection and keyboard position; validate without shaking the field. |
| `home-note.02.04` · Open my home | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |

### 03 · Today at Maple House

[Approved PNG](../../images/mobile/home-note/03-today.png) · [Screen interaction prompt](../../prompts/interaction/home-note/03-today.txt)

- **Ambient:** The small house and Avery portrait are still.
- **Action:** Agenda rows use a soft peach tint on rollover. Optional object tilt is limited to 2 degrees once during pointer entry, never the text. Add a note opens the editor; the schedule is unchanged until save.
- **Scroll and return:** Preserve agenda scroll on detail/editor return. No motion is applied to time labels.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `home-note.03.01` · Avery avatar | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.03.02` · Schedule row | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.03.03` · Add a note | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.03.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.03.nav.2` · Notes | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.03.nav.3` · People | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 04 · The handover notebook

[Approved PNG](../../images/mobile/home-note/04-notes.png) · [Screen interaction prompt](../../prompts/interaction/home-note/04-notes.txt)

- **Ambient:** House and author avatars are still while reading.
- **Action:** Accordion expands in 220 ms; chevron reflects aria-expanded. Edit and Mark read remain separate buttons. Mark read updates its label and saved state only after success, with no celebratory movement.
- **Scroll and return:** Opening a note does not mark it read. Preserve the expanded record and return focus after editing.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `home-note.04.01` · Note row | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.04.02` · Edit | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.04.03` · Mark read | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.04.04` · Add a note | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.04.05` · Avery avatar | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.04.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.04.nav.2` · Notes | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.04.nav.3` · People | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

### 05 · The people who make home

[Approved PNG](../../images/mobile/home-note/05-people.png) · [Screen interaction prompt](../../prompts/interaction/home-note/05-people.txt)

- **Ambient:** House and avatars stay still; pending invitation has no pulsing urgency cue.
- **Action:** Resend uses explicit pending/sent text; Cancel invitation opens confirmation. Hover never sends or revokes. Invitation success may fade in one pending row over 180 ms, but the member count stays one.
- **Scroll and return:** Restore focus to the invoked row after confirmation. Remove/reinsert with Undo only when the underlying action supports it.

| Control | Rollover / touch / focus | Motion and state feedback |
| --- | --- | --- |
| `home-note.05.01` · Avery row | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.05.02` · Morgan invitation row | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.05.03` · Resend | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.05.04` · Cancel invitation | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.05.05` · Invite someone | Hover: 120 ms contextual fill/border tint. Focus: immediate visible outline. Press: 80 ms darker tint without layout shift. Exit/canceled press restores rest. | Activate on release/keyboard once; preserve labels while pending, suppress duplicate submits, and show explicit success/error. No decorative animation gates the action. |
| `home-note.05.nav.1` · Today | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.05.nav.2` · Notes | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |
| `home-note.05.nav.3` · People | Hover: 120 ms underline/tint. Focus: immediate outline. Press: 80 ms tint; no image/card movement. Exit restores rest without changing active destination. | Route crossfade 160 ms after activation; reduced motion immediate. Active route selection is a no-op; preserve route scroll/drafts. |

## Asset preparation

- Isolated clay house, trees and shrubbery from Give your home a name.
- Adult Avery avatar remains a separate still asset; Morgan is the M placeholder until a real profile is supplied.
- Separate card objects: backpack, apple, books, cardigan and lunchbox; no lettering in the art.

[Exact extraction / reconstruction prompt](../../prompts/motion/home-note-assets.txt)

From Home Note 02-household isolate the cream clay house, terracotta roof, warm windows, fence and green shrubs. Preserve geometry, surface softness, shadows and fixed camera. Make an illustration-only plate with the same peach background and an alpha cutout option. Keep Avery from 03-today as a separate still portrait, preserving her adult face, brown wavy hair, hoops and sweater. Do not animate or replace avatars and do not make Morgan a photographed person. Remove all UI lettering from the motion plate.

## React production approach

Compose an illustration-only video inside the house region, under semantic form and card UI. The house can have a single 4-second entrance vignette on welcome/setup; main tabs use the still. Expand notes with CSS/Motion layout and preserve focus. A successful create/save/acknowledgement drives a short state treatment; a clip ending does not create a household, mark a note read or send an invitation.

## Motion direction prompt

[Download the exact prompt](../../prompts/motion/home-note-direction.txt)

```text
Veo motion-study prompt — animate the supplied Home Note clay-house plate with a completely locked camera. Over four seconds softly brighten the already-lit windows by a small amount and let the outer shrub leaves settle through a very small sway. Maintain exact house shape, terracotta roof, peach scene, creamy clay texture and shadows. End at the resting composition. No door opening, new inhabitants, moving architecture, talking faces, text, UI, music or narration. The effect is atmosphere only.
```

## Acceptance

Check all five screens with touch, mouse, keyboard and 200% text. Confirm hover never commits data; press/cancel does not double-submit; focus is visible over every background frame; animation completion never grants progress. Check reduced motion on initial load and during playback, hidden/offscreen pause, poster fallback, resize, route return and canceled requests. Compare each resting frame with its approved PNG.

Verify this contract against the app’s fixed review data. The effect timings are proposed and still require device testing; this document does not claim measured frame rates or completed media.

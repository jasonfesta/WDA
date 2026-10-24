# Courtyard · Material picker — full interaction specification

24 October 2026 · Version 3.2 · 5 control groups · 17 rendered states

[Readable guide](INTERACTIONS.html) · [Visual review](README.md) · [Structured specification](interactions.json)

Choose a material, inspect its value and replace or restore a palette.

These are detailed implementation requirements for the six static studies. All 93 planned PNG/SVG states are mapped below. Generic hover/press combinations, every data permutation and additional host-only failure branches are specified in text rather than claimed as extra rendered images. No production behavior is implemented by this document.

## Initial fixture

Rose #D68C80; Apricot #E9A16D selected; Citron #E4C65A; Moss #797D50; Burgundy #65333C. The shuffled fixture is Clay, Peel, Brick, Plum, Ash.

## Every control

### Five material tiles

Control ID: `courtyard.materials`

- **Semantics:** Radio group labelled Material
- **Click / tap:** Select one material and apply its ID/value to the selected object.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Radio contract; arrow navigation selects in visual order across wrapped rows.
- **Pending / disabled:** Freeze while loading a palette. Available after a load error.
- **Result:** One check/border, matching detail name, finish and hex.
- **Return / dismiss:** Selecting a different tile replaces selection; no deselect-all state.
- **Announcement:** Expose material name, finish and checked state; decorative texture is hidden from assistive technology.

### Shuffle

Control ID: `courtyard.shuffle`

- **Semantics:** Button
- **Click / tap:** Request a replacement palette.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Disabled while loading. Keep the focused button in place with aria-disabled during the request.
- **Result:** Keep current materials until success; new set selects Clay and makes Undo available.
- **Return / dismiss:** Undo restores previous palette/selection. Failure leaves current palette unchanged.
- **Announcement:** Announce Loading palette, then Palette shuffled or Couldn’t load palette.

### Palette Retry

Control ID: `courtyard.palette-retry`

- **Semantics:** Button
- **Click / tap:** Retry the failed palette request.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** One pending request only; Retry replaces its text with progress or is aria-disabled.
- **Result:** Same result rules as Shuffle; failure remains retryable.
- **Return / dismiss:** Selecting a current tile is allowed after failure; retry preserves that selection until success.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Undo

Control ID: `courtyard.undo`

- **Semantics:** Button
- **Click / tap:** Restore previousSnapshot and clear it.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Available only with an undo snapshot and no palette request.
- **Result:** Original palette plus its previous selection; footer Previous palette restored.
- **Return / dismiss:** Focus moves to the restored selected tile after the Undo control disappears.
- **Announcement:** Announce Previous palette restored and selected material name.

### Copy hex value

Control ID: `courtyard.copy`

- **Semantics:** Icon button named Copy hex value; adjacent selectable text
- **Click / tap:** Copy the currently selected material’s hex string.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract; native text selection and platform copy shortcuts remain available.
- **Pending / disabled:** Copy is independent of palette loading; suppress concurrent copy attempts.
- **Result:** Success gives check/Copied for two seconds; failure highlights selectable text and explains manual copy.
- **Return / dismiss:** Selection does not change. Keep focus on Copy, including after failure.
- **Announcement:** Announce Copied #E9A16D or Couldn’t copy. Select the value to copy manually.

## State transitions

### Material picker · default

`courtyard-v2-default` · [View state](images/courtyard-v2-default.png) · [Data](state-data/courtyard-v2-default.json)

- **Entry:** Select the illustrated original material or load default Apricot.
- **Exit / return:** Select another tile, Copy, or Shuffle → loading.
- **Focus:** Selected radio receives focus on keyboard selection.
- **Data / guard:** Apricot · Matte ceramic · #E9A16D always agree.

### Rose selected

`courtyard-v2-rose` · [View state](images/courtyard-v2-rose.png) · [Data](state-data/courtyard-v2-rose.json)

- **Entry:** Select the illustrated original material or load default Apricot.
- **Exit / return:** Select another tile, Copy, or Shuffle → loading.
- **Focus:** Selected radio receives focus on keyboard selection.
- **Data / guard:** Rose · Polished ceramic · #D68C80 always agree.

### Citron selected

`courtyard-v2-citron` · [View state](images/courtyard-v2-citron.png) · [Data](state-data/courtyard-v2-citron.json)

- **Entry:** Select the illustrated original material or load default Apricot.
- **Exit / return:** Select another tile, Copy, or Shuffle → loading.
- **Focus:** Selected radio receives focus on keyboard selection.
- **Data / guard:** Citron · Textured clay · #E4C65A always agree.

### Moss selected

`courtyard-v2-moss` · [View state](images/courtyard-v2-moss.png) · [Data](state-data/courtyard-v2-moss.json)

- **Entry:** Select the illustrated original material or load default Apricot.
- **Exit / return:** Select another tile, Copy, or Shuffle → loading.
- **Focus:** Selected radio receives focus on keyboard selection.
- **Data / guard:** Moss · Natural stone · #797D50 always agree.

### Burgundy selected

`courtyard-v2-burgundy` · [View state](images/courtyard-v2-burgundy.png) · [Data](state-data/courtyard-v2-burgundy.json)

- **Entry:** Select the illustrated original material or load default Apricot.
- **Exit / return:** Select another tile, Copy, or Shuffle → loading.
- **Focus:** Selected radio receives focus on keyboard selection.
- **Data / guard:** Burgundy · Ribbed wood · #65333C always agree.

### Clay in shuffled set

`courtyard-v2-shuffled-clay` · [View state](images/courtyard-v2-shuffled-clay.png) · [Data](state-data/courtyard-v2-shuffled-clay.json)

- **Entry:** Shuffle succeeds, then select the illustrated material if it is not Clay.
- **Exit / return:** Select another shuffled tile; Undo → previous palette and prior selected ID; Shuffle starts another request.
- **Focus:** Keep Shuffle focus after loading; direct selection focuses its tile.
- **Data / guard:** Clay · Terracotta · #C77E5A; Undo snapshot remains intact.

### Peel in shuffled set

`courtyard-v2-shuffled-peel` · [View state](images/courtyard-v2-shuffled-peel.png) · [Data](state-data/courtyard-v2-shuffled-peel.json)

- **Entry:** Shuffle succeeds, then select the illustrated material if it is not Clay.
- **Exit / return:** Select another shuffled tile; Undo → previous palette and prior selected ID; Shuffle starts another request.
- **Focus:** Keep Shuffle focus after loading; direct selection focuses its tile.
- **Data / guard:** Peel · Matte ceramic · #EDAD71; Undo snapshot remains intact.

### Brick in shuffled set

`courtyard-v2-shuffled-brick` · [View state](images/courtyard-v2-shuffled-brick.png) · [Data](state-data/courtyard-v2-shuffled-brick.json)

- **Entry:** Shuffle succeeds, then select the illustrated material if it is not Clay.
- **Exit / return:** Select another shuffled tile; Undo → previous palette and prior selected ID; Shuffle starts another request.
- **Focus:** Keep Shuffle focus after loading; direct selection focuses its tile.
- **Data / guard:** Brick · Textured clay · #A94F35; Undo snapshot remains intact.

### Plum in shuffled set

`courtyard-v2-shuffled-plum` · [View state](images/courtyard-v2-shuffled-plum.png) · [Data](state-data/courtyard-v2-shuffled-plum.json)

- **Entry:** Shuffle succeeds, then select the illustrated material if it is not Clay.
- **Exit / return:** Select another shuffled tile; Undo → previous palette and prior selected ID; Shuffle starts another request.
- **Focus:** Keep Shuffle focus after loading; direct selection focuses its tile.
- **Data / guard:** Plum · Polished ceramic · #886476; Undo snapshot remains intact.

### Ash in shuffled set

`courtyard-v2-shuffled-ash` · [View state](images/courtyard-v2-shuffled-ash.png) · [Data](state-data/courtyard-v2-shuffled-ash.json)

- **Entry:** Shuffle succeeds, then select the illustrated material if it is not Clay.
- **Exit / return:** Select another shuffled tile; Undo → previous palette and prior selected ID; Shuffle starts another request.
- **Focus:** Keep Shuffle focus after loading; direct selection focuses its tile.
- **Data / guard:** Ash · Natural stone · #BDB8AF; Undo snapshot remains intact.

### Undo restores Apricot

`courtyard-v2-undo-apricot` · [View state](images/courtyard-v2-undo-apricot.png) · [Data](state-data/courtyard-v2-undo-apricot.json)

- **Entry:** Activate Undo after a successful shuffle.
- **Exit / return:** Choose another original material or Shuffle again; the consumed Undo is removed.
- **Focus:** Restored selected tile.
- **Data / guard:** Restored Apricot and the original five-material palette.

### Undo restores Moss

`courtyard-v2-undo-moss` · [View state](images/courtyard-v2-undo-moss.png) · [Data](state-data/courtyard-v2-undo-moss.json)

- **Entry:** Activate Undo after a successful shuffle.
- **Exit / return:** Choose another original material or Shuffle again; the consumed Undo is removed.
- **Focus:** Restored selected tile.
- **Data / guard:** Restored Moss and the original five-material palette.

### Palette loading

`courtyard-v2-loading` · [View state](images/courtyard-v2-loading.png) · [Data](state-data/courtyard-v2-loading.json)

- **Entry:** Activate Shuffle; request is pending.
- **Exit / return:** loading → shuffled-clay on success or error; error → Retry/loading, or keep/select a current tile.
- **Focus:** Keep the initiating action focused; expose loading/error without moving focus.
- **Data / guard:** Retain the current palette and selected value; the screenshot uses Apricot.

### Palette load failed

`courtyard-v2-error` · [View state](images/courtyard-v2-error.png) · [Data](state-data/courtyard-v2-error.json)

- **Entry:** Activate Shuffle; request fails.
- **Exit / return:** loading → shuffled-clay on success or error; error → Retry/loading, or keep/select a current tile.
- **Focus:** Keep the initiating action focused; expose loading/error without moving focus.
- **Data / guard:** Retain the current palette and selected value; the screenshot uses Apricot.

### Material value copied

`courtyard-v2-copied` · [View state](images/courtyard-v2-copied.png) · [Data](state-data/courtyard-v2-copied.json)

- **Entry:** Copy Apricot; clipboard operation succeeds.
- **Exit / return:** copied → default after 2 seconds; copy-error → manual copy or Retry via Copy; selection clears feedback.
- **Focus:** Copy button remains focused; value supports manual selection.
- **Data / guard:** The operation affects clipboard feedback only, not palette or selection.

### Copy unavailable

`courtyard-v2-copy-error` · [View state](images/courtyard-v2-copy-error.png) · [Data](state-data/courtyard-v2-copy-error.json)

- **Entry:** Copy Apricot; clipboard operation fails or is unavailable.
- **Exit / return:** copied → default after 2 seconds; copy-error → manual copy or Retry via Copy; selection clears feedback.
- **Focus:** Copy button remains focused; value supports manual selection.
- **Data / guard:** The operation affects clipboard feedback only, not palette or selection.

### Focus on Shuffle

`courtyard-v2-focus` · [View state](images/courtyard-v2-focus.png) · [Data](state-data/courtyard-v2-focus.json)

- **Entry:** Tab to Shuffle.
- **Exit / return:** Enter/Space → loading; Tab moves on without changing Apricot.
- **Focus:** Shuffle outer ring, independent from Apricot selection.

## Read-only content

The material name and finish are read-only; the hex string is selectable text. Only the copy icon copies it. Textures do not zoom or drag, and the palette order changes only through Shuffle or Undo.

## State model

- palette: ordered material IDs with name, finish, colour and texture
- selectedMaterialId; previousSnapshot: previous palette plus selected ID, or null
- paletteStatus: idle, loading or error; copyStatus: idle, pending, copied or error
- paletteRequestId; copiedValue; copyFeedbackExpiry

## Persistence

- Material selection applies immediately to the host’s selected object. The component does not create an object or own the host document’s undo stack.
- A successful shuffle captures one prior snapshot and selects the first new material (Clay in the fixture). Choosing another shuffled material does not overwrite that snapshot.
- Undo restores both palette and selection and consumes the snapshot. A subsequent shuffle replaces the snapshot; no multi-level history is shown.

Stable IDs, not visible labels, identify people, materials, cities, plans and routes. Async callbacks carry a request/version ID and cannot apply after cancellation, replacement or unmount. Server acknowledgements govern persistence and purchases. The per-state JSON fixtures are example inputs, not a backend schema.

## Async and edge cases

- Keep the existing palette visible during load; freeze material selection, Undo and Shuffle until the response resolves. Copy remains available for the current value.
- Only the current request may apply a palette. Failure preserves the entire old palette/selection and exposes Retry.
- Clipboard success is confirmed only by a fulfilled host copy operation. Failure provides selectable text and the manual-copy instruction; never show a false Copied state.
- Copied feedback lasts 2 seconds, then clears. Selection or palette changes clear old copy feedback immediately so it cannot describe another value.

## Keyboard, pointer and feedback contracts

### Buttons

Use a semantic button. Enter or Space activates once; suppress duplicate pending actions. Focus is visible immediately. Keep a pending focused control in the tab order with aria-disabled when disabling it would lose focus; the handler must also prevent activation.

### Manual tabs

Tab enters at the selected tab. Left/Right and Home/End move focus without activation; Enter/Space commits. Arrow navigation wraps. The active tab and associated panel are labelled together; focus and selection are separate.

### Radios

Tab enters at the checked radio. Arrow keys move and select; Space checks the focused item. Only one option is checked. Use native radios where possible. Unit and material controls use this pattern; plan/day/period controls use manual tabs.

### Combobox

Keep text-editing focus in the input; Up/Down changes the active suggestion and Enter chooses it. Expose expanded state, controlled list and active option. Typed arbitrary text never becomes a committed city. Escape closes the location panel.

### Modal dialogs

Give the modal a heading and accessible name. On entry focus that heading when context needs reading; keep Tab/Shift+Tab inside. Background is inert. Escape, close or explicit Back dismisses and restores the recorded trigger. Backdrop clicks do not dismiss in this study.

### Nonmodal panels

Sol search and Gather picker do not trap focus. Escape and explicit dismissal return to the trigger. Pointer outside closes and allows the clicked target to receive focus. Keyboard focus leaving the panel closes it after the move, without redirecting focus.

### Links

Use real hrefs. Enter follows; modifier clicks and browser history retain native behavior. Do not make navigation links into radio controls. Use aria-current only for the committed route.

### Hover

120 ms background/colour transition. Use neutral tint for unselected items; selected fill stays distinct. Do not reveal essential information only on hover.

### Press

Apply immediate darker surface while held; return within 90 ms on release. No scale, bounce or layout displacement. Pointer cancellation does not activate.

### Focus

2 px burgundy outline with 2 px offset, not a duplicate selected fill. Never remove focus styles. Keep logical DOM order; no positive tabindex.

### Loading

Show progress immediately and preserve known data. A spinner may rotate at a steady 800 ms cycle; it is decorative and not the only loading indicator. No minimum artificial wait or fabricated progress percentage.

### Overlays

Open with a 120 ms opacity transition; close in 90 ms. Focus behavior runs immediately, independent of animation completion. No spring or perspective transforms.

### Reduced motion

Disable decorative rotation and overlay/colour interpolation; show the final state immediately. Text status and visible focus remain.

### Errors and announcements

Use one polite live region for async status. Keep an actionable error until retry, dismissal or a successful superseding action. Do not move focus merely to announce it. A disappearing focused recovery control returns to its stable trigger.

### Touch and targets

Target at least 44 × 44 CSS px where space permits, even when the icon is smaller; keep target areas from overlapping. Tap duplicates pointer activation, never hover. Keep browser zoom and text selection enabled.

## Responsive layout

- Native study: 640 × 304. On narrow screens wrap material tiles into rows, preserving order and full labels; keep a minimum 44 px target.
- The selected check and border must remain visible over every swatch. Focus is an independent outer ring.
- Hex text stays selectable and untruncated. Swatches are visual samples, not promises of physically accurate rendering.

These are implementation requirements; additional responsive component exports are not included.

## Acceptance checks for future implementation

- Select Moss: name, Natural stone and #797D50 agree with the checked tile.
- Shuffle from Moss, choose Plum, Undo: restore the original five and Moss, not Apricot or Plum.
- Fail Shuffle: retain Apricot and its value, with an actionable Retry.
- Deny clipboard access: retain the hex value and show manual copy guidance without losing selection.

## Primary references

Checked 24 October 2026. Timings and product behavior are study-specific decisions.

- [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WAI-ARIA APG: Radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Final audit clarifications

These rules clarify exceptional transitions without adding rendered image states. They take precedence where the earlier general rule needs a narrower condition.

- Copy has an explicit pending state even though it has no separate PNG. Capture the exact hex value and a selection revision when copying. Suppress duplicate attempts. If selection or palette changes before the clipboard promise settles, allow the already requested clipboard write to settle but ignore its stale success/error feedback; it must not display “Copied” beside a different value. A fresh Copy uses the new value.

- Validate a replacement palette before applying it: require nonempty material records, unique stable IDs, readable names and valid hex values. An empty or malformed payload follows the existing palette-error recovery and preserves the prior palette, selected ID and Undo snapshot. A failed shuffle never consumes the prior snapshot.

- At a palette request boundary, disable activation without removing the focused action from keyboard order. When a selected tile becomes unavailable, keep focus on a stable action or restore the selected tile after success; never leave focus on a removed node. The host supplies a valid editable target and owns document persistence; the picker emits a selected material ID rather than inventing a second document save flow.

[Rebuild reference](../REBUILD.md) · [Coverage and audit](../AUDIT.md)

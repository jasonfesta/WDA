# Courtyard / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the material palette picker using the [five-state ledger](../../interaction/courtyard.md), [original artwork](../../references/originals/courtyard.png) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

Long ivory porcelain tray, evenly spaced tactile spheres, one coral selection ring and small text labels. Preserve the wide, shallow footprint.

Inter for the small uppercase title, material names and action label.

## Screens and transitions

- **01-apricot / Apricot selected** — [image](../../images/states/courtyard/01-apricot.png). Rose, Apricot, Citron, Moss and Burgundy; only Apricot has the selection ring.
- **02-moss / Moss selected** — [image](../../images/states/courtyard/02-moss.png). The original five materials remain; only Moss is selected.
- **03-focus / Shuffle focused** — [image](../../images/states/courtyard/03-focus.png). Apricot remains selected; a separate high-contrast outline surrounds Shuffle.
- **04-shuffled / New palette** — [image](../../images/states/courtyard/04-shuffled.png). Clay, Peel, Brick, Plum and Ash replace the original set; Clay selected; Palette shuffled · Undo.
- **05-restored / Undo restores selection** — [image](../../images/states/courtyard/05-restored.png). Original materials return with Moss selected; Previous palette restored.

- Every original and shuffled sphere is a labelled radio. Left/Right changes the selected ID within the current set; Home/End select first/last. The selected ring and focus outline remain separate. Shuffle retains focus on the Shuffle button.
- Image 03 shows keyboard focus with Apricot selected. Enter here would save Apricot for Undo. Images 04–05 deliberately follow the Moss branch from image 02; restoring Moss is not a universal hardcoded default.
- Undo is one level. On restoration remove Undo and announce Previous palette restored. A library-loading failure keeps the existing palette, shows Couldn’t load palette and Retry; no empty set or mismatched names/assets.

## State ownership

MaterialPalette receives materials, selectedMaterialId and onSelect/onShuffle/onUndo. Store a full previous snapshot for undo; never derive identity from current array position. Use a fieldset of labelled radios, keeping shuffle outside the group.

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

- Rose: Set selectedMaterialId to this swatch ID. Exactly one selected material; label and preview derive from that ID.
- Apricot: Set selectedMaterialId to this swatch ID. Exactly one selected material; label and preview derive from that ID.
- Citron: Set selectedMaterialId to this swatch ID. Exactly one selected material; label and preview derive from that ID.
- Moss: Set selectedMaterialId to this swatch ID. Exactly one selected material; label and preview derive from that ID.
- Burgundy: Set selectedMaterialId to this swatch ID. Exactly one selected material; label and preview derive from that ID.
- Shuffle palette: Save current set and selection to history, then apply a new valid material set. Five new swatches, one selection and an available Undo.
- Undo shuffle: Restore the preceding set and selectedMaterialId. The prior material set and selected ring return.
- Clay / Peel / Brick / Plum / Ash: Select one material in the shuffled set using stable IDs. One selected ring; Undo restores the prior set and selection.

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Input and motion

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

Only the hovered material lifts 2px; on selection the ring crossfades in 120 ms. Shuffle crossfades the set over 180 ms with no mixing of old labels and new artwork. There is no ambient rotation. Under reduced motion, update the entire set immediately.

## Acceptance

- Exactly five named materials and one selected ring.
- Shuffle updates names, assets and IDs together.
- Undo restores both palette and selection.

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

- [W3C — radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) — Courtyard keeps exactly one active material, with a visible ring and its text name.
- [Radix — Toggle Group build example](https://www.radix-ui.com/primitives/docs/components/toggle-group) — A useful implementation reference for compact controls. Courtyard still uses radio semantics because it requires a choice.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.

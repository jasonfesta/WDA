# Gather / Interaction ledger

WDA / Jason Festa · 21 October 2026

[Visual review](../reviews/gather.html) · [React prompt](../prompts/interaction/gather.md) · [Motion prompt](../prompts/motion/gather.md)

Five rendered states of the same component. Review order is an index; the action paths below define the actual transitions. Supporting loading, data and host-route branches are specified after the images.


<a id="01-three-selected"></a>
## 01-three-selected / Three selected

![Gather: Three selected](../images/states/gather/01-three-selected.png)

[Exact image prompt](../prompts/states/gather/01-three-selected.md) · [Attached visual reference](../references/originals/gather.png)

- **Entry:** Open the picker with the saved three-person set.
- **Visible:** Lena, Noah and Amara checked; three corresponding avatars and a count of 3.
- **Exit / return:** Toggle any checkbox or close.

- **Close picker** → [02-closed](#02-closed). Selected IDs persist.
- **Select Eli** → [03-four-selected](#03-four-selected). Count and all avatars derive from IDs.

<a id="02-closed"></a>
## 02-closed / Closed picker

![Gather: Closed picker](../images/states/gather/02-closed.png)

[Exact image prompt](../prompts/states/gather/02-closed.md) · [Attached visual reference](../images/states/gather/01-three-selected.png)

- **Entry:** Close the three-person picker using trigger, Escape or outside click.
- **Visible:** Only the trigger remains; three avatars, Gather · 3 people and a down chevron.
- **Exit / return:** Reopen restores the same selected IDs.

- **Open picker** → [01-three-selected](#01-three-selected). Restore three checked rows.

<a id="03-four-selected"></a>
## 03-four-selected / Four selected

![Gather: Four selected](../images/states/gather/03-four-selected.png)

[Exact image prompt](../prompts/states/gather/03-four-selected.md) · [Attached visual reference](../images/states/gather/01-three-selected.png)

- **Entry:** Select Eli from the three-person set.
- **Visible:** All four rows checked; four matching avatars; both summaries say 4.
- **Exit / return:** Deselect rows, close or handle save failure.

- **Deselect Eli** → [01-three-selected](#01-three-selected). Return to the saved three-person set.
- **Deselect all four** → [04-empty](#04-empty). Review shortcut for four individual checkbox actions; no Clear all button is drawn.
- **Save fails** → [05-save-error](#05-save-error). Keep attempted four-person selection.

<a id="04-empty"></a>
## 04-empty / Zero selected

![Gather: Zero selected](../images/states/gather/04-empty.png)

[Exact image prompt](../prompts/states/gather/04-empty.md) · [Attached visual reference](../images/states/gather/01-three-selected.png)

- **Entry:** Deselect all four people.
- **Visible:** All checkboxes empty; no trigger avatars; both summaries say 0.
- **Exit / return:** Select any row; the count and avatars return from the selected IDs.

- **Select Lena, Noah and Amara** → [01-three-selected](#01-three-selected). Review shortcut for three individual toggles; not one hidden UI action.

<a id="05-save-error"></a>
## 05-save-error / Selection save error

![Gather: Selection save error](../images/states/gather/05-save-error.png)

[Exact image prompt](../prompts/states/gather/05-save-error.md) · [Attached visual reference](../images/states/gather/01-three-selected.png)

- **Entry:** Saving the attempted four-person set fails.
- **Visible:** Four remain checked; Changes not saved, Retry and Revert appear beneath the summary.
- **Exit / return:** Retry success reaches the four-person state; Revert restores the saved three-person set.

- **Retry succeeds** → [03-four-selected](#03-four-selected). Confirm the attempted four IDs.
- **Revert** → [01-three-selected](#01-three-selected). Restore last-confirmed IDs.
- **Retry fails** → [05-save-error](#05-save-error). Retain the error.

## Every control

### gather-trigger / Gather · selected count

Scope: original · 1 element instances

- **Activation:** Toggle the connected popover without changing selection.
- **Rollover:** A subtle cream border highlight; chevron rotation only when open changes.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Enter/Space toggles; Escape closes; return focus to trigger.
- **Result / return:** Open ↔ closed with unchanged IDs.

Related images: [01-three-selected](#01-three-selected), [02-closed](#02-closed).

### gather-person-lena / Lena Ortiz · Visual direction

Scope: original · 1 element instances

- **Activation:** Toggle this person ID in selectedIds.
- **Rollover:** Lighten the entire row; avatar lifts 1px at most; checked state stays clear.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Native checkbox, labelled with name and role; Space toggles.
- **Result / return:** Derive count, checkmarks, trigger avatars and summary from the same selectedIds.

Related images: [01-three-selected](#01-three-selected), [03-four-selected](#03-four-selected), [04-empty](#04-empty).

### gather-person-noah / Noah Bell · Material studies

Scope: original · 1 element instances

- **Activation:** Toggle this person ID in selectedIds.
- **Rollover:** Lighten the entire row; avatar lifts 1px at most; checked state stays clear.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Native checkbox, labelled with name and role; Space toggles.
- **Result / return:** Derive count, checkmarks, trigger avatars and summary from the same selectedIds.

Related images: [01-three-selected](#01-three-selected), [03-four-selected](#03-four-selected), [04-empty](#04-empty).

### gather-person-amara / Amara Chen · Digital craft

Scope: original · 1 element instances

- **Activation:** Toggle this person ID in selectedIds.
- **Rollover:** Lighten the entire row; avatar lifts 1px at most; checked state stays clear.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Native checkbox, labelled with name and role; Space toggles.
- **Result / return:** Derive count, checkmarks, trigger avatars and summary from the same selectedIds.

Related images: [01-three-selected](#01-three-selected), [03-four-selected](#03-four-selected), [04-empty](#04-empty).

### gather-person-eli / Eli Brooks · Photography

Scope: original · 1 element instances

- **Activation:** Toggle this person ID in selectedIds.
- **Rollover:** Lighten the entire row; avatar lifts 1px at most; checked state stays clear.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Native checkbox, labelled with name and role; Space toggles.
- **Result / return:** Derive count, checkmarks, trigger avatars and summary from the same selectedIds.

Related images: [01-three-selected](#01-three-selected), [03-four-selected](#03-four-selected).

### gather-retry / Retry save

Scope: proposed supporting control · 1 element instances

- **Activation:** Resubmit attempted selection; disable duplicate submissions while pending.
- **Rollover:** High-contrast text and underline.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Native button; status announced once.
- **Result / return:** Saved state or continued inline error.

Related images: [05-save-error](#05-save-error), [03-four-selected](#03-four-selected).

### gather-revert / Revert selection

Scope: proposed supporting control · 1 element instances

- **Activation:** Restore lastConfirmedIds after a failed save.
- **Rollover:** Show a clear text action with focus ring.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Enter/Space; keep focus in the list.
- **Result / return:** Checked state, count and trigger all roll back together.

Related images: [05-save-error](#05-save-error), [01-three-selected](#01-three-selected).

## Descriptive regions

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Supporting branches and all return paths

- Each row supports selection independently; the one-, two- and alternate three-person sets reuse the illustrated row grammar. Closed state preserves whatever current set exists, even though image 02 illustrates three.
- Save pending keeps attempted values with a Saving… status. Failure never displays a success toast. Retry resubmits the same set with request versioning; stale responses cannot overwrite newer selections. Revert is available only after failure and restores the last confirmed snapshot.
- Close/Escape/outside click dismisses the popover without undoing selection. The zero state is valid. Roles and heading are descriptive; avatar click activates its checkbox row, not a profile route.

## Rollover, motion and extraction

Open with a 140 ms opacity change and a 4px vertical offset. Checkmarks settle in 100 ms; avatars move only when the selected set changes. Do not continuously spin or float people. Preserve list height while an error appears beneath the footer.

Prepare four separate material spheres: rose ceramic, amber glass, moss stone and burgundy ribbed wood. Reuse the identical sphere for a person in the row and trigger. Export transparent assets with matched camera, light and baseline. No portrait replacements or names baked into pixels.

## Scroll, touch and accessibility

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

## React translation

TeamPicker receives people, selectedIds, open, saveStatus and onSelectionChange. Use a controlled Popover plus native checkboxes. Count is selectedIds.length; displayed avatars are selectedIds for the four-person study; use a labelled overflow count only when the layout actually requires it. Store attempted and last-confirmed sets for save errors.

- 0 selected gives zero avatars and a zero count.
- All four selected shows four or a truthful three-plus-one summary.
- Closing preserves current selection; failed save never claims success.

## Alternative layout

For a long directory, add a labelled search field and a scrollable list with a fixed summary. Selection remains by stable person ID across filters. This is a future layout option; the original four-person picker remains primary.

## Build references

- [W3C — checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) — Gather uses one native checkbox per person, with count and avatar summary derived from selected IDs.
- [W3C — disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — Gather opens by activation, not hover; its trigger communicates open or closed.
- [Radix — Popover build example](https://www.radix-ui.com/primitives/docs/components/popover) — Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.

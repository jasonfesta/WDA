# Gather / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the team picker using the [five-state ledger](../../interaction/gather.md), [original artwork](../../references/originals/gather.png) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

Cocoa panel, cream checkmarks and rose, amber, moss and burgundy objects. Keep the floating trigger connected to the list and preserve generous row spacing.

Inter for names, roles and count. Names lead; roles remain secondary but readable.

## Screens and transitions

- **01-three-selected / Three selected** — [image](../../images/states/gather/01-three-selected.png). Lena, Noah and Amara checked; three corresponding avatars and a count of 3.
- **02-closed / Closed picker** — [image](../../images/states/gather/02-closed.png). Only the trigger remains; three avatars, Gather · 3 people and a down chevron.
- **03-four-selected / Four selected** — [image](../../images/states/gather/03-four-selected.png). All four rows checked; four matching avatars; both summaries say 4.
- **04-empty / Zero selected** — [image](../../images/states/gather/04-empty.png). All checkboxes empty; no trigger avatars; both summaries say 0.
- **05-save-error / Selection save error** — [image](../../images/states/gather/05-save-error.png). Four remain checked; Changes not saved, Retry and Revert appear beneath the summary.

- Each row supports selection independently; the one-, two- and alternate three-person sets reuse the illustrated row grammar. Closed state preserves whatever current set exists, even though image 02 illustrates three.
- Save pending keeps attempted values with a Saving… status. Failure never displays a success toast. Retry resubmits the same set with request versioning; stale responses cannot overwrite newer selections. Revert is available only after failure and restores the last confirmed snapshot.
- Close/Escape/outside click dismisses the popover without undoing selection. The zero state is valid. Roles and heading are descriptive; avatar click activates its checkbox row, not a profile route.

## State ownership

TeamPicker receives people, selectedIds, open, saveStatus and onSelectionChange. Use a controlled Popover plus native checkboxes. Count is selectedIds.length; displayed avatars are selectedIds for the four-person study; use a labelled overflow count only when the layout actually requires it. Store attempted and last-confirmed sets for save errors.

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

- Gather · selected count: Toggle the connected popover without changing selection. Open ↔ closed with unchanged IDs.
- Lena Ortiz · Visual direction: Toggle this person ID in selectedIds. Derive count, checkmarks, trigger avatars and summary from the same selectedIds.
- Noah Bell · Material studies: Toggle this person ID in selectedIds. Derive count, checkmarks, trigger avatars and summary from the same selectedIds.
- Amara Chen · Digital craft: Toggle this person ID in selectedIds. Derive count, checkmarks, trigger avatars and summary from the same selectedIds.
- Eli Brooks · Photography: Toggle this person ID in selectedIds. Derive count, checkmarks, trigger avatars and summary from the same selectedIds.
- Retry save: Resubmit attempted selection; disable duplicate submissions while pending. Saved state or continued inline error.
- Revert selection: Restore lastConfirmedIds after a failed save. Checked state, count and trigger all roll back together.

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Input and motion

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

Open with a 140 ms opacity change and a 4px vertical offset. Checkmarks settle in 100 ms; avatars move only when the selected set changes. Do not continuously spin or float people. Preserve list height while an error appears beneath the footer.

## Acceptance

- 0 selected gives zero avatars and a zero count.
- All four selected shows four or a truthful three-plus-one summary.
- Closing preserves current selection; failed save never claims success.

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

- [W3C — checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) — Gather uses one native checkbox per person, with count and avatar summary derived from selected IDs.
- [W3C — disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — Gather opens by activation, not hover; its trigger communicates open or closed.
- [Radix — Popover build example](https://www.radix-ui.com/primitives/docs/components/popover) — Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.

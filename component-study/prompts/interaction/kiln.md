# Kiln / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the usage dashboard using the [five-state ledger](../../interaction/kiln.md), [original artwork](../../references/originals/kiln.png) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

Wide cream panel, cocoa labels, orange/rose/burgundy category segments, a simple daily rhythm and a compact resource footer. Keep bars mathematically honest.

Inter with tabular numerals for values; readable period labels and units.

## Screens and transitions

- **01-cycle / This cycle** — [image](../../images/states/kiln/01-cycle.png). 6,240/8,000 (78%), categories 3,200/1,600/960/480, average 208/day; 1,760 available.
- **02-previous / Previous cycle** — [image](../../images/states/kiln/02-previous.png). 4,800/8,000 (60%); categories 2,400/1,200/720/480; average 160/day; 3,200 available.
- **03-week / This week** — [image](../../images/states/kiln/03-week.png). 1,400/8,000 (17.5%); 700/350/210/140; average 200/day; seven weekday bars. The 6,600 difference is against the allowance, not remaining balance this cycle.
- **04-detail / Inspect Render usage** — [image](../../images/states/kiln/04-detail.png). Render popover: 3,200 credits; 51% of used credits; 40% of cycle allowance; View render activity and Close.
- **05-manage / Manage plan** — [image](../../images/states/kiln/05-manage.png). Current plan dialog: 8,000 allowance, 6,240 used, 1,760 available, 6/8 seats and 2.4/4 GB; Compare plans, Back to usage, Close.

- Explore, Compose and Export reuse Render’s popover with their own totals and explicit used-versus-allowance percentages. Close/Escape/outside click restores focus. View activity opens a host filtered table; Back restores the originating range and filter.
- Daily bars expose exact date and credits on hover or focus. Touch toggles the same tooltip; Escape closes. One chart tab stop supports arrow traversal; a View data table action exposes all values. Daily arrays in fixtures.json are proposed build data; raster bar heights are illustrative, not a data source.
- Period loading keeps the prior range clearly labelled until success; failure shows Couldn’t load this range, timestamp and Retry. No-data and true-zero datasets are distinct. Near capacity, add a textual warning at 95% without forcing an upgrade.
- Collaborators, Library and Collections link to host members, storage and collection routes. Preserve period on return. Collections is a count with no fabricated limit. Compare plans opens a verified host catalogue, with loading, retry and Back paths. The 6,600 weekly difference is not spendable remaining credit.

## State ownership

UsagePanel receives range, totals, categories, dailySeries, resources and requestStatus. Derive used = sum(categories), percent = used / limit and remaining = limit - used. Category ratios explicitly state their denominator. Keep range-filtered detail separate from the capacity summary.

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

- This cycle / Previous / Week: Choose one reporting range and fetch its aggregate and series as a unit. Every label and chart refers to the same reporting range.
- Render / Explore / Compose / Export: Open category details or a labelled transaction filter. Filtered details; the overall capacity summary remains explicitly unfiltered.
- Daily rhythm bars: Reveal date and credits for the focused/hovered day; click opens that day’s detail. Date-specific detail with Back and persistent period selection.
- Collaborators · 6 of 8: Open collaborator management. Host members route, returning to the same period.
- Library · 2.4 of 4 GB: Open storage details. Host storage route; 60% usage derived from 2.4/4.
- Collections · 18 active: Open the collections list. Collections route; no fabricated utilization percentage.
- Manage plan: Open a labelled billing overview with current plan and verified options. Host billing route; this control does not charge the user.
- View data table / Clear filter: Provide textual chart values and remove a detail filter. Accessible series and consistent totals.
- Retry range: Retry the chosen period request. Confirmed data or a continued unavailable state.
- Close detail / Back to usage: Dismiss the category popover or plan dialog. Restore focus to the corresponding trigger without resetting range.
- Compare plans: Open the host verified plan catalogue. Plan comparison with its own loading, retry and Back paths; no automatic upgrade.
- View render activity: Open the host category transaction table for Render and the active range. Filtered activity; Back restores the same range and category.

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Input and motion

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

Animate bars from their previous validated value to the next over 220 ms, only after successful data loading. Never animate from zero on every scroll. Tooltip fades over 80 ms. Under reduced motion, values and widths update immediately. Chart motion is programmatic, not rendered video.

## Acceptance

- 3,200 + 1,600 + 960 + 480 = 6,240.
- 6,240 / 8,000 = 78%; remaining = 1,760.
- 6,240 / 30 = 208 per day.
- Capacity widths: 40 + 20 + 12 + 6 + 22 = 100%.
- Collections has no defined capacity limit.

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

- [Supabase — usage documentation](https://supabase.com/docs/guides/platform/manage-your-usage) — Kiln needs explicit units, denominator labels and category details. This is a structure reference, not a copied pricing model.
- [W3C — complex images and charts](https://www.w3.org/WAI/tutorials/images/complex/) — Kiln exposes a data table and values in text; hover tooltips are supplemental.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [W3C — modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Roam review and Kiln plan details need explicit close/cancel paths with trigger focus restoration.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.

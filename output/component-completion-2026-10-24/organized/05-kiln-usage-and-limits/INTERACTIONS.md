# Kiln · Usage & limits — full interaction specification

24 October 2026 · Version 3.2 · 8 control groups · 15 rendered states

[Readable guide](INTERACTIONS.html) · [Visual review](README.md) · [Structured specification](interactions.json)

A truthful period summary, activity breakdown and host billing entry point.

These are detailed implementation requirements for the six static studies. All 93 planned PNG/SVG states are mapped below. Generic hover/press combinations, every data permutation and additional host-only failure branches are specified in text rather than claimed as extra rendered images. No production behavior is implemented by this document.

## Initial fixture

June cycle: 6,240 / 8,000 credits (78%); 1,760 remaining; reset 1 July. Activity: Render 3,200, Explore 1,600, Compose 960, Export 480. Resources: seats 6/8, storage 2.4/4 GB, collections 18.

## Every control

### This cycle / Previous / Week

Control ID: `kiln.periods`

- **Semantics:** Manual tabs labelled Usage period
- **Click / tap:** Request the selected period; commit tab and data only after success.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Manual-tab contract. Focus alone never loads a period.
- **Pending / disabled:** Activation suppressed during a request; focused target remains visible.
- **Result:** Loading feedback with old data, then atomic new period/data or retained data plus Retry.
- **Return / dismiss:** Selecting the committed tab is a no-op; a failed target can be retried or replaced.
- **Announcement:** Announce Loading previous cycle, Usage updated, or Couldn’t load previous cycle.

### Usage / range Retry

Control ID: `kiln.usage-retry`

- **Semantics:** Button
- **Click / tap:** Retry requestedPeriod after range failure, or current period when no usage data exists.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** One request at a time; suppress repeat activation.
- **Result:** Success commits data; failure retains cached data or the unknown-value state.
- **Return / dismiss:** Focus stays on a stable status/action location; on success, if Retry disappears, focus the committed period tab.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Render / Explore / Compose / Export details

Control ID: `kiln.activity`

- **Semantics:** Button in each activity table row; named [activity] usage details
- **Click / tap:** Open a detail dialog for the committed period’s activity.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract plus modal contract.
- **Pending / disabled:** Available only when the activity value is known, including verified zero. Disable when data is missing.
- **Result:** Show activity name, credits, share and period; no invented event history.
- **Return / dismiss:** Close/Escape returns to the same activity control.
- **Announcement:** Dialog title and value provide context; no extra live-region repetition.

### Close usage detail

Control ID: `kiln.detail-close`

- **Semantics:** Icon button named Close usage detail
- **Click / tap:** Close the activity dialog.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract; Escape; modal contract.
- **Pending / disabled:** Always available inside the dialog.
- **Result:** Underlying period and all values remain unchanged.
- **Return / dismiss:** Focus returns to the activity details trigger; backdrop click does not dismiss.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Manage plan

Control ID: `kiln.manage`

- **Semantics:** Button
- **Click / tap:** Open billing details and begin the host plan read.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Deduplicate openings; modal is the single active overlay.
- **Result:** Loading plan details, then Studio / 8,000 credits per cycle, or plan error.
- **Return / dismiss:** Back/close returns to Manage plan.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Open billing settings

Control ID: `kiln.billing-open`

- **Semantics:** Button
- **Click / tap:** Navigate to the host’s authenticated billing settings.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract within modal.
- **Pending / disabled:** Available after valid plan details; suppress duplicate navigation while pending.
- **Result:** Host owns the settings page. No upgrade price, purchase or card entry happens in this component.
- **Return / dismiss:** If the host cannot open billing, retain the dialog and show its retryable error. Browser Back returns to the originating usage view.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Plan Retry

Control ID: `kiln.billing-retry`

- **Semantics:** Button
- **Click / tap:** Retry the failed billing details read or settings handoff, according to the failed operation.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Suppressed while pending.
- **Result:** Loading then valid plan details/settings, or same error.
- **Return / dismiss:** Back to usage remains available.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Billing close × / Back to usage

Control ID: `kiln.billing-dismiss`

- **Semantics:** Buttons; close named Close plan management
- **Click / tap:** Dismiss the billing modal and invalidate a pending plan read.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract; Escape; modal contract.
- **Pending / disabled:** Available during loading and errors; no outside-click dismissal.
- **Result:** Keep committed usage untouched. Late plan responses must not reopen the modal.
- **Return / dismiss:** Restore focus to Manage plan.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

## State transitions

### Usage & limits · default

`kiln-v2-default` · [View state](images/kiln-v2-default.png) · [Data](state-data/kiln-v2-default.json)

- **Entry:** Load or successfully commit the illustrated period’s data.
- **Exit / return:** Activate another period → loading; open known activity → detail; Manage plan → plans-loading/manage.
- **Focus:** Keep the initiating period tab focused after data commits.
- **Data / guard:** Total 6240; allowance 8000; 78.0%. Zero and near-limit are verified data fixtures.

### Previous billing cycle

`kiln-v2-previous` · [View state](images/kiln-v2-previous.png) · [Data](state-data/kiln-v2-previous.json)

- **Entry:** Load or successfully commit the illustrated period’s data.
- **Exit / return:** Activate another period → loading; open known activity → detail; Manage plan → plans-loading/manage.
- **Focus:** Keep the initiating period tab focused after data commits.
- **Data / guard:** Total 4800; allowance 8000; 60.0%. Zero and near-limit are verified data fixtures.

### This week usage

`kiln-v2-week` · [View state](images/kiln-v2-week.png) · [Data](state-data/kiln-v2-week.json)

- **Entry:** Load or successfully commit the illustrated period’s data.
- **Exit / return:** Activate another period → loading; open known activity → detail; Manage plan → plans-loading/manage.
- **Focus:** Keep the initiating period tab focused after data commits.
- **Data / guard:** Total 1400; allowance 8000; 17.5%. Weekly usage does not establish remaining cycle credits.

### Render usage detail

`kiln-v2-detail-render` · [View state](images/kiln-v2-detail-render.png) · [Data](state-data/kiln-v2-detail-render.json)

- **Entry:** Activate Render usage details in the current period.
- **Exit / return:** Close/Escape → same committed usage state. Other periods are inert behind the modal.
- **Focus:** Dialog heading on entry; trap focus; return to the originating activity button.
- **Data / guard:** Example detail values use June; implementation reads the committed period, never a hard-coded default.

### Explore usage detail

`kiln-v2-detail-explore` · [View state](images/kiln-v2-detail-explore.png) · [Data](state-data/kiln-v2-detail-explore.json)

- **Entry:** Activate Explore usage details in the current period.
- **Exit / return:** Close/Escape → same committed usage state. Other periods are inert behind the modal.
- **Focus:** Dialog heading on entry; trap focus; return to the originating activity button.
- **Data / guard:** Example detail values use June; implementation reads the committed period, never a hard-coded default.

### Compose usage detail

`kiln-v2-detail-compose` · [View state](images/kiln-v2-detail-compose.png) · [Data](state-data/kiln-v2-detail-compose.json)

- **Entry:** Activate Compose usage details in the current period.
- **Exit / return:** Close/Escape → same committed usage state. Other periods are inert behind the modal.
- **Focus:** Dialog heading on entry; trap focus; return to the originating activity button.
- **Data / guard:** Example detail values use June; implementation reads the committed period, never a hard-coded default.

### Export usage detail

`kiln-v2-detail-export` · [View state](images/kiln-v2-detail-export.png) · [Data](state-data/kiln-v2-detail-export.json)

- **Entry:** Activate Export usage details in the current period.
- **Exit / return:** Close/Escape → same committed usage state. Other periods are inert behind the modal.
- **Focus:** Dialog heading on entry; trap focus; return to the originating activity button.
- **Data / guard:** Example detail values use June; implementation reads the committed period, never a hard-coded default.

### Usage range loading

`kiln-v2-loading` · [View state](images/kiln-v2-loading.png) · [Data](state-data/kiln-v2-loading.json)

- **Entry:** Activate Previous from the June cycle.
- **Exit / return:** Success → previous; failure → error.
- **Focus:** Keep existing focus; if the recovery action disappears after success, focus the committed period tab.
- **Data / guard:** Loading/error retain June data. Missing uses em dashes while known resource counts remain visible.

### Usage range failed

`kiln-v2-error` · [View state](images/kiln-v2-error.png) · [Data](state-data/kiln-v2-error.json)

- **Entry:** Previous request fails while June is cached.
- **Exit / return:** Retry → loading; another period activation replaces the failed target.
- **Focus:** Keep existing focus; if the recovery action disappears after success, focus the committed period tab.
- **Data / guard:** Loading/error retain June data. Missing uses em dashes while known resource counts remain visible.

### Usage data unavailable

`kiln-v2-missing` · [View state](images/kiln-v2-missing.png) · [Data](state-data/kiln-v2-missing.json)

- **Entry:** Usage read fails without usable credit data.
- **Exit / return:** Retry → load the requested/current period; success → its usage, failure → missing.
- **Focus:** Keep existing focus; if the recovery action disappears after success, focus the committed period tab.
- **Data / guard:** Loading/error retain June data. Missing uses em dashes while known resource counts remain visible.

### Verified zero usage

`kiln-v2-zero` · [View state](images/kiln-v2-zero.png) · [Data](state-data/kiln-v2-zero.json)

- **Entry:** Load or successfully commit the illustrated period’s data.
- **Exit / return:** Activate another period → loading; open known activity → detail; Manage plan → plans-loading/manage.
- **Focus:** Keep the initiating period tab focused after data commits.
- **Data / guard:** Total 0; allowance 8000; 0.0%. Zero and near-limit are verified data fixtures.

### Near capacity

`kiln-v2-near-limit` · [View state](images/kiln-v2-near-limit.png) · [Data](state-data/kiln-v2-near-limit.json)

- **Entry:** Load or successfully commit the illustrated period’s data.
- **Exit / return:** Activate another period → loading; open known activity → detail; Manage plan → plans-loading/manage.
- **Focus:** Keep the initiating period tab focused after data commits.
- **Data / guard:** Total 7600; allowance 8000; 95.0%. Zero and near-limit are verified data fixtures.

### Plan management

`kiln-v2-manage` · [View state](images/kiln-v2-manage.png) · [Data](state-data/kiln-v2-manage.json)

- **Entry:** Host plan details load successfully.
- **Exit / return:** Open billing settings → host; close/Back/Escape → same usage.
- **Focus:** Dialog heading on entry; keep focus within modal; dismiss to Manage plan.
- **Data / guard:** Closing invalidates pending plan reads and never alters credit usage.

### Loading plan details

`kiln-v2-plans-loading` · [View state](images/kiln-v2-plans-loading.png) · [Data](state-data/kiln-v2-plans-loading.json)

- **Entry:** Activate Manage plan or Retry.
- **Exit / return:** Success → manage; failure → plans-error; close → usage.
- **Focus:** Dialog heading on entry; keep focus within modal; dismiss to Manage plan.
- **Data / guard:** Closing invalidates pending plan reads and never alters credit usage.

### Plan details unavailable

`kiln-v2-plans-error` · [View state](images/kiln-v2-plans-error.png) · [Data](state-data/kiln-v2-plans-error.json)

- **Entry:** Host plan read/settings handoff fails.
- **Exit / return:** Retry → plans-loading or host handoff; close/Back/Escape → usage.
- **Focus:** Dialog heading on entry; keep focus within modal; dismiss to Manage plan.
- **Data / guard:** Closing invalidates pending plan reads and never alters credit usage.

## Read-only content

The capacity meter, totals, table headings and resource summaries are read-only. There is no chart tooltip or resource-card navigation. Activity details are exposed through the row detail button, not through the numbers themselves.

## State model

- committedPeriod: cycle, previous or week; requestedPeriod; requestId
- usage: total, allowance, period dates, reset date and activity totals, or unknown
- resourceCounts: seats, storage and collections, independently loaded
- status: ready, loading or error; detailActivity; billingDialogStatus

## Persistence

- Commit a period label and its data together. Focus may move to another period without changing either. Keep resources independent from credit usage.
- Meter percentage is period total / cycle allowance. Weekly usage is not a remaining cycle balance. If actual cycle usage exceeds allowance, cap visual fill at 100%, show the true percentage and an explicit over-limit amount; that extension is not separately rendered.
- Activity shares use period total, rounded to one decimal; do not force a rounded sum to 100. At zero, shares are undefined (em dash). Missing and zero are different states.

Stable IDs, not visible labels, identify people, materials, cities, plans and routes. Async callbacks carry a request/version ID and cannot apply after cancellation, replacement or unmount. Server acknowledgements govern persistence and purchases. The per-state JSON fixtures are example inputs, not a backend schema.

## Async and edge cases

- While a new period loads keep committed labels/numbers visible, mark the usage region busy and deduplicate requests. Freeze period activation until the request settles; arrow focus may still move.
- Failure preserves committed values and requestedPeriod for Retry. A new explicit period activation after failure replaces that target. Ignore late responses from obsolete request IDs.
- If there is no usable usage response, show missing values and Retry; retain known resources. Do not substitute zero.
- Billing details and navigation are host-owned. Keep usage visible behind the modal while plan data loads or fails; never invent a price or payment method.

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

- Native study: 640 × 508. At narrow widths stack the metric suffix and resource summary while retaining table column headings.
- Activity detail is a modal dialog, not a chart tooltip. The table row has an explicit details button; numeric cells remain readable text.
- Progress fill is decorative beside an accessible numeric meter. Missing values use an unavailable label rather than an empty valid meter.

These are implementation requirements; additional responsive component exports are not included.

## Acceptance checks for future implementation

- This cycle totals 6,240 and fills exactly 78%; Previous totals 4,800 and fills 60%.
- Week totals 1,400, fills 17.5%, and never says 6,600 credits remaining.
- Missing usage shows unknown values; verified zero shows 0, empty fill and 8,000 remaining.
- Request Previous and fail: This cycle and all June numbers stay visible; Retry requests Previous.
- Open each activity detail: its value/share matches the current table and returns focus to its own row control.

## Primary references

Checked 24 October 2026. Timings and product behavior are study-specific decisions.

- [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WAI-ARIA APG: Radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Final audit clarifications

These rules clarify exceptional transitions without adding rendered image states. They take precedence where the earlier general rule needs a narrower condition.

- Validate totals and allowances before arithmetic: usage is finite and nonnegative; allowance must be finite and greater than zero to calculate a percentage. Invalid or unknown inputs show the missing-data treatment and Retry, never NaN, Infinity or a fabricated zero. Independently known resource values remain visible; unknown resource values use an em dash with an unavailable accessible label.

- At exactly 100%, show 0 credits remaining. Above the cycle allowance, cap fill at 100% but show the true percentage and “[amount] credits over limit”; do not show negative remaining credits. Weekly totals never imply a cycle balance. Over-limit and partially unavailable resources are documented variants without separate PNGs.

- If a usage response arrives while an activity dialog is open, preserve the dialog’s period/activity snapshot until it closes. Apply any newer committed table data together on return; never show a period heading from one response with amounts from another. Missing activity amounts disable only their details action. Zero totals keep amounts at zero and shares unavailable.

- A settings handoff has its own pending operation after plan details load. Keep the billing summary, suppress duplicate navigation, and retain Back. Failure shows the existing plan-error treatment; Retry repeats the failed operation, not a different billing request. A late callback after dismissal cannot navigate or reopen the modal.

[Rebuild reference](../REBUILD.md) · [Coverage and audit](../AUDIT.md)

# Roam · Plan selector — full interaction specification

24 October 2026 · Version 3.2 · 9 control groups · 15 rendered states

[Readable guide](INTERACTIONS.html) · [Visual review](README.md) · [Structured specification](interactions.json)

Compare a recurring plan, review it, and hand off to a host checkout without implying premature purchase.

These are detailed implementation requirements for the six static studies. All 93 planned PNG/SVG states are mapped below. Generic hover/press combinations, every data permutation and additional host-only failure branches are specified in text rather than claimed as extra rendered images. No production behavior is implemented by this document.

## Initial fixture

Everyday: $24/month, 20 GB, 3 devices. Weekender: $12/month, 5 GB, 1 device. Worldwide: $48/month, 50 GB, 5 devices. All show 120 destinations and monthly billing. These are design fixtures, not real offers.

## Every control

### Weekender / Everyday / Worldwide

Control ID: `roam.plans`

- **Semantics:** Manual tabs labelled Plan
- **Click / tap:** Activate the selected plan and update its entire content panel.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Manual-tab contract; Home/End supported. This deliberately uses tabs, not automatic-selection radios.
- **Pending / disabled:** Inert behind review; available on plans. On confirmation/account views, activating another tab returns to plans for that plan without changing membership.
- **Result:** One active tab; title, price, allowance, device count and Continue label update together.
- **Return / dismiss:** Switching plans has no billing side effect.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Continue with [plan]

Control ID: `roam.continue`

- **Semantics:** Button
- **Click / tap:** Open the selected plan’s review modal.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Only available on the comparison view; no request starts yet.
- **Result:** Focus the Review your plan heading; include plan, recurring amount, billing interval, GB, destinations and devices.
- **Return / dismiss:** Back, close or Escape returns to this Continue button.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Continue to checkout / Retry

Control ID: `roam.checkout`

- **Semantics:** Button inside review dialog
- **Click / tap:** Start or retry the host checkout-session handoff.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract within modal.
- **Pending / disabled:** aria-disabled while pending; keep focus and suppress duplicate submissions.
- **Result:** Starting checkout; host session success navigates; failure keeps review open with Retry.
- **Return / dismiss:** Back returns to comparison; close cancels local waiting without claiming financial reversal.
- **Announcement:** Announce Starting checkout or Checkout could not start; never announce purchase success from session creation.

### Review close × / Back to plans

Control ID: `roam.review-dismiss`

- **Semantics:** Close button named Close plan review; text Back button
- **Click / tap:** Dismiss review and preserve the selected comparison plan.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract; Escape also dismisses; modal focus contract.
- **Pending / disabled:** Available during local session creation; invalidate pending navigation callbacks when dismissed.
- **Result:** Return to plans; a clear pre-purchase cancellation may show the cancelled notice.
- **Return / dismiss:** Restore focus to Continue with the same plan. Backdrop clicks do nothing.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Manage membership

Control ID: `roam.manage`

- **Semantics:** Button on verified confirmation
- **Click / tap:** Request host membership management.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Debounce repeated handoffs. Keep confirmed membership data while awaiting host response.
- **Result:** Authenticated host opens membership settings; unauthenticated → sign-in handoff; failed account read → account error.
- **Return / dismiss:** Remember confirmation as the account return view.
- **Announcement:** Announce account unavailability only on failure; navigation success is handled by the host.

### Confirmation: Back to plans

Control ID: `roam.confirmed-back`

- **Semantics:** Button
- **Click / tap:** Return to comparison for the confirmed plan.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Available after confirmation.
- **Result:** Plan selector remains consistent; membership is neither cancelled nor changed.
- **Return / dismiss:** Focus the selected plan tab.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Sign in

Control ID: `roam.sign-in`

- **Semantics:** Button launching host authentication
- **Click / tap:** Launch the host sign-in flow, keeping the intended membership destination.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Deduplicate launches; no inline credentials are collected.
- **Result:** Host success resumes membership settings; cancellation returns to this sign-in view.
- **Return / dismiss:** Back returns to the saved account return view.
- **Announcement:** The host supplies authentication outcomes; do not manufacture a signed-in identity.

### Membership Retry

Control ID: `roam.account-retry`

- **Semantics:** Button
- **Click / tap:** Retry fetching or opening the host membership account.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Suppress repeated requests while pending; retain the error context until a result.
- **Result:** Host success opens settings; authentication required → sign-in; repeated failure stays retryable.
- **Return / dismiss:** Back returns to the saved confirmation or plan view.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Account Back

Control ID: `roam.account-back`

- **Semantics:** Button
- **Click / tap:** Leave the account handoff/error and restore accountReturnView.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Available when host navigation has not already taken over.
- **Result:** Restore confirmed plan when entered from Manage membership; otherwise restore comparison.
- **Return / dismiss:** Focus Manage membership or the selected plan tab, whichever opened the account flow.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

## State transitions

### Plan selector · default

`roam-v2-default` · [View state](images/roam-v2-default.png) · [Data](state-data/roam-v2-default.json)

- **Entry:** Activate Everyday or load its comparison view.
- **Exit / return:** Continue → review-everyday; another tab → its plan; no purchase happens on tab selection.
- **Focus:** Selected plan tab or Continue button, according to the trigger.
- **Data / guard:** $24/month, 20 GB, 3 device(s), billed monthly.

### Weekender plan

`roam-v2-weekender` · [View state](images/roam-v2-weekender.png) · [Data](state-data/roam-v2-weekender.json)

- **Entry:** Activate Weekender or load its comparison view.
- **Exit / return:** Continue → review-weekender; another tab → its plan; no purchase happens on tab selection.
- **Focus:** Selected plan tab or Continue button, according to the trigger.
- **Data / guard:** $12/month, 5 GB, 1 device(s), billed monthly.

### Review Weekender

`roam-v2-review-weekender` · [View state](images/roam-v2-review-weekender.png) · [Data](state-data/roam-v2-review-weekender.json)

- **Entry:** Continue with Weekender.
- **Exit / return:** Continue to checkout → pending host attempt; error → retry review; Back/close/Escape → weekender.
- **Focus:** Review heading on entry; trap focus; return to Continue on dismissal.
- **Data / guard:** The same review contract applies to every plan; only Everyday pending/error is separately rendered.

### Weekender confirmed

`roam-v2-confirmed-weekender` · [View state](images/roam-v2-confirmed-weekender.png) · [Data](state-data/roam-v2-confirmed-weekender.json)

- **Entry:** Host confirms completed activation of Weekender.
- **Exit / return:** Manage membership → host settings, sign-in or account error; Back to plans → weekender.
- **Focus:** Plan activated heading on entry; subsequent Tab reaches Manage membership.
- **Data / guard:** Never reach this state merely from creating a checkout session.

### Review Everyday

`roam-v2-review-everyday` · [View state](images/roam-v2-review-everyday.png) · [Data](state-data/roam-v2-review-everyday.json)

- **Entry:** Continue with Everyday.
- **Exit / return:** Continue to checkout → pending host attempt; error → retry review; Back/close/Escape → default.
- **Focus:** Review heading on entry; trap focus; return to Continue on dismissal.
- **Data / guard:** The same review contract applies to every plan; only Everyday pending/error is separately rendered.

### Everyday confirmed

`roam-v2-confirmed-everyday` · [View state](images/roam-v2-confirmed-everyday.png) · [Data](state-data/roam-v2-confirmed-everyday.json)

- **Entry:** Host confirms completed activation of Everyday.
- **Exit / return:** Manage membership → host settings, sign-in or account error; Back to plans → default.
- **Focus:** Plan activated heading on entry; subsequent Tab reaches Manage membership.
- **Data / guard:** Never reach this state merely from creating a checkout session.

### Worldwide plan

`roam-v2-worldwide` · [View state](images/roam-v2-worldwide.png) · [Data](state-data/roam-v2-worldwide.json)

- **Entry:** Activate Worldwide or load its comparison view.
- **Exit / return:** Continue → review-worldwide; another tab → its plan; no purchase happens on tab selection.
- **Focus:** Selected plan tab or Continue button, according to the trigger.
- **Data / guard:** $48/month, 50 GB, 5 device(s), billed monthly.

### Review Worldwide

`roam-v2-review-worldwide` · [View state](images/roam-v2-review-worldwide.png) · [Data](state-data/roam-v2-review-worldwide.json)

- **Entry:** Continue with Worldwide.
- **Exit / return:** Continue to checkout → pending host attempt; error → retry review; Back/close/Escape → worldwide.
- **Focus:** Review heading on entry; trap focus; return to Continue on dismissal.
- **Data / guard:** The same review contract applies to every plan; only Everyday pending/error is separately rendered.

### Worldwide confirmed

`roam-v2-confirmed-worldwide` · [View state](images/roam-v2-confirmed-worldwide.png) · [Data](state-data/roam-v2-confirmed-worldwide.json)

- **Entry:** Host confirms completed activation of Worldwide.
- **Exit / return:** Manage membership → host settings, sign-in or account error; Back to plans → worldwide.
- **Focus:** Plan activated heading on entry; subsequent Tab reaches Manage membership.
- **Data / guard:** Never reach this state merely from creating a checkout session.

### Checkout pending

`roam-v2-checkout-pending` · [View state](images/roam-v2-checkout-pending.png) · [Data](state-data/roam-v2-checkout-pending.json)

- **Entry:** Start Everyday checkout; session creation is pending.
- **Exit / return:** pending → host checkout or checkout-error; error → Retry/pending; dismissal → preserved comparison.
- **Focus:** Keep focus on checkout/Retry inside the modal.
- **Data / guard:** No purchase/activation has been confirmed. Dismissal invalidates late navigation callbacks.

### Checkout failed

`roam-v2-checkout-error` · [View state](images/roam-v2-checkout-error.png) · [Data](state-data/roam-v2-checkout-error.json)

- **Entry:** Start Everyday checkout; session creation fails.
- **Exit / return:** pending → host checkout or checkout-error; error → Retry/pending; dismissal → preserved comparison.
- **Focus:** Keep focus on checkout/Retry inside the modal.
- **Data / guard:** No purchase/activation has been confirmed. Dismissal invalidates late navigation callbacks.

### Checkout cancelled

`roam-v2-cancelled` · [View state](images/roam-v2-cancelled.png) · [Data](state-data/roam-v2-cancelled.json)

- **Entry:** A pre-purchase flow is explicitly abandoned or the host confirms cancellation.
- **Exit / return:** Continue → review-everyday; another tab changes comparison. Clear the notice on the next plan/review action.
- **Focus:** Return to Continue with Everyday.
- **Data / guard:** The No purchase made sentence is prohibited for an unknown payment outcome.

### Sign in to manage membership

`roam-v2-account-sign-in` · [View state](images/roam-v2-account-sign-in.png) · [Data](state-data/roam-v2-account-sign-in.json)

- **Entry:** Manage membership requires authentication.
- **Exit / return:** Sign in → host authentication/settings; cancel host auth → same state; Back → recorded account return view.
- **Focus:** Sign-in heading on entry, then Sign in/Back in normal order.

### Membership unavailable

`roam-v2-account-error` · [View state](images/roam-v2-account-error.png) · [Data](state-data/roam-v2-account-error.json)

- **Entry:** Host account details or settings handoff fails.
- **Exit / return:** Retry → host request, success → settings; auth required → account-sign-in; Back → recorded return view.
- **Focus:** Error heading on entry; keep Retry focus after repeated failure.

### Plan keyboard focus

`roam-v2-focus` · [View state](images/roam-v2-focus.png) · [Data](state-data/roam-v2-focus.json)

- **Entry:** Move plan-tab focus to Worldwide while Everyday remains selected.
- **Exit / return:** Enter/Space → worldwide; other focus movement leaves Everyday selected.
- **Focus:** Worldwide has an outline; Everyday retains the active surface.
- **Data / guard:** Price remains $24 and allowance 20 GB until activation.

## Read-only content

Price, allowance badge, benefit rows and the roam wordmark are read-only. The decorative ribbon has no click or drag behavior. Only explicit tabs and actions affect the flow.

## State model

- selectedPlanId: weekender, everyday or worldwide
- view: plans, review, confirmed, accountSignIn or accountError
- checkoutStatus: idle, pending, reconciling, uncertain or error; checkoutAttemptId; confirmedPlanId
- accountReturnView; dialogTrigger; cancellationNotice

## Persistence

- Plan selection persists across review, cancellation and account handoff. Review snapshots the selected plan so every label and the checkout payload agree.
- Confirmed plan identity comes from a verified host result, not from whichever tab the user last focused. Back to plans preserves that confirmed plan as the selected comparison tab.
- No payment data, credential fields, tax estimate or account identity is invented by this component. The host owns checkout, billing and sign-in.

Stable IDs, not visible labels, identify people, materials, cities, plans and routes. Async callbacks carry a request/version ID and cannot apply after cancellation, replacement or unmount. Server acknowledgements govern persistence and purchases. The per-state JSON fixtures are example inputs, not a backend schema.

## Async and edge cases

- Continue to checkout starts one attempt with a stable idempotency key; retry reuses the same attempt identity until its outcome is known. A successful session creation navigates to the host checkout; it is not Plan activated.
- Show Plan activated only after the host confirms a completed activation for the matching plan. Failure, timeout, leaving the dialog or returning without a confirmed result never produces success.
- Close/Back during session creation cancels local waiting and invalidates navigation callbacks. It does not claim to reverse a purchase; the host must reconcile uncertain transaction outcomes before allowing another attempt.
- The No purchase made notice is valid only for an explicitly abandoned pre-purchase flow or a host-confirmed cancelled checkout. Ambiguous outcomes require a host status check; there is no separate ambiguous-outcome PNG.

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

- Native study: 400 × 544. Keep the three plan tabs in fixed order and the primary action full width.
- Review is a modal dialog: background is inert, dialog scrolls internally if necessary, actions stay reachable. Do not dismiss on backdrop click.
- At small heights keep the dialog inside 16 px viewport margins; allow content scrolling without clipping close, Back or price.

These are implementation requirements; additional responsive component exports are not included.

## Acceptance checks for future implementation

- Focus Worldwide while Everyday is current: price stays $24 and allowance 20 GB until activation.
- Choose Weekender then Review: title, $12/month, 5 GB and 1 device all agree.
- Create a checkout session successfully: navigate to the host; do not show Plan activated yet.
- Retry after a network failure must not create duplicate purchases; only verified activation shows confirmation.

## Primary references

Checked 24 October 2026. Timings and product behavior are study-specific decisions.

- [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WAI-ARIA APG: Radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Final audit clarifications

These rules clarify exceptional transitions without adding rendered image states. They take precedence where the earlier general rule needs a narrower condition.

- An unknown checkout outcome is an explicit documented state. Keep the review summary and plan identity, show “Checking checkout status…”, and disable purchase submission while the host reconciles the existing attempt. Do not create another attempt or announce activation/cancellation from a timeout.

- If reconciliation also fails, show “We couldn’t confirm checkout” with Check status and Back to plans. Check status retries the same attempt lookup; it does not create a checkout session. Keep focus on the triggering action, announce status once, and restore Continue on dismissal. Reopening review resumes reconciliation for that attempt before allowing checkout. Confirmed activation enters the matching confirmed image; confirmed non-completion permits retry with the host’s same-attempt/idempotency contract; confirmed cancellation may show “No purchase made”. These exceptional states have no separate PNG.

- Account and authentication handoffs have a pending state: retain the current summary and accessible action label, expose busy status, and suppress repeat launches. Back invalidates local callbacks before the host takes over; returned authentication cancellation restores the same sign-in view. Authenticated settings and payment entry belong to the host, with return destinations supplied by the integration.

- Plan IDs, prices, allowances and devices must arrive as one valid record. A missing or malformed host plan record must not fall back to a different paid plan or fabricate a price; retain a valid cached record if present, otherwise show an unavailable plan message with host retry. The three supplied plan records are valid fixtures, not live commercial offers.

[Rebuild reference](../REBUILD.md) · [Coverage and audit](../AUDIT.md)

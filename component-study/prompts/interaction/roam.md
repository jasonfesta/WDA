# Roam / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the membership panel using the [five-state ledger](../../interaction/roam.md), [original artwork](../../references/originals/roam.png) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

Tall ivory panel, serif headline, coral ribbon, warm feature cells and a burgundy CTA. Give plan changes space; the whole panel should not jump in height.

DM Serif Display for editorial headings; Inter for prices, tabs, features and buttons. These are proposed implementation mappings, not verified raster font identities.

## Screens and transitions

- **01-everyday / Everyday plan** — [image](../../images/states/roam/01-everyday.png). Everyday selected; $24/month and its four original benefits.
- **02-weekender / Weekender plan** — [image](../../images/states/roam/02-weekender.png). Weekender, $12/month; Weekend travel data, One local number, Your personal plan, A private connection; matching CTA.
- **03-worldwide / Worldwide plan** — [image](../../images/states/roam/03-worldwide.png). Worldwide, $48/month; Data across borders, Local-number options, Share with four people, A private connection; matching CTA.
- **04-review / Review chosen plan** — [image](../../images/states/roam/04-review.png). Review your plan dialog; Everyday, $24/month, Billed monthly; Continue to checkout, Back to plans, Close.
- **05-confirmed / Confirmation** — [image](../../images/states/roam/05-confirmed.png). You’re ready to roam; Everyday $24/month; Manage membership and Back to plans.

- Weekender $12 and Worldwide $48 with their new benefit copy are proposed design fixtures. Everyday $24 is inherited from the original. None is a verified purchasable product. Production must inject a verified catalogue, currency, availability and tax treatment.
- Choosing Weekender or Worldwide uses the same review-dialog layout as image 04, populated with that plan’s ID, price and benefits. Confirmation uses image 05’s grammar with the verified purchased plan. Do not silently switch their checkout to Everyday.
- Continue enters pending, disables repeat submission and asks the host for a checkout session. Failure remains in review with Checkout could not start, Retry and Back. Closing or checkout cancellation returns to the selected plan. Only verified host completion shows confirmation; URL parameters alone cannot confirm payment.
- Manage membership opens the authenticated account route. Unauthorized access opens sign-in with a return destination; unavailable account data shows Retry and Back. Feature tiles are read-only; no hover-only hidden feature interactions.

## State ownership

MembershipPanel receives plansById, selectedPlanId, checkoutStatus and onPlanChange/onReview/onCheckout. Plan objects own price, billing interval, benefits and availability. Keep the displayed price and server checkout price linked to the same plan version. Review and error are explicit states.

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

- Weekender / Everyday / Worldwide: Select a plan preview from canonical plan data. Plan heading, price, benefits and CTA update together.
- Choose selected plan: Validate availability then open a review of the selected plan. Plan review; no purchase is made from selection alone.
- Four feature tiles: Read the four benefits for the selected plan. These tiles are static information. Benefits remain tied to the selected plan.
- Continue to checkout: Create checkout for the reviewed plan ID and confirmed price. Checkout destination or inline error; server verifies all prices.
- Cancel / Back to plans: Close review or error without changing the selected plan. Original plan panel preserved.
- Retry checkout: Retry only the failed session-creation request. Checkout or actionable error.
- Manage membership: Open the authenticated host membership account. Membership account or sign-in with a return destination; Back returns to confirmation.
- Close review ×: Dismiss review without starting checkout. Return to the selected plan and focus Choose.

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Input and motion

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

Crossfade plan copy and artwork in 180 ms after activation; reserve the maximum content height to prevent jumps. The hero ribbon may have a single subtle 3° turn on entry, never continuous movement near price text. Feature objects remain still until a detail interaction.

## Acceptance

- Everyday $24, Weekender $12 and Worldwide $48 are review fixtures, not live offers.
- Plan heading, price, benefits, review and confirmation derive from the same plan ID.
- A repeated click cannot create duplicate checkout requests.
- Confirmation follows verified completion, never merely a Continue click.

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [Stripe — subscription pricing table](https://docs.stripe.com/payments/checkout/pricing-table) — Roam previews and compares plans, then explicitly reviews the chosen price. Selection alone does not subscribe.
- [W3C — modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Roam review and Kiln plan details need explicit close/cancel paths with trigger focus restoration.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.

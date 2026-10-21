# Folio / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the navigation dock using the [five-state ledger](../../interaction/folio.md), [original artwork](../../references/originals/folio.png) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

Wide shallow ivory dock, pale citron active capsule, coral studio house, cocoa line icons and a burgundy current-state dot. Keep every destination labelled.

Inter for four consistently sized navigation labels.

## Screens and transitions

- **01-studio / Studio** — [image](../../images/states/folio/01-studio.png). Studio alone has the citron active capsule and burgundy dot.
- **02-explore / Explore** — [image](../../images/states/folio/02-explore.png). Explore alone has the active capsule and dot; icon order and dock geometry stay fixed.
- **03-saved / Saved** — [image](../../images/states/folio/03-saved.png). Saved alone is current. The host content may show saved items or an empty collection.
- **04-profile / Profile** — [image](../../images/states/folio/04-profile.png). Profile alone is current. Account/sign-in content is owned by the host.
- **05-keyboard-focus / Focus without navigation** — [image](../../images/states/folio/05-keyboard-focus.png). Studio keeps the only active capsule and dot; Profile has an outline only.

- Native links preserve browser Back/Forward, modified clicks and deep links. Active state derives from committed route; nested saved-item routes remain under Saved. The dock does not replace route content in the host.
- Saved empty content offers Browse Explore. Profile signed out offers sign-in with returnTo=/profile; cancel and completion both return there. Loading and error feedback live in the host content without changing item order.
- During pending navigation retain the last committed active marker and show an accessible loading label in host content. A failed route leaves the old marker and Retry; successful commit moves the marker and focuses the new page heading. Hover and focus never commit navigation.
- All four icons and labels activate their enclosing link; divider, shell and active dot are decorative. On mobile reserve dock space so it cannot obscure page content; use safe-area padding in implementation without adding OS chrome to artwork.

## State ownership

NavigationDock receives items with stable IDs/hrefs and currentPath. Derive current item from router state, not independent button state. Preserve query parameters and route history. The host owns auth and async route loading; dock reflects their results.

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

- Studio: Navigate to /studio; update active treatment only when the route commits. Exactly one aria-current link and matching route content.
- Explore: Navigate to /explore; update active treatment only when the route commits. Exactly one aria-current link and matching route content.
- Saved: Navigate to /saved; update active treatment only when the route commits. Exactly one aria-current link and matching route content.
- Profile: Navigate to /profile; update active treatment only when the route commits. Exactly one aria-current link and matching route content.
- Browse Explore from empty Saved: Navigate to Explore from a clearly labelled empty state. Explore selected; Back returns to Saved.
- Sign in / Cancel: Open sign-in with returnTo=/profile; preserve intent. Return to Profile after completion or cancellation.
- Retry destination: Retry a failed route while preserving the last successful route. Successful destination becomes the only current item.

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Input and motion

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

Move the active capsule between equal-width destination slots over 180 ms after a route commit. The coral house may settle by 2px once on Studio entry; other line icons do not morph into invented objects. Under reduced motion, swap the active treatment instantly.

## Acceptance

- Exactly four destinations in fixed order.
- One current item, one active dot and matching content.
- Hover/focus never change the current route.
- Browser Back restores the prior active item.

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

- [MDN — aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current) — Folio uses navigation links and aria-current="page" for routes. Use tabs only if switching local panels.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.

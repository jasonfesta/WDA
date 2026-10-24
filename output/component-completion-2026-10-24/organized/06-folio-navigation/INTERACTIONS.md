# Folio · Navigation dock — full interaction specification

24 October 2026 · Version 3.2 · 5 control groups · 10 rendered states

[Readable guide](INTERACTIONS.html) · [Visual review](README.md) · [Structured specification](interactions.json)

Four primary routes with clear current, focused and pending states.

These are detailed implementation requirements for the six static studies. All 93 planned PNG/SVG states are mapped below. Generic hover/press combinations, every data permutation and additional host-only failure branches are specified in text rather than claimed as extra rendered images. No production behavior is implemented by this document.

## Initial fixture

Studio is current. Route order never changes: Studio, Explore, Saved, Profile. Saved empty and signed-out Profile are valid loaded routes.

## Every control

### Studio / Explore / Saved / Profile

Control ID: `folio.routes`

- **Semantics:** Four links in navigation landmark labelled Primary; exactly one aria-current=page
- **Click / tap:** Unmodified activation starts host navigation. Current-route activation is a no-op when idle; if another destination is pending, it cancels that pending attempt. Preserve native modifier/new-tab behavior.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Link contract: Tab/Shift+Tab, Enter. No roving tab index or radio-style arrows; Space retains native page-scroll behavior.
- **Pending / disabled:** Keep links available during navigation so a new target can supersede the pending one.
- **Result:** Pending/error stays outside dock; commit highlight only with route success.
- **Return / dismiss:** Host history restores prior routes. On success focus the destination main heading.
- **Announcement:** Host status region announces Loading Explore or Couldn’t open Explore; current route is exposed by aria-current.

### Route Retry

Control ID: `folio.retry`

- **Semantics:** Button in host status strip
- **Click / tap:** Retry the failed pendingRoute, preserving currentRoute.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** aria-disabled while retrying; other navigation links remain usable.
- **Result:** Success commits destination; failure retains old route and Retry.
- **Return / dismiss:** Choosing any other link supersedes this error/request.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Browse Explore

Control ID: `folio.browse`

- **Semantics:** Link in empty Saved content
- **Click / tap:** Navigate to Explore using the normal router contract.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Link contract.
- **Pending / disabled:** No special disabled state; duplicate pending target is deduplicated.
- **Result:** Saved stays current until Explore succeeds.
- **Return / dismiss:** Failure uses the same host retry strip while retaining Saved.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Sign in

Control ID: `folio.sign-in`

- **Semantics:** Button in signed-out Profile content
- **Click / tap:** Open host authentication with return destination Profile.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Suppress duplicate authentication launches.
- **Result:** Successful authentication refreshes Profile content; cancelled authentication retains signed-out Profile.
- **Return / dismiss:** Auth failure is shown by the host sign-in flow; no credentials are collected by the dock.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Cancel in signed-out Profile

Control ID: `folio.cancel`

- **Semantics:** Button
- **Click / tap:** Return to previousSuccessfulRoute; use Studio if none is available.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Available while no external auth flow owns the screen.
- **Result:** Use normal pending/success routing; Profile stays current until the return route commits.
- **Return / dismiss:** Focus the returned page heading. This does not sign the user out or erase saved items.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

## State transitions

### Navigation dock · default

`folio-v2-default` · [View state](images/folio-v2-default.png) · [Data](state-data/folio-v2-default.json)

- **Entry:** Router successfully commits Studio.
- **Exit / return:** Activate another link → route pending; success commits it, failure retains current route.
- **Focus:** Destination main heading on client-side success; browser history uses host restoration.
- **Data / guard:** One current route; fixed order and labels.

### Explore current

`folio-v2-explore` · [View state](images/folio-v2-explore.png) · [Data](state-data/folio-v2-explore.json)

- **Entry:** Router successfully commits Explore.
- **Exit / return:** Activate another link → route pending; success commits it, failure retains current route.
- **Focus:** Destination main heading on client-side success; browser history uses host restoration.
- **Data / guard:** One current route; fixed order and labels.

### Saved current

`folio-v2-saved` · [View state](images/folio-v2-saved.png) · [Data](state-data/folio-v2-saved.json)

- **Entry:** Router successfully commits Saved.
- **Exit / return:** Activate another link → route pending; success commits it, failure retains current route.
- **Focus:** Destination main heading on client-side success; browser history uses host restoration.
- **Data / guard:** One current route; fixed order and labels.

### Profile current

`folio-v2-profile` · [View state](images/folio-v2-profile.png) · [Data](state-data/folio-v2-profile.json)

- **Entry:** Router successfully commits Profile.
- **Exit / return:** Activate another link → route pending; success commits it, failure retains current route.
- **Focus:** Destination main heading on client-side success; browser history uses host restoration.
- **Data / guard:** One current route; fixed order and labels.

### Keyboard focus on Saved

`folio-v2-focus` · [View state](images/folio-v2-focus.png) · [Data](state-data/folio-v2-focus.json)

- **Entry:** Focus Saved with keyboard.
- **Exit / return:** Activate the target → pending; leave target → remove transient styling.
- **Focus:** Saved outline only for keyboard focus; hover never moves focus.
- **Data / guard:** Studio remains current. Neither transient state changes history or fetches content.

### Explore hover

`folio-v2-hover` · [View state](images/folio-v2-hover.png) · [Data](state-data/folio-v2-hover.json)

- **Entry:** Hover Explore with pointer.
- **Exit / return:** Activate the target → pending; leave target → remove transient styling.
- **Focus:** Saved outline only for keyboard focus; hover never moves focus.
- **Data / guard:** Studio remains current. Neither transient state changes history or fetches content.

### Explore route loading

`folio-v2-pending` · [View state](images/folio-v2-pending.png) · [Data](state-data/folio-v2-pending.json)

- **Entry:** Request Explore from Studio; navigation is pending.
- **Exit / return:** pending → explore on success or error; error → Retry/pending; another link supersedes the attempt.
- **Focus:** Keep activated link or Retry focus until navigation succeeds; then destination heading.
- **Data / guard:** Studio stays current and host feedback appears above the dock.

### Explore route failed

`folio-v2-error` · [View state](images/folio-v2-error.png) · [Data](state-data/folio-v2-error.json)

- **Entry:** Request Explore from Studio; navigation fails.
- **Exit / return:** pending → explore on success or error; error → Retry/pending; another link supersedes the attempt.
- **Focus:** Keep activated link or Retry focus until navigation succeeds; then destination heading.
- **Data / guard:** Studio stays current and host feedback appears above the dock.

### Saved has no items

`folio-v2-saved-empty` · [View state](images/folio-v2-saved-empty.png) · [Data](state-data/folio-v2-saved-empty.json)

- **Entry:** Saved route succeeds with an empty collection.
- **Exit / return:** Browse Explore → normal Explore navigation; any dock link follows normal routing.
- **Focus:** Saved page heading on route entry.
- **Data / guard:** Empty content is a successful Saved route, not a loading/error state.

### Profile signed out

`folio-v2-profile-signed-out` · [View state](images/folio-v2-profile-signed-out.png) · [Data](state-data/folio-v2-profile-signed-out.json)

- **Entry:** Profile route succeeds but has no authenticated session.
- **Exit / return:** Sign in → host auth then Profile; Cancel → previous successful route, Studio in the fixture; other dock links work.
- **Focus:** Profile page heading, followed by Sign in and Cancel in content order.
- **Data / guard:** Profile is current despite being signed out; the dock never collects credentials.

## Read-only content

Each icon and visible label form one link target. The active dot is decorative. The dock shell and gaps are not clickable, and destinations cannot be dragged or reordered.

## State model

- currentRoute: studio, explore, saved or profile
- pendingRoute, navigationRequestId, navigationError
- previousSuccessfulRoute; hostContentState; signInReturnRoute
- hoverTarget and focusTarget are transient visual state only

## Persistence

- Derive currentRoute from the successfully committed router location. Do not infer it from hover, focus or the last attempted click.
- Use actual links with host-provided hrefs; preserve open-in-new-tab, copy-link, browser Back and Forward behavior. Modifier clicks do not change the current tab’s active marker.
- The host owns page content, authentication and history. Dock order and labels stay stable across account and empty states.

Stable IDs, not visible labels, identify people, materials, cities, plans and routes. Async callbacks carry a request/version ID and cannot apply after cancellation, replacement or unmount. Server acknowledgements govern persistence and purchases. The per-state JSON fixtures are example inputs, not a backend schema.

## Async and edge cases

- Keep the current route highlighted while another route loads. Put pending/error messages in the host content strip, outside the dock.
- A new unmodified navigation can supersede a pending one; abort or ignore the old request. Only the latest successful route commits.
- On failure stay on the last successful route and show Retry for the failed target. Do not remove access to the other links.
- After a successful client-side route change, move focus to the destination main heading. Back/Forward uses host scroll/focus restoration and must not force focus back to the dock.

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

- Native dock: 560 × 96; with status strip: 560 × 174. Use four equal columns and visible labels at narrow widths.
- If fixed to a mobile viewport, respect the safe-area inset and reserve content space beneath the page so the dock cannot cover the last action.
- Current fill/dot, neutral hover and outer focus ring remain distinct. Icons are decorative alongside text.

These are implementation requirements; additional responsive component exports are not included.

## Acceptance checks for future implementation

- Focus Saved while Studio is current: only Studio retains current styling and aria-current.
- Open Explore and fail: Studio remains current; Retry targets Explore.
- Navigate to empty Saved: Saved becomes current and Browse Explore is available in host content.
- Reach signed-out Profile: Profile is current; Sign in resumes Profile; Cancel returns to the previous successful route (Studio in the fixture).
- Use modifier-click or keyboard open-in-new-tab: preserve native link behavior without activating this tab’s pending UI.

## Primary references

Checked 24 October 2026. Timings and product behavior are study-specific decisions.

- [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WAI-ARIA APG: Radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Final audit clarifications

These rules clarify exceptional transitions without adding rendered image states. They take precedence where the earlier general rule needs a narrower condition.

- Activating the current route is a no-op only when idle. If another route is pending, an unmodified activation of the current link cancels that pending attempt, clears its transient status/error and keeps the current page. Ignore late completion of the cancelled target. Modifier clicks still retain native link behavior.

- Deduplicate repeated activation of the same pending destination. A different destination supersedes it. A browser Back/Forward event cancels incompatible local pending requests before the router restores the committed route, scroll and focus.

- The host authentication flow owns its pending, error and credential states. Sign-in cancellation returns to signed-out Profile; the separate Cancel action in Profile routes back to the previously successful page. These are different cancellations. Keep exactly one current-route marker throughout and announce each outcome only once.

[Rebuild reference](../REBUILD.md) · [Coverage and audit](../AUDIT.md)

# WDA / Component React handoff

Jason Festa · 21 October 2026

This package is a visual and interaction study. The review explorer is plain HTML/JavaScript and works offline. It is not a shipped React component library. The six implementation prompts define the next build.

## Boundaries

Use live DOM text, semantic controls and data-driven SVG/CSS. Keep textures and 3D accents as independent decorative layers. Preserve the original hierarchy while reflowing the component at narrow widths; never resize raster text into a tiny touch target. Image canvases preserve natural silhouettes and raster aspect ratios. Presentation margins are not an implementation requirement. A closed picker has a shorter natural footprint than its open state.

## State architecture

Keep one authoritative object for each logical selection: selected IDs for people, selected material ID for palette, selected plan ID for membership, selected date/unit for weather, reporting range/data for usage, router location for navigation. Derived counts, labels, totals and active treatment are not independent state. See [React state guidance](https://react.dev/learn/choosing-the-state-structure).

Separate idle/loading/success/error where an external operation exists. Preserve the last confirmed state and distinguish a pending optimistic selection from saved data. Prevent duplicate actions, provide retry and cancel paths, and restore focus after closing a dialog. Use deterministic study fixtures locally; production requires verified endpoints and business prices.

## Component boundaries and data contracts

| Component | Inputs | Events | Owned by the host |
| --- | --- | --- | --- |
| WeatherCard | location, forecastByDate, selectedDate, unit, status | dateChange, unitChange, locationChange, retry | Weather provider, cache and location permission |
| TeamPicker | people, selectedIds, open, saveStatus | openChange, selectionChange, retry, revert | Membership access and persistence |
| MaterialPalette | materials, selectedMaterialId, previousSnapshot | select, shuffle, undo | Palette library and project application |
| MembershipPanel | plansById, selectedPlanId, checkoutStatus | planChange, review, checkout, cancel | Verified price catalogue and payment session |
| UsagePanel | range, categories, dailySeries, resources, requestStatus | rangeChange, inspect, retry, manage | Billing periods, totals and authorized account routes |
| NavigationDock | items, currentPath, navigationStatus | normal link navigation | Router, authentication and route content |

## Input parity

Hover previews affordance, never commits data. Touch performs the same action on tap. Keyboard focus is distinct from active state. Prefer native controls, tested popover/dialog primitives and accurate accessible names. Minimum 44 × 44 CSS-pixel hit areas are the study’s design target. Keep labels visible at 200% text zoom. Every popup has a dismissal path and focus return. Loading and save results use concise polite live announcements.

Sol day panels, Roam plan previews and Kiln periods use tabs. Courtyard materials use radios. Gather uses checkboxes inside a controlled popover. Folio uses route links with aria-current; do not give route links an incomplete tab pattern.

## Motion

Use CSS for small state changes; use Motion for coordinated layout only where it earns its cost. Respect prefers-reduced-motion and the host setting. Remove looping decorative motion, transform travel and parallax; retain essential state feedback. Pause optional media/render loops offscreen and on hidden tabs. The component artwork cannot provide true meshes: 3D objects must be reconstructed and checked against the reference.

## Meaningful implementation checks

- Gather: select/unselect all; checked rows, trigger avatars and count agree at 0, 1, 3 and 4; failed save has retry and revert.
- Courtyard: selected material belongs to current set; shuffle and undo restore the complete state; keyboard selection matches the ring.
- Sol: 28°C converts to 82°F, 29°C to 84°F; days update every date-specific field; errors preserve a truthful stale state.
- Roam: selected plan and checkout request share one canonical ID; unconfirmed prices cannot be purchased; cancel preserves selection; repeat clicks cannot duplicate sessions.
- Kiln: all categories sum to usage; capacity segments sum to used/limit; remaining and average reconcile; missing data is not silently zero.
- Folio: one current route, Back/Forward correctness, keyboard access, empty Saved and sign-in return path.

These are future component tests. Package validation separately checks files, provenance, links and explorer content.


## Illustrated state mapping

The thirty state records in `data/components.json` map each image to its prompt, actual visual reference and directed actions. Review buttons simulate those actions; they are not a live payment or data service. `data/fixtures.json` defines proposed weather, plan and usage values. Daily raster heights are illustrative; render production charts from numeric arrays and provide accessible data tables.

Roam adds proposed Weekender $12 and Worldwide $48 design fixtures alongside the original Everyday $24. They are not live offers. Confirmation is gated by verified checkout completion.

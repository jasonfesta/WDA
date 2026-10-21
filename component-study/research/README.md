# WDA / Component research and provenance

Jason Festa · 21 October 2026

## Scope and provenance

Six original components now have five rendered states each: thirty individual images, thirty exact generation prompts, one saved correction prompt, six control ledgers and six React/motion handoffs. The original artwork is the visual authority. State 01 attaches the original; states 02–05 attach the locked state-01 render. [Render ledger](../data/state-render-plan.json) records the actual paths. [Asset ledger](../data/assets.json) records native dimensions, byte lengths and SHA-256 hashes.

The original six image bytes remain unchanged in references/originals. Five historical supplied screenshots are in references/screenshots; Gather and Courtyard share one. The original handoff does not preserve a verified per-call attachment list, so those screenshots are labelled historical inspiration. No new source attribution is inferred.

Thirty older branded contextual alternatives and twenty correction inputs are preserved in a separate historical archive. They are not the new interaction states. Storycircle had a three-avatar/two-reader mismatch; Plotcrew omitted an overflow count for four people. These older issues are not promoted as approved behavior.

## Decisions from the research

- Folio uses four real route destinations and one independent keyboard-focus state. Its active marker follows committed route state, not hover or focus.
- Gather uses native checkboxes and a controlled popover. Counts, checkmarks and avatars derive from one selected-ID set; save errors preserve attempted versus confirmed values.
- Courtyard uses radios for one selected material. Shuffle and Undo store/restore the complete palette plus selected ID. The illustrated Undo branch starts with Moss.
- Sol separates canonical temperatures from display units and preserves truthful cached data after a refresh failure.
- Roam’s original Everyday $24 is joined by proposed Weekender $12 and Worldwide $48 study fixtures. All production pricing requires a verified catalogue. A confirmation image is a verified-completion state, not the automatic result of pressing Continue.
- Kiln distinguishes category shares of used credits from capacity shares of the allowance. Its weekly 6,600 difference is not remaining spendable balance. Chart text and fixture arrays define the values; raster segment lengths and daily bars are illustrative. A targeted correction shortened the Week capacity bar; its before-image and exact edit prompt remain packaged.
- Natural wide/shallow and tall silhouettes are preserved. The reviews never crop controls or stretch the PNGs. Closed Gather uses its natural smaller footprint.

## Implementation boundary

The review is a static design study with an interactive state/action explorer. It does not perform purchases, fetch forecasts, persist people selections or implement host routes. All remaining data combinations, loading, failures, retry, cancellation, focus return and route ownership are documented in each ledger. Motion, object extraction and 3D reconstruction are briefs for the later build.

## Official references read on 21 October 2026

Documentation and build examples inform the behavior; they are not popularity rankings or claims of a hands-on audit of live products. Each application is a WDA design decision. No remote imagery or third-party source code was copied into this package.

### W3C — tabs pattern

[Official reference](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

Observed: A selected tab is connected to its visible panel. Horizontal tab lists use Left/Right arrows; manual activation uses Enter or Space.

Applied: Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.

### W3C — checkbox pattern

[Official reference](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)

Observed: A checkbox exposes its checked state and a readable label; Space toggles it.

Applied: Gather uses one native checkbox per person, with count and avatar summary derived from selected IDs.

### W3C — radio group pattern

[Official reference](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

Observed: Radio groups express a single choice. Arrow keys move between options and Space selects.

Applied: Courtyard keeps exactly one active material, with a visible ring and its text name.

### W3C — modal dialog pattern

[Official reference](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

Observed: A modal moves focus inside, contains keyboard focus, closes on Escape and returns focus appropriately.

Applied: Roam review and Kiln plan details need explicit close/cancel paths with trigger focus restoration.

### W3C — disclosure pattern

[Official reference](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)

Observed: A disclosure button exposes its expanded state and toggles a connected content region.

Applied: Gather opens by activation, not hover; its trigger communicates open or closed.

### Radix — Popover build example

[Official reference](https://www.radix-ui.com/primitives/docs/components/popover)

Observed: The documented primitive includes controlled state, placement and collision handling, focus management and dismissal options.

Applied: Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.

### Radix — Toggle Group build example

[Official reference](https://www.radix-ui.com/primitives/docs/components/toggle-group)

Observed: The example supports controlled state, single or multiple toggles, orientation and keyboard navigation.

Applied: A useful implementation reference for compact controls. Courtyard still uses radio semantics because it requires a choice.

### Stripe — subscription pricing table

[Official reference](https://docs.stripe.com/payments/checkout/pricing-table)

Observed: The pricing table displays plans and takes a chosen option into Checkout. Completion is a separate step.

Applied: Roam previews and compares plans, then explicitly reviews the chosen price. Selection alone does not subscribe.

### Supabase — usage documentation

[Official reference](https://supabase.com/docs/guides/platform/manage-your-usage)

Observed: Usage documentation separates resource categories and explains what is measured and how it is calculated.

Applied: Kiln needs explicit units, denominator labels and category details. This is a structure reference, not a copied pricing model.

### W3C — complex images and charts

[Official reference](https://www.w3.org/WAI/tutorials/images/complex/)

Observed: Complex graphics need a short description plus a longer textual equivalent of their essential information.

Applied: Kiln exposes a data table and values in text; hover tooltips are supplemental.

### MDN — aria-current

[Official reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current)

Observed: aria-current identifies the current item within a related set, including the current page.

Applied: Folio uses navigation links and aria-current="page" for routes. Use tabs only if switching local panels.

### Apple — Weather guide

[Official reference](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/ios)

Observed: The guide shows current conditions, forecast exploration, location selection and configurable weather units.

Applied: Sol retains a compact four-day surface, with unit conversion and a separately opened location control.

### React — choosing state structure

[Official reference](https://react.dev/learn/choosing-the-state-structure)

Observed: React recommends avoiding contradictory, redundant and duplicated state.

Applied: Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.

### Motion — accessible animation

[Official reference](https://motion.dev/docs/react-accessibility)

Observed: Motion supports system reduced-motion preferences and replacing substantial movement with simpler feedback.

Applied: Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.

# Interface reconstruction briefs — REF-007 to REF-018

These twelve studies were reconstructed after individually viewing all twelve selected PNGs and reading their matching generation prompts. React owns the layout, labels, buttons, forms, charts, selection state, and navigation. The supplied PNGs remain visual references; three screens reuse isolated decorative illustration regions, with no screenshot-sized click targets. All durable demo state is supplied through `AreaProps.state` and `onState`. The host scales the exact natural dimensions below and supplies semantic color tokens. No API keys, subscriptions, messages, payments, or external requests are required.

## Shared implementation prompt

Build one straightforward React example from the selected reference. Preserve its visual hierarchy, characteristic geometry, spacing, type contrast, copy, and illustration placement. Rebuild the actual interface with semantic HTML, CSS, small SVG icons, and native form controls. Use supplied transparent objects only as decoration. Bind interface surfaces, ink, muted copy, accent, secondary accent, and borders to the host's CSS tokens. Keep artwork's original color and material variation; never filter an entire interface screenshot. Every visible control must produce the described local behavior. Persist changes in host-owned state so opening a study and returning to the board preserve progress. Keep the board's separate inspection control independent of the example's own interactions.

## REF-007 — Sol weather card

- **Source:** `public/assets/ui-components/07-sol-weather-clean.png`; source prompt `../output/reference-remixes/warm-moodboard-handoff/prompts/ui-components/07-sol-weather-clean.txt`.
- **Natural size:** 400 × 420.
- **Reconstruction prompt:** Build one rounded weather card with a left-aligned city/date header, oversized satin orange sun contained behind a frosted lower panel, a large temperature with adjacent C/F controls, sunset detail, and four equal day tabs. Reuse `3d-objects/30-amber-sun.png` for the sun; keep all copy and controls native.
- **Interactions:** C/F performs a temperature conversion; day tabs update the date and temperature; the ellipsis opens a three-city picker. Use illustrative forecast values.
- **Visual checks:** Disc stays inside the card, lower glass follows both rounded corners, no labels overlap, all four dates fit. Browser-verified 29°C → 84°F on Friday.

## REF-008 — Gather team picker

- **Source:** `public/assets/ui-components/08-gather-team-clean.png`; matching `prompts/ui-components/08-gather-team-clean.txt` under the handoff directory above.
- **Natural size:** 400 × 485.
- **Reconstruction prompt:** Keep the connected dark trigger and dark cocoa panel. Build four generous rows with tactile rose, amber, moss, and burgundy spheres, collaborator name/role, and circular checked states. Use CSS material spheres with a light mineral grain overlay from `textures/24-mineral-impressions.png`.
- **Interactions:** Trigger opens/closes the list; each row toggles membership; trigger count and footer update together. Initial selection is Lena, Noah, and Amara.
- **Visual checks:** Trigger and panel share the dark treatment, avatars are circles, role copy is subdued, and the full footer remains inside the natural height. Browser-verified adding/removing Eli updates both counts.

## REF-009 — Courtyard material palette

- **Source:** `public/assets/ui-components/09-courtyard-palette-clean.png`; matching `prompts/ui-components/09-courtyard-palette-clean.txt`.
- **Natural size:** 460 × 180.
- **Reconstruction prompt:** Build a single horizontal porcelain tray with a spaced uppercase caption, five tactile material spheres, small captions, a selected ring, and an integrated shuffle action divided by a thin rule. Preserve Rose, Apricot, Citron, Moss, and Burgundy.
- **Interactions:** Swatches select a material; shuffle rotates the sequence and advances the active material. Announce selection with a hidden live label.
- **Visual checks:** All six control groups fit one row. Apricot is initially selected; the ring remains visible and captions remain separate. Browser-verified shuffle moves the order and active state.

## REF-010 — Roam membership panel

- **Source:** `public/assets/ui-components/10-roam-membership-clean.png`; matching `prompts/ui-components/10-roam-membership-clean.txt`.
- **Natural size:** 400 × 680.
- **Reconstruction prompt:** Keep the editorial serif title, three pill tabs, price hero with large cropped coral ribbon, and four feature cells. Populate the feature cells with transparent amber arc, moss sphere, citron fold, and rose discs (`3d-objects/25`–`28`); use the separate coral ribbon (`29`) in the hero. Every cell has a plain token-owned fill and native caption.
- **Interactions:** Weekender/Everyday/Worldwide change plan and price. Annual billing applies the displayed discounted monthly equivalent. Choose saves a local demo selection and displays the billing total; it does not purchase anything.
- **Visual checks:** Title is on one line, artwork stays inside its cells, billing switch, primary action, and billing caption all fit within 680px. Browser-verified Worldwide annual → $38.40/month equivalent, $460.80/year demo total (exact 20% discount).

## REF-011 — Kiln usage dashboard

- **Source:** `public/assets/ui-components/11-kiln-usage-clean.png`; matching `prompts/ui-components/11-kiln-usage-clean.txt`.
- **Natural size:** 460 × 410.
- **Reconstruction prompt:** Rebuild the entire compact credit dashboard: heading and period pills, 6,240/8,000 credit hierarchy, segmented meter, two-column category legend, daily bar chart, three resource meters, and footer action. Draw all charts with native elements and CSS.
- **Interactions:** Period pills update amounts, percent, average, remaining balance, and number of daily bars. Legend buttons isolate a category and can toggle it off. Daily bars select a point. Manage plan opens a reversible inline summary.
- **Visual checks:** Footer fully visible; resource bars do not collide; legend values align; chart points are individually accessible. Browser-verified Week changes to 1,623 credits and seven bars; plan details open/close.

## REF-012 — Folio navigation dock

- **Source:** `public/assets/ui-components/12-folio-navigation-dock.png`; matching `prompts/ui-components/12-folio-navigation-dock.txt`.
- **Natural size:** 460 × 180.
- **Reconstruction prompt:** Build an elongated ivory dock with four equally weighted items. Use a raised selected capsule, colored house accent, thin compass/bookmark/profile icons, labels, and small selection dot. Keep shadow shallow and corners generous.
- **Interactions:** Studio, Explore, Saved, and Profile update the active icon/capsule and a concise contextual line below the dock.
- **Visual checks:** All labels center below their icons and no item changes the dock width. Browser-verified Saved changes both selection and the contextual line.

## REF-013 — Home Note onboarding

- **Source:** `public/assets/mobile-screens/13-home-note-onboarding.png`; matching `prompts/mobile-screens/13-home-note-onboarding.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Preserve the layered tilted cards, household-symbol backing card, caregiver and child portraits, three household tasks, step markers, serif reassurance headline, and stacked actions. Rebuild cards, labels, icons, and all text natively. Use tightly bounded circular crops from the selected image only for the adult/child illustration.
- **Interactions:** Three working steps; final step names and creates a local home note. The invitation path validates a six-character demo code and joins the preview. Step dots and restart provide a reversible flow.
- **Visual checks:** Both portrait crops stay in their own card regions. The third-step name field and validation fit without clipping. Browser-verified all three steps and successful local named-note completion.

## REF-014 — Afterglow evening rhythm

- **Source:** `public/assets/mobile-screens/14-afterglow-bedtime.png`; matching `prompts/mobile-screens/14-afterglow-bedtime.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Build the luminous negative space with token-colored localized blooms, header/progress strokes, rounded humanist heading, central 10:45 pm time, tiny moon, translucent three-column picker, and bottom back/primary controls. Use native select controls inside the styled picker.
- **Interactions:** Hour, quarter-hour minute, and AM/PM update the large time. Set my evening stores the next occurrence of the selected time and shows a live remaining-time calculation. Adjust unlocks the picker; reset restores 10:45 pm.
- **Visual checks:** Time remains centered, neighboring values are subdued, and bottom actions are fully visible. Browser-verified 11:15 pm selection, persisted target/countdown, and reset.

## REF-015 — Pocket Garden early access

- **Source:** `public/assets/mobile-screens/15-pocket-garden-waitlist.png`; matching `prompts/mobile-screens/15-pocket-garden-waitlist.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Isolate the supplied gardener illustration above the native title and action area. Crop out the raster status bar and all raster copy; softly mask the artwork into the token-owned surface. Rebuild status bar, title, body, badge, button, secondary action, and home indicator.
- **Interactions:** Primary opens a native email form with local validation. Valid submission stores a demo confirmation only; no email is sent or subscription created. Plant notes opens three local checklist items; back restores the garden view.
- **Visual checks:** Only one status bar is present, illustration fades before native copy, and form/notes remain readable against a solid local surface. Browser-verified a valid local-only email flow.

## REF-016 — Petal botanical puzzle

- **Source:** `public/assets/mobile-screens/16-petal-puzzle.png`; matching `prompts/mobile-screens/16-petal-puzzle.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Preserve the editorial title, five staggered botanical strips, small grips, compact progress line, coral action, and understated restart link. Use five individually cropped illustration regions from the selected source inside five separate native strip controls. Keep the actual heading, progress, controls, and status native.
- **Interactions:** Tap, drag horizontally, or press an arrow key on a strip to align it. Hint aligns the next outstanding strip. Pause blocks moves and offers Resume. Completion changes the status/action; restart scrambles four strips.
- **Visual checks:** Exactly five strips, separate native grips, moving offsets, full primary/restart/help region visible. Browser-verified two hints take the initial 3/5 state to completion.

## REF-017 — Sol hourly forecast

- **Source:** `public/assets/mobile-screens/17-sol-forecast.png`; matching `prompts/mobile-screens/17-sol-forecast.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Keep a pale blue hero, SOL wordmark, city selector, oversized temperature, isolated orange sun/cream cloud, rounded lower data panel, six-point temperature chart, two metrics, golden-hour message, and three-item navigation. Use the transparent amber sun, a CSS cloud, and a native SVG chart.
- **Interactions:** Hourly points update the main temperature; city control cycles locations. Places selects a location. Settings changes C/F and golden-hour visibility. Message toggles a short golden-hour note. Values remain illustrative.
- **Visual checks:** Chart points follow the curve; hour labels are readable; golden-hour message ends above the navigation. Browser-verified hourly selection, unit conversion, and hiding/restoring golden-hour content.

## REF-018 — Daybook daylight planner

- **Source:** `public/assets/mobile-screens/18-daybook-daylight.png`; matching `prompts/mobile-screens/18-daybook-daylight.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Keep uppercase monospaced utility copy, a generous italic serif title, thin sun arc, two evening schedule rows, outlined add action, and quiet bottom navigation. Rebuild the arc, hills, small village shapes, and horizon with lightweight SVG and token-owned colors.
- **Interactions:** Schedule rows toggle completion. Add opens a title/time form and appends a local 30-minute plan. The plan list scrolls when needed. Week selects a day and displays its status. Places updates the chosen city and returns to Today.
- **Visual checks:** Sun is clipped at the horizon, plans have comfortable targets, new rows scroll inside the list rather than pushing the bottom tabs. Browser-verified adding “Read on the balcony” at 20:15.

## Verification record

All twelve live studies were opened individually at their registered natural proportions in the integrated app. Layout issues found during review were corrected in Gather, Roam, Kiln, Home Note, Pocket Garden, Petal, and Sol forecast. Rechecked the corrected membership and dashboard bounds programmatically through visible DOM geometry: no controls extend beneath the card. The full project TypeScript check and production Vite build passed. These are intentional frontend demonstrations with illustrative content; they do not imply an external service connection.

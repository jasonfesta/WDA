# Sundrop — tout and interaction specification

Round 2 · 21 October 2026 · [Shared React contract](react-interaction-contract.md) · [Live reference evidence](../research/live-reference-register.md)

## Desktop and mobile preview

[Side-by-side review](../reviews/04-sundrop.html) · [Desktop long image](../images/desktop/04-sundrop.png) · [One continuous mobile homepage](../images/mobile/04-sundrop.jpg)

[Mobile research and exact prompts](mobile-04-sundrop.md) · [Mobile React contract](react-mobile-contract.md)

## Critique and revised composition

Keep the sunlit product world and narrow wine-red display type. Replace the three boxed packs with one configurable still life. Merge flavor and ingredient panels; show serving as one dominant image and three explicit steps.

Chapter gaps 128–176 px. Cream surrounds citrus and pack objects; orange used once for the flavor scene. Three equal grids never appear back-to-back.

## Page sequence

1. Approved Sundrop hero with apricot spritz, ribbed coupe, coral 200 ml can and 8% ALC/VOL.
2. Find your first pour: very spacious ivory area with one carton and one coral can on the left, elegant 4 cans / 8 cans / 12 cans radio-style labels on right. Selected 4 cans $24; other values $44 and $60. One Choose your pack button. No three cards.
3. Apricot. Bitter orange. A little sparkle.: one beautifully composed large orange/coral still life with can and naturally scattered real fruit, not three ingredient tiles. Three small external labels under image, no icons.
4. Chill. Pour. Take your time.: one large pouring photograph with wide cream margins. Three textual step selectors beneath, 01 Chill / 02 Pour / 03 Settle in. No three equal thumbnails.
5. There's room at our table: one warm full-width editorial gathering image. Under it one small offset detail of a table and a few lines; no stacked community grids.
6. The afternoon journal: two unequal photo-and-caption stories The orange-twist pour / A table for four, separated by substantial space. Three tiny FAQ rows nearby: How to serve / Pack sizes / Delivery.
7. A little sunshine in your inbox: open apricot signup area; full burgundy footer and Enjoy responsibly.

## Tout register

Every former section is accounted for, including those embedded in larger compositions. Destinations are planned routes, not deployed pages. Scroll, hover and React details are WDA proposals.

### D00 — A slower sip / hero

**Content:** Approved alcoholic aperitif: Apricot, bitter orange, 200 ml, 8% ALC/VOL. Do not import nonalcoholic claims.

**Real build reference:** [Ghia — Homepage shop module](https://drinkghia.com/) · [Browser click + selected panel + screenshot](../research/live-reference-register.md#ghia)

**Layout:** Original 1586:992 ratio.

**Scroll:** Normal document flow; no hero parallax, crop change or scroll-scrubbed lettering. Header becomes a solid 64 px surface only after the hero exits. Preserve its footprint.

**Hover and focus:** Underline actionable text over 180 ms. Photo and brand wordmark stay still.

**Activation:** Use real navigation links. Menu is a button with aria-expanded; Escape closes and focus returns.

**Touch / small screen:** Same visible actions; menu button at 44 × 44 px minimum. Approved desktop composition gets a separately art-directed mobile crop later.

**React:** Hero + SiteHeader; IntersectionObserver sentinel owns header mode. Hero content has no React animation state.

**Individual tiles / destinations:**

- Find your first pour → /sundrop/aperitifs

**Mobile reflow — this same tout:** Headline wraps above a portrait can/coupe composition. Preserve 200 ml and 8% ALC/VOL. Find your first pour goes to the pack chooser in the same document.

**Mobile scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Mobile tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**Mobile React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D01 — Find your first pour / pack chooser

**Content:** 4 cans $24 / 8 cans $44 / 12 cans $60 are WDA concept values, pending commerce data.

**Real build reference:** [Ghia — Homepage shop module](https://drinkghia.com/) · [Browser click + selected panel + screenshot](../research/live-reference-register.md#ghia)

**Layout:** One product scene with radio options; no three repeated product boxes.

**Scroll:** One stable product scene; section reveals as a unit. Changing selection never scrolls the page or changes section height.

**Hover and focus:** Only selector outline/text responds over 160 ms. Do not rotate cans or move purchase controls.

**Activation:** Native radio group selects 4, 8 or 12 cans; selected pack, total price and product URL update together. Continue button navigates to the configured pack; no cart write in the reference gallery.

**Touch / small screen:** Use visible radio labels and 44 px targets; stack selector under product photo. Screen readers hear group legend and selected pack.

**React:** PackSelector; parent owns selectedPackId. Compute price/units/href from one packs map rather than separate state variables.

**Individual tiles / destinations:**

- 4 cans → /sundrop/aperitifs/apricot?pack=4
- 8 cans → /sundrop/aperitifs/apricot?pack=8
- 12 cans → /sundrop/aperitifs/apricot?pack=12

**Mobile reflow — this same tout:** Product scene precedes three full-width radio labels: 4 / 8 / 12 cans. One selected row, one derived price, one Choose your pack action. No fixed purchase bar.

**Mobile scroll:** Chooser remains in flow. Reserve image space so a pack change does not move the CTA unexpectedly.

**Mobile tap / focus:** Tap the complete radio label to select 4, 8 or 12. Count, price, image and destination derive together; activation does not add to cart.

**Mobile React:** PackSelector uses one selectedPackId. Native fieldset/legend/radios; polite price update. Same commerce data and state contract at every width.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D02 — Flavor story

**Content:** Apricot / Bitter orange / A little sparkle. Sensory copy, no wellness claims.

**Real build reference:** [Ghia — Homepage shop module](https://drinkghia.com/) · [Browser click + selected panel + screenshot](../research/live-reference-register.md#ghia)

**Layout:** One substantial still life, short copy outside.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Meet the aperitif → /sundrop/aperitifs/apricot

**Mobile reflow — this same tout:** Flavor heading and ingredient scene stack vertically. The can stays readable and proportionate.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D03 — What goes into a slower afternoon

**Content:** Apricots, bitter orange, botanicals are approved/proposed narrative cues; full ingredient declaration requires formulation data.

**Real build reference:** [Pentire — Serves](https://pentiredrinks.com/blogs/serves) · [Primary-page content](../research/live-reference-register.md#pentire)

**Layout:** Captions integrated into D02, not a second ingredient grid.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Ingredients → /sundrop/aperitifs/apricot#ingredients

**Mobile reflow — this same tout:** Ingredient labels can form a short three-up list at 390px; switch to one column at 320px or enlarged text. No ingredient claims beyond approved copy.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D04 — Chill / Pour / Settle in

**Content:** Three serving stages; final serving instructions need product sign-off.

**Real build reference:** [Pentire — Serves](https://pentiredrinks.com/blogs/serves) · [Primary-page content](../research/live-reference-register.md#pentire)

**Layout:** Single large media area; explicit controls below.

**Scroll:** Natural reading order. Scroll never changes the selected step. One large active photograph gives the sequence space.

**Hover and focus:** Step button underline brightens over 160 ms; no automatic selection on hover or focus.

**Activation:** Click/Enter chooses step and crossfades fixed-ratio media over 220 ms. aria-pressed buttons control a labelled region. No autoplay.

**Touch / small screen:** Three full-width or wrapping buttons remain visible; active description is below. Keyboard Tab/Enter works without a custom tab algorithm.

**React:** RitualSteps or ServeSteps; selectedStepId in parent; image and description derived from steps data. CSS fade; respect reduced motion.

**Individual tiles / destinations:**

- Chill → local step chill
- Pour → local step pour
- Settle in → local step settle

**Mobile reflow — this same tout:** Chill / Pour / Settle in are three visible buttons. Selection changes one instruction region and its approved image; it never advances with scroll or a timer.

**Mobile scroll:** Selection changes only on activation, never on scroll position. Keep the selected region stable in height where practical.

**Mobile tap / focus:** Tap one of three labelled buttons. Focus alone does not select. The selected button is visibly marked and exposes aria-pressed.

**Mobile React:** RitualSteps/ServeSteps owns selectedStepId. One record supplies image and copy. No incomplete ARIA tab implementation; do not duplicate state for mobile.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D05 — There’s room at our table

**Content:** Adult gathering scene; no customer names or endorsements.

**Real build reference:** [Pentire — Community](https://pentiredrinks.com/blogs/news) · [Primary-page content](../research/live-reference-register.md#community)

**Layout:** Cinematic image and small outside caption.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Pull up another chair → /sundrop/our-table

**Mobile reflow — this same tout:** Adult gathering photo is a full-width story with an explicit Pull up another chair link. Keep adequate contrast if copy overlays the crop.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D06 — Good company, unhurried

**Content:** Sunlit sips / Simple pleasures / Made for the moment become contextual notes.

**Real build reference:** [Pentire — Community](https://pentiredrinks.com/blogs/news) · [Primary-page content](../research/live-reference-register.md#community)

**Layout:** Embedded with D05; one smaller detail, not another three-card row.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- More moments → /sundrop/our-table#stories

**Mobile reflow — this same tout:** Supporting community notes remain inside the table story rather than three repeated photo cards. Route links retain descriptive labels.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D07 — Afternoon journal and practical FAQ

**Content:** The orange-twist pour / A table for four. FAQ uses shared disclosure behavior, not links that open empty drawers.

**Real build reference:** [Pentire — Serves](https://pentiredrinks.com/blogs/serves) · [Primary-page content](../research/live-reference-register.md#pentire)

**Layout:** Two unequal story images; three quiet details/summary rows.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- Orange-twist pour → /sundrop/how-we-pour/orange-twist
- A table for four → /sundrop/our-table/table-for-four
- How to serve / Pack sizes / Delivery → disclosures

**Help-row behavior:** Enter/Space or click toggles native details/summary. Multiple answers may remain open. Expanded copy includes the relevant detail-page link. Summary text darkens and the plus rotates 90° over 160 ms. No photo animation. Entire summary is a minimum 48 px row; no hover requirement. Reduced motion opens immediately.


**Mobile reflow — this same tout:** Two journal entries stack with visible text; How to serve, Pack sizes and Delivery follow as separate full-width help disclosures.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D08 — A little sunshine in your inbox

**Content:** Recipe and hosting newsletter with an explicit opt-in.

**Real build reference:** [Ghia — Homepage shop module](https://drinkghia.com/) · [Browser click + selected panel + screenshot](../research/live-reference-register.md#ghia)

**Layout:** Apricot closing field with generous padding.

**Scroll:** Static closing composition. Form never follows the user or opens an unsolicited modal.

**Hover and focus:** Button changes fill/foreground over 160 ms; input retains a stable border. Focus ring is always explicit.

**Activation:** Real form submit uses idle/submitting/success/error. Validate email, prevent duplicate requests, announce status and preserve input on failure. Until endpoint exists label demo as not connected.

**Touch / small screen:** Visible label plus autocomplete=email; 44 px button. Success stays in place without redirect.

**React:** NewsletterForm owns status and error; server action/API owns persistence. Keep inquiry CTA separate from marketing opt-in.

**Individual tiles / destinations:**

- Join our table → newsletter endpoint, pending

**Mobile reflow — this same tout:** Peach newsletter uses a full-width field and a full-width button on the next row. Keep consent and error text in the same flow.

**Mobile scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Mobile tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**Mobile React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### D09 — Sundrop footer

**Content:** Aperitifs / How we pour / Our table / Contact / Shipping / Privacy / Terms; Enjoy responsibly.

**Real build reference:** [Pentire — Serves](https://pentiredrinks.com/blogs/serves) · [Primary-page content](../research/live-reference-register.md#pentire)

**Layout:** Deep wine close with spacious columns.

**Scroll:** Static footer in document flow with adequate bottom padding.

**Hover and focus:** Simple underline only; logo remains still.

**Activation:** Real anchors to existing routes; future routes are documented as planned, not fake working links.

**Touch / small screen:** Groups stack and remain expanded; maintain clear reading order.

**React:** SiteFooter from route groups and contact data. No animation state.

**Individual tiles / destinations:**

- Aperitifs → /sundrop/aperitifs
- How we pour → /sundrop/how-we-pour
- Our table → /sundrop/our-table

**Mobile reflow — this same tout:** Two readable footer groups and Enjoy responsibly. The product category and ABV remain consistent with the desktop concept.

**Mobile scroll:** Footer follows the newsletter with no fixed positioning.

**Mobile tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**Mobile React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-04-sundrop.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

## Content and asset handoff

Use the approved hero from research/approved. The long image is a composition reference; rebuild type and controls as HTML. Individual product, on-body, process and editorial assets are needed for implementation; do not slice UI text into photographs. Preserve approved silhouettes and packaging. Below-fold scenes, secondary products and stories remain design proposals.

## Image generation

[Exact round-two prompt](../prompts/desktop/04-sundrop.txt) · [Manifest](../manifest.json)

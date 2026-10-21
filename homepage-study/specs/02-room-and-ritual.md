# Room & Ritual — tout and interaction specification

Round 2 · 21 October 2026 · [Shared React contract](react-interaction-contract.md) · [Live reference evidence](../research/live-reference-register.md)

## Desktop and mobile preview

[Side-by-side review](../reviews/02-room-and-ritual.html) · [Desktop long image](../images/desktop/02-room-and-ritual.png) · [One continuous mobile homepage](../images/mobile/02-room-and-ritual.jpg)

[Mobile research and exact prompts](mobile-02-room-and-ritual.md) · [Mobile React contract](react-mobile-contract.md)

## Critique and revised composition

Retain the expressive pink masthead. Replace the small repeated interior grids with two offset homes, a substantial house tour and a few isolated objects. Materials become annotations within the house story; process becomes a restrained text sequence.

Desktop chapter gaps 144–192 px; 6% side gutters. Project offset 96 px, disabled below 768 px. Pink appears at the masthead and closing invitation, not between every section.

## Page sequence

1. Approved ROOM & RITUAL pink masthead and entire arched-window interior hero.
2. Generous warm ivory pause. Rooms for living: large Courtyard House photograph left; smaller Cedar Rooms portrait offset lower at right; Olive Terrace a text link beneath. Avoid equal three-card strip.
3. Inside the Courtyard House: one immersive dining-room image with one narrow prose block next to it. An offset small walnut/wool detail with minimal captions continues below; no four-tile material row.
4. From first conversation to final layer: four elegant text labels Listen, Shape, Gather, Settle in plenty of white space; a single small studio drawing, no boxes.
5. Objects with a place in your story: freestanding orange mushroom lamp and dark ceramic vessel on cream, one modest still life of walnut table. Unequal scales with air, not three product cards. Omit prices in image.
6. Life, once the room is finished: a large warm courtyard gathering photograph. Field notes become two quiet text links with a single offset vignette below, not multiple thumbnail rails.
7. Soft pink generous inquiry and newsletter, followed by full dark burgundy footer.

## Tout register

Every former section is accounted for, including those embedded in larger compositions. Destinations are planned routes, not deployed pages. Scroll, hover and React details are WDA proposals.

### R00 — Masthead and Courtyard House hero

**Content:** ROOM & RITUAL; A home should hold more than furniture. Existing approved room palette.

**Real build reference:** [Studio Ashby — Projects](https://studioashby.com/projects/) · [Browser scroll, screenshot and click](../research/live-reference-register.md#ashby)

**Layout:** Original 1586:992 ratio, pink masthead retained.

**Scroll:** Normal document flow; no hero parallax, crop change or scroll-scrubbed lettering. Header becomes a solid 64 px surface only after the hero exits. Preserve its footprint.

**Hover and focus:** Underline actionable text over 180 ms. Photo and brand wordmark stay still.

**Activation:** Use real navigation links. Menu is a button with aria-expanded; Escape closes and focus returns.

**Touch / small screen:** Same visible actions; menu button at 44 × 44 px minimum. Approved desktop composition gets a separately art-directed mobile crop later.

**React:** Hero + SiteHeader; IntersectionObserver sentinel owns header mode. Hero content has no React animation state.

**Individual tiles / destinations:**

- Homes → /room-and-ritual/homes
- Discuss a space → /room-and-ritual/studio#inquiry

**Mobile reflow — this same tout:** ROOM & RITUAL wraps across two lines on blush. Preserve the calligraphic ampersand. The room image uses a portrait-friendly crop that retains the arched window and olive sofa.

**Mobile scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Mobile tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**Mobile React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R01 — Rooms for living / home tiles

**Content:** Courtyard House / Cedar Rooms / Olive Terrace are existing WDA concepts.

**Real build reference:** [Studio Ashby — Projects](https://studioashby.com/projects/) · [Browser scroll, screenshot and click](../research/live-reference-register.md#ashby)

**Layout:** 7/4-column staggered images; third as text link; no uniform cards.

**Scroll:** Preserve asymmetric grid offsets. Each large photograph settles 12→0 px once; captions remain steady. No sticky panels or forced horizontal scrolling.

**Hover and focus:** Image scale 1→1.018 over 500 ms inside its crop; arrow moves 4 px over 180 ms. Title remains visible. Keyboard uses a 2 px focus outline.

**Activation:** Whole image/caption is one descriptive link to the project page. Do not put a nested button inside it.

**Touch / small screen:** One column in reading order, remove offsets; image and caption remain one 44 px+ target.

**React:** ProjectTout with project, size, offset and href props. CSS Grid places items; no hover state in React.

**Individual tiles / destinations:**

- Courtyard House → /room-and-ritual/homes/courtyard-house
- Cedar Rooms → /room-and-ritual/homes/cedar-rooms
- Olive Terrace → /room-and-ritual/homes/olive-terrace

**Mobile reflow — this same tout:** Courtyard House comes first, Cedar Rooms second, Olive Terrace as a text link third. Captions sit below images; desktop offsets are removed.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R02 — Inside the Courtyard House

**Content:** Dining, gathering and daylight; describe human use without fabricated client facts.

**Real build reference:** [Studio Ashby — Tamodi Estate](https://studioashby.com/project/tamodi-estate/) · [Browser navigation + DOM](../research/live-reference-register.md#tamodi)

**Layout:** One large image, short prose, one smaller detail.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Take the house tour → /room-and-ritual/homes/courtyard-house

**Mobile reflow — this same tout:** Dining image, house-tour heading, copy and link form one vertical story. Do not pin the photo while the text scrolls.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R03 — Walnut, wool, afternoon light / materials

**Content:** Walnut / Wool / Plaster / Stone are palette notes; they are not purchase controls.

**Real build reference:** [Workstead — Studio and lighting](https://workstead.com/) · [Primary-page content](../research/live-reference-register.md#workstead)

**Layout:** Small supporting details nested in the house story, no row of four tiles.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- See the palette → /room-and-ritual/homes/courtyard-house#materials

**Mobile reflow — this same tout:** Walnut-and-wool material detail follows the tour with a visible caption. Material names are editorial labels, not selectable options.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R04 — Listen / Shape / Gather / Settle

**Content:** A proposed four-stage studio approach; no delivery timeline promise.

**Real build reference:** [Workstead — Project inquiry](https://workstead.com/project-inquiry/) · [Primary-page content; no submission](../research/live-reference-register.md#inquiry)

**Layout:** Four text steps, ample line spacing, at most one studio sketch.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Our approach → /room-and-ritual/studio#process

**Mobile reflow — this same tout:** Sketch followed by four numbered text rows: Listen, Shape, Gather, Settle. All four are visible; no step selection or hover dependency.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R05 — Objects with a place in your story

**Content:** Sculptural light / Walnut coffee table / Ceramic vessel. Omit unvalidated prices and designer attribution.

**Real build reference:** [Studio Ashby — Tamodi Estate](https://studioashby.com/project/tamodi-estate/) · [Browser navigation + DOM](../research/live-reference-register.md#tamodi)

**Layout:** Freestanding objects at varying scales; generous cream ground.

**Scroll:** Enter as one composition at 15% visibility: translateY 12→0 px over 600 ms, once. Do not animate each label separately.

**Hover and focus:** Only on fine pointers, crossfade primary to on-body/texture image over 240 ms. Name, price and action remain visible. Focus outlines the link without swapping image.

**Activation:** Image and product name form one product-detail link. No homepage variants are proposed; do not add unapproved swatches or quick-add.

**Touch / small screen:** No hover dependency. Show stable primary image and explicit color names. Two columns at tablet, one at narrow phone.

**React:** Static ProductTout[] in ProductRange. Each record owns title, image pair, optional approved price and href. CSS handles hover; no selection state.

**Individual tiles / destinations:**

- Sculptural light → /room-and-ritual/objects/sculptural-light
- Walnut table → /room-and-ritual/objects/walnut-table
- Ceramic vessel → /room-and-ritual/objects/ceramic-vessel

**Mobile reflow — this same tout:** One room/object still life introduces the collection. Specific object links live in the accessible text list or on the collection route, not invisible hotspots on the raster.

**Mobile scroll:** Products remain readable without animation or a swipe. Any entrance is optional and disabled for reduced motion.

**Mobile tap / focus:** One tap on the product link opens its detail route. Approved variant swatches, if implemented, use separate 44px buttons; first tap never merely reveals a hover CTA.

**Mobile React:** One ProductRange data array and CSS grid. Variant state is per product only when approved; keep links separate from buttons.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R06 — Life, once the room is finished

**Content:** Adult friends at the courtyard table; demonstration editorial scene.

**Real build reference:** [Studio Ashby — Tamodi Estate](https://studioashby.com/project/tamodi-estate/) · [Browser navigation + DOM](../research/live-reference-register.md#tamodi)

**Layout:** Large panorama with caption outside image; no overlaid card.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Life at home → /room-and-ritual/notes/life-at-home

**Mobile reflow — this same tout:** Gathering image and its narrative stack. Keep adults and the table in the crop; avoid clipping faces with a fixed background.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R07 — Field notes

**Content:** Collected over time / Following the afternoon light.

**Real build reference:** [Studio Ashby — Projects](https://studioashby.com/projects/) · [Browser scroll, screenshot and click](../research/live-reference-register.md#ashby)

**Layout:** Two text-led article entries and one offset detail, embedded after R06.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- Collected over time → /room-and-ritual/notes/collected-over-time
- Following the light → /room-and-ritual/notes/afternoon-light

**Mobile reflow — this same tout:** Two editorial rows remain visible. Thumbnail and text can sit side by side at 390px; stack at 320px or 200% text size.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R08 — Make room / Letters from the studio

**Content:** Inquiry is a route; newsletter is a separate opt-in form.

**Real build reference:** [Workstead — Project inquiry](https://workstead.com/project-inquiry/) · [Primary-page content; no submission](../research/live-reference-register.md#inquiry)

**Layout:** Large pink open area; two distinct actions.

**Scroll:** Static closing composition. Form never follows the user or opens an unsolicited modal.

**Hover and focus:** Button changes fill/foreground over 160 ms; input retains a stable border. Focus ring is always explicit.

**Activation:** Real form submit uses idle/submitting/success/error. Validate email, prevent duplicate requests, announce status and preserve input on failure. Until endpoint exists label demo as not connected.

**Touch / small screen:** Visible label plus autocomplete=email; 44 px button. Success stays in place without redirect.

**React:** NewsletterForm owns status and error; server action/API owns persistence. Keep inquiry CTA separate from marketing opt-in.

**Individual tiles / destinations:**

- Discuss a space → /room-and-ritual/studio#inquiry
- Letters from the studio → newsletter endpoint, pending

**Mobile reflow — this same tout:** Discuss a space remains a separate navigation link. Newsletter label, input and submit control form a distinct opt-in below it.

**Mobile scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Mobile tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**Mobile React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### R09 — Room & Ritual footer

**Content:** Homes / Objects / Field notes / Studio / Contact / Privacy / Terms.

**Real build reference:** [Studio Ashby — Projects](https://studioashby.com/projects/) · [Browser scroll, screenshot and click](../research/live-reference-register.md#ashby)

**Layout:** Dark wine footer, no cramped columns.

**Scroll:** Static footer in document flow with adequate bottom padding.

**Hover and focus:** Simple underline only; logo remains still.

**Activation:** Real anchors to existing routes; future routes are documented as planned, not fake working links.

**Touch / small screen:** Groups stack and remain expanded; maintain clear reading order.

**React:** SiteFooter from route groups and contact data. No animation state.

**Individual tiles / destinations:**

- Homes → /room-and-ritual/homes
- Objects → /room-and-ritual/objects
- Studio → /room-and-ritual/studio

**Mobile reflow — this same tout:** Wordmark followed by two compact link groups. Mobile never hides contact information behind hover.

**Mobile scroll:** Footer follows the newsletter with no fixed positioning.

**Mobile tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**Mobile React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-02-room-and-ritual.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

## Content and asset handoff

Use the approved hero from research/approved. The long image is a composition reference; rebuild type and controls as HTML. Individual product, on-body, process and editorial assets are needed for implementation; do not slice UI text into photographs. Preserve approved silhouettes and packaging. Below-fold scenes, secondary products and stories remain design proposals.

## Image generation

[Exact round-two prompt](../prompts/desktop/02-room-and-ritual.txt) · [Manifest](../manifest.json)

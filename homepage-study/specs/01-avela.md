# Avela / Soft Form — tout and interaction specification

Round 2 · 21 October 2026 · [Shared React contract](react-interaction-contract.md) · [Live reference evidence](../research/live-reference-register.md)

## Desktop and mobile preview

[Side-by-side review](../reviews/01-avela.html) · [Desktop long image](../images/desktop/01-avela.png) · [One continuous mobile homepage](../images/mobile/01-avela.jpg)

[Mobile research and exact prompts](mobile-01-avela.md) · [Mobile React contract](react-mobile-contract.md)

## Critique and revised composition

Keep the campaign strength, remove repetitive triptychs. Products float on cream; the Arc story, craft and coastal story become large, unequal compositions. Workshop notes sit inside craft; community imagery sits inside the coastal story.

Desktop chapters 144–192 px apart, side gutters clamp(24px,6vw,96px), 32–48 px internal gaps. Product grounds blend into the cream; no card outlines.

## Page sequence

1. Approved SOFT FORM hero exactly as supplied.
2. After a generous cream pause, Forms for every day: three freestanding bags with subtle baseline labels; Arc $420, Fold $360, Day $480. No three background rectangles. Leave space around every silhouette.
3. Large pale-blue Arc flat lay on left occupying 55%; smaller serif copy floated on cream at right, separated by negative space. One short heading: Soft structure. Room for the everyday.
4. Shaped by hand: one substantial terracotta-toned handwork photograph on right and a smaller close-up offset below-left. Use a quiet cream field, not a solid stripe. A single workshop story link replaces a second journal grid.
5. Carried through the day: one large coastal campaign photo and a smaller on-body photograph offset like a magazine spread. Two tiny community captions share this composition, not another row.
6. Made to stay with you: calm wide cream pause, three fine accordion lines left, one small tactile leather detail right.
7. Blue newsletter breathing room; full oxblood footer with useful link columns.

## Tout register

Every former section is accounted for, including those embedded in larger compositions. Destinations are planned routes, not deployed pages. Scroll, hover and React details are WDA proposals.

### A00 — Campaign / SOFT FORM

**Content:** Approved AVELA campaign and Arc bag; retain original copy, not Polène’s product names.

**Real build reference:** [Polène — homepage](https://eng.polene-paris.com/) · [Browser scroll + DOM](../research/live-reference-register.md#polene)

**Layout:** Original 1681:936 ratio; no added tile boxes.

**Scroll:** Normal document flow; no hero parallax, crop change or scroll-scrubbed lettering. Header becomes a solid 64 px surface only after the hero exits. Preserve its footprint.

**Hover and focus:** Underline actionable text over 180 ms. Photo and brand wordmark stay still.

**Activation:** Use real navigation links. Menu is a button with aria-expanded; Escape closes and focus returns.

**Touch / small screen:** Same visible actions; menu button at 44 × 44 px minimum. Approved desktop composition gets a separately art-directed mobile crop later.

**React:** Hero + SiteHeader; IntersectionObserver sentinel owns header mode. Hero content has no React animation state.

**Individual tiles / destinations:**

- The bags → /avela/bags
- Meet the Arc → /avela/bags/the-arc

**Mobile reflow — this same tout:** Portrait campaign crop keeps the whole Arc bag visible; SOFT FORM wraps into two lines. Compact Menu / Bag header. Copy and image retain the approved campaign.

**Mobile scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Mobile tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**Mobile React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A01 — Forms for every day / 3 product tiles

**Content:** The Arc $420 / Oxblood; The Fold $360 / Tan; The Day $480 / Olive. Arc price from prior WDA registry; others provisional.

**Real build reference:** [Polène — homepage](https://eng.polene-paris.com/) · [Browser scroll + DOM](../research/live-reference-register.md#polene)

**Layout:** Unboxed 3-column silhouettes with 48 px gaps; smaller metadata beneath.

**Scroll:** Enter as one composition at 15% visibility: translateY 12→0 px over 600 ms, once. Do not animate each label separately.

**Hover and focus:** Only on fine pointers, crossfade primary to on-body/texture image over 240 ms. Name, price and action remain visible. Focus outlines the link without swapping image.

**Activation:** Image/name link opens the correct product route. Color selection is a sibling button group, never nested in the link; click updates selected color, image and route.

**Touch / small screen:** No hover dependency. Show stable primary image and explicit color names. Two columns at tablet, one at narrow phone.

**React:** ProductTout[] in ProductRange. ProductRange owns selectedVariantByProduct; product data owns image pairs, price and href. CSS handles hover; React handles selection.

**Individual tiles / destinations:**

- The Arc → /avela/bags/the-arc
- The Fold → /avela/bags/the-fold
- The Day → /avela/bags/the-day

**Mobile reflow — this same tout:** The Arc leads on its own; The Fold and The Day form the secondary pair. At 320px, stack the pair if labels wrap badly. Product names and prices remain visible. Swatches shown in the concept require approved variants before implementation.

**Mobile scroll:** Products remain readable without animation or a swipe. Any entrance is optional and disabled for reduced motion.

**Mobile tap / focus:** One tap on the product link opens its detail route. Approved variant swatches, if implemented, use separate 44px buttons; first tap never merely reveals a hover CTA.

**Mobile React:** One ProductRange data array and CSS grid. Variant state is per product only when approved; keep links separate from buttons.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A02 — The Arc / capacity story

**Content:** Phone, notebook and keys convey use. Avoid an unverified liters/capacity specification.

**Real build reference:** [Polène — Materials](https://eng.polene-paris.com/blogs/bags/materials) · [Primary-page content](../research/live-reference-register.md#leather)

**Layout:** 7-column image, 3-column copy, 2-column breathing gap; blue only behind still life.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Discover the Arc → /avela/bags/the-arc#details

**Mobile reflow — this same tout:** Blue flat-lay spans the content width, followed by heading, short copy and Discover the Arc. No copy column beside the image.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A03 — Shaped by hand / making

**Content:** Cut, Fold, Finish remain simple process captions. No invented factory location, certification or warranty.

**Real build reference:** [Hereu — Craftsmanship](https://hereustudio.com/pages/craftmanship) · [Primary-page content](../research/live-reference-register.md#hereu)

**Layout:** One main photograph and one offset detail; no equal triptych.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Inside the workshop → /avela/workshop

**Mobile reflow — this same tout:** Making photograph and stitch detail stack vertically. Process remains readable copy; Read the workshop story is a normal link.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A04 — Carried through the day

**Content:** Coastal carry campaign; the same oxblood crescent Arc and cream linen wardrobe.

**Real build reference:** [Polène — homepage](https://eng.polene-paris.com/) · [Browser scroll + DOM](../research/live-reference-register.md#polene)

**Layout:** Large portrait plus smaller landscape image separated by cream.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Explore the story → /avela/journal/carried-through-the-day

**Mobile reflow — this same tout:** Coastal carry image becomes a portrait composition. Retain the same bag and campaign wardrobe. The CTA is outside any ambiguous image-only target.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A05 — Made to stay with you / care rows

**Content:** What fits / Leather care / Repairs. Final care instructions and repair policy require brand input.

**Real build reference:** [Polène — Materials](https://eng.polene-paris.com/blogs/bags/materials) · [Primary-page content](../research/live-reference-register.md#leather)

**Layout:** Three hairline rows, adjacent small leather detail, 144 px clear space.

**Scroll:** In normal flow. Opening increases document height without moving the trigger; reserve image space beside the questions.

**Hover and focus:** Summary text darkens and the plus rotates 90° over 160 ms. No photo animation.

**Activation:** Enter/Space or click toggles native details/summary. Multiple answers may remain open. Expanded copy includes the relevant detail-page link.

**Touch / small screen:** Entire summary is a minimum 48 px row; no hover requirement. Reduced motion opens immediately.

**React:** CareDisclosure using native details/summary. No duplicated React open state unless a future URL-deep-link requirement needs it.

**Individual tiles / destinations:**

- What fits → /avela/bags/the-arc#details
- Leather care → /avela/care
- Repairs → /avela/care#repairs

**Mobile reflow — this same tout:** What fits, Leather care and Repairs are three full-width independent disclosure rows. Open answers increase document height.

**Mobile scroll:** Expanding an answer changes page height naturally and retains focus on its summary.

**Mobile tap / focus:** Tap anywhere in the full-width summary row to toggle. Multiple answers may stay open.

**Mobile React:** Use native details/summary, preserve content in DOM, and style the focus ring. Do not animate measured height under reduced motion.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A06 — In good company / embedded community

**Content:** Everyday carry and weekend imagery are editorial proposals, not customer testimonials.

**Real build reference:** [Polène — homepage](https://eng.polene-paris.com/) · [Browser scroll + DOM](../research/live-reference-register.md#polene)

**Layout:** Two small captions in A04; eliminate separate three-card band.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- Everyday carry → /avela/journal/carried-through-the-day
- Weekend away → /avela/journal/weekend-away

**Mobile reflow — this same tout:** The two supporting carry stories follow the main coastal story. At 390px they can be a two-up pair; use one column at 320px or large text.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A07 — Notes from the workshop / embedded journal

**Content:** The making of a curve; a leather that keeps its story.

**Real build reference:** [Polène — Manufacturing](https://eng.polene-paris.com/blogs/bags/manufacturing) · [Primary-page content](../research/live-reference-register.md#manufacturing)

**Layout:** Two text links and one detail already within A03; no duplicate photo grid.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- The making of a curve → /avela/workshop#shape
- A leather that keeps its story → /avela/care

**Mobile reflow — this same tout:** Notes from the workshop becomes one compact editorial link and optional supporting image within the care chapter; the journal archive holds the longer story list.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A08 — A longer story, in your inbox

**Content:** One newsletter signup; no unsolicited overlay.

**Real build reference:** [Polène — homepage](https://eng.polene-paris.com/) · [Browser scroll + DOM](../research/live-reference-register.md#polene)

**Layout:** Pale blue field, generous open area around label and email field.

**Scroll:** Static closing composition. Form never follows the user or opens an unsolicited modal.

**Hover and focus:** Button changes fill/foreground over 160 ms; input retains a stable border. Focus ring is always explicit.

**Activation:** Real form submit uses idle/submitting/success/error. Validate email, prevent duplicate requests, announce status and preserve input on failure. Until endpoint exists label demo as not connected.

**Touch / small screen:** Visible label plus autocomplete=email; 44 px button. Success stays in place without redirect.

**React:** NewsletterForm owns status and error; server action/API owns persistence. Keep inquiry CTA separate from marketing opt-in.

**Individual tiles / destinations:**

- Join the atelier → newsletter endpoint, pending

**Mobile reflow — this same tout:** Newsletter heading, labelled email input and Join the atelier button stack in that order. The button spans the available width.

**Mobile scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Mobile tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**Mobile React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### A09 — Avela footer

**Content:** Bags, Workshop, Care, Contact, Shipping, Returns, Privacy, Terms.

**Real build reference:** [Polène — homepage](https://eng.polene-paris.com/) · [Browser scroll + DOM](../research/live-reference-register.md#polene)

**Layout:** Dark oxblood close with broad gutters.

**Scroll:** Static footer in document flow with adequate bottom padding.

**Hover and focus:** Simple underline only; logo remains still.

**Activation:** Real anchors to existing routes; future routes are documented as planned, not fake working links.

**Touch / small screen:** Groups stack and remain expanded; maintain clear reading order.

**React:** SiteFooter from route groups and contact data. No animation state.

**Individual tiles / destinations:**

- Bags → /avela/bags
- Workshop → /avela/workshop
- Care → /avela/care

**Mobile reflow — this same tout:** Keep AVELA and two short link groups. Use 16px text and 44px minimum row height in the build; legal links remain discoverable.

**Mobile scroll:** Footer follows the newsletter with no fixed positioning.

**Mobile tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**Mobile React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-01-avela.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

## Content and asset handoff

Use the approved hero from research/approved. The long image is a composition reference; rebuild type and controls as HTML. Individual product, on-body, process and editorial assets are needed for implementation; do not slice UI text into photographs. Preserve approved silhouettes and packaging. Below-fold scenes, secondary products and stories remain design proposals.

## Image generation

[Exact round-two prompt](../prompts/desktop/01-avela.txt) · [Manifest](../manifest.json)

# Serein — tout and interaction specification

Round 2 · 21 October 2026 · [Shared React contract](react-interaction-contract.md) · [Live reference evidence](../research/live-reference-register.md)

## Desktop and mobile preview

[Side-by-side review](../reviews/05-serein.html) · [Desktop long image](../images/desktop/05-serein.png) · [One continuous mobile homepage](../images/mobile/05-serein.jpg)

[Mobile research and exact prompts](mobile-05-serein.md) · [Mobile React contract](react-mobile-contract.md)

## Critique and revised composition

The color direction works; remove the sequence of repetitive three-image strips. Give Daily Oil a generous hero-like lower section. Botanical source material becomes one image with annotations; routine becomes a calm stateful scene.

Desktop chapter gaps 144–192 px. Peach and blue used as large calm fields; 5–7% gutters. Product bottles float on cream; no enclosing tiles.

## Page sequence

1. Approved SEREIN hero: peach copy, botanical center strip, brown-skinned adult model on blue, Daily Oil 30 ml amber squat bottle with sculptural coral pump.
2. Your everyday essentials: three bottles/jar on one continuous cream ground with generous space, no rectangles. Dew Cleanser 150 ml $32 / Daily Oil 30 ml $48 / Cloud Cream 50 ml $42. Do not label cleanser as oil.
3. Daily Oil. A softer finish.: large faithful Daily Oil bottle and one tiny oil texture on expansive peach ground; much more blank space, short serif copy left. Preserve 30 ml, squat amber glass, sculptural coral pump.
4. Close to the source: one large sunlit botanical macro photograph and one little drop-of-oil detail offset, minimal Leaves / Petals / Texture notes. No ingredient-card triptych.
5. Cleanse. Nourish. Pause.: powder blue area with ONE large warm portrait and three elegant selectable step labels. Description and Daily Oil reference sit quietly beside portrait. No three thumbnail row.
6. A quieter moment at the sink: large warm sink scene, with a smaller candid portrait offset below-right and two community captions. The care journal becomes two airy text links and ONE texture detail. No repeated card grid.
7. Make a little room for yourself: calm peach signup with proper email and button; complete cream footer, optional slender blue ritual baseline.

## Tout register

Every former section is accounted for, including those embedded in larger compositions. Destinations are planned routes, not deployed pages. Scroll, hover and React details are WDA proposals.

### S00 — A little care, every day / hero

**Content:** Approved Serein, Daily Oil 30 ml, peach/blue/cream, existing hero copy.

**Real build reference:** [Vintner’s Daughter — Products and stories](https://vintnersdaughter.com/) · [Primary-page content](../research/live-reference-register.md#vintner)

**Layout:** Original 1586:992 ratio; do not rename oil Petal Oil.

**Scroll:** Normal document flow; no hero parallax, crop change or scroll-scrubbed lettering. Header becomes a solid 64 px surface only after the hero exits. Preserve its footprint.

**Hover and focus:** Underline actionable text over 180 ms. Photo and brand wordmark stay still.

**Activation:** Use real navigation links. Menu is a button with aria-expanded; Escape closes and focus returns.

**Touch / small screen:** Same visible actions; menu button at 44 × 44 px minimum. Approved desktop composition gets a separately art-directed mobile crop later.

**React:** Hero + SiteHeader; IntersectionObserver sentinel owns header mode. Hero content has no React animation state.

**Individual tiles / destinations:**

- Build your daily ritual → /serein/daily-ritual

**Mobile reflow — this same tout:** Peach copy block above the portrait. Retain botanical accent, blue background and Daily Oil 30 ml inset. The blue ritual strip points to the routine section.

**Mobile scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Mobile tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**Mobile React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S01 — Everyday essentials / product tiles

**Content:** Dew Cleanser 150 ml $32; Daily Oil 30 ml $48; Cloud Cream 50 ml $42. Secondary products/prices are concepts.

**Real build reference:** [Botnia — Homepage](https://www.botniaskincare.com/) · [Browser category click + DOM + screenshot](../research/live-reference-register.md#botnia)

**Layout:** Three floating products with no separate image cards; labels stay visible.

**Scroll:** Enter as one composition at 15% visibility: translateY 12→0 px over 600 ms, once. Do not animate each label separately.

**Hover and focus:** Only on fine pointers, crossfade primary to on-body/texture image over 240 ms. Name, price and action remain visible. Focus outlines the link without swapping image.

**Activation:** Image and product name form one product-detail link. No homepage variants are proposed; do not add unapproved swatches or quick-add.

**Touch / small screen:** No hover dependency. Show stable primary image and explicit color names. Two columns at tablet, one at narrow phone.

**React:** Static ProductTout[] in ProductRange. Each record owns title, image pair, optional approved price and href. CSS handles hover; no selection state.

**Individual tiles / destinations:**

- Dew Cleanser → /serein/products/dew-cleanser
- Daily Oil → /serein/products/daily-oil
- Cloud Cream → /serein/products/cloud-cream

**Mobile reflow — this same tout:** Daily Oil is the lead product; Dew Cleanser and Cloud Cream follow. Preserve names, volumes and concept prices. At 320px, stack secondary products.

**Mobile scroll:** Products remain readable without animation or a swipe. Any entrance is optional and disabled for reduced motion.

**Mobile tap / focus:** One tap on the product link opens its detail route. Approved variant swatches, if implemented, use separate 44px buttons; first tap never merely reveals a hover CTA.

**Mobile React:** One ProductRange data array and CSS grid. Variant state is per product only when approved; keep links separate from buttons.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S02 — Daily Oil / signature story

**Content:** A softer finish; amber bottle and coral pump remain consistent. No efficacy metrics.

**Real build reference:** [Vintner’s Daughter — Products and stories](https://vintnersdaughter.com/) · [Primary-page content](../research/live-reference-register.md#vintner)

**Layout:** Large peach still life with small texture inset and concise text.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Meet Daily Oil → /serein/products/daily-oil

**Mobile reflow — this same tout:** Keep Daily Oil bottle fully visible and its 30 ml label consistent. Text and image stack whenever the content width cannot support readable type.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S03 — Close to the source

**Content:** Leaves / Petals / Texture are visual notes; do not fabricate an INCI list or source farm.

**Real build reference:** [Botnia — Key ingredients](https://www.botniaskincare.com/blogs/key-ingredients) · [Primary-page content](../research/live-reference-register.md#ingredients)

**Layout:** One botanical photograph and an offset oil detail, no three cards.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Ingredient notes → /serein/ingredients

**Mobile reflow — this same tout:** Botanical photo is followed by vertical Leaves / Petals / Texture notes. These are explanatory content, not filters.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S04 — Cleanse / Nourish / Pause

**Content:** Dew Cleanser / Daily Oil / quiet moment. Actual application and suitability copy require formulation guidance.

**Real build reference:** [Botnia — Find your skincare routine](https://www.botniaskincare.com/pages/find-your-skincare-routine) · [Primary-page content; no form submission](../research/live-reference-register.md#routine)

**Layout:** One image per selected step, fixed media height, blue ground.

**Scroll:** Natural reading order. Scroll never changes the selected step. One large active photograph gives the sequence space.

**Hover and focus:** Step button underline brightens over 160 ms; no automatic selection on hover or focus.

**Activation:** Click/Enter chooses step and crossfades fixed-ratio media over 220 ms. aria-pressed buttons control a labelled region. No autoplay.

**Touch / small screen:** Three full-width or wrapping buttons remain visible; active description is below. Keyboard Tab/Enter works without a custom tab algorithm.

**React:** RitualSteps or ServeSteps; selectedStepId in parent; image and description derived from steps data. CSS fade; respect reduced motion.

**Individual tiles / destinations:**

- Cleanse → local step cleanse
- Nourish → local step nourish
- Pause → local step pause

**Mobile reflow — this same tout:** Three tap buttons above one routine panel. Cleanse is the initial selected step; changing it updates the image and text together. No automatic selection while scrolling.

**Mobile scroll:** Selection changes only on activation, never on scroll position. Keep the selected region stable in height where practical.

**Mobile tap / focus:** Tap one of three labelled buttons. Focus alone does not select. The selected button is visibly marked and exposes aria-pressed.

**Mobile React:** RitualSteps/ServeSteps owns selectedStepId. One record supplies image and copy. No incomplete ARIA tab implementation; do not duplicate state for mobile.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S05 — A quieter moment at the sink

**Content:** Contextual adult morning scene, no clinical before/after comparison.

**Real build reference:** [Vintner’s Daughter — Products and stories](https://vintnersdaughter.com/) · [Primary-page content](../research/live-reference-register.md#vintner)

**Layout:** Large natural-light image; caption in cream outside.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Our approach → /serein/our-approach

**Mobile reflow — this same tout:** Sink photo and short narrative stack; The daily ritual is a normal descriptive link. Keep the bottle and tap in the crop.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S06 — Everyday rituals / embedded community

**Content:** Before the day / A moment of care / When the day slows are editorial concepts.

**Real build reference:** [Botnia — Homepage](https://www.botniaskincare.com/) · [Browser category click + DOM + screenshot](../research/live-reference-register.md#botnia)

**Layout:** One smaller portrait embedded with S05; no stand-alone tile strip.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- Everyday rituals → /serein/journal/everyday-rituals

**Mobile reflow — this same tout:** A single portrait supports the sink story. Additional ritual stories are linked from the journal; no customer testimonial is implied.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S07 — Care journal and practical help

**Content:** Finding your daily rhythm / A guide to texture. Help rows use shared disclosure behavior.

**Real build reference:** [Botnia — Homepage](https://www.botniaskincare.com/) · [Browser category click + DOM + screenshot](../research/live-reference-register.md#botnia)

**Layout:** Text-led stories plus one texture; FAQs have generous line spacing.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- Finding your rhythm → /serein/journal/daily-rhythm
- Guide to texture → /serein/journal/texture
- Using Daily Oil / Your routine / Shipping → disclosures

**Help-row behavior:** Enter/Space or click toggles native details/summary. Multiple answers may remain open. Expanded copy includes the relevant detail-page link. Summary text darkens and the plus rotates 90° over 160 ms. No photo animation. Entire summary is a minimum 48 px row; no hover requirement. Reduced motion opens immediately.


**Mobile reflow — this same tout:** Two journal text rows followed by Using Daily Oil, Your routine and Shipping disclosures. Entire summary row is the tap target.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S08 — Letters from Serein

**Content:** Optional email updates; no diagnostic quiz data collected on homepage.

**Real build reference:** [Botnia — Homepage](https://www.botniaskincare.com/) · [Browser category click + DOM + screenshot](../research/live-reference-register.md#botnia)

**Layout:** Peach signup, visible label, one button.

**Scroll:** Static closing composition. Form never follows the user or opens an unsolicited modal.

**Hover and focus:** Button changes fill/foreground over 160 ms; input retains a stable border. Focus ring is always explicit.

**Activation:** Real form submit uses idle/submitting/success/error. Validate email, prevent duplicate requests, announce status and preserve input on failure. Until endpoint exists label demo as not connected.

**Touch / small screen:** Visible label plus autocomplete=email; 44 px button. Success stays in place without redirect.

**React:** NewsletterForm owns status and error; server action/API owns persistence. Keep inquiry CTA separate from marketing opt-in.

**Individual tiles / destinations:**

- Join us → newsletter endpoint, pending

**Mobile reflow — this same tout:** Letters from Serein, field and Join us stack on peach. Use 16px minimum input text, a persistent label and an inline status region.

**Mobile scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Mobile tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**Mobile React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### S09 — Serein footer

**Content:** Daily ritual / Daily Oil / Ingredients / Approach / Contact / Privacy / Terms.

**Real build reference:** [Vintner’s Daughter — Products and stories](https://vintnersdaughter.com/) · [Primary-page content](../research/live-reference-register.md#vintner)

**Layout:** Open cream footer with restrained blue baseline.

**Scroll:** Static footer in document flow with adequate bottom padding.

**Hover and focus:** Simple underline only; logo remains still.

**Activation:** Real anchors to existing routes; future routes are documented as planned, not fake working links.

**Touch / small screen:** Groups stack and remain expanded; maintain clear reading order.

**React:** SiteFooter from route groups and contact data. No animation state.

**Individual tiles / destinations:**

- Daily ritual → /serein/daily-ritual
- Ingredients → /serein/ingredients
- Approach → /serein/our-approach

**Mobile reflow — this same tout:** Two readable footer columns with comfortable line height. Ingredients and approach may be one editorial destination; final routing must retain all approved pages.

**Mobile scroll:** Footer follows the newsletter with no fixed positioning.

**Mobile tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**Mobile React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-05-serein.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

## Content and asset handoff

Use the approved hero from research/approved. The long image is a composition reference; rebuild type and controls as HTML. Individual product, on-body, process and editorial assets are needed for implementation; do not slice UI text into photographs. Preserve approved silhouettes and packaging. Below-fold scenes, secondary products and stories remain design proposals.

## Image generation

[Exact round-two prompt](../prompts/desktop/05-serein.txt) · [Manifest](../manifest.json)

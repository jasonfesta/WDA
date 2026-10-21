# Oriel — tout and interaction specification

Round 2 · 21 October 2026 · [Shared React contract](react-interaction-contract.md) · [Live reference evidence](../research/live-reference-register.md)

## Desktop and mobile preview

[Side-by-side review](../reviews/03-oriel.html) · [Desktop long image](../images/desktop/03-oriel.png) · [One continuous mobile homepage](../images/mobile/03-oriel.jpg)

[Mobile research and exact prompts](mobile-03-oriel.md) · [Mobile React contract](react-mobile-contract.md)

## Critique and revised composition

The hero is open and monumental; the first lower page reduced it to a dense catalog. Restore long ivory pauses, photographs of different sizes and a single quiet material composition. Keep architectural geometry true: organic means rhythm, daylight and irregular spacing, not decorative blob masks.

Largest pauses in the set: 192–240 px between chapters at 1440 desktop; 96 px offsets; 7% side gutters. No adjacent full-width color bands. 70%+ of non-hero ground stays light ivory. Only one dark footer.

## Page sequence

1. Approved oriel hero unchanged: huge cream lowercase wordmark, rammed earth wall, oval opening, oak and brass.
2. Long luminous ivory pause with Places with a second life and short fine-type filters All / Culture / Living. One large Willow Hall landscape at left, ONE smaller River Rooms portrait offset far lower at right, with huge blank space around both. Foundry Commons is a small text link, never a third card.
3. Willow Hall, reopened: enormous architectural photograph, about 75% page width, offset right. Quiet 2-line serif heading and tiny caption outside; one very small plan drawing in margin below. Do not make a 50/50 boxed split.
4. Matter. Light. Belonging.: an open cream editorial still life of irregular earth sample, oak joinery block and brass offcut on a studio table in sunlight, one photograph only. Small Listen / Reuse / Make / Inhabit process notes run nearby, not in four bordered panels.
5. A place becomes itself through people: one large photographic panorama of the hall in use. Let it breathe with cream before and after. No text overlay rectangle. One small workshop-detail photo offset below can support Shared perspectives.
6. Practice notes: mostly typography and negative space, two links Working with what is here / Drawing with daylight, one small daylight detail. No two-by-two photo grid.
7. What could this place become? Huge airy ivory invitation with small Start a conversation action and separate email line. Finish with simple cocoa footer.

## Tout register

Every former section is accounted for, including those embedded in larger compositions. Destinations are planned routes, not deployed pages. Scroll, hover and React details are WDA proposals.

### O00 — Willow Hall hero

**Content:** Approved ORIEL / SPATIAL PRACTICE and Willow Hall culture/community narrative.

**Real build reference:** [Olson Kundig — Design approach](https://olsonkundig.com/design-approach/) · [Primary-page content](../research/live-reference-register.md#olson)

**Layout:** Exact 1681:936 hero composition.

**Scroll:** Normal document flow; no hero parallax, crop change or scroll-scrubbed lettering. Header becomes a solid 64 px surface only after the hero exits. Preserve its footprint.

**Hover and focus:** Underline actionable text over 180 ms. Photo and brand wordmark stay still.

**Activation:** Use real navigation links. Menu is a button with aria-expanded; Escape closes and focus returns.

**Touch / small screen:** Same visible actions; menu button at 44 × 44 px minimum. Approved desktop composition gets a separately art-directed mobile crop later.

**React:** Hero + SiteHeader; IntersectionObserver sentinel owns header mode. Hero content has no React animation state.

**Individual tiles / destinations:**

- Projects → /oriel/projects
- Approach → /oriel/approach

**Mobile reflow — this same tout:** Portrait crop preserves the oval opening, oak and earth. Lowercase oriel stays large. Primary copy and Step inside remain visible without swiping.

**Mobile scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Mobile tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**Mobile React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O01 — Places with a second life / project index

**Content:** Willow Hall / River Rooms / Foundry Commons; All / Culture / Living. All project facts remain conceptual.

**Real build reference:** [Snøhetta — Project index](https://www.snohetta.com/projects?view=list&sortBy=last-updated) · [Browser click + URL + DOM](../research/live-reference-register.md#snohetta)

**Layout:** Two offset images; third text-only. ProjectTout behavior applies to each result.

**Scroll:** Changing filter preserves the control’s position and uses normal document flow. No masonry reordering.

**Hover and focus:** Underline category label over 160 ms; image behavior follows ProjectTout.

**Activation:** All/Culture/Living are ordinary filter links carrying ?type=. Selected state is aria-current; browser Back restores it. Show result count and empty state.

**Touch / small screen:** Labels wrap naturally. No horizontal drag required; 44 px targets.

**React:** ProjectIndex receives type from router/searchParams; filters project data. CSS handles layout. No duplicated URL and component selection state.

**Individual tiles / destinations:**

- Willow Hall → /oriel/projects/willow-hall
- River Rooms → /oriel/projects/river-rooms
- Foundry Commons → /oriel/projects/foundry-commons

**Each project tile:** Image scale 1→1.018 over 500 ms inside its crop; arrow moves 4 px over 180 ms. Title remains visible. Keyboard uses a 2 px focus outline. Whole image/caption is one descriptive link to the project page. Do not put a nested button inside it.


**Mobile reflow — this same tout:** All / Culture / Living wrap above a vertical sequence: Willow Hall, River Rooms, then Foundry Commons link. Project names and category labels sit below each image.

**Mobile scroll:** Changing a filter keeps focus on the control and does not jump to the top. Existing results remain while pending.

**Mobile tap / focus:** Tap All, Culture or Living to change the URL-backed selection; show selected styling and a result count.

**Mobile React:** ProjectIndex reads router search params as the source of truth. Browser Back restores selection. Empty state includes Reset; do not make width determine filter state.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O02 — Willow Hall, reopened

**Content:** Retained fabric and shared use; no invented floor area, location or performance metrics.

**Real build reference:** [Olson Kundig — Design approach](https://olsonkundig.com/design-approach/) · [Primary-page content](../research/live-reference-register.md#olson)

**Layout:** 9-column image with 2-column margin caption; plan below, not in a boxed fact panel.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Explore Willow Hall → /oriel/projects/willow-hall

**Mobile reflow — this same tout:** Willow Hall heading, short narrative, earth/oval interior photo, small plan and project link follow DOM order. No floating metadata or narrow side column.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O03 — Matter. Light. Belonging.

**Content:** Earth / Oak / Brass; material palette carried from original hero.

**Real build reference:** [Olson Kundig — Design approach](https://olsonkundig.com/design-approach/) · [Primary-page content](../research/live-reference-register.md#olson)

**Layout:** One photographic material still life; tiny external labels, no triptych.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Material approach → /oriel/approach#materials

**Mobile reflow — this same tout:** One material still life spans the content area. Earth, Oak and Brass notes remain text under it. Use a 72–96px chapter pause.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O04 — Built through conversation

**Content:** Listen / Reuse / Make / Inhabit proposed process.

**Real build reference:** [Olson Kundig — Design approach](https://olsonkundig.com/design-approach/) · [Primary-page content](../research/live-reference-register.md#olson)

**Layout:** Text sequence integrated with O03. All descriptions visible; do not invent hover cards.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Our process → /oriel/approach#process

**Mobile reflow — this same tout:** Listen / Reuse / Make / Inhabit become an ordered vertical list beneath the material story. All text is available without a selector.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O05 — A place becomes itself through people

**Content:** Hall-in-use image shows adult community use at believable human scale.

**Real build reference:** [Snøhetta — Project index](https://www.snohetta.com/projects?view=list&sortBy=last-updated) · [Browser click + URL + DOM](../research/live-reference-register.md#snohetta)

**Layout:** Wide 16:7 photograph and standalone caption with ivory margins.

**Scroll:** Large image enters naturally; supporting text reveals once with a 12 px/600 ms settle. No section pinning or content swapping caused by scrolling.

**Hover and focus:** Only the text action underlines; editorial photo stays still unless it is itself the linked tout.

**Activation:** A descriptive story link opens its route. Noninteractive material photographs remain figure/figcaption.

**Touch / small screen:** Image then copy in the same DOM order; remove desktop overlaps; keep 48–72 px between chapters.

**React:** EditorialTout with eyebrow, title, body, image, imageSide and optional href. Static content props; CSS grid does the composition.

**Individual tiles / destinations:**

- Life at Willow Hall → /oriel/projects/willow-hall#use

**Mobile reflow — this same tout:** Community heading and short copy precede the hall-in-use photo. Keep text outside the photo so contrast does not depend on the crop.

**Mobile scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Mobile tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**Mobile React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O06 — Shared perspectives

**Content:** On site / In the workshop / Around the table are proposed practice-story links.

**Real build reference:** [Olson Kundig — Design approach](https://olsonkundig.com/design-approach/) · [Primary-page content](../research/live-reference-register.md#olson)

**Layout:** Short text links and one small offset workshop photo within O05, no carousel.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- On site → /oriel/practice/on-site
- In the workshop → /oriel/practice/making
- Around the table → /oriel/projects/willow-hall#use

**Mobile reflow — this same tout:** Shared perspectives follows with a single workshop image and visible story link. Additional practice stories remain accessible on the linked route.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O07 — Practice notes

**Content:** Working with what is here / Drawing with daylight.

**Real build reference:** [Olson Kundig — Design approach](https://olsonkundig.com/design-approach/) · [Primary-page content](../research/live-reference-register.md#olson)

**Layout:** Two spacious text links, one daylight detail; no card backgrounds.

**Scroll:** Two stories with different image proportions form one quiet composition. Reveal once per story, 80 ms maximum stagger.

**Hover and focus:** Title underline and arrow translate 4 px. Optional image scale limited to 1.018; no hidden excerpt.

**Activation:** One link per story with a specific article title. Community captions only link when an actual owned story exists; decorative images have no pointer cursor.

**Touch / small screen:** Stack stories. Headline and short summary remain visible; no carousel required.

**React:** StoryLink[] from journal content; each owns image, title, excerpt and href. State-free unless editorial pagination is added later.

**Individual tiles / destinations:**

- Working with what is here → /oriel/approach#reuse
- Drawing with daylight → /oriel/practice/daylight

**Mobile reflow — this same tout:** Working with what is here and Drawing with daylight become generous text rows with separators; do not collapse them into an auto-rotating carousel.

**Mobile scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Mobile tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**Mobile React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O08 — What could this place become? / Notes from Oriel

**Content:** Separate project inquiry route and optional studio-news subscription.

**Real build reference:** [Workstead — Project inquiry](https://workstead.com/project-inquiry/) · [Primary-page content; no submission](../research/live-reference-register.md#inquiry)

**Layout:** 240 px top pause, short title, discreet controls.

**Scroll:** Static closing composition. Form never follows the user or opens an unsolicited modal.

**Hover and focus:** Button changes fill/foreground over 160 ms; input retains a stable border. Focus ring is always explicit.

**Activation:** Real form submit uses idle/submitting/success/error. Validate email, prevent duplicate requests, announce status and preserve input on failure. Until endpoint exists label demo as not connected.

**Touch / small screen:** Visible label plus autocomplete=email; 44 px button. Success stays in place without redirect.

**React:** NewsletterForm owns status and error; server action/API owns persistence. Keep inquiry CTA separate from marketing opt-in.

**Individual tiles / destinations:**

- Start a conversation → /oriel/practice#contact
- Notes from Oriel → newsletter endpoint, pending

**Mobile reflow — this same tout:** The inquiry CTA occupies a full row. Notes from Oriel and the labelled email field follow as a separate opt-in. Leave clear separation between the two actions.

**Mobile scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Mobile tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**Mobile React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

### O09 — Oriel footer

**Content:** Projects / Approach / Practice / Contact / Privacy / Terms.

**Real build reference:** [Snøhetta — Project index](https://www.snohetta.com/projects?view=list&sortBy=last-updated) · [Browser click + URL + DOM](../research/live-reference-register.md#snohetta)

**Layout:** Simple cocoa footer. Lowercase wordmark retains weight and proportion.

**Scroll:** Static footer in document flow with adequate bottom padding.

**Hover and focus:** Simple underline only; logo remains still.

**Activation:** Real anchors to existing routes; future routes are documented as planned, not fake working links.

**Touch / small screen:** Groups stack and remain expanded; maintain clear reading order.

**React:** SiteFooter from route groups and contact data. No animation state.

**Individual tiles / destinations:**

- Projects → /oriel/projects
- Approach → /oriel/approach
- Practice → /oriel/practice

**Mobile reflow — this same tout:** Small cocoa footer with two link groups and visible oriel identity. Exact text and tap area sizes come from CSS, not the raster.

**Mobile scroll:** Footer follows the newsletter with no fixed positioning.

**Mobile tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**Mobile React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

[Phone-width source evidence](../research/mobile.md) · [Complete mobile adaptation](mobile-03-oriel.md)


**Reduced motion:** immediate state changes; no transforms, zoom or scroll smoothing. Preserve focus, selection and content.

## Content and asset handoff

Use the approved hero from research/approved. The long image is a composition reference; rebuild type and controls as HTML. Individual product, on-body, process and editorial assets are needed for implementation; do not slice UI text into photographs. Preserve approved silhouettes and packaging. Below-fold scenes, secondary products and stories remain design proposals.

## Image generation

[Exact round-two prompt](../prompts/desktop/03-oriel.txt) · [Manifest](../manifest.json)

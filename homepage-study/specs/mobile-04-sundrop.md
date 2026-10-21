# Sundrop — mobile adaptation

[Desktop and mobile review](../reviews/04-sundrop.html) · [Complete tout specification](04-sundrop.md)

## Same homepage, narrower composition

Place the portrait drink scene above the pack chooser. Pack options become full-width radio rows with a single clear selected state. Serving steps remain visible tap buttons; no fixed checkout bar.

[One continuous mobile image](../images/mobile/04-sundrop.jpg) · [Unchanged desktop image](../images/desktop/04-sundrop.png)

## Content sequence

1. D00 — A slower sip / hero

2. D01 — Find your first pour / pack chooser

3. D02 — Flavor story

4. D03 — What goes into a slower afternoon

5. D04 — Chill / Pour / Settle in

6. D05 — There’s room at our table

7. D06 — Good company, unhurried

8. D07 — Afternoon journal and practical FAQ

9. D08 — A little sunshine in your inbox

10. D09 — Sundrop footer

## Mobile behavior for every tout

### D00 — A slower sip / hero

**Reflow:** Headline wraps above a portrait can/coupe composition. Preserve 200 ml and 8% ALC/VOL. Find your first pour goes to the pack chooser in the same document.

**Scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

### D01 — Find your first pour / pack chooser

**Reflow:** Product scene precedes three full-width radio labels: 4 / 8 / 12 cans. One selected row, one derived price, one Choose your pack action. No fixed purchase bar.

**Scroll:** Chooser remains in flow. Reserve image space so a pack change does not move the CTA unexpectedly.

**Tap / focus:** Tap the complete radio label to select 4, 8 or 12. Count, price, image and destination derive together; activation does not add to cart.

**React:** PackSelector uses one selectedPackId. Native fieldset/legend/radios; polite price update. Same commerce data and state contract at every width.

### D02 — Flavor story

**Reflow:** Flavor heading and ingredient scene stack vertically. The can stays readable and proportionate.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### D03 — What goes into a slower afternoon

**Reflow:** Ingredient labels can form a short three-up list at 390px; switch to one column at 320px or enlarged text. No ingredient claims beyond approved copy.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### D04 — Chill / Pour / Settle in

**Reflow:** Chill / Pour / Settle in are three visible buttons. Selection changes one instruction region and its approved image; it never advances with scroll or a timer.

**Scroll:** Selection changes only on activation, never on scroll position. Keep the selected region stable in height where practical.

**Tap / focus:** Tap one of three labelled buttons. Focus alone does not select. The selected button is visibly marked and exposes aria-pressed.

**React:** RitualSteps/ServeSteps owns selectedStepId. One record supplies image and copy. No incomplete ARIA tab implementation; do not duplicate state for mobile.

### D05 — There’s room at our table

**Reflow:** Adult gathering photo is a full-width story with an explicit Pull up another chair link. Keep adequate contrast if copy overlays the crop.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### D06 — Good company, unhurried

**Reflow:** Supporting community notes remain inside the table story rather than three repeated photo cards. Route links retain descriptive labels.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### D07 — Afternoon journal and practical FAQ

**Reflow:** Two journal entries stack with visible text; How to serve, Pack sizes and Delivery follow as separate full-width help disclosures.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### D08 — A little sunshine in your inbox

**Reflow:** Peach newsletter uses a full-width field and a full-width button on the next row. Keep consent and error text in the same flow.

**Scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

### D09 — Sundrop footer

**Reflow:** Two readable footer groups and Enjoy responsibly. The product category and ABV remain consistent with the desktop concept.

**Scroll:** Footer follows the newsletter with no fixed positioning.

**Tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

## Reference at phone width

[Ghia — mobile product categories](https://drinkghia.com/)

At 390 × 844, a portrait hero is followed by category tabs and a large product tile with a sliver of the next tile visible. Activating Fizz selected it and displayed Le Fizz products. No cart or checkout action was performed.

Sundrop uses clear selected controls and generous product imagery. Its pack chooser remains a vertical radio group, and it retains 8% ALC/VOL; Ghia’s nonalcoholic product claims are not transferred.

[Captured evidence](../research/mobile.md) · [Shared mobile React contract](react-mobile-contract.md)

## Exact mobile generation prompts

The following prompts generated consecutive sections of this one homepage. The review presents one continuous result.

### Source section 1

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Sundrop
ART DIRECTION: Warm apricot, cream, deep wine-red condensed display type, coral-orange SUNDROP apricot aperitif can, ribbed coupe with spritz, apricots, Mediterranean sun. Exact product identity: 200 ml, 8% ALC/VOL. Never import Ghia alcohol-free claims.
PANEL 1 OF 3:
TOP: compact cream SUNDROP wordmark header with Menu and basket. Large wine-red condensed A SLOWER SIP. A BRIGHTER AFTERNOON. above a generous portrait still life of the original orange apricot can, ribbed spritz coupe and apricots. The label reads 200 ml and 8% ALC/VOL. Find your first pour link. Below on cream: FIND YOUR FIRST POUR. One warm product box-and-can photo. Three readable full-width radio rows: selected 4 cans $24; unselected 8 cans $44; unselected 12 cans $60. Full-width Choose your pack button. No footer. No purchase confirmation.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 2

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Sundrop
ART DIRECTION: Warm apricot, cream, deep wine-red condensed display type, coral-orange SUNDROP apricot aperitif can, ribbed coupe with spritz, apricots, Mediterranean sun. Exact product identity: 200 ml, 8% ALC/VOL. Never import Ghia alcohol-free claims.
PANEL 2 OF 3:
MIDDLE: no header, no opening hero, no footer. Cream. APRICOT. BITTER ORANGE. A LITTLE SPARKLE. One large full-width ingredient scene with the exact orange can, apricots, bitter orange and botanicals. Three short ingredients rows below. Broad cream pause. CHILL. POUR. TAKE YOUR TIME. A generous portrait pouring image of the original can into ribbed coupe. Beneath it three clearly labelled tap controls 01 Chill / 02 Pour / 03 Settle in, with Chill visibly selected and one short current instruction below. No side-by-side text/photo split. Finish on cream.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 3

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Sundrop
ART DIRECTION: Warm apricot, cream, deep wine-red condensed display type, coral-orange SUNDROP apricot aperitif can, ribbed coupe with spritz, apricots, Mediterranean sun. Exact product identity: 200 ml, 8% ALC/VOL. Never import Ghia alcohol-free claims.
PANEL 3 OF 3:
BOTTOM: no header. THERE’S ROOM AT OUR TABLE. One large photo of adult friends with spritz glasses at a sunny table, with Pull up another chair below. THE AFTERNOON JOURNAL. Two stacked editorial links with one small photo each: The orange-twist pour / A table for four. Three full-width FAQ rows: How to serve + / Pack sizes + / Delivery +. Peach newsletter A LITTLE SUNSHINE IN YOUR INBOX. Full-width Email address field then Join our table button. Complete wine-red SUNDROP footer with Aperitifs / How we pour / Our table / Contact / Privacy / Terms. Enjoy responsibly.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

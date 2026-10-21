# Serein — mobile adaptation

[Desktop and mobile review](../reviews/05-serein.html) · [Complete tout specification](05-serein.md)

## Same homepage, narrower composition

The desktop split hero becomes copy then portrait, with the Daily Oil inset retained. Product details stay visible. Routine selection becomes three tap buttons above one stable panel; help becomes a vertical disclosure list.

[One continuous mobile image](../images/mobile/05-serein.jpg) · [Unchanged desktop image](../images/desktop/05-serein.png)

## Content sequence

1. S00 — A little care, every day / hero

2. S01 — Everyday essentials / product tiles

3. S02 — Daily Oil / signature story

4. S03 — Close to the source

5. S04 — Cleanse / Nourish / Pause

6. S05 — A quieter moment at the sink

7. S06 — Everyday rituals / embedded community

8. S07 — Care journal and practical help

9. S08 — Letters from Serein

10. S09 — Serein footer

## Mobile behavior for every tout

### S00 — A little care, every day / hero

**Reflow:** Peach copy block above the portrait. Retain botanical accent, blue background and Daily Oil 30 ml inset. The blue ritual strip points to the routine section.

**Scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

### S01 — Everyday essentials / product tiles

**Reflow:** Daily Oil is the lead product; Dew Cleanser and Cloud Cream follow. Preserve names, volumes and concept prices. At 320px, stack secondary products.

**Scroll:** Products remain readable without animation or a swipe. Any entrance is optional and disabled for reduced motion.

**Tap / focus:** One tap on the product link opens its detail route. Approved variant swatches, if implemented, use separate 44px buttons; first tap never merely reveals a hover CTA.

**React:** One ProductRange data array and CSS grid. Variant state is per product only when approved; keep links separate from buttons.

### S02 — Daily Oil / signature story

**Reflow:** Keep Daily Oil bottle fully visible and its 30 ml label consistent. Text and image stack whenever the content width cannot support readable type.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### S03 — Close to the source

**Reflow:** Botanical photo is followed by vertical Leaves / Petals / Texture notes. These are explanatory content, not filters.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### S04 — Cleanse / Nourish / Pause

**Reflow:** Three tap buttons above one routine panel. Cleanse is the initial selected step; changing it updates the image and text together. No automatic selection while scrolling.

**Scroll:** Selection changes only on activation, never on scroll position. Keep the selected region stable in height where practical.

**Tap / focus:** Tap one of three labelled buttons. Focus alone does not select. The selected button is visibly marked and exposes aria-pressed.

**React:** RitualSteps/ServeSteps owns selectedStepId. One record supplies image and copy. No incomplete ARIA tab implementation; do not duplicate state for mobile.

### S05 — A quieter moment at the sink

**Reflow:** Sink photo and short narrative stack; The daily ritual is a normal descriptive link. Keep the bottle and tap in the crop.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### S06 — Everyday rituals / embedded community

**Reflow:** A single portrait supports the sink story. Additional ritual stories are linked from the journal; no customer testimonial is implied.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### S07 — Care journal and practical help

**Reflow:** Two journal text rows followed by Using Daily Oil, Your routine and Shipping disclosures. Entire summary row is the tap target.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### S08 — Letters from Serein

**Reflow:** Letters from Serein, field and Join us stack on peach. Use 16px minimum input text, a persistent label and an inline status region.

**Scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

### S09 — Serein footer

**Reflow:** Two readable footer columns with comfortable line height. Ingredients and approach may be one editorial destination; final routing must retain all approved pages.

**Scroll:** Footer follows the newsletter with no fixed positioning.

**Tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

## Reference at phone width

[Botnia — mobile skincare homepage](https://www.botniaskincare.com/)

At 390 × 844, product imagery and its name, price and action appear above full-width category rows with chevrons and separators. A newsletter overlay was dismissed. The capture verifies the row composition; no category result transition is claimed.

Serein keeps product information visible and uses full-width help disclosures. Its routine selector is a proposed three-button control, not a copied Botnia interaction.

[Captured evidence](../research/mobile.md) · [Shared mobile React contract](react-mobile-contract.md)

## Exact mobile generation prompts

The following prompts generated consecutive sections of this one homepage. The review presents one continuous result.

### Source section 1

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Serein
ART DIRECTION: Peach, pale blue, warm ivory, wine-burgundy elegant serif with italic accents. Brown-skinned adult woman, blue sky, botanical leaves and amber Daily Oil bottle with sculptural coral pump. Daily Oil 30 ml. Keep approved model and bottle identity.
PANEL 1 OF 3:
TOP: compact cream SEREIN header with Menu and Bag (0). Peach copy block A little care, every day. with italic every day and Build your daily ritual button. Beneath it a tall portrait of the approved brown-skinned woman against blue sky with narrow botanical accent and small amber/coral-pump Daily Oil 30 ml inset. Thin pale-blue 01 Cleanse / 02 Nourish / 03 Pause strip below portrait. On ivory: Your everyday essentials. The Daily Oil hero product centered, then Dew Cleanser and Cloud Cream in a smaller two-up row. Visible correct captions: Dew Cleanser 150 ml $32; Daily Oil 30 ml $48; Cloud Cream 50 ml $42. No footer.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 2

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Serein
ART DIRECTION: Peach, pale blue, warm ivory, wine-burgundy elegant serif with italic accents. Brown-skinned adult woman, blue sky, botanical leaves and amber Daily Oil bottle with sculptural coral pump. Daily Oil 30 ml. Keep approved model and bottle identity.
PANEL 2 OF 3:
MIDDLE: no header, no opening hero, no footer. Peach and ivory. Daily Oil. A softer finish. One generous full-width close-up of the exact amber Daily Oil 30 ml bottle with coral pump on pale stone, short copy and Meet Daily Oil below. Ivory pause. Close to the source. One full-width botanical leaf/petal image with a glistening oil droplet, followed by short Leaves / Petals / Texture notes. Pale blue ritual chapter: Cleanse. Nourish. Pause. Three comfortably sized buttons 01 Cleanse / 02 Nourish / 03 Pause; Cleanse underlined as selected. One single portrait of the same adult woman washing her face below the controls and concise Dew Cleanser text. Finish on ivory.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 3

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Serein
ART DIRECTION: Peach, pale blue, warm ivory, wine-burgundy elegant serif with italic accents. Brown-skinned adult woman, blue sky, botanical leaves and amber Daily Oil bottle with sculptural coral pump. Daily Oil 30 ml. Keep approved model and bottle identity.
PANEL 3 OF 3:
BOTTOM: no header. Ivory. A quieter moment at the sink. One large stone sink photo with the amber/coral Daily Oil bottle and botanical stem. Below one small inset portrait of the same woman, and The daily ritual link. The care journal: two separated readable links Finding your daily rhythm / A guide to texture. Full-width help rows Using Daily Oil + / Your routine + / Shipping +. Peach newsletter Make a little room for yourself. with Letters from Serein, full-width Email address field and Join us button below. Complete ivory footer SEREIN, Daily ritual / Daily Oil / Ingredients / Approach / Contact / Privacy / Terms. End with a subtle pale-blue strip.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

Correction:

```text
Use case: ui-mockup / precise layout correction. Edit the attached MOBILE closing page segment. Keep the same SEREIN identity, colors, imagery and headings. Correct only the undersized footer: make the bottom links readable at the same text size as the rest of this mobile page, in TWO columns of THREE links: Daily ritual / Daily Oil / Ingredients and Approach / Contact / Privacy. Give footer links generous line-height and padding. Make room by reducing the portrait photo height and by shortening journal descriptions; never shrink text. Keep complete newsletter field and Join us button. Preserve sink photo, adult model, The care journal, three help rows and peach close. Complete ivory footer and pale blue end strip must be visible with bottom padding. 1:3 portrait canvas, no new header.

```

# Avela / Soft Form — mobile adaptation

[Desktop and mobile review](../reviews/01-avela.html) · [Complete tout specification](01-avela.md)

## Same homepage, narrower composition

Lead with the Arc; use a two-up row only for the two secondary bags. Flat-lay, making and coastal stories become separate full-width reading moments. Care stays in full-width disclosure rows.

[One continuous mobile image](../images/mobile/01-avela.jpg) · [Unchanged desktop image](../images/desktop/01-avela.png)

## Content sequence

1. A00 — Campaign / SOFT FORM

2. A01 — Forms for every day / 3 product tiles

3. A02 — The Arc / capacity story

4. A03 — Shaped by hand / making

5. A04 — Carried through the day

6. A05 — Made to stay with you / care rows

7. A06 — In good company / embedded community

8. A07 — Notes from the workshop / embedded journal

9. A08 — A longer story, in your inbox

10. A09 — Avela footer

## Mobile behavior for every tout

### A00 — Campaign / SOFT FORM

**Reflow:** Portrait campaign crop keeps the whole Arc bag visible; SOFT FORM wraps into two lines. Compact Menu / Bag header. Copy and image retain the approved campaign.

**Scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

### A01 — Forms for every day / 3 product tiles

**Reflow:** The Arc leads on its own; The Fold and The Day form the secondary pair. At 320px, stack the pair if labels wrap badly. Product names and prices remain visible. Swatches shown in the concept require approved variants before implementation.

**Scroll:** Products remain readable without animation or a swipe. Any entrance is optional and disabled for reduced motion.

**Tap / focus:** One tap on the product link opens its detail route. Approved variant swatches, if implemented, use separate 44px buttons; first tap never merely reveals a hover CTA.

**React:** One ProductRange data array and CSS grid. Variant state is per product only when approved; keep links separate from buttons.

### A02 — The Arc / capacity story

**Reflow:** Blue flat-lay spans the content width, followed by heading, short copy and Discover the Arc. No copy column beside the image.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### A03 — Shaped by hand / making

**Reflow:** Making photograph and stitch detail stack vertically. Process remains readable copy; Read the workshop story is a normal link.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### A04 — Carried through the day

**Reflow:** Coastal carry image becomes a portrait composition. Retain the same bag and campaign wardrobe. The CTA is outside any ambiguous image-only target.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### A05 — Made to stay with you / care rows

**Reflow:** What fits, Leather care and Repairs are three full-width independent disclosure rows. Open answers increase document height.

**Scroll:** Expanding an answer changes page height naturally and retains focus on its summary.

**Tap / focus:** Tap anywhere in the full-width summary row to toggle. Multiple answers may stay open.

**React:** Use native details/summary, preserve content in DOM, and style the focus ring. Do not animate measured height under reduced motion.

### A06 — In good company / embedded community

**Reflow:** The two supporting carry stories follow the main coastal story. At 390px they can be a two-up pair; use one column at 320px or large text.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### A07 — Notes from the workshop / embedded journal

**Reflow:** Notes from the workshop becomes one compact editorial link and optional supporting image within the care chapter; the journal archive holds the longer story list.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### A08 — A longer story, in your inbox

**Reflow:** Newsletter heading, labelled email input and Join the atelier button stack in that order. The button spans the available width.

**Scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

### A09 — Avela footer

**Reflow:** Keep AVELA and two short link groups. Use 16px text and 44px minimum row height in the build; legal links remain discoverable.

**Scroll:** Footer follows the newsletter with no fixed positioning.

**Tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

## Reference at phone width

[Polène — mobile homepage](https://eng.polene-paris.com/)

At 390 × 844, the header uses a compact menu and persistent brand/cart controls. Product cards form two columns with names and prices beneath; a large serif editorial passage follows. The cookie notice was dismissed. This is a viewport-width inspection, not a physical-device test.

Retain visible product labels, a compact header and generous story typography. Avela gives its signature Arc more prominence, then uses two secondary products.

[Captured evidence](../research/mobile.md) · [Shared mobile React contract](react-mobile-contract.md)

## Exact mobile generation prompts

The following prompts generated consecutive sections of this one homepage. The review presents one continuous result.

### Source section 1

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Avela / Soft Form
ART DIRECTION: Oxblood gathered crescent Arc bag, brass hardware, terracotta wall, sea blue, ivory, linen woman. Burgundy editorial serif and huge cream SOFT FORM. Keep the exact Arc silhouette.
PANEL 1 OF 3:
TOP: compact AVELA header with Menu and Bag (0). A tall, portrait phone hero of the original linen-clad woman carrying the oxblood Arc in front of terracotta and the sea, bag fully visible. A softer shape. A longer story. Meet the Arc. Huge SOFT / FORM in two cream lines. Hero occupies the upper 55% of this panel. Below it a calm cream product chapter: Forms for every day. The Arc $420 is large on its own, with The Fold $360 and The Day $480 in one smaller two-up row. Each name and Explore link remains readable. End on cream with 24px of blank space. NO footer.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 2

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Avela / Soft Form
ART DIRECTION: Oxblood gathered crescent Arc bag, brass hardware, terracotta wall, sea blue, ivory, linen woman. Burgundy editorial serif and huge cream SOFT FORM. Keep the exact Arc silhouette.
PANEL 2 OF 3:
MIDDLE: no header, no hero, no footer. Start on cream. Upper half: one full-width blue flat-lay photograph of the original Arc with phone, wallet, keys, then heading Soft structure. Room for the everyday. and Discover the Arc below it, not beside it. After a broad cream pause: Shaped by hand. Large full-width photograph of hands working burgundy leather. One small stitch detail below, and Read the workshop story. Use a strictly vertical phone composition, no text columns alongside photographs. End on cream with 24px blank space.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 3

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Avela / Soft Form
ART DIRECTION: Oxblood gathered crescent Arc bag, brass hardware, terracotta wall, sea blue, ivory, linen woman. Burgundy editorial serif and huge cream SOFT FORM. Keep the exact Arc silhouette.
PANEL 3 OF 3:
BOTTOM: no header or opening hero. Start on cream. Carried through the day. One generous coastal portrait of the same linen woman with Arc. Links A weekend away / A familiar favorite beneath. Then Made to stay with you. Three large, full-width accordion rows: What fits + / Leather care + / Repairs +. One Notes from the workshop journal link. A blue newsletter chapter A longer story, in your inbox. with a full-width Email address field and full-width Join the atelier button BELOW it. Finish complete oxblood AVELA footer in two readable link columns: Bags / Workshop / Care / Contact / Privacy / Terms.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

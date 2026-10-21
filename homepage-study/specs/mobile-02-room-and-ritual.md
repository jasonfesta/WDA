# Room & Ritual — mobile adaptation

[Desktop and mobile review](../reviews/02-room-and-ritual.html) · [Complete tout specification](02-room-and-ritual.md)

## Same homepage, narrower composition

Preserve the oversized masthead on two lines. Home stories stack as large photographs with captions; the second home is inset slightly, and Olive Terrace remains a text link. Process becomes a short vertical list.

[One continuous mobile image](../images/mobile/02-room-and-ritual.jpg) · [Unchanged desktop image](../images/desktop/02-room-and-ritual.png)

## Content sequence

1. R00 — Masthead and Courtyard House hero

2. R01 — Rooms for living / home tiles

3. R02 — Inside the Courtyard House

4. R03 — Walnut, wool, afternoon light / materials

5. R04 — Listen / Shape / Gather / Settle

6. R05 — Objects with a place in your story

7. R06 — Life, once the room is finished

8. R07 — Field notes

9. R08 — Make room / Letters from the studio

10. R09 — Room & Ritual footer

## Mobile behavior for every tout

### R00 — Masthead and Courtyard House hero

**Reflow:** ROOM & RITUAL wraps across two lines on blush. Preserve the calligraphic ampersand. The room image uses a portrait-friendly crop that retains the arched window and olive sofa.

**Scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

### R01 — Rooms for living / home tiles

**Reflow:** Courtyard House comes first, Cedar Rooms second, Olive Terrace as a text link third. Captions sit below images; desktop offsets are removed.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### R02 — Inside the Courtyard House

**Reflow:** Dining image, house-tour heading, copy and link form one vertical story. Do not pin the photo while the text scrolls.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### R03 — Walnut, wool, afternoon light / materials

**Reflow:** Walnut-and-wool material detail follows the tour with a visible caption. Material names are editorial labels, not selectable options.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### R04 — Listen / Shape / Gather / Settle

**Reflow:** Sketch followed by four numbered text rows: Listen, Shape, Gather, Settle. All four are visible; no step selection or hover dependency.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### R05 — Objects with a place in your story

**Reflow:** One room/object still life introduces the collection. Specific object links live in the accessible text list or on the collection route, not invisible hotspots on the raster.

**Scroll:** Products remain readable without animation or a swipe. Any entrance is optional and disabled for reduced motion.

**Tap / focus:** One tap on the product link opens its detail route. Approved variant swatches, if implemented, use separate 44px buttons; first tap never merely reveals a hover CTA.

**React:** One ProductRange data array and CSS grid. Variant state is per product only when approved; keep links separate from buttons.

### R06 — Life, once the room is finished

**Reflow:** Gathering image and its narrative stack. Keep adults and the table in the crop; avoid clipping faces with a fixed background.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### R07 — Field notes

**Reflow:** Two editorial rows remain visible. Thumbnail and text can sit side by side at 390px; stack at 320px or 200% text size.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### R08 — Make room / Letters from the studio

**Reflow:** Discuss a space remains a separate navigation link. Newsletter label, input and submit control form a distinct opt-in below it.

**Scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

### R09 — Room & Ritual footer

**Reflow:** Wordmark followed by two compact link groups. Mobile never hides contact information behind hover.

**Scroll:** Footer follows the newsletter with no fixed positioning.

**Tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

## Reference at phone width

[Studio Ashby — mobile projects](https://studioashby.com/projects/)

At 390 × 844, projects form one vertical sequence of large photographs with persistent captions below. The header shows the wordmark and menu icon. Activating Tamodi Estate opened its case-study page; the case-study content was inspected.

Room & Ritual keeps project names outside images and opens each home with one tap. Large photographs carry the narrative; a third project can remain a text link.

[Captured evidence](../research/mobile.md) · [Shared mobile React contract](react-mobile-contract.md)

## Exact mobile generation prompts

The following prompts generated consecutive sections of this one homepage. The review presents one continuous result.

### Source section 1

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Room & Ritual
ART DIRECTION: Blush pink, deep burgundy, cream, walnut, olive wool, warm daylight. Preserve original huge bold ROOM & RITUAL with calligraphic ampersand, arched courtyard window, olive sofa and orange lamp. Authentic architecture, no curved or warped furniture.
PANEL 1 OF 3:
TOP: blush header with small emblem and Menu. Huge ROOM & / RITUAL lettering adapted to two lines, the elegant calligraphic ampersand kept, then A home should hold more than furniture. A tall portrait crop of the approved room with arched window, olive sofa and orange lamp. Beneath on cream: Rooms for living. Large Courtyard House courtyard photograph and visible caption. One smaller inset Cedar Rooms bedroom photograph and caption; Olive Terrace is a text link below. No footer. Keep type readable; no three-column gallery.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 2

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Room & Ritual
ART DIRECTION: Blush pink, deep burgundy, cream, walnut, olive wool, warm daylight. Preserve original huge bold ROOM & RITUAL with calligraphic ampersand, arched courtyard window, olive sofa and orange lamp. Authentic architecture, no curved or warped furniture.
PANEL 2 OF 3:
MIDDLE: no header, no hero, no footer. Cream background. Inside the Courtyard House. One full-width dining room photograph with the same large arched windows and walnut table. Caption and Take the house tour below. A small walnut-and-wool material detail beside a short caption, not a card grid. Long cream pause. From first conversation to final layer. One light pencil room sketch, then four comfortable stacked text rows 01 Listen / 02 Shape / 03 Gather / 04 Settle. Finish on cream.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

Correction:

```text
Use case: ui-mockup / precise layout correction. Edit the attached MOBILE page segment. Keep the same brand, colors, typography and photographs. The final Settle row is clipped at the bottom: fix this. Reduce the height of the pencil sketch and shorten process descriptions to ONE short line each so that all four stages Listen / Shape / Gather / Settle fit fully, with 48 CSS px equivalent of empty cream below the last row. No text may touch or cross the bottom edge. Keep a 1:3 portrait canvas and readable mobile typography. This is a middle section: no header, no footer, no new sections. Preserve Inside the Courtyard House photo and full caption, walnut and wool detail, and From first conversation to final layer.

```

### Source section 3

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Room & Ritual
ART DIRECTION: Blush pink, deep burgundy, cream, walnut, olive wool, warm daylight. Preserve original huge bold ROOM & RITUAL with calligraphic ampersand, arched courtyard window, olive sofa and orange lamp. Authentic architecture, no curved or warped furniture.
PANEL 3 OF 3:
BOTTOM: no header. Cream. Objects with a place in your story. A full-width still life with the orange mushroom lamp, ceramic vessel and walnut table; Explore the collection. Life, once the room is finished: a wide photo of adult friends eating at the courtyard table, caption below. Field notes: two simple separated links Collected over time / Following the afternoon light. Blush close Make room for something good. Separate Discuss a space link, then Email address field and newsletter arrow button. Full dark-burgundy footer with ROOM & RITUAL and two readable link columns Homes / Objects / Field notes / Studio / Contact / Privacy.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

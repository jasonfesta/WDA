# Oriel — mobile adaptation

[Desktop and mobile review](../reviews/03-oriel.html) · [Complete tout specification](03-oriel.md)

## Same homepage, narrower composition

Keep Oriel the most spacious of the five. Filters wrap above a vertical project list. Portrait crops preserve the oval threshold; chapter pauses remain 72–96 CSS pixels, and project metadata sits under the photograph.

[One continuous mobile image](../images/mobile/03-oriel.jpg) · [Unchanged desktop image](../images/desktop/03-oriel.png)

## Content sequence

1. O00 — Willow Hall hero

2. O01 — Places with a second life / project index

3. O02 — Willow Hall, reopened

4. O03 — Matter. Light. Belonging.

5. O04 — Built through conversation

6. O05 — A place becomes itself through people

7. O06 — Shared perspectives

8. O07 — Practice notes

9. O08 — What could this place become? / Notes from Oriel

10. O09 — Oriel footer

## Mobile behavior for every tout

### O00 — Willow Hall hero

**Reflow:** Portrait crop preserves the oval opening, oak and earth. Lowercase oriel stays large. Primary copy and Step inside remain visible without swiping.

**Scroll:** Normal document scroll. Reserve hero height to avoid layout shift; never force a full viewport if copy needs more room.

**Tap / focus:** Menu opens a labelled dialog; Escape/close returns focus. Primary CTA navigates or scrolls to its named section.

**React:** Header owns menuOpen; real links retain keyboard access. Picture sources and CSS object-position adapt crops. No viewport-dependent duplicate content.

### O01 — Places with a second life / project index

**Reflow:** All / Culture / Living wrap above a vertical sequence: Willow Hall, River Rooms, then Foundry Commons link. Project names and category labels sit below each image.

**Scroll:** Changing a filter keeps focus on the control and does not jump to the top. Existing results remain while pending.

**Tap / focus:** Tap All, Culture or Living to change the URL-backed selection; show selected styling and a result count.

**React:** ProjectIndex reads router search params as the source of truth. Browser Back restores selection. Empty state includes Reset; do not make width determine filter state.

### O02 — Willow Hall, reopened

**Reflow:** Willow Hall heading, short narrative, earth/oval interior photo, small plan and project link follow DOM order. No floating metadata or narrow side column.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### O03 — Matter. Light. Belonging.

**Reflow:** One material still life spans the content area. Earth, Oak and Brass notes remain text under it. Use a 72–96px chapter pause.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### O04 — Built through conversation

**Reflow:** Listen / Reuse / Make / Inhabit become an ordered vertical list beneath the material story. All text is available without a selector.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### O05 — A place becomes itself through people

**Reflow:** Community heading and short copy precede the hall-in-use photo. Keep text outside the photo so contrast does not depend on the crop.

**Scroll:** Vertical flow with image aspect ratios reserved. No sticky photo, parallax, or scroll hijacking on the phone.

**Tap / focus:** Caption/CTA remains visible; a normal link opens the story. Decorative photos have no misleading button role.

**React:** EditorialTout/ProjectTout uses the same content and href as desktop. CSS changes grid and image focal point; no separate mobile business logic.

### O06 — Shared perspectives

**Reflow:** Shared perspectives follows with a single workshop image and visible story link. Additional practice stories remain accessible on the linked route.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### O07 — Practice notes

**Reflow:** Working with what is here and Drawing with daylight become generous text rows with separators; do not collapse them into an auto-rotating carousel.

**Scroll:** Entries remain in document order; no autoplay or compulsory horizontal dragging.

**Tap / focus:** One tap on the visible title/CTA navigates. Help rows use independent native disclosures.

**React:** Reuse StoryLink data; CSS changes the layout. Optional thumbnail never becomes the only accessible name.

### O08 — What could this place become? / Notes from Oriel

**Reflow:** The inquiry CTA occupies a full row. Notes from Oriel and the labelled email field follow as a separate opt-in. Leave clear separation between the two actions.

**Scroll:** Form stays in normal flow above the footer and is not covered by a sticky bar or keyboard overlay.

**Tap / focus:** Tap input opens the email keyboard. Explicit submit shows inline validation, pending, server-confirmed success or retryable failure.

**React:** NewsletterForm owns status; server owns success. type=email, autocomplete=email, visible label, aria-describedby and polite status region. No submission is implemented in this concept.

### O09 — Oriel footer

**Reflow:** Small cocoa footer with two link groups and visible oriel identity. Exact text and tap area sizes come from CSS, not the raster.

**Scroll:** Footer follows the newsletter with no fixed positioning.

**Tap / focus:** Links remain visible with generous row targets; do not require a first tap to reveal a link.

**React:** Reuse SiteFooter nav data. CSS grid becomes two columns then one at large text; preserve DOM order and legal destinations.

## Reference at phone width

[Snøhetta — mobile project index](https://www.snohetta.com/projects?view=list&sortBy=last-updated)

At 390 × 844, the project introduction wraps above Grid / List / Map controls, search and two-column filter disclosures. List remained selected. Activating Filter projects updated the results and added a result count and Reset filter link. This was not an audit of every filter option.

Oriel retains explicit All / Culture / Living controls above its project content. The proposed three-filter interface is simpler than the reference; selection is visible and stored in the URL.

[Captured evidence](../research/mobile.md) · [Shared mobile React contract](react-mobile-contract.md)

## Exact mobile generation prompts

The following prompts generated consecutive sections of this one homepage. The review presents one continuous result.

### Source section 1

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Oriel
ART DIRECTION: Huge cream lowercase oriel, terracotta rammed-earth architecture with oval doorway, oak and brass, ivory space, fine editorial serif type. Willow Hall must remain the earth/oval interior; River Rooms alone is the riverside building. No warped architecture.
PANEL 1 OF 3:
TOP: small ORIEL / SPATIAL PRACTICE and Menu header over the approved earth-and-oak interior. Very large cream lowercase oriel across a portrait crop preserving the oval doorway. An old foundry. A new place to gather. and Step inside. Hero occupies about 50% of panel. A substantial uninterrupted ivory pause. Places with a second life. Visible All / Culture / Living filters, All underlined. One large Willow Hall earth-interior project photo with caption below. One smaller River Rooms riverside photo inset with caption, and Foundry Commons as a text-only link. No footer. Keep empty ivory space.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 2

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Oriel
ART DIRECTION: Huge cream lowercase oriel, terracotta rammed-earth architecture with oval doorway, oak and brass, ivory space, fine editorial serif type. Willow Hall must remain the earth/oval interior; River Rooms alone is the riverside building. No warped architecture.
PANEL 2 OF 3:
MIDDLE: no header, no hero, no footer. Entire ground warm ivory, generous quiet space. Willow Hall, reopened. Short sentence, then one large portrait photograph of the original earth/oval/oak hall, not a river house. Tiny plan drawing and Explore the project link below, not next to main photo. Very broad ivory pause. Matter. Light. Belonging. One full-width still life of irregular earth sample, oak joinery block and brass offcut. Beneath, four sparse stacked process rows Listen / Reuse / Make / Inhabit. No boxes, no dense grid. Finish on ivory.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

### Source section 3

```text
Use case: ui-mockup. Create ONE vertical image of the specified consecutive segment of a real mobile homepage. Canvas 1:3 portrait, target 768 x 2304 or native equivalent. This panel represents about 390 x 1170 CSS pixels of a 390px-wide phone page. It is one of THREE consecutive panels, so do not squeeze the entire website into this image. Show ONLY the content assigned to this panel.
The supplied desktop reference is the authority for brand, photography, products and typography. Adapt it to a genuine MOBILE reading order. Body type must be visually equivalent to at least 16px at 390px width; headings 32–40px, touch rows at least 44px high. Use 24px side gutters, full-width images and generous 48–72px chapter pauses (Oriel 72–96px). Main headlines wrap. Stack text and photos vertically. A product pair or short three-button control is the only permitted narrow multi-column layout. Do not shrink a desktop screenshot. No tiny footer columns, boxed cards, phone frame, browser chrome, device mockup, exterior margins, explanatory labels, or duplicate header/footer. Image is website content edge to edge. Preserve natural proportions, contextual photography, and the original art direction. No fabricated claims, reviews or awards. Do not add unrequested content to fill space: use calm blank ground instead.

BRAND: Oriel
ART DIRECTION: Huge cream lowercase oriel, terracotta rammed-earth architecture with oval doorway, oak and brass, ivory space, fine editorial serif type. Willow Hall must remain the earth/oval interior; River Rooms alone is the riverside building. No warped architecture.
PANEL 3 OF 3:
BOTTOM: no header. Ivory breathing space first. A place becomes itself through people. One full-width photograph of adults gathered in the same earth/oval/oak hall. Heading and short copy stay outside the photo. Shared perspectives: one small inset workshop hands photo and Behind the scenes link. Broad ivory pause. Practice notes: two generous text-only links Working with what is here / Drawing with daylight. What could this place become? with Start a conversation button. Separate Notes from Oriel newsletter, Email address field below heading. Finish complete small cocoa footer with oriel and Projects / Approach / Practice / Contact / Privacy. This must remain airy; no collage of small rectangles.

Final check: unmistakably a phone page, large legible type, no desktop columns, only the specified segment, no panel number printed on the design.
```

# Avela / Soft Form — complete review

[All five](../index.html) · [Interaction specification](../specs/01-avela.md)

## Desktop and mobile — same homepage

| Desktop | Mobile |
| --- | --- |
| ![Desktop](../images/desktop/01-avela.png) | ![Mobile](../images/mobile/01-avela.jpg) |

Lead with the Arc; use a two-up row only for the two secondary bags. Flat-lay, making and coastal stories become separate full-width reading moments. Care stays in full-width disclosure rows.

[Mobile prompt set, references and every tout behavior](../specs/mobile-01-avela.md) · [Mobile research](../research/mobile.md) · [Mobile React contract](../specs/react-mobile-contract.md)

## Exact generation prompt

Input 1: approved hero. Input 2: first long concept.

```text
Use case: ui-mockup / art-directed revision of a complete long desktop homepage.

Make ONE single long, complete desktop website screenshot at width:height 1:3, target 1536 x 4608 or maximum useful native resolution. No presentation frame, browser chrome, multiple pages, labels or annotations. Make it look like a serious designed desktop website with several columns, not a narrow mobile site.

REFERENCE 1 is the ORIGINAL APPROVED HERO. It is the strict visual authority. Preserve its brand, photograph, product shape, lettering, art direction, colors and geometry at the top in the original aspect ratio (~19–21% of this long page). Do not reinterpret or rename it.
REFERENCE 2 is the FIRST LONG HOMEPAGE, supplied to show the current direction. Retain its brand world but REBUILD THE BELOW-FOLD LAYOUT. Its flaw is excessive stacked bands, equal-size grids and crowded boxy sections. The new image must visibly correct that flaw, not reproduce it.

The user likes the themes and requests more breathing room, organic pacing, and a stronger continuation of the open approved hero. Organic means natural light, material detail, unequal image scale, offset editorial compositions and generous negative space. It does NOT mean adding wavy borders, bubble cards, cutout blob masks or decorative curves. Keep photographs rectangular, objects and architecture undistorted. Do not bend architecture or stretch images. Do not shrink body copy to fit.

Reduce the visible modules by combining related stories. Seven major compositions including hero/close are specified below. These contain the needed product/project discovery, deeper story, material/process context, human editorial, help/journal and a complete newsletter/footer. Show real working-looking interactive affordances: persistent descriptive links, clear selected controls, restrained underline links, genuine email field. Never print a hover-state diagram or development annotation. Default selected state only. No every-section identical left title rail. No repeated three-column photo strips. No tightly stacked touching colored bands. At least two substantial spans of uninterrupted warm ivory negative space between major image compositions.

Text: short, confident headings and concise real English. Exact brand and product names. No invented awards, reviews, metrics, certification or clinical promises. Prices if specified are concept prices. Full newsletter and footer visible. No clipped page bottom.

BRAND: Avela / Soft Form
REVISION PRIORITY: Keep the campaign strength, remove repetitive triptychs. Products float on cream; the Arc story, craft and coastal story become large, unequal compositions. Workshop notes sit inside craft; community imagery sits inside the coastal story.
SPACING DIRECTION: Desktop chapters 144–192 px apart, side gutters clamp(24px,6vw,96px), 32–48 px internal gaps. Product grounds blend into the cream; no card outlines.

PAGE COMPOSITIONS IN ORDER:
1. Approved SOFT FORM hero exactly as supplied.

2. After a generous cream pause, Forms for every day: three freestanding bags with subtle baseline labels; Arc $420, Fold $360, Day $480. No three background rectangles. Leave space around every silhouette.

3. Large pale-blue Arc flat lay on left occupying 55%; smaller serif copy floated on cream at right, separated by negative space. One short heading: Soft structure. Room for the everyday.

4. Shaped by hand: one substantial terracotta-toned handwork photograph on right and a smaller close-up offset below-left. Use a quiet cream field, not a solid stripe. A single workshop story link replaces a second journal grid.

5. Carried through the day: one large coastal campaign photo and a smaller on-body photograph offset like a magazine spread. Two tiny community captions share this composition, not another row.

6. Made to stay with you: calm wide cream pause, three fine accordion lines left, one small tactile leather detail right.

7. Blue newsletter breathing room; full oxblood footer with useful link columns.

Final visual check: faithful approved hero, much more open below the fold than reference 2, no repeated boxes, meaningful contextual photography, cohesive typography, full usable-looking footer. Do not add a page title outside the website.

```

## References

- [Polène — homepage](https://eng.polene-paris.com/) — Browser scroll + DOM.
- [Polène — Materials](https://eng.polene-paris.com/blogs/bags/materials) — Primary-page content.
- [Hereu — Craftsmanship](https://hereustudio.com/pages/craftmanship) — Primary-page content.
- [Polène — Manufacturing](https://eng.polene-paris.com/blogs/bags/manufacturing) — Primary-page content.

[Observed findings and screenshots](../research/live-reference-register.md) · [All 25 category references](../research/desktop.html)

## Page sequence

1. Approved SOFT FORM hero exactly as supplied.
2. After a generous cream pause, Forms for every day: three freestanding bags with subtle baseline labels; Arc $420, Fold $360, Day $480. No three background rectangles. Leave space around every silhouette.
3. Large pale-blue Arc flat lay on left occupying 55%; smaller serif copy floated on cream at right, separated by negative space. One short heading: Soft structure. Room for the everyday.
4. Shaped by hand: one substantial terracotta-toned handwork photograph on right and a smaller close-up offset below-left. Use a quiet cream field, not a solid stripe. A single workshop story link replaces a second journal grid.
5. Carried through the day: one large coastal campaign photo and a smaller on-body photograph offset like a magazine spread. Two tiny community captions share this composition, not another row.
6. Made to stay with you: calm wide cream pause, three fine accordion lines left, one small tactile leather detail right.
7. Blue newsletter breathing room; full oxblood footer with useful link columns.

## Interactions and React

[All ten touts with scroll, hover, focus, touch, activation and component ownership](../specs/01-avela.md).

[Shared React contract](../specs/react-interaction-contract.md) · [Image manifest](../manifest.json)

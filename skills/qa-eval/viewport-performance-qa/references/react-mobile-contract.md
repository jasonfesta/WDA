# Mobile homepage and React contract

Five mobile adaptations of the same five desktop homepages. These are not additional routes. The content IDs, links and state owners remain shared with the desktop specification.

## Delivery and fidelity

Each review displays one continuous mobile image beside one unchanged desktop image. The mobile screenshot combines consecutive sections into one homepage. The delivery includes only the final desktop and mobile images; prompt text records the section sequence. The full mobile concept is about 3,200–3,510 CSS pixels tall at 390px wide. Raster heights and type are illustrative; the implementation rules below govern the real build.

The mobile version preserves the same brand, product/project subjects and chapter order. It reflows typography and image crops for a narrow screen. Generated photography and small text approximate the original assets; this is not pixel-identical art cropping. Production must use approved individual assets and real HTML text. These are static concepts, not functioning five-site React apps.

## Responsive layout

- Design review width: 390px. Verify production at 320, 390, 430, 768 and 1440px, plus 200% text size.
- Below 640px: one main column, 24px side gutters (20px at 320px), 16px body/input text, 1.5–1.7 line height. Main headings 32–40px; campaign mastheads may be larger and wrap.
- Chapter pauses: 48–72px; Oriel 72–96px. Do not shrink those pauses to make page heights equal.
- Secondary two-product rows may remain two columns at 390px. Stack them at 320px or when labels need more space. No horizontal page overflow.
- From 640 to 1023px: optional two-column product/project layouts; avoid desktop negative offsets until 1024px. Content order stays identical in the DOM.
- Preserve image aspect ratios and focal points with picture/srcset and object-position. Do not stretch desktop images. Hero crops must retain the signature product or architecture.

## Scroll, tap and focus

- Native vertical scrolling; no scroll hijacking, parallax, pinned multi-screen chapters or automatic carousel selection.
- Essential text, controls and hero are visible immediately. Optional secondary entrances run once; reduced motion removes transforms and smoothing.
- No hover prerequisite. Names, prices, labels and CTAs are always visible. A link opens on the first tap; a button changes state on activation.
- Target 44px minimum control height with visible 2px focus rings. This project target exceeds the WCAG 2.2 AA minimum; see research sources.
- Mobile navigation uses a labelled dialog, explicit close, Escape and focus return. No nested links/buttons.
- Native details/summary for help. Opening a row grows the page naturally and retains focus. Answers are readable without animation.
- Filters update URL state and a polite result count without moving focus. Browser Back restores the choice.
- Pack and routine controls share the desktop state owner. Selection changes image, copy, price and route from one data record.
- Newsletter fields use a persistent visible label, email keyboard and explicit submission. Inline errors retain input; success requires a server response. The raster field is not connected.

## React translation

Use the existing desktop data and components. CSS changes composition; do not create a second mobile data model or use window.innerWidth during SSR to choose different content. Use media queries for layout, pointer queries for hover, and useReducedMotion for optional motion. Keep dialog and selected-state ownership in the existing component.

The main gallery and review pages implement the comparison interface only. They do not implement the depicted commerce, project filters or newsletters.

## Future build checks

Verify no horizontal page scrolling at 320px, usable controls at 200% text, keyboard menu focus return, first-tap navigation, filter Back restoration, pack price/route consistency, routine button/panel agreement, disclosure focus retention and server-confirmed newsletter status. These remain application acceptance criteria, not claims that the five apps have been built.

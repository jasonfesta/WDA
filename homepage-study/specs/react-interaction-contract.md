# WDA — homepage interaction and React contract

Round 2 · 21 October 2026

## Scope and evidence

This pass refines the five existing homepages. It does not generate additional routes or claim that the raster images are functioning React pages. The approved source headers remain available in research/approved. The generated images approximate those headers; the production build should use the approved originals with real HTML type and controls.

The 25-site category research remains in the research directory. This pass adds a deeper 17-page evidence register, six browser screenshots, 50 contextual tout specifications and a shared React contract. “Observed” in the register means exactly the inspection described there. Scroll timing, hover scale, easing, spacing and component architecture below are proposed WDA behavior. Pointer-hover behavior was not directly exercised on the reference sites.

Existing WDA product/project names are retained. Prices for new products, new stories, service details and routes remain concept content until supplied by the brand. Reference-site facts and claims do not become WDA facts.

## Visual rhythm

- Keep the original hero composition and aspect ratio. Do not stretch it to make a taller page.
- Use seven major compositions instead of ten equal stacked bands. Related touts remain separately addressable in content but share visual space.
- At 1440 px desktop, use 144–192 px between most chapters; Oriel uses 192–240 px. Within a chapter use 32–64 px gaps. Phone chapter gaps are 48–72 px, Oriel 72–96 px.
- A 12-column grid is a placement system, not a requirement for visible cards. Use 7/4, 8/3 and 9/2 compositions with an empty column.
- Use three unboxed product choices, or two unequal project photographs followed by a text-only third entry.
- Organic pacing comes from light, material and unequal image scale. Keep architecture and product silhouettes true. Avoid decorative blob masks and repeated colored stripes.
- Consolidate material/process, editorial/community and journal/help. Leave negative space empty.
- Raster spacing is illustrative. Use the CSS values as the implementation source of truth.

## Shared interaction rules

All timing and motion below is proposed WDA behavior, not reverse-engineered source-site timing.

- Scroll normally: no hijacking, forced horizontal sections, scroll-triggered selection, pinned multi-screen scenes or automatic carousels.
- Secondary image/copy groups settle by 12 px over 600 ms once at 15% visibility. Hero, navigation, forms and essential reading content are visible immediately. Never hide content behind a failed animation.
- Fine-pointer hover only: product alternate images crossfade in 240 ms; project images scale to 1.018 in 500 ms; arrows travel 4 px in 180 ms. Essential information is always visible.
- Focus uses a visible 2 px outline with 4 px offset. Focus does not select a product, step or filter; activation does.
- Reduced motion disables translate, scale, parallax and scroll smoothing. State changes immediately; focus and selection remain clear.
- Touch uses the same labels/actions, 44 px targets and DOM reading order. Desktop offsets disappear.
- Links navigate; buttons change local state; radios choose one option. Never nest buttons in linked tiles.
- Independent accordions use native details/summary. Three-step selectors use aria-pressed buttons and a labelled region, not incomplete ARIA tab roles.
- No hero video is planned. A later video needs a poster and explicit play/pause.
- Planned routes are contracts for later builds, not fake working links.

## Data and state ownership

Static content owns stable IDs, headlines, image pairs, image dimensions, alt text, captions and destinations. Prices/availability must come from commerce once connected. Provenance, ingredient lists and service promises need approved brand data.

ProductRange owns selected variants only where variants exist. PackSelector owns one selectedPackId; price, unit count, image and href derive from that record. RitualSteps/ServeSteps owns selectedStepId and derives image and copy. ProjectIndex reads router search parameters; the URL is its single source of truth. NewsletterForm owns submission status; the server owns persistence. EditorialTout, ProjectTout, StoryLink and SiteFooter are state-free.

Namespace prototypes beneath brand slugs. Separate production sites can remove the prefix in the routing adapter.

## React mapping

The React plan uses shared components and responsive CSS. This study does not install dependencies or implement the depicted applications.

Suggested structure:

src/features/landing/
  data/{avela,room-and-ritual,oriel,sundrop,serein}.ts
  components/{Hero,ProductRange,ProjectTout,EditorialTout,StoryLink}.tsx
  components/{PackSelector,RitualSteps,CareDisclosure,NewsletterForm}.tsx
  hooks/useSectionEntrance.ts
  styles/{tokens,composition,interaction}.css
  routes/<brand>/index.tsx

Build semantic content first, then grids and exact assets, then stateful controls, then restrained motion. The PNG is a reference, not the background of a working page.

## Example state contract

Proposed implementation sketch; not a tested application. All displayed pack values derive from one record. Replace concept values with approved commerce data.

```tsx
import { useState } from "react";
type PackId = "4" | "8" | "12";
const packs = {
  "4": { label: "4 cans", price: 24, href: "/sundrop/aperitifs/apricot?pack=4" },
  "8": { label: "8 cans", price: 44, href: "/sundrop/aperitifs/apricot?pack=8" },
  "12": { label: "12 cans", price: 60, href: "/sundrop/aperitifs/apricot?pack=12" },
};
function PackSelector() {
  const [selectedPackId, setSelectedPackId] = useState<PackId>("4");
  const selected = packs[selectedPackId];
  return (
    <section aria-labelledby="pack-title">
      <h2 id="pack-title">Find your first pour</h2>
      <fieldset>
        <legend>Choose your pack</legend>
        {(Object.keys(packs) as PackId[]).map(id => (
          <label key={id}>
            <input type="radio" name="pack" value={id}
              checked={id === selectedPackId}
              onChange={() => setSelectedPackId(id)} />
            {packs[id].label}
          </label>
        ))}
      </fieldset>
      <p aria-live="polite">{selected.label} · USD {selected.price}</p>
      <a href={selected.href}>Choose your pack</a>
    </section>
  );
}
```

## Motion and CSS contract

Use Motion for a small reveal wrapper with useInView once, amount 0.15, and useReducedMotion. Keep CSS-only hover out of React state. The SSR/no-JavaScript default stays readable. Failed images preserve aspect ratio and descriptive links.

```css
:root {
  --chapter-gap: clamp(3rem, 10vw, 12rem);
  --page-gutter: clamp(1.5rem, 6vw, 6rem);
  --ease-editorial: cubic-bezier(.22, 1, .36, 1);
}
[data-brand="oriel"] { --chapter-gap: clamp(4.5rem, 14vw, 15rem); }
.chapter + .chapter { margin-block-start: var(--chapter-gap); }
.tout__media { overflow: hidden; }
.tout__image { display: block; width: 100%; height: auto; }
.tout:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
@media (hover: hover) and (pointer: fine) {
  .project-tout .tout__image { transition: transform 500ms var(--ease-editorial); }
  .project-tout:hover .tout__image { transform: scale(1.018); }
}
@media (prefers-reduced-motion: reduce) {
  .tout__image, .tout__arrow { transition: none !important; transform: none !important; }
}
```

## States and future implementation checks

| Component | States | Meaningful acceptance check |
| --- | --- | --- |
| ProductTout | Default, alternate hover, focus; variant if offered | Labels stay visible; variant changes image and route together |
| ProjectIndex | All, category, empty, browser Back | URL restores category without moving focus |
| PackSelector | 4 / 8 / 12; unavailable if reported by commerce | Count, price and destination agree |
| RitualSteps / ServeSteps | Three selected steps, keyboard activation | Focus alone does not select; button and region agree |
| Disclosure | Closed, open, multiple open | Keyboard toggles; focus remains on summary |
| NewsletterForm | Idle, invalid, submitting, success, server failure | Prevent duplicates; server-confirmed success; retain input on failure |
| SiteHeader | Hero overlay, solid after hero, menu open/closed | No layout shift; Escape restores focus |
| All | 1440 / 768 / 390 px; reduced motion | No overlap or essential hover-only content |

These are future implementation criteria, not tests executed during this documentation pass.

## Primary implementation documentation

- [React — sharing state](https://react.dev/learn/sharing-state-between-components): keep coupled state in a common parent.
- [Motion — scroll animations](https://motion.dev/docs/react-scroll-animations): distinguish entrances from continuous scroll linkage.
- [Motion — accessibility](https://motion.dev/docs/react-accessibility): honor motion preferences.
- [MDN — hover media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover): gate pointer enhancements.

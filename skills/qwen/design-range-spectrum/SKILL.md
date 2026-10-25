---
name: design-range-spectrum
description: >-
  Parameterize a design category's stylistic spectrum across Minimal, Structured,
  and Opinionated poles, structure 7-chapter page pacing, and specify section-level
  micro-interactions and touch targets ("Charm"). Use this skill when the user
  wants to define a design range, establish editorial spacing rhythms, or specify
  hover, focus, reduced-motion, and 44x44px touch contracts for a site or app.
---

# Dynamic Design Range & Interaction Specs ("Charm")

```text
skill / design-range-spectrum
────────────────────────────────────────────────────────────────────
mode      standalone design-space parameterization & interaction spec
input     category references / brand brief / design direction
output    spectrum matrix + 7-chapter pacing plan + "Charm" interaction specs
```

Structure a design category across an explicit **Dynamic Design Spectrum** (`Minimal → Structured → Opinionated`), define **7-chapter editorial page pacing**, and specify section-level micro-interactions, touch targets, and React state ownership ("Charm").

## Inputs

- Category references, mood board, or brand brief.
- Reference interaction and responsive contracts: [react-interaction-contract.md](./references/react-interaction-contract.md) and [react-mobile-contract.md](./references/react-mobile-contract.md).

## Work

### A. Parameterize the Dynamic Design Spectrum (`Minimal → Structured → Opinionated`)

1. **Map category archetypes across explicit stylistic poles.**
   Define each pole with concrete visual, typographic, grid, and material constraints so concepts never collapse into one generic template:

   | Spectrum Pole | Archetype Character | Grid & Spacing Rhythm | Typography & Surface Treatment |
   | :--- | :--- | :--- | :--- |
   | **Minimal** (*Quiet & Atmospheric*) | Architectural calm, unboxed silhouettes floating on warm paper or ivory, generous empty columns | `192–240px` desktop chapter gaps (`72–96px` mobile); asymmetric `8/3` and `9/2` splits | Lowercase monumental or tracked light sans + quiet book serif; subtle hairline rules |
   | **Structured** (*Editorial & Systematized*) | Split editorial mastheads, numbered rituals/indexes, ruled schedules, clear tabular hierarchy | `144–192px` desktop chapter gaps (`48–72px` mobile); 12-column `7/4` and `7/3/2` splits with `32–64px` intra-chapter gaps | Expressive roman/italic editorial serif + tracked sans micro-labels (`01 / STEP`) |
   | **Opinionated** (*High-Contrast & Tactile*) | Full-bleed sunlit campaign photography, edge-to-edge lower display lines, rich tactile materials | Full-viewport hero at natural aspect ratio + bold scale contrast between hero and unboxed touts | Oversized heavy condensed/wide display + tactile leather, oxblood, amber glass, cocoa |

2. **Define authored palette directions and semantic CSS tokens.**
   - Preserve distinct palette families (such as **Terracotta**, **Orchard**, **Rosette**, **Moss**, **Honey**, **Citron**, **Apricot**, **Burgundy**, **Cocoa**, and **Coral**) rather than flattening warm palettes into uniform beige or sepia.
   - Bind every concept's UI palette to 8 semantic CSS custom properties:
     - `--surface`, `--surface-raised`, `--ink`, `--muted`, `--accent`, `--accent-alt`, `--on-accent`, `--border`

3. **Consolidate long-scroll page pacing into 7 major compositions (not 10 repetitive bands).**
   - Keep the hero composition at its natural aspect ratio—never stretch a hero vertically to make a taller page.
   - Structure full pages around **7 distinct chapters** with intentional negative space:
     1. **Chapter 01 — Signature Hero**: Natural aspect ratio, brand wordmark, primary story, and core selector/CTA.
     2. **Chapter 02 — Unboxed Product Range or Unequal Project Pair**: Three unboxed product choices on warm surface, or two unequal project photographs (`55%` primary + offset secondary) followed by a text-only third entry.
     3. **Chapter 03 — Asymmetric Capacity / Ritual / Detail Story**: `7/3/2` or `7/4` placement with an intentional empty column.
     4. **Chapter 04 — Material, Craft, or Process Spread**: Tactile close-ups with embedded workshop/approach links.
     5. **Chapter 05 — Offset Editorial / Community Spread**: Magazine-style asymmetric imagery and field notes.
     6. **Chapter 06 — Hairline Care / Help Disclosure Pause**: Native `<details>/<summary>` rows (`48px` minimum summary height) with generous breathing room.
     7. **Chapter 07 — Quiet Newsletter & Complete Grounded Footer**: Persistent visible input label, explicit submit, and full route/anchor navigation footer.

### B. Specify Section-Level Interaction & Touch Areas ("Charm")

4. **Assign deterministic motion, pointer, touch, and state rules per section.**
   - **Native vertical scroll**: No scroll hijacking, no forced horizontal sections, no scroll-triggered selection, no pinned multi-screen scenes, and no auto-advancing carousels.
   - **Single entrance settle**: Hero, navigation, forms, and essential copy render immediately (`opacity: 1`). Secondary image/copy groups settle `translateY(12px → 0)` over `600ms` with `--ease-editorial: cubic-bezier(0.22, 1, 0.36, 1)` once at `15%` viewport visibility (`useInView({ once: true, amount: 0.15 })`).
   - **Fine-pointer hover (`@media (hover: hover) and (pointer: fine)`)**:
     - Product tout alternate view crossfades in `240ms`.
     - Project tout photograph scales to `1.018` over `500ms var(--ease-editorial)`.
     - Directional arrow translates `4px` in `180ms`; editorial link underline reveals in `180ms`.
     - Hover previews affordance only and **never** commits data or hides essential copy/prices.
   - **Touch, keyboard, and reduced-motion parity**:
     - Minimum `44 × 44 CSS px` touch targets (`48px` row height for disclosures); `24px` mobile side gutters (`20px` at `320px`).
     - Visible `2px solid currentColor` focus ring with `4px` offset (`:focus-visible`); focus never auto-selects a product, step, or filter—explicit activation does.
     - Never nest `<button>` swatches inside `<a>` product cards; keep sibling controls separate in the DOM.
     - Under `@media (prefers-reduced-motion: reduce)`, disable all translate, scale, parallax, and scroll smoothing immediately (`transition: none !important; transform: none !important`).
   - **Authoritative React state ownership**:
     - Assign one state owner per interactive module (`ProductRange` → `selectedVariantByProduct`; `PackSelector` → `selectedPackId`; `RitualSteps` → `selectedStepId`; `ProjectIndex` → URL search parameters `?category=...&view=list`). Derived prices, unit counts, images, and `href` links are computed from that single state record.

## Input → Output Example

**Sample Input**:
```text
"Structure our design range across Minimal (Oriel spatial practice), Structured (Rill & Rye bakery), and Opinionated (Avela leather atelier), and specify the Charm interaction rules for the product/pack selectors."
```

**Expected Output (Spectrum + Charm Contract Excerpt)**:
```markdown
| Concept | Pole | Desktop / Mobile Chapter Gap | Semantic Tokens (`--surface` / `--ink` / `--accent`) | Primary Interactive Owner | Fine-Pointer Hover | Touch / Keyboard Contract |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Oriel** | Minimal | `192–240px` / `72–96px` | `#F6F2EB` / `#1C1917` / `#8C5A3C` | `ProjectIndex` (URL `?category=`) | Photo `scale(1.018)` in `500ms` | `44×44px` filter pills; Back restores URL |
| **Rill & Rye** | Structured | `144–192px` / `48–72px` | `#FAF6F0` / `#231F1C` / `#B85D3B` | `ReservationPanel` (`selectedLoafId`) | Link underline in `180ms` | Native `<select>` + `44px` button |
| **Avela** | Opinionated | `144–192px` / `48–72px` | `#F7F3EE` / `#181311` / `#5C1D24` | `ProductRange` (`selectedVariant`) | Alternate bag view in `240ms` | `<fieldset>` radios outside `<a>` card |
```

## Result

Deliver the **Design Range Spectrum Matrix**, **7-Chapter Pacing Plan**, and **Section-Level "Charm" Interaction Specification**.

### Verification

- [ ] Spectrum poles (`Minimal`, `Structured`, `Opinionated`) are mapped to concrete reference URLs, typography, and `--surface` / `--ink` / `--accent` tokens.
- [ ] Full-page websites consolidate content into 7 varied compositions with explicit CSS chapter pauses (`144–192px` desktop / `48–72px` mobile; `192–240px` / `72–96px` for architectural studies).
- [ ] Every interactive section specifies fine-pointer hover timing, `44×44px` touch targets, `:focus-visible` outline, `prefers-reduced-motion` behavior, semantic HTML primitive, and single-source React state owner.

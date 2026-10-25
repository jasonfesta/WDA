---
name: prompt-builder-specs
description: >-
  Author structured Markdown design specifications (1x Main Agent .md + 5–10x
  concept .md files) and 10-point Nano Banana 2 (1K) image generation prompts for
  expanding websites, mobile apps, or UI components into 5 complete pages, screens,
  or states per concept. Use this skill when the user wants to write image-generation
  prompt packages, plan 5-screen product sets, or create detailed Markdown design
  specs.
---

# Structured Markdown Specifications & Nano Banana 2 Prompt Builder

```text
skill / prompt-builder-specs
────────────────────────────────────────────────────────────────────
mode      standalone Markdown spec & 10-point prompt authoring
input     seed reference images / concept brief / category notes
output    1× Main Agent .md + 5–10× Concept .md + 10-point NB2 prompts
```

Author a self-contained Markdown specification package—**1× Main Agent `.md` file** plus **5–10× Concept `.md` files**—containing ranked section/tab/state plans, final copy, reference roles, and **10-point Nano Banana 2 (`1K`) prompts** (`5` final images per concept across Websites, Mobile Apps, or UI Components).

## Inputs

- Seed reference images, concept brief, or category research notes.
- Master prompt-builder reference: [prompt-builder.md](./references/prompt-builder.md).

## Work

1. **Reconcile the canonical concept inventory and style records.**
   - Inspect every selected seed image individually at readable size (never rely solely on thumbnails or folder names).
   - Record each concept's stable reference ID, exact source path, native pixel dimensions, category (`website`, `mobile`, or `component`), palette family, typography hierarchy, and tactile materials.
   - Keep historical revision folders (e.g., `earlier-versions/`) and secondary color/texture reference folders (`images/colors/`) out of the primary concept count; assign color/texture studies strictly as secondary material/lighting references.
   - Do not copy global moodboard shell headlines onto individual product concepts.

2. **Author the `1× Main Agent .md` file and `5–10× Concept .md` files.**
   - **`1× Main Agent .md`**: Global architecture, reconciled concept inventory, shared art-direction rules, palette families, breakpoint contracts (`1440px` desktop, `390px` mobile), and cross-concept state/interaction conventions.
   - **`5–10× Concept .md` (`specs/01-<slug>.md`, etc.)**: One dedicated specification per concept containing:
     - Source path, reference ID, native dimensions, audience, and primary user task.
     - Observed traits vs. researched patterns vs. proposed additions.
     - Ranked section table (Websites), primary tab/flow table (Mobile Apps), or complete state matrix (UI Components).
     - Complete React interaction and route/state mapping.

3. **Allocate exactly 5 final images (`01–05`) per concept.**

   | Category | Image `01` | Image `02` | Image `03` | Image `04` | Image `05` |
   | :--- | :--- | :--- | :--- | :--- | :--- |
   | **Websites** *(full-page browser capture, header to footer)* | Complete main homepage (all prioritized chapters + footer) | First researched secondary page (e.g., Collection / Project Index) | Second researched secondary page (e.g., Product Detail / Case Study) | Third researched secondary page (e.g., Story / Practice / Workshop / Care) | Meaningful interaction/conversion variant of one of the 4 pages (e.g., open Shopping Bag drawer, Pack Builder, or Inquiry state) as a full page |
   | **Mobile Apps** *(`874×1800` / `9:16` edge-to-edge, zero device bezel or OS status bar)* | First primary tab/destination with complete content & bottom nav | Second primary tab/destination with distinct content | Third primary tab/destination with distinct content | Fourth primary tab/destination with distinct content | Essential onboarding, detail, completion, or action screen connecting the flow |
   | **UI Components** *(centered on clean off-white studio surface, zero room props)* | Complete default / resting component | Prioritized interactive state 2 (e.g., `°F` unit toggle / selection change) | Prioritized interactive state 3 (e.g., alternate day / period / shuffled order) | Prioritized interactive state 4 (e.g., open options / keyboard focus / review) | Prioritized interactive state 5 (e.g., error + retry / confirmed / empty state) |

4. **Build every Nano Banana 2 prompt with all 10 mandatory blocks.**
   Each prompt (`01–05`) must be individually runnable on **Nano Banana 2 (`1K` output setting)** with zero unresolved placeholders:
   1. **Identity & Source**: Stable concept ID, output number (`01–05`), output name, category, and exact source image path(s).
   2. **Sequence Role**: Role in the 5-image set and relationship to sibling pages, tabs, or component states.
   3. **Reference Roles & Preservation Rules**: Primary layout/brand anchor vs. secondary color/texture reference; locked brand story, typography, palette, materials, and photography style.
   4. **Ordered Structure & Scale**: Exact section-by-section, tab, or component region order from top to bottom with relative proportions.
   5. **Final Visible Copy & Data**: Exact wordmark, nav links, headlines, body copy, CTAs, prices, measurements, volumes, and state math (zero lorem ipsum).
   6. **Canvas & Model Settings**: Orientation, verified Nano Banana 2 `1K` setting, target aspect ratio/dimensions, and continuous full-page or edge-to-edge screen-capture framing.
   7. **Cross-Set Locks vs. Delta**: What stays locked across `01–05` (header/footer, outer card dimensions, avatar identities, tab bar) vs. what changes in this specific output.
   8. **Quality Exclusions (Negative Constraints)**: No missing footer, no cropped controls, no illegible micro-type, no duplicated labels, no device frames/bezels/notches, no watermarks, no unintended contact-sheet grids.
   9. **Acceptance Checklist & Targeted Revision Rule**: Pass/fail visual criteria and exact localized edit instruction if a region fails.
   10. **Output Record & React Mapping**: Target output filename, model/provider record, and mapped React route, tab ID, or component state ID.

5. **Specify long-page `1K` section assembly where required.**
   - Never squeeze a 7-chapter desktop website into an unreadable tiny strip. When a long page exceeds a single legible native `1K` vertical canvas, specify a documented section-by-section `1K` generation and vertical stitch plan with matched content widths, typography scale, and seam continuity. Count section sub-renders separately from the 5 final deliverables.

## Input → Output Example

**Sample Input**:
```text
"Write the 5-image expansion plan and Prompt 01 (Homepage) for REF-001 (Avela / The Arc oxblood leather bag, 1681x936)."
```

**Expected Output (`specs/01-avela.md` excerpt)**:
```markdown
### 5-Image Allocation (REF-001 · Avela)
- `01-homepage.png`: Full 7-chapter homepage from thin `AVELA` header and `SOFT FORM` hero through unboxed range (`Arc $420`, `Fold $360`, `Day $480`), `30 × 22 × 10 cm` capacity story, calfskin atelier spread, journal, `<details>` care rows, and footer.
- `02-collection.png`: Complete Collection catalog page with category filters (`All`, `Shoulder`, `Tote`, `Crossbody`) and `'Make room for Fold'` editorial callout.
- `03-arc-detail.png`: Complete `The Arc` product detail page (`$420`, Oxblood / Espresso / Chalk swatches, gallery, hardware zoom, dimensions `30 × 22 × 10 cm`).
- `04-our-story.png`: Atelier & Saddlery craft page.
- `05-bag-drawer-open.png`: Homepage with active right-hand Shopping Bag drawer (`1 × The Arc · Oxblood · $420` subtotal).
```

## Result

Deliver the `1× Main Agent .md` manifest, the `5–10× Concept .md` files, and the individual `01–05` Nano Banana 2 prompt files.

### Verification

- [ ] Reconciled inventory confirms exact concept totals (`N concepts × 5 prompts = 5N final-image prompts`) with earlier revisions and color studies excluded from concept counts.
- [ ] Every visible header link, footer link, tab, and CTA maps to a concrete section anchor, planned page route, or defined component state.
- [ ] Every prompt contains all 10 required blocks, final copy (zero lorem ipsum or `[TBD]` placeholders), and explicit negative constraints.

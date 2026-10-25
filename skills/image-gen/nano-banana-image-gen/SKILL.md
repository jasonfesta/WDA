---
name: nano-banana-image-gen
description: >-
  Generate and edit UI screen comps, 4K multi-screen contact grids, targeted
  cleanup passes (cleanup-brief.md), and clean inpainted photographic background
  plates (*-clean-photo.png) using Nano Banana 2. Use this skill when the user
  wants to lock desktop/mobile anchor screens, expand multi-screen flows or 4K
  grids, repair localized copy or state-math defects in generated sheets, or strip
  baked interface text from background photos.
---

# Iterative Image Generation & Cleanup (Nano Banana 2)

```text
skill / nano-banana-image-gen
────────────────────────────────────────────────────────────────────
mode      standalone Nano Banana 2 generation, cleanup & layer inpainting
input     Markdown specs / 10-point prompts / existing comps or sheets
output    anchor comps + 4K grids / screen sets + *-clean-photo.png plates
```

Run **Nano Banana 2** image generation and editing tasks: lock Desktop + Mobile anchor screens, expand multi-page websites, mobile flows, or component state strips (individually or as 4K contact grids), run deterministic cleanup passes (`cleanup-brief.md`), and inpaint clean photographic background plates (`*-clean-photo.png`) for DOM layering.

## Inputs

- Structured `.md` specifications, 10-point prompts, or existing generated sheets/comps requiring cleanup or background-plate extraction.
- Canonical cleanup and layer-preparation references: [cleanup-brief.md](./references/cleanup-brief.md) and [warm-moodboard-build-brief.md](./references/warm-moodboard-build-brief.md).

## Work

1. **Generate and lock Anchor Screens (Desktop + Mobile breakpoints).**
   - Render the initial anchor screen (`01-homepage` at desktop width and `mobile-01-homepage` at `390px` width, ~`3,200–3,510 CSS px` full height; or state `01` for apps/components) steered by the `.md` spec.
   - Verify palette fidelity, display typography scale, hero crop, and signature product/architectural silhouette before generating secondary screens.
   - Record uniform downsampling factors if an input reference is scaled for upload—**never** crop content or apply non-uniform X/Y scaling to input references.

2. **Clone the locked anchor and expand (`1-by-1` or `4K Composite Grid`).**
   - Pass the approved anchor screen as **Input 1** so downstream pages, tabs, or states inherit identical brand typography, surface tokens, hardware/material details, and navigation chrome:
     - **Mode A — 1-by-1 Screen Rendering**: Render each screen (`01–05`, or up to `35+` screens across a full product study) as an individual native image (`~724×2170` long desktop homepage, `874×1800` mobile screen with `os_chrome: false`, or natural component canvas).
     - **Mode B — 4K Composite Grid Rendering**: Render a unified multi-screen 4K contact sheet for cost efficiency (`~$0.16/sheet`) and slice post-generation:
       - **Websites (5-page sheet)**: `5312 × 3200` (`5:3` ratio) or `5332 × 3200`.
       - **Mobile Apps (10-screen sheet)**: `4544 × 3748` (2 rows × 5 screens, edge-to-edge, zero device bezels).
       - **UI Components (5-state sheet)**: `9280 × 1856` (wide horizontal strip), `8192 × 2048` (`4:1` strip), `7104 × 2368` (`3:1` strip), `3456 × 4936` (vertical stack), or `3648 × 4692` (vertical stack).

3. **Execute targeted Cleanup Passes (`cleanup-brief.md`) — zero automatic paid reruns.**
   - Never run blind automatic paid retries. Inspect returned sheets first and author a targeted cleanup prompt that locks all approved regions and repairs only specific copy, silhouette, or state-math defects:
     - **Product & architectural identity**: Keep product silhouettes, colors, hardware clasps, and measurements (`30 × 22 × 10 cm`) identical across catalog, detail, campaign, and cart thumbnails. Keep architectural openings and materials consistent across views.
     - **Arithmetic & state consistency**: Enforce exact agreement between quantity and subtotal (`1 × $420 = $420`), pack counts (`4-pack $24`, `8-pack $44`, `12-pack $64` with matching physical cans), timer progress (`05:00 elapsed / 15:00 remaining = 25%` with pause icon while playing), puzzle strips (`5 of 5 placed = 100%` with 5 physical aligned strips), collaborator counts (checked rows = footer count = trigger avatar stack), and segmented capacity bars (used segments + empty remainder = `100%` total capacity).
     - **OS chrome removal**: Strip any status-bar clocks, battery icons, notches, or home-indicator bars from mobile screens (`os_chrome: false`).

4. **Generate clean photographic background plates (`*-clean-photo.png`) for React DOM layering.**
   - Whenever hero or editorial typography/UI cards are baked across a photograph needed in React, run a targeted object-removal/inpainting pass that removes **only** overlaid interface lettering, progress marks, and UI cards while preserving subjects, architecture, lighting, and physical product labels (such as printed text on a can or bottle).
   - Save clean derivatives to `public/assets/website-layers/<brand>-clean-photo.png` and keep the original source PNG untouched.

## Input → Output Example

**Sample Input**:
```text
"1. Write a targeted cleanup prompt for the Sundrop 5-page website sheet where the 4-pack/8-pack/12-pack can counts and cart subtotal disagree.
2. Write the inpaint prompt to produce public/assets/website-layers/sundrop-clean-photo.png."
```

**Expected Output (`cleanup-brief.md` + Layer Inpaint Prompt)**:
```markdown
## websites / sundrop (Cleanup Brief)
Apricot Aperitif is 200 ml, 8% ALC/VOL, never alcohol-free.
Four-pack $24, eight-pack $44, twelve-pack $64. Pack images must contain the matching
number of cans; catalog counts, product detail and cart must agree. One four-pack at
quantity 1 has subtotal $24. Long serve uses 100 ml Sundrop plus 100 ml sparkling water.
Keep orange/apricot ingredients and adult gathering imagery; no unrelated fruit/product.

## website-layers / sundrop-clean-photo.png (Inpaint Prompt)
Remove only the overlaid website header, 'A SLOWER SIP / A BRIGHTER AFTERNOON' headline,
'Find your first pour' button, taste profile text, and lower-left series index. Preserve
the sunlit apricot glass, ice, shadow caustics, terracotta surface, and the physical
printed SUNDROP label on the can without alteration.
```

## Result

Return all generated screen/grid PNGs, cleanup derivatives, clean background plates (`public/assets/website-layers/*-clean-photo.png`), and provenance metadata (input references, uniform scale factors, native pixel dimensions, and SHA-256 hashes).

### Verification

- [ ] Desktop and Mobile anchor screens are locked prior to multi-page or 4K grid expansion.
- [ ] Original seed images remain untouched; all generated screens, grids, and clean plates are saved to versioned paths with recorded binary PNG dimensions and SHA-256 checksums.
- [ ] Mobile app screens are full-bleed square-cornered UI exports (`874×1800`) with `os_chrome: false`.
- [ ] Clean photographic background plates have zero baked UI text remaining where live DOM text will sit.

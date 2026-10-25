---
name: grid-comp-qa
description: >-
  Audit generated Nano Banana 2 contact sheets and screen comps for canvas
  aspect-ratio fidelity (< 0.5% delta), native-pixel typography legibility,
  cross-screen state continuity, and CSS chapter-spacing overrides (review-notes.md
  and visual-review.md). Use this skill when the user wants to review generated
  design comps or 4K grids, check for geometry distortion or garbled raster text,
  or document visual QA overrides.
---

# Grid & Comp Visual QA

```text
skill / grid-comp-qa
────────────────────────────────────────────────────────────────────
mode      standalone visual & geometry QA for generated comps/grids
input     generated Nano Banana 2 sheets / screen comps
output    review-notes.md + visual-review.md + pass/fail gate & DOM overrides
```

Execute a deterministic pass/fail audit across generated screen grids and individual comps—validating canvas aspect-ratio geometry, `100%` native-pixel typography, cross-screen state math, and CSS chapter-spacing overrides so visual regressions ("slop") are caught and logged cleanly.

## Inputs

- Generated 4K contact sheets, long-scroll page comps, mobile screen sets, or component state strips.
- Bundled geometry & SHA-256 auditor script: [audit_comp_geometry.py](./scripts/audit_comp_geometry.py).
- Canonical QA review templates: [review-notes.md](./references/review-notes.md) and [visual-review.md](./references/visual-review.md).

## Work

1. **Compute canvas aspect-ratio delta (`< 0.5%` pass gate).**
   - Extract each returned PNG's binary header dimensions (`struct.unpack('>II', raw[16:24])`) and compare its aspect ratio (`W_out / H_out`) against the submitted input/target ratio (`W_in / H_in`):
     $$\text{Ratio Change \%} = \frac{|(W_{\text{out}} / H_{\text{out}}) - (W_{\text{in}} / H_{\text{in}})|}{W_{\text{in}} / H_{\text{in}}} \times 100$$
   - **Pass (`< 0.5%`, or `< 0.75%` on an authorized multi-screen retry)**: Approve canvas geometry for slicing or layout reference.
   - **Geometry Failure (`> 1.0%` — Hold / Do Not Auto-Slice)**:
     - Flag severe aspect-ratio distortion immediately (e.g., a `5:3` sheet returned at `4096×4096` square = `39.99%` error, or a `6.25:1` strip compressed to `4.03:1` = `35.54%` error).
     - Retain raw outputs unaltered for provenance, mark them **Not approved as final geometry**, and require either an authorized targeted retry or direct reconstruction from approved individual anchors in code.

2. **Audit `100%` native-pixel crops for malformed raster copy.**
   - Inspect both full-sheet overviews and `100%` native-pixel crops of wordmarks, prices, bottle/can micro-labels, and chart legends.
   - Log every garbled wordmark or conflicting micro-label in `review-notes.md` / `visual-review.md` so engineering replaces it with live DOM typography and clean plates rather than copying corrupted raster text.

3. **Verify cross-screen identity, silhouette, and state-math continuity.**
   - **Websites**: Verify all 5 pages have complete headers and footers, distinct openings, and identical product silhouettes/clasps across catalog, detail, campaign, and bag drawer. Check that candidate renders did not swap architectural or product subjects.
   - **Mobile Apps**: Verify character/avatar identity across onboarding and directory screens, onboarding progress dots (`1/4` through `4/4`), physical puzzle strip count (`5 of 5 placed` = 5 physical strips), and non-contradictory daylight/timer math.
   - **UI Components**: Verify constant outer card/tray dimensions across all 5 states, matching avatar stacks, and faithful surface palettes.

4. **Record mandatory CSS spacing & header overrides (`visual-review.md`).**
   - Long-scroll rasters (`~724×2170`) often compress lower sections or slightly soften original hero headers.
   - Record two explicit rules in `visual-review.md`:
     1. **Use approved original hero headers and clean plates** (`research/approved/` + `public/assets/website-layers/*-clean-photo.png`) with live HTML text rather than downsampled long-scroll raster headers.
     2. **Use the Markdown CSS chapter gaps as the source of truth** (`144–192px` desktop, `192–240px` for architectural studies; `48–72px` mobile, `72–96px` for architectural studies) rather than copying compressed lower-page raster spacing.

## Input → Output Example

**Sample Input**:
```text
Audit these 3 returned sheets against their target ratios:
1. websites/stillhaven: returned 5312x3200 (target 5:3 = 1.6667)
2. websites/virel: returned 4096x4096 (target 5:3 = 1.6667)
3. components/palette: returned 3456x4936 (target 0.7000)
```

**Expected Output (`review-notes.md` excerpt)**:
```markdown
| Sheet | Native output | Ratio change | Gate Status | Review & Required Override |
| :--- | :--- | :--- | :--- | :--- |
| `websites/stillhaven` | `5312 × 3200` | `0.3838%` | **PASS (Geometry)** | 5 full pages retained within `0.39%`. Replace malformed testimonial/body copy with live DOM text; enforce `144–192px` CSS chapter gaps. |
| `websites/virel` | `4096 × 4096` | `39.9902%` | **HOLD (Geometry Fail)** | Returned a `1:1` square sheet instead of `5:3`. Do not auto-slice; rebuild from approved anchor + spec. |
| `components/palette` | `3456 × 4936` | `0.0232%` | **PASS** | 5 trays retain natural proportions, 5 spheres per tray, active selection rings (`2, 3, 2, 1, 3`), and shuffle labels. |
```

## Result

Deliver `review-notes.md` and `visual-review.md` containing the complete sheet/screen pass/fail table, SHA-256 provenance, and mandatory DOM/CSS override instructions.

### Verification

- [ ] Every generated sheet or screen comp has its native pixel dimensions, aspect-ratio delta `%`, SHA-256 checksum, and pass/fail status recorded in `review-notes.md`.
- [ ] Any sheet with `> 1%` aspect-ratio distortion is flagged as a geometry failure and blocked from blind slicing.
- [ ] Every raster copy defect, micro-label discrepancy, state-math error, and compressed chapter pause has a deterministic DOM/CSS override documented.

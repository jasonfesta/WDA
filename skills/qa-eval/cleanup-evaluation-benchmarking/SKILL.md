---
name: cleanup-evaluation-benchmarking
description: >-
  Benchmark a live React implementation side-by-side against source design comps
  and run automated repository, SHA-256 asset checksum, local link, and state-math
  validation (validation.json). Use this skill when the user wants to evaluate
  visual fidelity against reference comps, fix ghosted raster text or clipped
  descenders, verify state/cart/usage arithmetic, or generate validation.json.
---

# Cleanup & Evaluation Benchmarking

```text
skill / cleanup-evaluation-benchmarking
────────────────────────────────────────────────────────────────────
mode      standalone side-by-side comp evaluation & state-math audit
input     live React build + source design comps
output    validation.json + visual & state cleanup refinements
```

Pair automated script evaluation (`validation.json`) with side-by-side browser benchmarking against source design comps to eliminate visual drift, ghosted raster text, clipped descenders, broken links, and state-arithmetic mismatches.

## Inputs

- Running React + TypeScript application or component suite and its source design comps.
- Bundled executable workspace validator: [validate_workspace.py](./scripts/validate_workspace.py).
- Canonical verification and build references: [verification.md](./references/verification.md), [warm-moodboard-build-brief.md](./references/warm-moodboard-build-brief.md), and [react-handoff.md](./references/react-handoff.md).

## Work

1. **Run side-by-side visual benchmarking against the source comps.**
   - Open every route or focused study in the browser alongside its source reference image (using a `View reference comparison` toggle or split viewport) and verify five visual-fidelity invariants:
     - **Descender & headline safety**: Large display headlines match reference weight, tracking, and gradient endpoints, with enough `line-height` and bottom `padding-bottom` that zero descenders (`g`, `j`, `p`, `q`, `y`) are clipped by `background-clip: text` or overflow containers.
     - **Zero ghosted raster lettering**: Clean photographic plates (`*-clean-photo.png`) and CSS/SVG crop windows show zero remnants of baked source lettering underneath live DOM text.
     - **True circles & aspect-ratio preservation**: Every swatch button, avatar sphere, radio ring, and next-arrow button retains a `1:1` circle (`flex-shrink: 0; aspect-ratio: 1 / 1`); every photo crop and upright 3D cutout preserves its natural aspect ratio with zero X/Y distortion or torn collage seams.
     - **Unboxed floating chrome**: Verify that global floating controls sit directly on the canvas without unrequested enclosing cards, borders, decorative dials, scale sliders, download buttons, or page footers, and that board items show zero reference ID badges (`REF-001`), tiny below-card captions, or arrows.
     - **Palette & single-pass grading**: Confirm all clickable palette directions expand their deduplicated semantic UI tokens plus sampled artwork and photo pixel banks (`Coral` or artwork-only sets omit unused UI tokens). A boundary sweep of `270` Hue/Warmth/Depth slider combinations (`Hue -20..+20`, `Warmth -30..+30`, `Depth -25..+25`) must keep primary accents within warm material families and clamp raster hue shifts to `±7°`.

2. **Verify deterministic state and arithmetic invariants across all interactive modules.**
   - **Commerce & bag persistence**:
     - Category filtering and ascending price sorting return the exact expected product order.
     - Adding an item (`$420`), incrementing quantity to `2` (`$840` subtotal), reloading the browser (`localStorage` persistence), and removing the item reconcile across header badge, bag drawer, and checkout summary.
   - **Component & Mobile state math**:
     - *Multi-select picker*: Select/unselect all; checked rows, trigger avatar stack, and footer counts agree at `0, 1, 3, 4`; failed save exposes `retry` and `revert`.
     - *Palette tray*: Active ring matches radio selection; `shuffle` and `undo` restore the complete prior order and selected material snapshot.
     - *Weather unit conversion*: `28°C` converts to `82°F`, `29°C` converts to `84°F`; switching days updates all date-specific metrics; error state retains truthful stale data with `retry`.
     - *Membership billing*: Plan selection and checkout share one canonical `selectedPlanId`; annual billing applies exact `20%` discount; `cancel` preserves selection; repeat clicks cannot create duplicate checkout sessions.
     - *Usage capacity math*: `sum(categories) == used == sum(daily)`, `average == used / days`, `capacity_percent == (used / limit) * 100`, and `difference_from_allowance == limit - used`.
     - *Navigation dock*: Exactly one destination carries `aria-current="page"`; browser `Back/Forward` updates active capsule.

3. **Run automated repository, checksum, and link validation (`validation.json`).**
   - Execute [validate_workspace.py](./scripts/validate_workspace.py) (`python3 qa-eval/cleanup-evaluation-benchmarking/scripts/validate_workspace.py --root . --out validation.json`) to verify:
     - Every expected reference ID and route exists.
     - Every PNG/JPG binary header dimension (`struct.unpack('>II', raw[16:24])`) and `hashlib.sha256` checksum matches `manifest.json` / `assets.json`.
     - Every relative `href`, `src`, and Markdown link across all `.html` and `.md` files resolves (`broken_local_links: []`).
   - Write the machine-readable report to `validation.json`.

## Input → Output Example

**Sample Input**:
```text
"Validate the component study repository, verify usage fixture math and PNG SHA-256 hashes, check all HTML/MD relative links, and emit validation.json."
```

**Expected Output (`validation.json`)**:
```json
{
  "status": "pass",
  "date": "2026-10-21",
  "components": 6,
  "state_images": 30,
  "exact_state_prompts": 30,
  "asset_hashes_checked": 41,
  "directed_review_actions": 84,
  "local_links_checked": 142,
  "broken_local_links": [],
  "fixture_totals": "pass",
  "errors": []
}
```

## Result

Deliver the cleaned React implementation and `validation.json` (`"status": "pass"`, `broken_local_links: []`, `fixture_totals: "pass"`).

### Verification

- [ ] Every route and focused study has been compared side-by-side against its source comp with zero clipped descenders, ghosted raster text, or oval circles.
- [ ] All shopping-bag, unit-conversion, billing-discount, collaborator-count, and capacity-bar arithmetic invariants pass.
- [ ] `validation.json` is written to the project root with `"status": "pass"` and zero broken local links or SHA-256 mismatches.

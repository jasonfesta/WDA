---
name: design-package-handoff
description: >-
  Consolidate research .md files, live reference registers, desktop and mobile
  breakpoint specs, normalized image crop coordinates, state/data fixtures, and
  approved screen comps into a deterministic Design Package (design-package.md
  and react-handoff.md). Use this skill when the user wants to prepare a complete
  design-to-engineering handoff spec, define React state ownership and component
  boundaries, or document asset layers and crop windows.
---

# Complete Design Package Handoff

```text
skill / design-package-handoff
────────────────────────────────────────────────────────────────────
mode      standalone design-to-React handoff specification
input     design specs / approved screen comps / QA notes
output    1× design-package.md + react-handoff.md + JSON data fixtures
```

Unify design specifications, desktop and mobile breakpoint contracts, normalized crop coordinates, state architecture, and approved screen comps into a deterministic build package (`design-package.md` and `react-handoff.md`) that eliminates visual guesswork during React engineering.

## Inputs

- Approved screen comps, clean photographic plates (`*-clean-photo.png`), and any visual QA notes.
- Canonical handoff contracts: [react-handoff.md](./references/react-handoff.md), [react-interaction-contract.md](./references/react-interaction-contract.md), and [react-mobile-contract.md](./references/react-mobile-contract.md).

## Work

1. **Lock strict DOM vs. Photographic vs. 3D/WebGL layer boundaries.**
   - **Live DOM Layer (100% HTML/CSS/SVG)**: All brand wordmarks, headlines, body copy, captions, prices, navigation links, buttons, tabs, radio groups, checkboxes, counters, `<details>/<summary>` disclosures, and numeric data charts/tables. Never resize raster text into a tiny touch target or place invisible click regions over a screenshot.
   - **Photographic & Cutout Asset Layer**:
     - Clean inpainted background plates (`public/assets/website-layers/<brand>-clean-photo.png`).
     - Normalized uniform CSS/SVG crop windows (`[x, y, width, height]` in `0..1` coordinates) that isolate photography from baked UI.
     - Texture specimens (`public/assets/textures/`) and alpha-bearing 3D object cutouts (`public/assets/3d-objects/`, upright with preserved transparency).
   - **WebGL Mesh Layer**: Where geometric 3D studies require interactive camera/material control, specify the Three.js primitives (cube, square pyramid, sphere), finishes (`Original` seeded procedural texture, `Stone`, `Glaze`, `Linen`), and idle-thumbnail-to-hover-renderer lifecycle rules. Document honestly that creative texture sources are not calibrated seamless PBR scans or recovered 3D meshes.

2. **Define single-source React state ownership and component data contracts.**
   - Keep **one authoritative state object** per logical selection; derive all counts, labels, subtotals, and active treatments from that state (never store derived counts or subtotals as independent state).
   - Separate `idle | loading | success | error` states where external operations exist, preserve the last confirmed state on error, expose `retry` and `cancel`/`revert` paths, and document what is owned by the host application vs. the component.

3. **Specify semantic primitives, input parity, and desktop/mobile breakpoints.**
   - **Semantic HTML**:
     - `<div role="tablist">` / `<button role="tab">` for day panels, plan previews, and usage periods.
     - `<fieldset>/<legend>` radio groups for material swatches and pack selectors.
     - Checkboxes inside a controlled popover with `Escape` and focus return for multi-select pickers.
     - Route links (`<a aria-current="page">`) for navigation docks (never an incomplete tab pattern).
     - `aria-pressed` buttons for 3-step ritual selectors; native `<details>/<summary>` for care/help rows.
   - **Desktop (`1440px` / `1280px`) → Mobile (`390px` design target; verified at `320px, 390px, 430px, 768px, 1440px` + `200%` text zoom)**:
     - Share the exact same React components, DOM reading order, and data records across desktop and mobile—never branch content with `window.innerWidth` during SSR.
     - Below `640px`: single main column, `24px` side gutters (`20px` at `320px`), `16px` body/input text (`1.5–1.7` line-height), `32–40px` main headings, `48–72px` chapter pauses (`72–96px` for architectural studies), and `44 × 44 CSS px` minimum hit areas (`48px` for accordion summaries).

4. **Package deterministic JSON fixtures alongside `design-package.md`.**
   - Emit `design-package.md`, `react-handoff.md`, and supporting JSON registries (`registry.json`, `components.json`, `fixtures.json`, `flows.json`, `assets.json`) with verified SHA-256 checksums and binary dimensions.

## Input → Output Example

**Sample Input**:
```text
"Create the React handoff contract for the 6 interactive components (WeatherCard, TeamPicker, MaterialPalette, MembershipPanel, UsagePanel, NavigationDock) and document the normalized photo crops for Rill & Rye and Serein."
```

**Expected Output (`react-handoff.md` excerpt)**:
```markdown
### Component Boundaries & State Ownership
| Component | Authoritative Inputs | Emitted Events | Host-Owned Services | Semantic Primitive |
| :--- | :--- | :--- | :--- | :--- |
| `WeatherCard` (*Sol*) | `location`, `forecastByDate`, `selectedDate`, `unit`, `status` | `dateChange`, `unitChange`, `locationChange`, `retry` | Weather provider, cache, location permission | `role="tablist"` for days; `28°C ↔ 82°F` |
| `TeamPicker` (*Gather*) | `people`, `selectedIds`, `open`, `saveStatus` | `openChange`, `selectionChange`, `retry`, `revert` | Membership access & persistence | Controlled popover + checkboxes (`0, 1, 3, 4` sync) |
| `MaterialPalette` (*Courtyard*) | `materials`, `selectedMaterialId`, `previousSnapshot` | `select`, `shuffle`, `undo` | Palette library & project application | `<fieldset>` radios + snapshot undo |
| `MembershipPanel` (*Roam*) | `plansById`, `selectedPlanId`, `checkoutStatus` | `planChange`, `review`, `checkout`, `cancel` | Verified price catalog & payment session | Plan tabs + `20%` annual discount math |
| `UsagePanel` (*Kiln*) | `range`, `categories`, `dailySeries`, `resources`, `requestStatus` | `rangeChange`, `inspect`, `retry`, `manage` | Billing periods, totals & account routes | Period tabs + `sum(categories) == used == sum(daily)` |
| `NavigationDock` (*Folio*) | `items`, `currentPath`, `navigationStatus` | Normal route link navigation | Router, auth & route content | `<a aria-current="page">` |

### Normalized Asset Crop Windows
- `02-rill-and-rye-bakery.png`: Orchard bakery window `[0.466, 0.198, 0.518, 0.718]`.
- `06-serein-botanical-care.png`: Botanical macro `[0.365, 0.068, 0.164, 0.85]`, portrait `[0.53, 0.068, 0.47, 0.85]`, overlapping bottle inset `[0.243, 0.526, 0.172, 0.354]`.
```

## Result

Deliver `design-package.md`, `react-handoff.md`, and deterministic JSON data fixtures.

### Verification

- [ ] Every visual asset, clean background plate, and normalized crop window (`[x, y, w, h]`) is documented with exact paths, dimensions, and SHA-256 hashes.
- [ ] Every interactive module has a single authoritative React state owner, semantic HTML primitive, keyboard/touch contract (`44×44px`), and explicit demo boundary.
- [ ] Desktop (`1440px`) and mobile (`390px` / `320px`) share one DOM structure and data model with CSS-only layout adaptation.

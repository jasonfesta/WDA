---
name: viewport-performance-qa
description: >-
  Verify cross-viewport responsiveness across desktop and mobile breakpoints
  (1440px, 1280px, 768px, 430px, 390px, 320px, and 200% text zoom) with zero
  horizontal overflow, 60fps scroll and WebGL lifecycle performance, reduced-motion
  compliance, and automated browser interaction checks (browser-checks.json and
  docs/verification.md). Use this skill when the user wants to test responsive
  layouts, check scroll/WebGL performance, or run headless browser QA across
  controls and states.
---

# Viewport & Performance QA

```text
skill / viewport-performance-qa
────────────────────────────────────────────────────────────────────
mode      standalone responsive viewport, 60fps scroll & browser QA
input     running web / React application
output    browser-checks.json + docs/verification.md + preview captures
```

Verify cross-viewport layout fidelity across desktop and mobile breakpoints (`1440px` down to `320px` plus `200%` text zoom), `60fps` scroll and Three.js WebGL lifecycle discipline, reduced-motion compliance, and the automated browser interaction matrix (`browser-checks.json` and `docs/verification.md`).

## Inputs

- Running web or React application bound to a local preview port.
- Canonical QA references: [browser-checks.json](./references/browser-checks.json), [verification.md](./references/verification.md), and [react-mobile-contract.md](./references/react-mobile-contract.md).

## Work

1. **Verify cross-viewport geometry and zero horizontal overflow (`1440px → 320px` + `200%` text zoom).**
   - Load every page route, focused study, and open drawer/popover across all target viewports:
     - **Desktop**: `1440 × 1000` and `1280 × 900`
     - **Tablet**: `768 × 1024`
     - **Mobile**: `430 × 932`, `390 × 844` (primary design target), and `320 × 568`
     - **Accessibility Zoom**: `200%` text size
   - In every viewport and state, assert programmatically in the browser:
     ```js
     document.documentElement.scrollWidth <= document.documentElement.clientWidth
     ```
     and verify that every visible `<img>` satisfies `img.complete === true && img.naturalWidth > 0`.
   - Confirm mobile reflow rules below `640px`:
     - Single main column, `24px` side gutters (`20px` at `320px`), `16px` body/input text (`1.5–1.7` line-height), `32–40px` main headings.
     - Chapter pauses: `48–72px` (`72–96px` for architectural studies). Secondary 2-product rows at `390px` stack cleanly to 1 column at `320px`.
     - Mobile navigation opens in a labelled dialog (`role="dialog"` / `aria-modal="true"`) with explicit close button, `Escape` handler, focus return to trigger, and working mobile search.
     - All interactive hit targets measure at least `44 × 44 CSS px` (`48px` for `<details>/<summary>` rows).

2. **Audit `60fps` scroll, GPU-only transitions, and Three.js WebGL lifecycle.**
   - **Native vertical scroll & scroll-kit**: Confirm smooth `60fps` vertical scrolling with zero scroll hijacking, zero pinned multi-screen traps, and zero cumulative layout shift (`CLS = 0`) when the sticky/overlay site header transitions after the hero sentinel.
   - **GPU-safe animations & reduced motion**:
     - Animate only `transform` and `opacity`; gate fine-pointer hover effects (`scale(1.018)`, `240ms` crossfade, `4px` arrow shift) behind `@media (hover: hover) and (pointer: fine)` in CSS rather than React state.
     - Emulate `prefers-reduced-motion: reduce` and confirm all entrance translates, scales, parallax, and auto-rotations disable immediately (`transition: none !important; transform: none !important`).
   - **WebGL lifecycle**:
     - Confirm idle board tiles render static `<img>` thumbnails (zero active WebGL contexts while idle).
     - Hovering/focusing a tile or opening a study mounts a single Three.js renderer, renders on demand when camera/material/theme knobs change, pauses when `document.hidden` is true, and calls `.dispose()` on geometries, materials, textures, and the WebGL context upon close/unmount.

3. **Execute the automated browser interaction matrix (`browser-checks.json`).**
   - Run automated headless browser checks across all components, routes, and viewports (`1280×900` and `390×844`), covering:
     - **State transition edges**: Every directed state transition (`01 → 02`, `01 → 03`, `01 → 04`, `04 → 05`, and return to `01`) plus image/prompt/reference inspection tabs.
     - **Interactive control matrix**: Every unit toggle, day/period tab, checkbox row, swatch radio, shuffle/undo button, billing switch, and dock route link.
     - **Global shell & keyboard checks**: `ArrowLeft`, `ArrowRight`, `Escape` focus return, deep-link URL restoration, and `layout 1280x900` / `layout 390x844` overflow checks.
   - Assert **zero** `console.error`, `console.warn`, or uncaught `pageerror` events across the entire run.
   - Clear any temporary test bag or saved-item state through the UI, then capture `desktop-preview.jpg` (`1440×1000`) and `mobile-preview.jpg` (`390×844`) and write `docs/verification.md`.

## Input → Output Example

**Sample Input**:
```text
"Run the headless browser QA matrix across all 6 components and the global shell at 1280x900 and 390x844, and output browser-checks.json + docs/verification.md."
```

**Expected Output (`browser-checks.json` excerpt)**:
```json
{
  "date": "2026-10-21",
  "status": "pass",
  "total": 181,
  "viewports": [
    { "width": 1280, "height": 900 },
    { "width": 390, "height": 844 }
  ],
  "checks": [
    { "component": "sol", "test": "01-today → 02-fahrenheit", "pass": true },
    { "component": "gather", "test": "control person-0..3 & avatar sync", "pass": true },
    { "component": "shell", "test": "layout 1280x900", "pass": true },
    { "component": "shell", "test": "layout 390x844", "pass": true }
  ]
}
```

## Result

Deliver `browser-checks.json` (`"status": "pass"`), `docs/verification.md`, `desktop-preview.jpg`, and `mobile-preview.jpg`.

### Verification

- [ ] `scrollWidth <= clientWidth` passes at `1440px`, `1280px`, `768px`, `430px`, `390px`, `320px`, and `200%` text zoom.
- [ ] `browser-checks.json` records `"status": "pass"` across all state transitions, interactive controls, keyboard bindings, and responsive viewports with zero console errors.
- [ ] `docs/verification.md` documents the build, test, port-isolation, interaction checks, and clean desktop/mobile preview captures.

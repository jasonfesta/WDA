---
name: competitor-benchmarking
description: >-
  Benchmark 15–25 live category websites and applications from an initial prompt,
  voice transcript, or mood board by capturing production URLs and full-viewport
  screenshots and evaluating both Visual Direction and Code/DOM Interactions into
  research.md and live-reference-register.md. Use this skill when the user wants
  to research a product category, gather live design references, or audit how
  real websites and apps handle layout and interaction.
---

# Competitor Research Benchmarking

```text
skill / competitor-benchmarking
────────────────────────────────────────────────────────────────────
mode      standalone category & interaction research
input     prompt / voice transcript / mood board / category brief
output    research.md + live-reference-register.md + viewport captures
```

Turn a prompt, voice transcript, or initial mood board into an evidence-backed benchmark of **15–25 live category websites and applications** (`5` references per concept or archetype), evaluated through both **Visual Direction** and **Code / DOM Interactions**.

## Inputs

- User prompt, voice research transcript, or seed mood board.
- Target surface (`websites`, `apps`, or `components`) and target viewports (`1440×900` / `1280×900` desktop, `390×844` mobile).
- Optional reference template: [visual-review.md](./references/visual-review.md).

## Work

1. **Parse intent, category scope, and concept fixtures.**
   - Identify the product category, target audience, primary user journey, and tonal/material direction.
   - Separate verified user requirements from illustrative concept fixtures (prices, SKUs, opening hours, inventory counts).
   - If a curated reference catalog already exists in `research/`, inspect it first before running live browser discovery.

2. **Capture 15–25 live category references (`5` per concept archetype).**
   - Open each production URL in a real browser, dismiss unsolicited cookie banners or newsletter overlays without submitting forms or creating accounts, and capture full-viewport screenshots under:
     - `research/captures/desktop/<slug>.png` (`1440×900` or `1280×900`)
     - `research/captures/mobile/<slug>.png` (`390×844`)
   - Record the production URL, inspection date (`YYYY-MM-DD`), stylistic pole, and viewport dimensions.

3. **Analyze every reference through the Dual Evaluation Lens.**
   - **Lens A — Visual Direction**:
     - Typography hierarchy: monumental display masthead vs. book/editorial serif vs. tracked sans-serif micro-labels.
     - Surface, ink, and accent relationships (warm paper, alabaster, terracotta, olive, oxblood, amber, cocoa, selective cool contrast).
     - Negative space and chapter pauses (`144–192px` editorial pauses vs. `192–240px` architectural pauses).
     - Photographic framing, crop ratios, and unboxed product silhouettes vs. full-bleed architectural scenes.
   - **Lens B — Code & DOM Interactions**:
     - Header behavior (hero overlay transitioning to solid surface after the hero sentinel with zero layout shift).
     - Native vertical scroll pacing vs. one-time secondary reveal settles (`12px` over `600ms` once at `15%` visibility).
     - Fine-pointer hover states (`@media (hover: hover) and (pointer: fine)`): alternate product-view crossfade, subtle photo scale (`1.018`), arrow translation (`4px`).
     - URL search-parameter synchronization (e.g., `?category=architecture&view=list&sortBy=last-updated`) and semantic HTML primitives (`<details>/<summary>`, `<fieldset>/<legend>` radios, `aria-pressed` step buttons, `aria-current="page"` dock links).

4. **Enforce strict Evidence vs. Proposal separation & claim fencing.**
   - Tag every entry in `live-reference-register.md` with its exact inspection method:
     - `Browser scroll + DOM` — scrolled page and inspected live DOM nodes/computed styles.
     - `Browser click + URL + DOM` — clicked filter/tab/disclosure and verified URL or DOM state change + screenshot.
     - `Primary-page content` — observed directly on the initial landing viewport without interaction.
   - Never claim pointer-hover timing or easing was reverse-engineered from a reference site unless directly inspected; label proposed interaction timings (`240ms` crossfade, `500ms` scale, `600ms` entrance) as **Proposed behavior**.
   - **Fence off non-transferable source-brand claims**: Explicitly list any medical/SPF efficacy claims, clinical trial percentages, alcohol-free positioning, sustainability certifications, or proprietary repair warranties found on reference sites so they are never copied into fictional concept copy.

5. **Write the canonical research artifacts (`research.md` & `live-reference-register.md`).**
   - Save the category synthesis in `research/research.md` (or `research/desktop.md` + `research/mobile.md`) and the granular per-site evidence table in `research/live-reference-register.md`.

## Input → Output Example

**Sample Input (Prompt)**:
```text
"Give me 15–25 live category benchmarks for a warm tactile leather goods and editorial bakery landing study. Evaluate both visual direction and live DOM interactions."
```

**Expected Output (`research/live-reference-register.md` excerpt)**:
```markdown
| Ref ID | Brand & Production URL | Inspected | Archetype Pole | Evidence Level | Observed Visual Direction | Observed DOM / Interaction Pattern | Fenced-Off Source Claims |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CAT-01 | [Polène](https://eng.polene-paris.com) | 2026-10-21 | Opinionated / Tactile | Browser scroll + DOM | Full-bleed sunlit campaign hero; unboxed leather silhouettes on warm cream | `<fieldset>` leather swatch radios; alternate angle crossfade on fine pointer | Certified leather tannery provenance (do not reuse) |
| CAT-02 | [Tartine](https://tartinebakery.com) | 2026-10-21 | Structured / Editorial | Browser click + URL + DOM | Two-column split masthead; expressive roman/italic serif + tracked bake schedule | `<details>/<summary>` FAQ rows; location filter syncs with URL query params | Organic grain certification (do not reuse) |
```

## Result

Return `research/research.md`, `research/live-reference-register.md`, and the indexed screenshot directory `research/captures/`.

### Verification

- [ ] 15–25 curated live category references (`5` per concept archetype) are documented with production URLs, inspection dates, and viewport screenshots.
- [ ] Every reference is evaluated across both **Visual Direction** and **Code / DOM Interactions**.
- [ ] Every row in `live-reference-register.md` records its exact evidence level (`Browser scroll + DOM`, `Browser click + URL + DOM`, or `Primary-page content`) and separates observed facts from proposed behavior.
- [ ] Source-brand medical, SPF, certification, alcohol-free, and warranty claims are explicitly fenced off from concept reuse.

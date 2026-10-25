---
name: image-to-react-translation
description: >-
  Translate screen comps, moodboards, or design packages into semantic React,
  TypeScript, and CSS with live DOM typography and controls, clean inpainted
  photographic background plates, uniform SVG crops, and on-demand Three.js
  WebGL scenes. Use this skill when the user wants to convert design images or
  4K comps into a working React + TypeScript + Vite application.
---

# Clean Image-to-React Translation

```text
skill / image-to-react-translation
────────────────────────────────────────────────────────────────────
mode      standalone image-to-React engineering & WebGL reconstruction
input     screen comps / moodboard images / design-package.md / build brief
output    compiling React + TypeScript + Vite build + live preview
```

Translate screen comps, 4K website grids, or moodboard references into clean, modular React + TypeScript + CSS—rebuilding all typography, navigation, and stateful controls in the live DOM while isolating photography, textures, 3D cutouts, and Three.js scenes into clean asset layers.

## Inputs

- Screen comps, 4K grids, moodboard images, or handoff specifications (`design-package.md`, `react-handoff.md`).
- Canonical build briefs: [original-image-prompt.md](./references/original-image-prompt.md), [warm-moodboard-build-brief.md](./references/warm-moodboard-build-brief.md), and [BUILD-PROMPT.md](./references/BUILD-PROMPT.md).

## Work

1. **Rebuild all typography, navigation, and controls as semantic React DOM.**
   - Render all brand wordmarks, display headlines, body copy, prices, navigation links, buttons, tabs, radio groups, checkboxes, counters, and `<details>/<summary>` accordions as live HTML/CSS/React.
   - **Never** use a full-page or full-component screenshot as the interactive UI or overlay invisible click targets on raster text.
   - Replace any garbled raster micro-copy with clean canonical copy and verified product specs.
   - Ensure large gradient or display headlines have generous `line-height` and `padding-bottom` so zero letter descenders (`g, j, p, q, y`) are clipped.

2. **Isolate photographic plates, normalized SVG crops, 3D cutouts, and Three.js WebGL scenes.**
   - **Clean background plates**: Layer live DOM text over clean inpainted background plates (`public/assets/website-layers/<brand>-clean-photo.png`) so baked raster lettering never ghosts behind live text.
   - **Normalized uniform crops**: Use SVG `viewBox` / `<image preserveAspectRatio="xMidYMid slice">` or CSS crop windows (`[x, y, width, height]`) to preserve natural source aspect ratios without independent X/Y stretching.
   - **Proportion & circle guards**: Preserve natural source stages (`900×501`, `900×563`, `660×660`) scaled uniformly for overview cards and rendered at full readable scale in focus view. Add `flex-shrink: 0; aspect-ratio: 1 / 1; border-radius: 9999px` to all circular swatches, avatars, and icon buttons so they never squash into ovals.
   - **Texture & 3D cutout specimens**: Keep texture studies in `public/assets/textures/` and alpha-bearing 3D object PNGs in `public/assets/3d-objects/` upright with full transparency.
   - **Three.js WebGL material area (`src/areas/MaterialScene.tsx`)**:
     - Build real cube, square pyramid, and sphere meshes on a softly lit seamless ground with grounding shadows, roughness/bump detail, and physical transmission/thickness for glass.
     - Support selectable finishes (`Original` seeded procedural texture, `Stone`, `Glaze`, `Linen`), pointer/touch/keyboard orbit, zoom, reset, and opt-in rotation.
     - Render static reference thumbnails while idle; mount a live WebGL renderer **only** when a tile is hovered/focused or opened in focus view, render on demand, pause when `document.hidden` is true, and dispose geometries/materials/textures/renderer on close.

3. **Coordinate parallel subagents with a shared `AreaProps` contract and semantic tokens.**
   - When splitting work across subagents (Websites, UI & Mobile Interfaces, Texture/Object Specimens, WebGL), share a minimal contract in `src/App.tsx`:
     ```ts
     export interface AreaProps<T = Record<string, unknown>> {
       id: string;
       focused: boolean;
       state: T;
       onState: (next: T | ((prev: T) => T)) => void;
       knobs: {
         hue: number;        // -20 to +20 (clamped to warm families; raster hue shift <= ±7 deg)
         warmth: number;     // -30 to +30
         depth: number;      // -25 to +25
         recolorImages: boolean;
         fontFamily: string;
         direction: string;
       };
     }
     ```
   - Bind all live surfaces and controls to `--surface`, `--surface-raised`, `--ink`, `--muted`, `--accent`, `--accent-alt`, `--on-accent`, and `--border`.
   - Apply the optional `recolorImages` CSS filter **once** to photo/illustration/texture/cutout layers (`±7°` max hue rotation) without double-filtering native DOM text.
   - Persist per-example state, shopping bag items, saved items, and theme knobs in `localStorage` with an in-memory fallback if storage is blocked.

4. **Check listening ports and run a clean local production build.**
   - Before starting any Vite dev or preview server, inspect active TCP listeners (`lsof -iTCP -sTCP:LISTEN -P -n`), leave all existing localhost servers untouched, and bind to an available port using `--strictPort` (e.g., `vite preview --host 127.0.0.1 --port 5186 --strictPort`).

## Input → Output Example

**Sample Input ([BUILD-PROMPT.md](./references/BUILD-PROMPT.md))**:
```text
"Turn the Avela Nano Banana 2 4K website grid into a complete, responsive 5-page React project (Home, Collection, Arc detail, Our Story, Care) using public/assets/website-layers/avela-clean-photo.png for the hero."
```

**Expected Output (Component & Asset Layer Structure)**:
```tsx
// Hero uses clean inpainted photo plate + 100% live DOM text & controls
<section className="avela-hero" style={{ backgroundImage: 'url(/assets/website-layers/avela-clean-photo.png)' }}>
  <header className="avela-header">
    <a href="#/" className="avela-wordmark">AVELA</a>
    <nav aria-label="Primary">
      <a href="#/collection">Collection</a>
      <a href="#/arc">The Arc</a>
      <a href="#/story">Our Story</a>
      <a href="#/care">Care</a>
    </nav>
    <button type="button" onClick={onOpenBag} aria-label={`Shopping bag, ${bagCount} items`}>
      Bag ({bagCount})
    </button>
  </header>
  <div className="avela-hero__story">
    <p className="avela-eyebrow">OBJECT 01 / THE ARC · 30 × 22 × 10 CM · $420</p>
    <h1>A softer shape.<br />A longer story.</h1>
  </div>
  <div className="avela-hero__display" aria-hidden="true">SOFT FORM</div>
</section>
```

## Result

Deliver the compiling React + TypeScript + Vite implementation and live preview URL.

### Verification

- [ ] `npm run build` (`tsc && vite build`) and `npm test` pass with zero TypeScript, bundler, or unit test errors.
- [ ] All text, navigation, and controls are live DOM; clean background plates (`*-clean-photo.png`) and uniform crops show zero ghosted raster text or stretched imagery.
- [ ] Existing localhost listeners remain untouched and the preview server responds with `HTTP 200` on its dedicated `--strictPort`.

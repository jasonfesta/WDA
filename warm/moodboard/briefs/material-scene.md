# Material studies — image to React brief

## Intent

Build six warm geometric studies as one reusable React + Three.js area, on the off-white moodboard. Preserve each selected composition as a source image while its board tile is idle. Hovering or focusing the tile mounts a real interactive WebGL scene containing a cube, square pyramid, and sphere. The focused study uses the same geometry and adds material controls. This is an interpretation of the image, not an image presented as a 3D model. The source PNGs remain intact.

## Selected imagery and composition

All six supplied images were inspected at full view before implementation.

| ID | Selected source in `public/assets/geometric-studies` | Arrangement and material cues |
|---|---|---|
| REF-031 | `01-apricot-balance.png` | Large apricot cube at left; smaller cream pyramid on top; terracotta sphere on the floor at right. Subtle, dense pores and a quiet ceramic finish. |
| REF-032 | `02-citron-courtyard.png` | Moss sphere on a small cream stone cube at left; larger citron pyramid beside it. Porous stone and slightly glossy moss. |
| REF-033 | `03-rosette-tilt.png` | Cream sphere atop a rose aggregate cube at back right; terracotta pyramid at front left. Large aggregate reads against finer ceramic texture. |
| REF-034 | `04-honey-translucence.png` | Clay pyramid on cream aggregate cube at back right; amber translucent sphere at front left. Glass uses physical transmission, thickness, refraction, and environment reflections. |
| REF-035 | `05-clay-triad.png` | Large pale clay cube at back; terracotta pyramid front left; smaller peach sphere front right. Aggregate is shared across all three surfaces. |
| REF-036 | `06-quiet-monument.png` | Rose aggregate cube left, a small citron pyramid on top, and a large moss sphere right. Warm side light and low, grounding shadows. |

## Supporting material references

All twelve files in `public/assets/textures` were visually inspected. `09-peach-travertine.png`, `12-cream-glaze.png`, and `08-moss-linen.png` are loaded as real image color maps with separately configured non-color bump maps when Stone, Glaze, or Linen is selected. These are creative material studies from photographic references, not scanned calibrated PBR texture sets; baked lighting and seams can remain visible.

`07-sienna-silk.png`, `10-honey-caustics.png`, `11-coral-paper.png`, `19-apricot-citron-light.png`, `20-canyon-lines-craft.png`, `21-rosette-moss-grain.png`, `22-courtyard-light-bokeh.png`, `23-woven-light.png`, and `24-mineral-impressions.png` inform warmth, light, material grain, and tactile detail. They are not indiscriminately projected as full photographs onto the geometry. The original finish uses neutral, seeded procedural pore and aggregate maps so all three global color knobs can affect actual PBR material colors. Amber glass does not claim ray-traced caustics; it uses the physically based transmission available in Three.js.

## Structured implementation prompt

Create a 660 × 660 natural-size material study surface, inheriting its container size. Use a warm seamless floor and backdrop. Light from high left with a soft environmental fill. Use a gently beveled cube, a four-sided pyramid, and a smooth sphere, with visible pores and aggregate detail. Match the arrangement table above. Keep the board surface purely visual: an upright square canvas with no miniature titles or controls. In the focused view only, show a small serif study title at the upper left, live 3D status at upper right, and compact material/camera controls along the lower edge. Use uniform scaling for the sphere, and update camera aspect from actual canvas dimensions so spheres remain round.

The focused React view must render actual mesh geometry with Three.js. Use mesh physical materials with roughness, bump maps, clearcoat, and transmission where appropriate. Preserve the source image as the idle board thumbnail. Mount a renderer when the board tile receives pointer hover or keyboard focus, and dispose it when the tile becomes idle. The board canvas supports direct orbit; wheel events continue to scroll the page. Opening the study gives the full focused renderer with camera and finish controls.

Support pointer and touch orbit, wheel or pinch zoom, keyboard arrow orbit, plus/minus zoom, R to reset, and visible zoom/reset buttons. Expose four material options: Original, Stone, Glaze, and Linen. Persist selected material, camera orbit, distance, and optional rotation through the supplied `state` / `onState` interface. The shared hue, warmth, and depth sliders update rendered material color, lighting, and exposure in place. Rotation is opt-in and pauses when the document is hidden; reduced-motion preferences disable automatic rotation. Dispose GPU resources and observers on close.

## Integration contract

- Component: default export `MaterialScene` from `src/areas/MaterialScene.tsx`.
- Input: the shared `AreaProps`; IDs REF-031 through REF-036 select the six studies.
- The parent card mounts `MaterialScene` for hover/focus activity and unmounts it when idle. `focused=false` renders only the interactive canvas; `focused=true` adds the study heading and material/camera controls.
- State keys: `material`, `orbitTheta`, `orbitPhi`, `orbitDistance`, `autoRotate`.
- Shared colors: `src/material-palettes.ts` exports the source mesh tuples and `materialBaseColors(id, knobs, finish)`. Both the meshes and the direction palette consume its exact cube, pyramid, sphere, backdrop, and optional amber attenuation colors. The header labels these as base colors because lighting, roughness, transmission, and image maps affect displayed pixels. Three.js remains lazily loaded; the palette helper has no Three dependency.
- The interactive area uses one canvas and one WebGL renderer. `ResizeObserver` handles the scene dimensions. Rendering is on demand unless the user turns on rotation.
- A WebGL failure preserves the selected image, explains that it is a reference fallback, and offers retry. Texture load failures retain the interactive geometry and show a precise message.

## Technical references researched

- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html): physical transmission, clearcoat, sheen, and environment maps.
- [Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html): pointer orbit, zoom, constraints, update, and disposal.
- [Three.js Texture](https://threejs.org/docs/pages/Texture.html): color-space handling, bump data, wrapping, anisotropy, and explicit GPU disposal.

## Verification

The integration production build passes. Browser review covered all six arrangements: REF-031–034 as live board tiles and REF-035–036 as focused scenes. All three forms are present and upright. The active board canvas measured 377 × 377 CSS pixels with no internal control buttons; the focused canvas measured 720 × 720 with an equally proportioned drawing buffer. Keyboard orbit visibly changes the geometry, and Reset restores the camera. Moving between board tiles disposes the previous canvas and mounts only the active scene.

Stone, Glaze, and Linen were each selected and visually checked on the live Honey scene: travertine, cracked ceramic, and woven texture maps loaded successfully. Changing Hue from 0 to 30 changed mesh/backdrop colors and the direction palette together; values were returned to baseline afterward. No material-scene warnings or errors were logged during those checks. Reduced-motion handling, context-loss fallback, and narrow-screen controls are implemented but were not independently forced in this pass.

Visual fidelity remains an interactive reconstruction of the selected stills; the images are not mesh assets, and no photogrammetry or physically accurate caustic reconstruction is claimed.

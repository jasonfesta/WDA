# Warm — a study in feeling

An off-white React moodboard using all 42 selected images, 18 live interface compositions, ten warm palettes, and six real Three.js material studies.

Live: https://warm-moodboard.vercel.app

Source: [`jasonfesta/WDA`, under `warm/moodboard/`](https://github.com/jasonfesta/WDA/tree/main/warm/moodboard). Deployed to the personal Vercel workspace `darwin5` as project `warm-moodboard`.

For deployment from a fresh checkout, run `vercel link --yes --project warm-moodboard --scope darwin5` in this directory, then `vercel deploy --prod --scope darwin5`. The local Vercel link, dependencies, and build output are ignored by Git.

```sh
npm install
npm run dev -- --port 5178
npm run build
```

Open `http://127.0.0.1:5178/`. The floating Google Sans Flex controls have no enclosing panel and include Tonal range and Directions. Tonal range opens Hue, Warmth, Depth, image recoloring, and font options. Click any direction's palette strip or choose it from Directions. Click the selected strip to return to all ten.

Hue is limited to −20…20 and moves warm colors within clay/coral/amber/honey families, keeps olives near olive, and barely moves existing cool accent colors. Images receive at most ±7° hue rotation, so the warm premise remains intact. Warmth and Depth adjust saturation and brightness. The image switch can preserve natural photography independently; Reset style restores baseline colors and original fonts. Fonts affect live React text, not lettering baked into an image. The enlarged central headline always uses Google Sans Flex, fades from a warm accent to near-white, and includes baseline padding so descenders remain complete.

The upright mosaic has no reference numbers, captions, category toolbar, scale controls, downloads, or footer. Open affordances appear on hover/focus, and stay available for touch.

Website and interface controls work directly on the board. Hover or focus a 3D tile to mount its real scene and drag to orbit; opening it adds finish and camera controls. Idle tiles use selected source images and dispose their GPU resources. Artwork tiles open at full size without stretching or rotation.

Palette data comes from `theme.ts` for live CSS roles, `material-palettes.ts` for the same values supplied to meshes, and `artwork-palettes.json` and `photo-palettes.json` for representative real pixels sampled from artwork and visible photographic regions. The baked source banks contain up to 16 distinct real colors per direction and source type; the header also includes all eight semantic UI roles and current material base colors, deduplicated. Rebuild source samples with `python3 scripts/extract-artwork-palettes.py` and `python3 scripts/extract-photo-palettes.py` (Pillow). Their swatches receive the same CSS grading as the artwork. Lighting and texture maps affect the final rendered 3D appearance.

`src/registry.json` maps REF-001–042 to assets, sizes, categories, and palettes. `src/theme.ts` derives semantic color roles. `src/App.tsx` owns color, view, and per-example state. Each area accepts the shared `AreaProps` contract. Saved controls and local demonstration state stay in this browser; forms and carts do not send data.

The original selected images are unchanged. Three additional clean photo layers in `public/assets/website-layers/` were generated from Avela, Oriel, and Sundrop to remove baked interface text before rebuilding that text in React. Other compositions use uniform SVG windows onto clean photo regions. Typeface matching and 3D reconstruction are reference-led approximations, not claims of original font identification or recovered meshes.

Reconstruction prompts are in `briefs/`. The complete structured brief, original user prompt, image-analysis prompt, and current 42-image ZIP are in the WDA repository root. No backend is required.

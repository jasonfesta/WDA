# Google Fonts Full Catalog Access, Top-5 Ranking Matrix & Download Reference

This reference manual defines how the `google-font-selection` skill accesses the **entire Google Fonts catalog** (1,600+ font families), extracts a **5-Vector Typographic Fingerprint** from any input artifact (image, video, code, or text brief), scores and returns the **Top 5 Ranked Google Font Recommendations**, and provides exact **Google Fonts URLs** plus **5 ways to download and self-host** every recommended font.

---

## 1. Accessing the Full Google Fonts Catalog (Live + Offline)

The skill accesses the complete Google Fonts library through three complementary layers:

1. **Live Google Fonts Metadata Endpoint (No API Key Required — 1,600+ Families)**:
   - Endpoint: `https://fonts.google.com/metadata/fonts`
   - Returns JSON (prefixed with `)]}'\n`) containing every published Google Font family (`familyMetadataList`), including `family`, `category` (`SANSSERIF`, `SERIF`, `DISPLAY`, `MONOSPACE`, `HANDWRITING`), `stroke`, `classifications`, `axes` (`tag`, `min`, `max`, `defaultValue`), `fonts` (weights/styles), `subsets`, and `popularity` / `trending` rank.
   - Run the bundled CLI helper to fetch or query the full catalog:
     ```bash
     python3 typography/google-font-selection/scripts/recommend_google_fonts.py --sync-live
     ```
2. **Official Google Fonts Developer Webfonts API v1**:
   - Endpoint: `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=$GOOGLE_FONTS_API_KEY`
   - Provides direct `.ttf` / `.woff2` file URLs per weight and variant.
3. **Built-In Curated Classification & Variable-Axis Index (`scripts/recommend_google_fonts.py`)**:
   - Works 100% offline (`$0` cost, zero network required) with rich typographic metadata (contrast, warmth, aperture, proportion, tempo, x-height, stroke modulation, variable axes, and pairing synergy) across all design archetypes, and merges seamlessly with the live 1,600+ family metadata cache when online.

---

## 2. Multimodal Artifact Classification → Design Type

When an engineer passes **any artifact** into the skill, classify it into its primary **Design Type** and measure its **5-Vector Typographic Fingerprint** (`contrast`, `warmth`, `aperture`, `proportion`, `tempo` on a `1–5` scale):

| Design Type ID | Design Type Name | Typical Input Artifacts (Image / Video / Code / Text) | Target Typographic Fingerprint |
| :--- | :--- | :--- | :--- |
| **`warm-editorial-luxury`** | **Warm Editorial, Atelier & Luxury Commerce** | Sunlit campaign photography, leather/stoneware/linen textures, lookbooks, fashion/hospitality briefs | High contrast (`4–5`), high warmth (`4–5`), open aperture (`3–4`), classic/generous proportion (`3–4`), contemplative tempo (`1–2`) |
| **`modern-product-ui`** | **Adaptive Product UI, AI Workspace & Design System** | App screenshots, dark/light mode SaaS shells, Figma frames, React/TSX component trees | Low-medium contrast (`1–2`), neutral warmth (`3`), wide open aperture (`5`), balanced proportion (`3`), responsive tempo (`3–4`) |
| **`technical-dev-data`** | **Technical Developer Tool, Telemetry & FinTech** | Code editors, CLI/logs, analytics dashboards, WebGL/3D LiDAR viewports, API docs | Low contrast (`1–2`), cool/clinical warmth (`1–2`), high aperture (`5`), compact/tabular proportion (`2–3`), fast tempo (`4–5`) |
| **`tactile-craft-culinary`** | **Tactile Craft, Bakery, Botanical & Packaging** | Film grain, paper labels, apothecary bottles, organic food/beverage video reels | Medium-high contrast (`3–4`), maximum warmth (`5`), humanist aperture (`4`), expressive proportion (`3–4`), warm tempo (`2–3`) |
| **`kinetic-video-brutalist`** | **Kinetic Video Title, Poster & Neo-Brutalist Motion** | `.mp4`/`.mov` motion reels, bold festival posters, experimental WebGL sites, wide hero banners | Variable/extreme contrast (`2–5`), bold attitude (`2–4`), sturdy aperture (`4`), condensed-to-extended proportion (`1` or `5`), high tempo (`5`) |
| **`high-contrast-culture`** | **High-Contrast Magazine, Architecture & Studio Index** | Monochrome architectural photography, gallery catalogs, brutalist grids + sharp serif headlines | Extreme Didone/sharp contrast (`5`), editorial warmth (`3`), crisp aperture (`3–4`), tall/narrow-to-normal proportion (`2–3`), deliberate tempo (`2`) |
| **`longform-documentation`** | **Longform Reading, Research & Knowledge Base** | Markdown essays, academic PDFs, multi-column articles, technical specifications | Moderate contrast (`2–3`), comfortable warmth (`3–4`), generous x-height & aperture (`4–5`), book proportion (`3`), steady reading tempo (`2`) |

---

## 3. URL & Download Formats Required for Every Top-5 Font

For **each of the Top 5 recommended Google Fonts**, always provide all 5 of the following actionable URLs and download commands:

### A. Google Fonts Specimen Page URL
```text
https://fonts.google.com/specimen/<Family+Name>
```
*(Example: `https://fonts.google.com/specimen/Instrument+Serif` or `https://fonts.google.com/specimen/Google+Sans+Flex`)*

### B. Production Google Fonts CSS2 API URL (`<link>` & `@import`)
Remember that **Google Fonts CSS2 requires axis names in strict alphabetical order** (`ital`, `opsz`, `slnt`, `wdth`, `wght` before uppercase `GRAD`, `ROND`, `SOFT`, `WONK`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400..700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### C. How to Download & Install the Font (4 Direct Methods)

1. **Method 1 — Direct `.zip` Archive & `curl` Script (`scripts/recommend_google_fonts.py --download`)**:
   - Google Fonts serves official `.ttf` / `.woff2` binary URLs inside its CSS2 response when queried with a modern User-Agent, or via the official GitHub source tree (`https://github.com/google/fonts`).
   - Engineers can download the Top 5 fonts directly into `public/fonts/` using the bundled script:
     ```bash
     python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
       --artifact "warm editorial leather goods homepage" \
       --download-dir ./public/fonts
     ```
   - Or via a one-line `curl` command generated by the skill for each font family:
     ```bash
     # Download WOFF2 variable font binary directly from Google Fonts CSS2 endpoint
     curl -sA "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36" \
       "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700" \
       | grep -oE "https://fonts.gstatic.com/[^)]+\.woff2" | head -n 1 \
       | xargs curl -L -o Newsreader-Variable.woff2
     ```

2. **Method 2 — NPM Self-Hosting via `@fontsource` (Recommended for React / Vite / Next.js)**:
   - Zero external network requests at runtime, GDPR-compliant, and automatic Vite/Webpack asset bundling:
     ```bash
     # Variable font package (preferred when the font has variable axes)
     npm install @fontsource-variable/newsreader @fontsource-variable/plus-jakarta-sans @fontsource/ibm-plex-mono
     ```
     ```tsx
     // In src/main.tsx or src/App.tsx
     import '@fontsource-variable/newsreader';
     import '@fontsource-variable/plus-jakarta-sans';
     import '@fontsource/ibm-plex-mono/400.css';
     ```

3. **Method 3 — Official Google Fonts GitHub Repository (`.ttf` / Variable Source Binaries)**:
   - Every open-source Google Font lives in `https://github.com/google/fonts` under `ofl/<family_slug>/` (SIL Open Font License), `apache/<family_slug>/`, or `ufl/<family_slug>/`:
     ```text
     https://github.com/google/fonts/tree/main/ofl/newsreader
     ```

4. **Method 4 — Google Webfonts Helper (Multi-Weight `.zip` Bundle for Static Self-Hosting)**:
   - Direct API & UI for downloading pre-subsetted `.woff2` + `@font-face` CSS bundles:
     ```text
     https://gwfh.mranftl.com/api/fonts/newsreader?download=zip&subsets=latin&variants=regular,500,600,italic&formats=woff2
     ```

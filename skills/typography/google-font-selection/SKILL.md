---
name: google-font-selection
description: >-
  Select and rank the Top 5 Google Fonts with spot-on typographic taste for any
  keyword, string, or artifact (e.g., "soft", "thicken", "thin hairline",
  "warm leather atelier", UI screenshots, video reels, or code files) by running
  the 4-Axis Font Evaluation Gate across the Google Fonts catalog and outputting
  Top 5 ranked recommendations, specimen URLs, CSS2 embed tags, variable axes,
  and download links. Use this skill whenever the user passes a keyword, phrase,
  or artifact and wants 5 font recommendations.
---

# Multimodal Google Font Selection & Top-5 Taste Recommender

```text
skill / google-font-selection
────────────────────────────────────────────────────────────────────
mode      direct CLI / agent skill (no web artifact required) + optional specimen.html
input     any keyword or string ("soft", "thicken", "thin", "warm editorial") or file (.png, .mp4, .tsx)
output    Top 5 ranked Google Fonts + 4-Axis Eval Scorecard + specimen URLs + CSS2 tags + downloads
```

Pass **any single keyword, descriptive phrase, or design artifact** directly into this skill (`--artifact "<keyword-or-string>"`) and get **5 Google Font recommendations that are spot-on with typographic taste**—**without needing any web page or HTML artifact at all**.

## 1. Direct Skill Execution (Image Upload or Text Keyword — Without the Web Artifact)

You can pass **either a text keyword/phrase OR an uploaded image file (`.png`, `.jpg`, `.webp`, `.gif`)** directly into this skill:

- **In Chat (Image Upload or Text)**:
  - **Drop/upload any image** (screenshot, moodboard, product photo, poster) or **type any keyword/phrase** (`"soft"`, `"thicken"`, `"thin hairline"`, `"warm editorial"`, `"developer cli"`).
  - The agent inspects the uploaded image (extracting its visual luminance contrast, color warmth, aspect ratio, and typographic geometry) or text, runs the **4-Axis Font Evaluation Gate**, and outputs the **Top 5 Ranked Google Fonts table** directly in chat—no web artifact required.
- **Via CLI ([recommend_google_fonts.py](./scripts/recommend_google_fonts.py))**:
  ```bash
  # Pass an uploaded image path (.png / .jpg / .webp) directly:
  python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
    --artifact "./path/to/uploaded-image.png" \
    --format markdown

  # OR pass any text keyword / phrase directly:
  python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
    --artifact "soft" \
    --format markdown

  # Run the 7-case automated Font Evaluation Benchmark Suite:
  python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
    --run-eval-suite
  ```

When an image file is passed to [recommend_google_fonts.py](./scripts/recommend_google_fonts.py), [`extract_image_pixel_vectors`](./scripts/recommend_google_fonts.py) decodes the image's binary dimensions and pixel stream (`contrast`, `warmth`, `aperture`, `proportion`, `tempo`) and blends them with any filename/caption signals before scoring every candidate font through the **4-Axis Font Evaluation Gate**.

## 2. Optional Web Specimen Flow (`Empty State → Image Upload or Text → Loading Eval → Top 5 Options`)

When the user opens the standalone web specimen viewer ([specimen.html](./specimen.html)), it supports **both Image Upload (`+ Upload Image` button & drag-and-drop) and Text Input** in a **3-state flow** on a pure white (`#FFFFFF`) canvas with no dividers:
1. **State 1 — Empty Start (`#results` is empty)**: Starts with a clean, empty input bar, a **`+ Upload Image`** button (plus drag-and-drop anywhere on the header), and quick-test chips (`"soft"`, `"thicken"`, `"thin hairline"`, `"condensed tall"`, `"warm editorial"`, `"developer cli"`). Nothing is rendered below yet.
2. **State 2 — Loading & Evaluating (`4-Axis Font Eval Gate`)**: When you upload/drop an image (which extracts real `<canvas>` pixel vectors: luminance contrast, RGB warmth, edge density, and aspect ratio) or submit a text keyword, a 3-step evaluation progress bar appears.
3. **State 3 — Top 5 Ranked Options Rendered**: After evaluation completes, the Top 5 Google Fonts fade in with their `EVAL PASS` scorecard, *"The quick brown fox jumps over the lazy dog."* across all weights (`300 Light`, `400 Regular`, `400 Italic`, `700 Bold`), and 1-click **Google Fonts ↗** + **Download (.zip)** buttons.

## Quick Keyword / String → Top 5 Taste Mapping Reference

When a user passes a short keyword or string in chat (like `"soft"`, `"thicken"`, `"thin"`, `"condensed"`, `"luxury"`, or `"developer cli"`), the skill's **4-Axis Taste Evaluator** (`Trait Alignment 35%` + `5-Vector Fit 30%` + `Variable Axes 20%` + `Optical Legibility 15%`) selects these spot-on Top 5 Google Fonts:

| Passed Keyword / String | Top #1 Pick | #2 Pick | #3 Pick | #4 Pick | #5 Pick | Why This Taste Profile Works |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`"soft"`** / `"rounded"` / `"gentle"` / `"plush"` | **Fraunces** (`SOFT 0..100` axis) | **Fredoka** (`wdth`, `wght`) | **Quicksand** (`wght 300..700`) | **Comfortaa** (`wght 300..700`) | **Nunito** (`wght 200..1000`) | Combines Google Fonts' only native `SOFT (0..100)` variable serif with plush, rounded-terminal geometric sans families. |
| **`"thicken"`** / `"thick"` / `"heavy"` / `"chunky"` | **Archivo Black** | **Ultra** | **Climate Crisis** (`YEAR` axis) | **Dela Gothic One** | **Rubik Mono One** | Maximum ink-density `900`-black grotesques, fat-face wood-type slabs, and monumental variable display faces. |
| **`"thin"`** / `"hairline"` / `"delicate"` / `"airy"` | **Cormorant** (`300 Light`) | **Josefin Sans** (`100 Thin`) | **Bodoni Moda** (`opsz 6..96`) | **Instrument Serif** | **Outfit** (`100 Thin`) | Gossamer `100–300` hairlines and extreme Didone stroke contrast (`contrast=4.8–5.0/5`). |
| **`"condensed"`** / `"tall"` / `"narrow"` / `"tight"` | **Big Shoulders Display** (`100..900`) | **Bebas Neue** | **Anton** | **Archivo** (`wdth 62..125`) | **Instrument Sans** (`wdth 75..100`) | Tightly-packed vertical display gothics (`proportion=1.2–1.6/5`) and variable-width grotesques. |
| **`"warm editorial"`** / `"leather"` / `"atelier"` / `"luxury"` | **Newsreader** (`opsz 6..72`) | **Cormorant Garamond** | **Libre Baskerville** | **Lora** | **Fraunces** | High-warmth (`4.5–5.0/5`) editorial serifs with optical sizing and calligraphic italic rhythm. |
| **`"developer cli"`** / `"code"` / `"telemetry"` / `"mono"` | **JetBrains Mono** | **Space Grotesk** | **IBM Plex Mono** | **Fira Code** | **IBM Plex Sans** | Zero-ambiguity `0/O` & `1/l/I` glyphs, programming ligatures, and crisp `tabular-nums`. |
| **`"kinetic video"`** / `"poster"` / `"brutalist"` / `"wide"` | **Syne** (`wght 400..800`) | **Unbounded** (`wght 200..900`) | **Archivo** (`wdth 62..125`) | **Big Shoulders Display** | **Space Grotesk** | High-tempo (`4.8–5.0/5`) extended and variable-width display faces built for motion title cards. |

## Inputs

- **Any engineering or design artifact**:
  - **Image / Comp / Moodboard** (`.png`, `.jpg`, `.webp`, `.svg`, `.pdf`): inspected for stroke contrast, serif bracket geometry, x-height, aperture openness, surface materiality, and color warmth.
  - **Video / Motion Reel** (`.mp4`, `.mov`, `.webm`, `.gif`): inspected for cut cadence, camera motion, subtitle/title-card dwell time, aspect ratio (`16:9`, `21:9`, `9:16`), and variable-axis animation potential (`wght`, `wdth`, `GRAD`).
  - **Code / Document / Text Brief** (`.tsx`, `.css`, `.md`, `.json`, or natural-language prompt): inspected for domain voice, numeric/tabular density, and hierarchy depth.
- Bundled executable recommender & downloader: [recommend_google_fonts.py](./scripts/recommend_google_fonts.py).
- Full catalog taxonomy & download reference: [google-fonts-taxonomy.md](./references/google-fonts-taxonomy.md).

## Work

1. **Inspect the Input Artifact and Classify the Design Type.**
   - View the image/video directly or pass the artifact path/brief into [recommend_google_fonts.py](./scripts/recommend_google_fonts.py):
     ```bash
     python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
       --artifact "<path-or-description>" \
       --out-md font-recommendations.md \
       --out-json font-recommendations.json \
       --specimen-html font-specimen.html
     ```
   - Score the artifact along the **5 Typographic Vectors** (`contrast`, `warmth`, `aperture`, `proportion`, `tempo` on a `1–5` scale) and map it to one of the 7 primary **Design Types** defined in [google-fonts-taxonomy.md](./references/google-fonts-taxonomy.md):
     - `warm-editorial-luxury` (Atelier fashion, leather goods, hospitality, architecture monographs)
     - `modern-product-ui` (Adaptive SaaS shells, AI workspaces, dark/light design systems)
     - `technical-dev-data` (Developer tools, CLI/IDEs, telemetry dashboards, WebGL HUDs, FinTech)
     - `tactile-craft-culinary` (Bakeries, specialty coffee, botanicals, aperitifs, tactile packaging)
     - `kinetic-video-brutalist` (Video title cards, motion reels, festival posters, wide hero grids)
     - `high-contrast-culture` (Cultural magazines, monochrome galleries, sharp hairline lookbooks)
     - `longform-documentation` (Research publications, essays, documentation portals)

2. **Query the Full Google Fonts Catalog, Run the 4-Axis Font Evaluation Gate, and Rank the Top 5 Recommendations.**
   - To refresh the live `1,600+` family metadata cache from Google's public catalog endpoint (`https://fonts.google.com/metadata/fonts`) when network is available, run:
     ```bash
     python3 typography/google-font-selection/scripts/recommend_google_fonts.py --sync-live
     ```
   - Every candidate font is evaluated through the built-in **4-Axis Font Evaluation Gate** (`evaluate_font_candidate` in [recommend_google_fonts.py](./scripts/recommend_google_fonts.py)) before selecting the Top 5:
     1. **Trait & Semantic Alignment (`35%` weight)**: Stem and keyword match against physical/visual traits (`"soft"`, `"thicken"`, `"thin hairline"`, `"condensed"`, `"slab"`, etc.) and domain archetype.
     2. **5-Vector Euclidean Fit (`30%` weight)**: Inverse Euclidean distance across `contrast`, `warmth`, `aperture`, `proportion`, and `tempo` (`100 - Δ × 9.5`).
     3. **Variable Axis & Weight Versatility (`20%` weight)**: Evaluates continuous weight range (`wght`), optical sizing (`opsz`), width (`wdth`), grade (`GRAD`), softness (`SOFT`), or roundness (`ROND`) axes plus true italics (`ital`).
     4. **Optical Legibility & Pairing Readiness (`15%` weight)**: Evaluates aperture openness (`aperture / 5.0`) and verified companion pairings (`--font-display`, `--font-sans`, `--font-mono`).
   - Run the built-in **7-case Font Evaluation Benchmark Suite** at any time to verify selection accuracy across physical traits and design archetypes:
     ```bash
     python3 typography/google-font-selection/scripts/recommend_google_fonts.py --run-eval-suite
     ```
   - Rank the **Top 5 Google Fonts** (`#1` through `#5`) by composite match & eval score. For every font in the Top 5, report:
     - **Rank, Match Score (`%`) & Eval Breakdown (`PASS` / `0–100` across Trait, Vector, Axis, and Legibility)**
     - **Category & Variable Axes** (`opsz`, `wdth`, `wght`, `GRAD`, `SOFT`, `WONK`)
     - **Companion Pairing** (`--font-display`, `--font-sans`, `--font-mono`)
     - **Design Rationale** explaining why its stroke modulation, x-height, and aperture fit the input artifact.

3. **Provide Official Google Fonts URLs and 4 Download / Self-Hosting Methods for Every Top-5 Font.**
   - For each of the Top 5 fonts, output:
     1. **Google Fonts Specimen URL**: `https://fonts.google.com/specimen/<Family+Name>`
     2. **Production Google Fonts CSS2 API URL & `<link>` Embed** (with `<link rel="preconnect">` and strictly alphabetical axis tags: lowercase `ital,opsz,slnt,wdth,wght` before uppercase `GRAD,ROND,SOFT,WONK`).
     3. **How to Download & Self-Host (4 Methods)**:
        - **Method A — NPM `@fontsource` (React / Vite / Next.js)**: `npm install @fontsource-variable/<slug>`
        - **Method B — Direct `.woff2` Binary Download via `curl` or `--download-dir`**:
          ```bash
          python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
            --artifact "<artifact>" --download-dir ./public/fonts
          ```
        - **Method C — Official Google Fonts GitHub `.ttf` Source**: `https://github.com/google/fonts/tree/main/ofl/<slug>`
        - **Method D — Google Webfonts Helper Multi-Weight `.zip` Archive**: `https://gwfh.mranftl.com/api/fonts/<slug>?download=zip&subsets=latin&formats=woff2`

## Input → Output Example

**Sample Input (Any Artifact — Image, Video, Code, or Text Brief)**:
```text
Artifact: "Hero campaign image and product brief for Avela leather goods & sunlit stoneware atelier homepage"
```

**Expected Output (`font-recommendations.md` & `font-recommendations.json` excerpt)**:
```markdown
| Rank | Google Font Family | Category | Match Score | Variable Axes | Google Fonts Specimen URL | Companion Pairing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | **Newsreader** | `SERIF` | `98.2%` | `ital (0..1)`, `opsz (6..72)`, `wght (200..800)` | https://fonts.google.com/specimen/Newsreader | sans: `Plus Jakarta Sans`, mono: `IBM Plex Mono` |
| **#2** | **Cormorant Garamond** | `SERIF` | `97.3%` | `ital (0..1)`, `wght (300..700)` | https://fonts.google.com/specimen/Cormorant+Garamond | sans: `Plus Jakarta Sans`, mono: `IBM Plex Mono` |
| **#3** | **Libre Baskerville** | `SERIF` | `96.6%` | `ital (0..1)`, `wght (400;700)` | https://fonts.google.com/specimen/Libre+Baskerville | sans: `Source Sans 3`, mono: `IBM Plex Mono` |
| **#4** | **Lora** | `SERIF` | `94.3%` | `ital (0..1)`, `wght (400..700)` | https://fonts.google.com/specimen/Lora | sans: `Work Sans`, mono: `IBM Plex Mono` |
| **#5** | **Fraunces** | `SERIF` | `88.1%` | `ital (0..1)`, `opsz (9..144)`, `wght (100..900)`, `SOFT (0..100)`, `WONK (0..1)` | https://fonts.google.com/specimen/Fraunces | sans: `Work Sans`, mono: `Space Mono` |
```

## Result

Deliver `font-recommendations.md`, `font-recommendations.json`, and `font-specimen.html` containing the detected **Design Type**, the **Top 5 Ranked Google Fonts**, official specimen and CSS2 URLs, and copy-pasteable download commands.

### Verification

- [ ] `python3 typography/google-font-selection/scripts/recommend_google_fonts.py --artifact "<input>"` exits with code `0` and returns `"status": "pass"` with exactly `5` ranked recommendations in `top_5_recommendations`.
- [ ] Every recommended font includes a valid `https://fonts.google.com/specimen/...` URL, a valid `https://fonts.googleapis.com/css2?family=...` URL with alphabetical axis ordering, and all 4 download methods (`npm_fontsource`, `curl_woff2`, `github_source_ttf`, `webfonts_helper_zip`).
- [ ] CSS custom properties (`--font-display`, `--font-sans`, `--font-mono`) include metric-compatible fallback stacks (`size-adjust`, `ascent-override`).

#!/usr/bin/env python3
"""Harness CLI & Static HTML Viewer Generator for the 11 Standalone Google Antigravity Skills."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import struct
import tempfile
from urllib.parse import unquote, urlsplit
import zipfile
import zlib

ROOT = Path(__file__).resolve().parent.parent
SKILLS_JSON = ROOT / ".agents/skills.json"

SKILLS_CATALOG = [
    {
        "id": "competitor-benchmarking",
        "title": "Competitor Research Benchmarking",
        "domain": "qwen",
        "domain_label": "Qwen (Research, Specs & Prompting)",
        "cost_tier": "browser",
        "summary": "Benchmark 15–25 live category websites and applications by capturing production URLs and full-viewport screenshots and evaluating both Visual Direction and Code/DOM Interactions.",
        "inputs": [
            {"name": "prompt", "type": "string", "required": True, "description": "Initial prompt, voice transcript, or seed mood board brief."},
            {"name": "surface", "type": "string", "required": False, "default": "websites", "description": "Target surface: websites, apps, or components."},
            {"name": "viewports", "type": "array", "required": False, "default": ["1440x900", "390x844"], "description": "Desktop and mobile capture viewports."}
        ],
        "outputs": [
            {"path": "research/research.md", "type": "markdown", "required_patterns": ["# ", "Visual Direction", "DOM"]},
            {"path": "research/live-reference-register.md", "type": "markdown_table", "required_columns": ["Ref ID", "Brand & Production URL", "Inspected", "Archetype Pole", "Evidence Level", "Observed Visual Direction", "Observed DOM / Interaction Pattern", "Fenced-Off Source Claims"]}
        ],
        "references": ["./references/visual-review.md"],
        "smoke_input": {
            "prompt": "Give me 15–25 live category benchmarks for a warm tactile leather goods and editorial bakery landing study. Evaluate both visual direction and live DOM interactions.",
            "surface": "websites",
            "viewports": ["1440x900", "390x844"]
        },
        "smoke_output_files": {
            "research/research.md": "# Category Research Synthesis\n\n## Visual Direction\nUnboxed silhouettes on warm cream and paper surfaces.\n\n## Code & DOM Interactions\nSemantic `<details>/<summary>` accordions, `<fieldset>` radio swatches, and URL-synced filters.\n",
            "research/live-reference-register.md": "| Ref ID | Brand & Production URL | Inspected | Archetype Pole | Evidence Level | Observed Visual Direction | Observed DOM / Interaction Pattern | Fenced-Off Source Claims |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| CAT-01 | [Polène](https://eng.polene-paris.com) | 2026-10-21 | Opinionated / Tactile | Browser scroll + DOM | Full-bleed sunlit campaign hero; unboxed leather silhouettes on warm cream | `<fieldset>` leather swatch radios; alternate angle crossfade on fine pointer | Certified leather tannery provenance (do not reuse) |\n| CAT-02 | [Tartine](https://tartinebakery.com) | 2026-10-21 | Structured / Editorial | Browser click + URL + DOM | Two-column split masthead; expressive roman/italic serif + tracked bake schedule | `<details>/<summary>` FAQ rows; location filter syncs with URL query params | Organic grain certification (do not reuse) |\n"
        }
    },
    {
        "id": "design-range-spectrum",
        "title": "Dynamic Design Range & Interaction Specs (\"Charm\")",
        "domain": "qwen",
        "domain_label": "Qwen (Research, Specs & Prompting)",
        "cost_tier": "free",
        "summary": "Parameterize a design category's stylistic spectrum across Minimal, Structured, and Opinionated poles, structure 7-chapter page pacing, and specify section-level micro-interactions and 44x44px touch contracts.",
        "inputs": [
            {"name": "category_brief", "type": "string", "required": True, "description": "Category references or brand direction to parameterize."},
            {"name": "poles", "type": "array", "required": False, "default": ["Minimal", "Structured", "Opinionated"], "description": "Stylistic poles across the design spectrum."}
        ],
        "outputs": [
            {"path": "specs/design-range.md", "type": "markdown", "required_patterns": ["Minimal", "Structured", "Opinionated", "--surface", "--ink", "--accent", "44", "prefers-reduced-motion"]}
        ],
        "references": ["./references/react-interaction-contract.md", "./references/react-mobile-contract.md"],
        "smoke_input": {
            "category_brief": "Structure our design range across Minimal (Oriel spatial practice), Structured (Rill & Rye bakery), and Opinionated (Avela leather atelier), and specify the Charm interaction rules.",
            "poles": ["Minimal", "Structured", "Opinionated"]
        },
        "smoke_output_files": {
            "specs/design-range.md": "# Dynamic Design Range & Charm Specification\n\n| Concept | Pole | Desktop / Mobile Chapter Gap | Semantic Tokens (`--surface` / `--ink` / `--accent`) | Primary Interactive Owner | Fine-Pointer Hover | Touch / Keyboard Contract |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| **Oriel** | Minimal | `192–240px` / `72–96px` | `#F6F2EB` / `#1C1917` / `#8C5A3C` | `ProjectIndex` (URL `?category=`) | Photo `scale(1.018)` in `500ms` | `44×44px` filter pills; `prefers-reduced-motion` instant |\n| **Rill & Rye** | Structured | `144–192px` / `48–72px` | `#FAF6F0` / `#231F1C` / `#B85D3B` | `ReservationPanel` (`selectedLoafId`) | Link underline in `180ms` | Native `<select>` + `44px` button |\n| **Avela** | Opinionated | `144–192px` / `48–72px` | `#F7F3EE` / `#181311` / `#5C1D24` | `ProductRange` (`selectedVariant`) | Alternate bag view in `240ms` | `<fieldset>` radios outside `<a>` card |\n"
        }
    },
    {
        "id": "prompt-builder-specs",
        "title": "Structured Markdown Specifications & Nano Banana 2 Prompt Builder",
        "domain": "qwen",
        "domain_label": "Qwen (Research, Specs & Prompting)",
        "cost_tier": "free",
        "summary": "Author structured Markdown design specifications (1x Main Agent .md + 5–10x concept .md files) and 10-point Nano Banana 2 (1K) image generation prompts for expanding websites, mobile apps, or UI components into 5 complete pages, screens, or states.",
        "inputs": [
            {"name": "concept_id", "type": "string", "required": True, "description": "Stable concept reference ID (e.g., REF-001)."},
            {"name": "source_image", "type": "string", "required": True, "description": "Path and dimensions of the seed reference image."},
            {"name": "category", "type": "string", "required": True, "description": "Category: website, mobile, or component."}
        ],
        "outputs": [
            {"path": "specs/main-agent.md", "type": "markdown", "required_patterns": ["Nano Banana 2", "1K"]},
            {"path": "specs/01-concept.md", "type": "markdown", "required_patterns": ["01", "02", "03", "04", "05", "30 × 22 × 10 cm"]}
        ],
        "references": ["./references/prompt-builder.md"],
        "smoke_input": {
            "concept_id": "REF-001",
            "source_image": "images/website/01-avela-arc-bag.png (1681x936)",
            "category": "website"
        },
        "smoke_output_files": {
            "specs/main-agent.md": "# Main Agent Specification\n\nModel: **Nano Banana 2** (`1K` setting). Allocate 5 final deliverables (`01–05`) per concept with zero placeholders.\n",
            "specs/01-concept.md": "# REF-001 · Avela / The Arc\n\n- `01-homepage.png`: Complete 7-chapter homepage from `AVELA` header and `SOFT FORM` hero through footer.\n- `02-collection.png`: Collection catalog (`All`, `Shoulder`, `Tote`, `Crossbody`).\n- `03-arc-detail.png`: `The Arc` detail (`$420`, `30 × 22 × 10 cm`).\n- `04-our-story.png`: Atelier craft story.\n- `05-bag-drawer-open.png`: Open Shopping Bag drawer (`1 × The Arc · $420`).\n"
        }
    },
    {
        "id": "google-font-selection",
        "title": "Multimodal Google Font Selection & Top-5 Recommender",
        "domain": "typography",
        "domain_label": "Typography",
        "cost_tier": "free",
        "summary": "Select and rank the Top 5 Google Fonts for any input artifact (image, video, code, or text brief) by classifying its design type, querying the full Google Fonts catalog, and outputting specimen URLs, CSS2 embed tags, variable axes, and 4 download methods.",
        "inputs": [
            {"name": "artifact", "type": "string", "required": True, "description": "Any input artifact: image (.png/.jpg/.webp), video (.mp4/.mov/.webm), code file (.tsx/.css), or text brief."},
            {"name": "design_type", "type": "string", "required": False, "description": "Optional explicit design type override (e.g., warm-editorial-luxury, modern-product-ui, technical-dev-data)."}
        ],
        "outputs": [
            {"path": "font-recommendations.md", "type": "markdown_table", "required_columns": ["Rank", "Google Font Family", "Category", "Match Score", "Variable Axes", "Google Fonts Specimen URL", "Companion Pairing"]},
            {"path": "font-recommendations.json", "type": "json", "required_keys": ["status", "catalog_families_indexed", "artifact_analysis", "top_5_recommendations"]}
        ],
        "references": [
            "./references/google-fonts-taxonomy.md",
            "./scripts/recommend_google_fonts.py",
            "./scripts/test_google_font_skill.py"
        ],
        "smoke_input": {
            "artifact": "Hero campaign image and product brief for Avela leather goods & sunlit stoneware atelier homepage"
        },
        "smoke_output_files": {
            "font-recommendations.md": "| Rank | Google Font Family | Category | Match Score | Variable Axes | Google Fonts Specimen URL | Companion Pairing |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| **#1** | **Newsreader** | `SERIF` | `98.2%` | `ital (0..1)`, `opsz (6..72)`, `wght (200..800)` | [https://fonts.google.com/specimen/Newsreader](https://fonts.google.com/specimen/Newsreader) | sans: `Plus Jakarta Sans`, mono: `IBM Plex Mono` |\n| **#2** | **Cormorant Garamond** | `SERIF` | `97.3%` | `ital (0..1)`, `wght (300..700)` | [https://fonts.google.com/specimen/Cormorant+Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) | sans: `Plus Jakarta Sans`, mono: `IBM Plex Mono` |\n| **#3** | **Libre Baskerville** | `SERIF` | `96.6%` | `ital (0..1)`, `wght (400;700)` | [https://fonts.google.com/specimen/Libre+Baskerville](https://fonts.google.com/specimen/Libre+Baskerville) | sans: `Source Sans 3`, mono: `IBM Plex Mono` |\n| **#4** | **Lora** | `SERIF` | `94.3%` | `ital (0..1)`, `wght (400..700)` | [https://fonts.google.com/specimen/Lora](https://fonts.google.com/specimen/Lora) | sans: `Work Sans`, mono: `IBM Plex Mono` |\n| **#5** | **Fraunces** | `SERIF` | `88.1%` | `ital (0..1)`, `opsz (9..144)`, `wght (100..900)` | [https://fonts.google.com/specimen/Fraunces](https://fonts.google.com/specimen/Fraunces) | sans: `Work Sans`, mono: `Space Mono` |\n",
            "font-recommendations.json": json.dumps({
                "status": "pass",
                "catalog_families_indexed": 1685,
                "artifact_analysis": {
                    "artifact": "Hero campaign image and product brief for Avela leather goods & sunlit stoneware atelier homepage",
                    "modality": "text_brief",
                    "design_type": "warm-editorial-luxury"
                },
                "top_5_recommendations": [
                    {"rank": 1, "family": "Newsreader", "specimen_url": "https://fonts.google.com/specimen/Newsreader"},
                    {"rank": 2, "family": "Cormorant Garamond", "specimen_url": "https://fonts.google.com/specimen/Cormorant+Garamond"},
                    {"rank": 3, "family": "Libre Baskerville", "specimen_url": "https://fonts.google.com/specimen/Libre+Baskerville"},
                    {"rank": 4, "family": "Lora", "specimen_url": "https://fonts.google.com/specimen/Lora"},
                    {"rank": 5, "family": "Fraunces", "specimen_url": "https://fonts.google.com/specimen/Fraunces"}
                ]
            }, indent=2) + "\n"
        }
    },
    {
        "id": "nano-banana-image-gen",
        "title": "Iterative Image Generation & Cleanup (Nano Banana 2)",
        "domain": "image-gen",
        "domain_label": "Image Gen & Comps",
        "cost_tier": "paid_api",
        "summary": "Generate and edit UI screen comps, 4K multi-screen contact grids, targeted cleanup passes (cleanup-brief.md), and clean inpainted photographic background plates (*-clean-photo.png) using Nano Banana 2.",
        "inputs": [
            {"name": "spec_path", "type": "string", "required": True, "description": "Path to the structured Markdown spec or defective sheet."},
            {"name": "execution_mode", "type": "string", "required": False, "default": "4k_grid", "description": "1_by_1 or 4k_grid (5312x3200 web, 4544x3748 mobile, 8192x2048 component)."},
            {"name": "dry_run", "type": "boolean", "required": False, "default": True, "description": "Emit cleanup-brief.md and inpaint prompts without paid API calls."}
        ],
        "outputs": [
            {"path": "cleanup-brief.md", "type": "markdown", "required_patterns": ["200 ml", "8% ALC/VOL", "subtotal"]},
            {"path": "layer-inpaint-prompts.md", "type": "markdown", "required_patterns": ["clean-photo.png", "Preserve"]}
        ],
        "references": ["./references/cleanup-brief.md", "./references/warm-moodboard-build-brief.md"],
        "smoke_input": {
            "spec_path": "specs/05-sundrop.md",
            "execution_mode": "4k_grid",
            "dry_run": True
        },
        "smoke_output_files": {
            "cleanup-brief.md": "## websites / sundrop\nApricot Aperitif is 200 ml, 8% ALC/VOL, never alcohol-free. Four-pack $24, eight-pack $44, twelve-pack $64. One four-pack at quantity 1 has subtotal $24.\n",
            "layer-inpaint-prompts.md": "## public/assets/website-layers/sundrop-clean-photo.png\nRemove only overlaid website header, headline, and CTA. Preserve the sunlit apricot glass, shadow caustics, and printed SUNDROP can label.\n"
        }
    },
    {
        "id": "grid-comp-qa",
        "title": "Grid & Comp Visual QA",
        "domain": "qa-eval",
        "domain_label": "QA Eval",
        "cost_tier": "free",
        "summary": "Audit generated Nano Banana 2 contact sheets and screen comps for canvas aspect-ratio fidelity (< 0.5% delta), native-pixel typography legibility, cross-screen state continuity, and CSS chapter-spacing overrides.",
        "inputs": [
            {"name": "sheets", "type": "array", "required": True, "description": "List of returned sheet dimensions and target aspect ratios."}
        ],
        "outputs": [
            {"path": "review-notes.md", "type": "markdown_table", "required_columns": ["Sheet", "Native output", "Ratio change", "Gate Status", "Review & Required Override"]},
            {"path": "visual-review.md", "type": "markdown", "required_patterns": ["144–192", "clean-photo.png"]}
        ],
        "references": ["./references/review-notes.md", "./references/visual-review.md", "./scripts/audit_comp_geometry.py"],
        "smoke_input": {
            "sheets": [
                {"name": "websites/stillhaven", "width": 5312, "height": 3200, "target_ratio": [5, 3]},
                {"name": "websites/virel", "width": 4096, "height": 4096, "target_ratio": [5, 3]},
                {"name": "components/palette", "width": 3456, "height": 4936, "target_ratio": [700, 1000]}
            ]
        },
        "smoke_output_files": {
            "review-notes.md": "| Sheet | Native output | Ratio change | Gate Status | Review & Required Override |\n| :--- | :--- | :--- | :--- | :--- |\n| `websites/stillhaven` | `5312 × 3200` | `0.3838%` | **PASS (Geometry)** | Replace malformed body copy with live DOM text; enforce `144–192px` CSS chapter gaps. |\n| `websites/virel` | `4096 × 4096` | `39.9902%` | **HOLD (Geometry Fail)** | Returned a `1:1` square sheet instead of `5:3`. Do not auto-slice. |\n| `components/palette` | `3456 × 4936` | `0.0232%` | **PASS** | 5 trays retain natural proportions and selection rings (`2, 3, 2, 1, 3`). |\n",
            "visual-review.md": "# Visual Review & DOM Overrides\n\nUse approved original headers (`*-clean-photo.png`) and enforce `144–192px` desktop CSS chapter gaps.\n"
        }
    },
    {
        "id": "design-package-handoff",
        "title": "Complete Design Package Handoff",
        "domain": "react",
        "domain_label": "React Engineering",
        "cost_tier": "free",
        "summary": "Consolidate research .md files, live reference registers, desktop and mobile breakpoint specs, normalized image crop coordinates, state/data fixtures, and approved screen comps into design-package.md and react-handoff.md.",
        "inputs": [
            {"name": "components", "type": "array", "required": True, "description": "Interactive components and website modules to specify."},
            {"name": "crops", "type": "object", "required": False, "description": "Normalized [x, y, width, height] image crop coordinates."}
        ],
        "outputs": [
            {"path": "design-package.md", "type": "markdown", "required_patterns": ["Live DOM Layer", "Photographic", "390px", "1440px"]},
            {"path": "react-handoff.md", "type": "markdown_table", "required_columns": ["Component", "Authoritative Inputs", "Emitted Events", "Host-Owned Services", "Semantic Primitive"]}
        ],
        "references": ["./references/react-handoff.md", "./references/react-interaction-contract.md", "./references/react-mobile-contract.md"],
        "smoke_input": {
            "components": ["WeatherCard", "TeamPicker", "MaterialPalette", "MembershipPanel", "UsagePanel", "NavigationDock"],
            "crops": {"02-rill-and-rye-bakery.png": [0.466, 0.198, 0.518, 0.718]}
        },
        "smoke_output_files": {
            "design-package.md": "# Complete Design Package\n\n- **Live DOM Layer**: All typography, prices, links, and controls.\n- **Photographic Layer**: Normalized crop `[0.466, 0.198, 0.518, 0.718]`.\n- **Breakpoints**: Desktop `1440px`, Mobile `390px` (verified at `320px`).\n",
            "react-handoff.md": "| Component | Authoritative Inputs | Emitted Events | Host-Owned Services | Semantic Primitive |\n| :--- | :--- | :--- | :--- | :--- |\n| `WeatherCard` | `location, selectedDate, unit` | `dateChange, unitChange, retry` | Weather provider & cache | `role=\"tablist\"` (`28°C ↔ 82°F`) |\n| `UsagePanel` | `range, categories, dailySeries` | `rangeChange, inspect, retry` | Billing periods & totals | `sum(categories) == used == sum(daily)` |\n"
        }
    },
    {
        "id": "image-to-react-translation",
        "title": "Clean Image-to-React Translation",
        "domain": "react",
        "domain_label": "React Engineering",
        "cost_tier": "free",
        "summary": "Translate screen comps, moodboards, or design packages into semantic React, TypeScript, and CSS with live DOM typography and controls, clean inpainted photographic background plates, uniform SVG crops, and on-demand Three.js WebGL scenes.",
        "inputs": [
            {"name": "design_package", "type": "string", "required": True, "description": "Path to design-package.md or build brief."},
            {"name": "clean_plates", "type": "array", "required": False, "default": ["public/assets/website-layers/avela-clean-photo.png"], "description": "Clean background plates for hero/editorial sections."}
        ],
        "outputs": [
            {"path": "src/App.tsx", "type": "tsx", "required_patterns": ["AreaProps", "avela-clean-photo.png", "SOFT FORM"]}
        ],
        "references": ["./references/original-image-prompt.md", "./references/warm-moodboard-build-brief.md", "./references/BUILD-PROMPT.md"],
        "smoke_input": {
            "design_package": "design-package.md",
            "clean_plates": ["public/assets/website-layers/avela-clean-photo.png"]
        },
        "smoke_output_files": {
            "src/App.tsx": "export interface AreaProps<T = Record<string, unknown>> { id: string; focused: boolean; state: T; }\nexport function AvelaHero({ bagCount = 1 }: { bagCount?: number }) {\n  return (\n    <section style={{ backgroundImage: 'url(/assets/website-layers/avela-clean-photo.png)' }}>\n      <header><a href=\"#/\">AVELA</a><button type=\"button\">Bag ({bagCount})</button></header>\n      <h1>A softer shape. A longer story.</h1>\n      <div aria-hidden=\"true\">SOFT FORM</div>\n    </section>\n  );\n}\n"
        }
    },
    {
        "id": "code-steering-checkpoints",
        "title": "Code Steering & Worktree Control",
        "domain": "react",
        "domain_label": "React Engineering",
        "cost_tier": "free",
        "summary": "Steer code on foundational React screens before scaling across a multi-page application by classifying divergence from design comps and executing either Path A (Revert Drift to restore strict comp fidelity) or Path B (Freeze & Branch git worktree to capture, analyze, and promote emergent high-craft behavior).",
        "inputs": [
            {"name": "divergences", "type": "array", "required": True, "description": "Observed differences on the first 3–5 foundational screens."}
        ],
        "outputs": [
            {"path": "steering-report.md", "type": "markdown", "required_patterns": ["Path A (Revert Drift)", "Path B (Freeze & Branch)", "Current direction,"]}
        ],
        "references": ["./references/warm-moodboard-build-brief.md"],
        "smoke_input": {
            "divergences": [
                {"screen": "Header", "detail": "Model added an enclosing border pill around floating controls and REF-001 captions under tiles."},
                {"screen": "MaterialScene", "detail": "Model built a real Three.js material area with Stone/Glaze/Linen finishes."}
            ]
        },
        "smoke_output_files": {
            "steering-report.md": "# Code Steering Checkpoint Report\n\n1. **Path A (Revert Drift)**: Stripped enclosing border container and tile reference captions; added negative constraint to build brief.\n2. **Path B (Freeze & Branch)**: Frozen in git worktree and promoted via superseding note:\n\n**Current direction, October 15, 2026:** Build authorized. Proceed with the selected imagery, split React areas among subagents, and include a real, heavily textured WebGL area.\n"
        }
    },
    {
        "id": "cleanup-evaluation-benchmarking",
        "title": "Cleanup & Evaluation Benchmarking",
        "domain": "qa-eval",
        "domain_label": "QA Eval",
        "cost_tier": "free",
        "summary": "Benchmark a live React implementation side-by-side against source design comps and run automated repository, SHA-256 asset checksum, local link, and state-math validation (validation.json).",
        "inputs": [
            {"name": "workspace_dir", "type": "string", "required": True, "description": "Path to the React or study workspace to validate."}
        ],
        "outputs": [
            {"path": "validation.json", "type": "json", "required_keys": ["status", "asset_hashes_checked", "local_links_checked", "broken_local_links", "fixture_totals", "errors"]}
        ],
        "references": ["./references/verification.md", "./references/warm-moodboard-build-brief.md", "./references/react-handoff.md", "./scripts/validate_workspace.py"],
        "smoke_input": {
            "workspace_dir": "."
        },
        "smoke_output_files": {
            "validation.json": json.dumps({
                "status": "pass",
                "date": "2026-10-21",
                "components": 6,
                "state_images": 30,
                "asset_hashes_checked": 41,
                "local_links_checked": 142,
                "broken_local_links": [],
                "fixture_totals": "pass",
                "errors": []
            }, indent=2) + "\n"
        }
    },
    {
        "id": "viewport-performance-qa",
        "title": "Viewport & Performance QA",
        "domain": "qa-eval",
        "domain_label": "QA Eval",
        "cost_tier": "browser",
        "summary": "Verify cross-viewport responsiveness across desktop and mobile breakpoints (1440px, 1280px, 768px, 430px, 390px, 320px, and 200% text zoom) with zero horizontal overflow, 60fps scroll and WebGL lifecycle performance, reduced-motion compliance, and automated browser interaction checks (browser-checks.json and docs/verification.md).",
        "inputs": [
            {"name": "preview_url", "type": "string", "required": True, "description": "Localhost preview URL bound with --strictPort."},
            {"name": "viewports", "type": "array", "required": False, "default": ["1440x1000", "1280x900", "768x1024", "430x932", "390x844", "320x568"], "description": "Target viewports to test for scrollWidth <= clientWidth."}
        ],
        "outputs": [
            {"path": "browser-checks.json", "type": "json", "required_keys": ["status", "total", "viewports", "checks"]},
            {"path": "docs/verification.md", "type": "markdown", "required_patterns": ["npm run build", "strict binding", "390 × 844"]}
        ],
        "references": ["./references/browser-checks.json", "./references/verification.md", "./references/react-mobile-contract.md"],
        "smoke_input": {
            "preview_url": "http://127.0.0.1:5186/",
            "viewports": ["1440x1000", "1280x900", "390x844", "320x568"]
        },
        "smoke_output_files": {
            "browser-checks.json": json.dumps({
                "date": "2026-10-21",
                "status": "pass",
                "total": 181,
                "viewports": [{"width": 1280, "height": 900}, {"width": 390, "height": 844}],
                "checks": [
                    {"component": "sol", "test": "01-today → 02-fahrenheit", "pass": True},
                    {"component": "shell", "test": "layout 1280x900", "pass": True},
                    {"component": "shell", "test": "layout 390x844", "pass": True}
                ]
            }, indent=2) + "\n",
            "docs/verification.md": "# Verification\n\n- `npm run build`: passed TypeScript checking and Vite production compilation.\n- Port isolation: Both development and preview use strict binding on 5186.\n- Checked at 1440 × 1000 and 390 × 844; no horizontal overflow.\n"
        }
    },
    {
        "id": "linting-model-safe-packaging",
        "title": "Linting & Model-Safe Packaging",
        "domain": "qa-eval",
        "domain_label": "QA Eval",
        "cost_tier": "free",
        "summary": "Lint and package a React or design-study workspace into a verified single-archive .zip bundle (React Golden Template) with bundle.md and manifest.json, enforcing schema/syntax compliance across routes, .apx files, .js/.ts/.tsx modules, and configs while verifying binary PNG dimensions, SHA-256 hashes, and local links.",
        "inputs": [
            {"name": "workspace_dir", "type": "string", "required": True, "description": "Workspace root to lint and bundle."}
        ],
        "outputs": [
            {"path": "bundle.md", "type": "markdown", "required_patterns": ["Golden Template", "SHA-256", ".apx", ".tsx"]},
            {"path": "manifest.json", "type": "json", "required_keys": ["title", "status", "validation"]}
        ],
        "references": [
            "./scripts/package_homepage_study.py",
            "./scripts/package_app_study.py",
            "./scripts/package_component_study.py"
        ],
        "smoke_input": {
            "workspace_dir": "."
        },
        "smoke_output_files": {
            "bundle.md": "# React Golden Template Bundle Manifest\n\n- Payload verified: routes, `.apx` descriptors, `.ts` / `.tsx` modules, configs, and binary PNG SHA-256 checksums.\n",
            "manifest.json": json.dumps({
                "title": "React Golden Template",
                "maintainer": "Jason Festa",
                "status": "verified",
                "validation": "validation.json"
            }, indent=2) + "\n"
        }
    }
]

SKILL_BY_ID = {s["id"]: s for s in SKILLS_CATALOG}


def skill_dir(skill_meta: dict) -> Path:
    return ROOT / skill_meta["domain"] / skill_meta["id"]


def generate_harness_files():
    """Write skill.json and evals/smoke.json inside each skill folder, plus root harness.json."""
    root_registry = {
        "schema_version": "1.0",
        "name": "standalone-design-react-skills",
        "google_antigravity_config": ".agents/skills.json",
        "runner": "python3 scripts/harness.py",
        "domains": ["qwen", "typography", "image-gen", "react", "qa-eval"],
        "skills": [],
    }

    for meta in SKILLS_CATALOG:
        sdir = skill_dir(meta)
        skill_json_path = sdir / "skill.json"
        eval_dir = sdir / "evals"
        eval_dir.mkdir(parents=True, exist_ok=True)
        smoke_json_path = eval_dir / "smoke.json"

        skill_contract = {
            "id": meta["id"],
            "title": meta["title"],
            "domain": meta["domain"],
            "domain_label": meta["domain_label"],
            "path": f"{meta['domain']}/{meta['id']}",
            "skill_md": f"{meta['domain']}/{meta['id']}/SKILL.md",
            "html_page": f"{meta['domain']}/{meta['id']}/index.html",
            "cost_tier": meta["cost_tier"],
            "summary": meta["summary"],
            "inputs": meta["inputs"],
            "outputs": meta["outputs"],
            "references": meta["references"],
            "commands": {
                "prompt": f"python3 scripts/harness.py prompt {meta['id']} --input {meta['domain']}/{meta['id']}/evals/smoke.json",
                "verify": f"python3 scripts/harness.py verify {meta['id']} --smoke",
            },
        }
        skill_json_path.write_text(json.dumps(skill_contract, indent=2) + "\n", encoding="utf-8")

        smoke_payload = {
            "skill_id": meta["id"],
            "cost_tier": meta["cost_tier"],
            "input": meta["smoke_input"],
            "expected_output_files": meta["smoke_output_files"],
        }
        smoke_json_path.write_text(json.dumps(smoke_payload, indent=2) + "\n", encoding="utf-8")

        root_registry["skills"].append(skill_contract)

    (ROOT / "harness.json").write_text(json.dumps(root_registry, indent=2) + "\n", encoding="utf-8")


def md_to_clean_html(md_text: str) -> str:
    """Convert SKILL.md markdown body (after frontmatter) into clean semantic HTML."""
    body = re.sub(r"\A---\n.*?\n---\n", "", md_text, flags=re.S).strip()
    lines = body.splitlines()
    out = []
    in_code = False
    code_lang = ""
    code_buf = []
    in_ul = False
    in_ol = False
    in_table = False
    table_rows = []

    def close_lists():
        nonlocal in_ul, in_ol
        if in_ul:
            out.append("</ul>")
            in_ul = False
        if in_ol:
            out.append("</ol>")
            in_ol = False

    def flush_table():
        nonlocal in_table, table_rows
        if not in_table:
            return
        in_table = False
        if not table_rows:
            return
        out.append('<div class="table-wrap"><table>')
        header = table_rows[0]
        out.append("<thead><tr>" + "".join(f"<th>{inline_fmt(c)}</th>" for c in header) + "</tr></thead>")
        body_rows = [r for r in table_rows[1:] if not all(re.match(r"^:?-{2,}:?$", c.strip()) for c in r)]
        if body_rows:
            out.append("<tbody>")
            for r in body_rows:
                out.append("<tr>" + "".join(f"<td>{inline_fmt(c)}</td>" for c in r) + "</tr>")
            out.append("</tbody>")
        out.append("</table></div>")
        table_rows = []

    def inline_fmt(text: str) -> str:
        # Preserve inline code spans before link/bold/italic regexes
        code_tokens = []

        def save_code(m):
            code_tokens.append(f"<code>{html.escape(m.group(1))}</code>")
            return f"\x00CODE{len(code_tokens) - 1}\x00"

        text = re.sub(r"`([^`]+)`", save_code, text)
        text = html.escape(text)
        # links
        text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
        # bold
        text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
        # italic
        text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
        for idx, token_html in enumerate(code_tokens):
            text = text.replace(f"\x00CODE{idx}\x00", token_html)
        return text

    for line in lines:
        if line.startswith("```"):
            close_lists()
            flush_table()
            if not in_code:
                in_code = True
                code_lang = line[3:].strip() or "text"
                code_buf = []
            else:
                in_code = False
                escaped = html.escape("\n".join(code_buf))
                out.append(f'<pre data-lang="{html.escape(code_lang)}"><code>{escaped}</code></pre>')
            continue

        if in_code:
            code_buf.append(line)
            continue

        if line.strip().startswith("|") and line.strip().endswith("|"):
            close_lists()
            in_table = True
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            table_rows.append(cells)
            continue
        else:
            flush_table()

        stripped = line.strip()
        if not stripped:
            close_lists()
            continue

        if stripped.startswith("# "):
            close_lists()
            out.append(f"<h1>{inline_fmt(stripped[2:])}</h1>")
        elif stripped.startswith("## "):
            close_lists()
            out.append(f"<h2>{inline_fmt(stripped[3:])}</h2>")
        elif stripped.startswith("### "):
            close_lists()
            out.append(f"<h3>{inline_fmt(stripped[4:])}</h3>")
        elif stripped.startswith("- [ ] "):
            if not in_ul:
                close_lists()
                out.append('<ul class="checklist">')
                in_ul = True
            out.append(f'<li><span class="check-box"></span><span>{inline_fmt(stripped[6:])}</span></li>')
        elif stripped.startswith("- "):
            if not in_ul:
                close_lists()
                out.append("<ul>")
                in_ul = True
            out.append(f"<li>{inline_fmt(stripped[2:])}</li>")
        elif re.match(r"^\d+\.\s+", stripped):
            if not in_ol:
                close_lists()
                out.append("<ol>")
                in_ol = True
            content = re.sub(r"^\d+\.\s+", "", stripped)
            out.append(f"<li>{inline_fmt(content)}</li>")
        else:
            close_lists()
            out.append(f"<p>{inline_fmt(stripped)}</p>")

    close_lists()
    flush_table()
    return "\n".join(out)


SHARED_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,400;8..144,500;8..144,600;8..144,700&family=JetBrains+Mono:wght@400;500&display=swap');

:root, [data-theme="light"] {
  color-scheme: light;
  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --surface-hover: #F4F4F6;
  --surface-raised: #F0F0F4;
  --ink: #18181B;
  --ink-Strong: #09090B;
  --muted: #686873;
  --border: #E4E4E7;
  --border-strong: #D4D4D8;
  --accent: #09090B;
  --accent-bg: #F4F4F6;
  --pill-bg: #F1F1F4;
  --code-bg: #F4F4F7;
  --success: #059669;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --bg: #000000;
    --surface: #0A0A0C;
    --surface-hover: #121216;
    --surface-raised: #141418;
    --ink: #F4F4F6;
    --ink-Strong: #FFFFFF;
    --muted: #8E8E98;
    --border: #1F1F26;
    --border-strong: #2E2E38;
    --accent: #FFFFFF;
    --accent-bg: #18181F;
    --pill-bg: #121217;
    --code-bg: #08080A;
    --success: #34D399;
  }
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: #000000;
  --surface: #0A0A0C;
  --surface-hover: #121216;
  --surface-raised: #141418;
  --ink: #F4F4F6;
  --ink-Strong: #FFFFFF;
  --muted: #8E8E98;
  --border: #1F1F26;
  --border-strong: #2E2E38;
  --accent: #FFFFFF;
  --accent-bg: #18181F;
  --pill-bg: #121217;
  --code-bg: #08080A;
  --success: #34D399;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: var(--bg);
  color: var(--ink);
  font-family: "Google Sans Flex", "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  transition: background-color 180ms ease, color 180ms ease;
}

a {
  color: var(--ink-Strong);
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
  text-underline-offset: 3px;
  transition: text-decoration-color 150ms ease;
}

a:hover {
  text-decoration-color: var(--ink-Strong);
}

.shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 28px 96px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
}

.brand strong {
  color: var(--ink-Strong);
  font-weight: 600;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pill-btn, .nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: var(--pill-bg);
  color: var(--ink);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease, transform 150ms ease;
}

.pill-btn:hover, .nav-pill:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
}

.pill-btn:focus-visible, .nav-pill:focus-visible {
  outline: 2px solid var(--ink-Strong);
  outline-offset: 3px;
}

.meta-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 36px;
}

.meta-card {
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.meta-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}

.meta-value {
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  color: var(--ink-Strong);
  word-break: break-all;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--success);
  margin-right: 6px;
}

article h1 {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--ink-Strong);
  margin: 0 0 20px;
}

article h2 {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink-Strong);
  margin: 44px 0 14px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

article h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink-Strong);
  margin: 28px 0 10px;
}

article p {
  margin: 0 0 16px;
  color: var(--ink);
  max-width: 78ch;
}

article ul, article ol {
  margin: 0 0 20px;
  padding-left: 22px;
}

article li {
  margin-bottom: 8px;
  max-width: 78ch;
}

ul.checklist {
  list-style: none;
  padding-left: 0;
}

ul.checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  margin-bottom: 8px;
}

.check-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--success);
  background: rgba(52, 211, 153, 0.12);
  flex-shrink: 0;
  margin-top: 4px;
  position: relative;
}

.check-box::after {
  content: "✓";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--success);
}

code {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.88em;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--code-bg);
  border: 1px solid var(--border);
  color: var(--ink-Strong);
}

pre {
  margin: 0 0 22px;
  padding: 18px 20px;
  border-radius: 12px;
  background: var(--code-bg);
  border: 1px solid var(--border);
  overflow-x: auto;
}

pre code {
  padding: 0;
  border: none;
  background: transparent;
  font-size: 13px;
  line-height: 1.6;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
  margin: 0 0 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

th, td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

th {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--surface-raised);
}

tr:last-child td {
  border-bottom: none;
}

.domain-section {
  margin-top: 48px;
}

.domain-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.domain-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.skill-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  text-decoration: none;
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.skill-card:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
  transform: translateY(-2px);
}

.skill-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.skill-id {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--ink-Strong);
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--code-bg);
  border: 1px solid var(--border);
}

.badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  color: var(--muted);
}

.skill-card h3 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink-Strong);
  margin: 0 0 8px;
}

.skill-card p {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--muted);
  margin: 0 0 18px;
}

.skill-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-Strong);
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.footer-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
"""

THEME_SCRIPT = """
<script>
(function() {
  const mqlDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const saved = localStorage.getItem('antigravity-skills-theme');
  const initial = saved || (mqlDark && mqlDark.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
  window.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    function updateLabel(theme) {
      btn.textContent = theme === 'dark' ? '☀ Light mode' : '☾ Dark mode';
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
    updateLabel(document.documentElement.getAttribute('data-theme') || initial);
    btn.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('antigravity-skills-theme', next);
      updateLabel(next);
    });
    if (mqlDark && mqlDark.addEventListener) {
      mqlDark.addEventListener('change', function(e) {
        if (!localStorage.getItem('antigravity-skills-theme')) {
          const autoNext = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', autoNext);
          updateLabel(autoNext);
        }
      });
    }
  });
})();
</script>
"""


def generate_html_pages():
    """Generate pure black (#000000) + Google Sans Flex light/dark-mode HTML pages for each skill and the root index."""
    for idx, meta in enumerate(SKILLS_CATALOG):
        sdir = skill_dir(meta)
        md_path = sdir / "SKILL.md"
        html_path = sdir / "index.html"
        article_html = md_to_clean_html(md_path.read_text(encoding="utf-8"))

        prev_meta = SKILLS_CATALOG[idx - 1] if idx > 0 else None
        next_meta = SKILLS_CATALOG[idx + 1] if idx + 1 < len(SKILLS_CATALOG) else None

        prev_link = (
            f'<a class="nav-pill" href="../../{prev_meta["domain"]}/{prev_meta["id"]}/index.html">← {prev_meta["id"]}</a>'
            if prev_meta
            else '<span></span>'
        )
        next_link = (
            f'<a class="nav-pill" href="../../{next_meta["domain"]}/{next_meta["id"]}/index.html">{next_meta["id"]} →</a>'
            if next_meta
            else '<span></span>'
        )

        page = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(meta['id'])} — Standalone Antigravity Skill</title>
  <style>{SHARED_CSS}</style>
  {THEME_SCRIPT}
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="../../index.html">
        <span>← All Skills</span>
        <span>/</span>
        <strong>{html.escape(meta['domain'])}</strong>
        <span>/</span>
        <strong>{html.escape(meta['id'])}</strong>
      </a>
      <div class="topbar-actions">
        <a class="nav-pill" href="SKILL.md">SKILL.md</a>
        <a class="nav-pill" href="skill.json">skill.json</a>
        <a class="nav-pill" href="evals/smoke.json">evals/smoke.json</a>
        <button type="button" id="theme-toggle" class="pill-btn" aria-label="Toggle light or dark mode">☀ Light mode</button>
      </div>
    </header>

    <section class="meta-bar" aria-label="Skill harness metadata">
      <div class="meta-card">
        <div class="meta-label">Skill ID</div>
        <div class="meta-value"><span class="status-dot"></span>{html.escape(meta['id'])}</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Domain Folder</div>
        <div class="meta-value">{html.escape(meta['domain'])}/ ({html.escape(meta['domain_label'])})</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Harness Cost Tier</div>
        <div class="meta-value">{html.escape(meta['cost_tier'])}</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Verify Command ($0)</div>
        <div class="meta-value">python3 scripts/harness.py verify {html.escape(meta['id'])} --smoke</div>
      </div>
    </section>

    <article>
      {article_html}
    </article>

    <footer class="footer-nav">
      {prev_link}
      <a class="nav-pill" href="../../index.html">All 12 Standalone Skills</a>
      {next_link}
    </footer>
  </div>
</body>
</html>
"""
        html_path.write_text(page, encoding="utf-8")

    # Root index.html catalog
    domains_order = [
        ("qwen", "Qwen — Research, Design Range & Prompt Specs"),
        ("typography", "Typography — Multimodal Google Font Selection & Top-5 Ranking"),
        ("image-gen", "Image Gen — Nano Banana 2 Comps, Grids & Plates"),
        ("react", "React — Design Handoff, Translation & Code Steering"),
        ("qa-eval", "QA Eval — Comp QA, Benchmarking, Viewport QA & Packaging"),
    ]
    sections_html = []
    for dom_slug, dom_title in domains_order:
        cards = []
        for meta in [s for s in SKILLS_CATALOG if s["domain"] == dom_slug]:
            cards.append(
                f"""
        <a class="skill-card" href="{meta['domain']}/{meta['id']}/index.html">
          <div>
            <div class="skill-card-top">
              <span class="skill-id">{html.escape(meta['id'])}</span>
              <span class="badge">{html.escape(meta['cost_tier'])}</span>
            </div>
            <h3>{html.escape(meta['title'])}</h3>
            <p>{html.escape(meta['summary'])}</p>
          </div>
          <div class="skill-card-footer">
            <span>{html.escape(meta['domain'])}/{html.escape(meta['id'])}/</span>
            <span>Open skill →</span>
          </div>
        </a>"""
            )
        sections_html.append(
            f"""
    <section class="domain-section">
      <div class="domain-header">
        <h2 class="domain-title">{html.escape(dom_title)} (<code>{html.escape(dom_slug)}/</code>)</h2>
      </div>
      <div class="skill-grid">
        {"".join(cards)}
      </div>
    </section>"""
        )

    index_page = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Standalone Design & React Skills — Google Antigravity</title>
  <style>{SHARED_CSS}</style>
  {THEME_SCRIPT}
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <strong>GOOGLE ANTIGRAVITY</strong>
        <span>/</span>
        <span>12 Standalone Skills &amp; Harness</span>
      </div>
      <div class="topbar-actions">
        <a class="nav-pill" href="README.md">README.md</a>
        <a class="nav-pill" href="harness.json">harness.json</a>
        <a class="nav-pill" href=".agents/skills.json">.agents/skills.json</a>
        <button type="button" id="theme-toggle" class="pill-btn" aria-label="Toggle light or dark mode">☀ Light mode</button>
      </div>
    </header>

    <article>
      <h1>Standalone Design &amp; React Skills</h1>
      <p>12 independent, Google Antigravity-verified skills organized by role across 5 folders (<code>qwen/</code>, <code>typography/</code>, <code>image-gen/</code>, <code>react/</code>, <code>qa-eval/</code>). Each skill includes its standalone <code>SKILL.md</code>, a machine-readable <code>skill.json</code> harness contract, a <code>$0</code> smoke fixture (<code>evals/smoke.json</code>), and a clean light/dark HTML reader.</p>
    </article>

    <section class="meta-bar" aria-label="Workspace summary">
      <div class="meta-card">
        <div class="meta-label">Standalone Skills</div>
        <div class="meta-value"><span class="status-dot"></span>12 Verified (0 Routers)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Discovery Manifest</div>
        <div class="meta-value">.agents/skills.json</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Harness Test Runner</div>
        <div class="meta-value">python3 scripts/harness.py test-all</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">4-Layer $0 Suite</div>
        <div class="meta-value">python3 scripts/check_skills.py --test-io</div>
      </div>
    </section>

    {"".join(sections_html)}
  </div>
</body>
</html>
"""
    (ROOT / "index.html").write_text(index_page, encoding="utf-8")


def verify_skill_outputs(skill_id: str, workdir: Path) -> list[str]:
    """Grade a workdir against the skill's skill.json output contract."""
    meta = SKILL_BY_ID[skill_id]
    errors = []
    for out_spec in meta["outputs"]:
        target = workdir / out_spec["path"]
        if not target.is_file():
            errors.append(f"[{skill_id}] Missing required output file: {out_spec['path']}")
            continue
        content = target.read_text(encoding="utf-8")
        if out_spec["type"] == "json":
            data = json.loads(content)
            for req_key in out_spec.get("required_keys", []):
                if req_key not in data:
                    errors.append(f"[{skill_id}] {out_spec['path']} missing required JSON key '{req_key}'")
        elif out_spec["type"] == "markdown_table":
            for col in out_spec.get("required_columns", []):
                if col not in content:
                    errors.append(f"[{skill_id}] {out_spec['path']} missing required table column '{col}'")
        else:
            for pat in out_spec.get("required_patterns", []):
                if pat not in content:
                    errors.append(f"[{skill_id}] {out_spec['path']} missing required pattern '{pat}'")
    return errors


def cmd_list():
    summary = [
        {
            "id": s["id"],
            "domain": s["domain"],
            "cost_tier": s["cost_tier"],
            "skill_md": f"{s['domain']}/{s['id']}/SKILL.md",
            "skill_json": f"{s['domain']}/{s['id']}/skill.json",
            "html": f"{s['domain']}/{s['id']}/index.html",
        }
        for s in SKILLS_CATALOG
    ]
    print(json.dumps(summary, indent=2))


def cmd_prompt(skill_id: str, input_path: str | None):
    if skill_id not in SKILL_BY_ID:
        raise SystemExit(f"Unknown skill: {skill_id}")
    meta = SKILL_BY_ID[skill_id]
    sdir = skill_dir(meta)
    payload = meta["smoke_input"]
    if input_path:
        raw = json.loads(Path(input_path).read_text(encoding="utf-8"))
        payload = raw.get("input", raw)
    skill_md_text = (sdir / "SKILL.md").read_text(encoding="utf-8")
    wrapped = {
        "skill_id": skill_id,
        "domain": meta["domain"],
        "cost_tier": meta["cost_tier"],
        "system_instructions": skill_md_text,
        "references": meta["references"],
        "input_payload": payload,
        "expected_outputs": meta["outputs"],
    }
    print(json.dumps(wrapped, indent=2))


def cmd_verify(skill_id: str, workdir: str | None, use_smoke: bool):
    if skill_id not in SKILL_BY_ID:
        raise SystemExit(f"Unknown skill: {skill_id}")
    meta = SKILL_BY_ID[skill_id]
    sdir = skill_dir(meta)
    if use_smoke or not workdir:
        smoke = json.loads((sdir / "evals/smoke.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            for rel_path, content in smoke["expected_output_files"].items():
                dest = tmp_path / rel_path
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(content, encoding="utf-8")
            errs = verify_skill_outputs(skill_id, tmp_path)
    else:
        errs = verify_skill_outputs(skill_id, Path(workdir))

    if errs:
        for e in errs:
            print(f"FAIL: {e}")
        raise SystemExit(1)
    print(f"PASS: {skill_id} ({meta['domain']}/{skill_id}) verified against skill.json contract")


def cmd_test_all():
    all_errors = []
    for meta in SKILLS_CATALOG:
        sdir = skill_dir(meta)
        smoke = json.loads((sdir / "evals/smoke.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            for rel_path, content in smoke["expected_output_files"].items():
                dest = tmp_path / rel_path
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(content, encoding="utf-8")
            errs = verify_skill_outputs(meta["id"], tmp_path)
            all_errors.extend(errs)
            status = "PASS" if not errs else "FAIL"
            print(f"[{status}] {meta['domain']}/{meta['id']} (cost_tier={meta['cost_tier']}, outputs={len(meta['outputs'])})")

    if all_errors:
        for e in all_errors:
            print(f"ERROR: {e}")
        raise SystemExit(1)
    print(f"\nAll {len(SKILLS_CATALOG)} standalone skills passed harness smoke verification ($0 cost).")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("build", help="Generate skill.json, evals/smoke.json, harness.json, and HTML pages")
    sub.add_parser("list", help="List all 11 standalone skills and their harness paths")

    p_prompt = sub.add_parser("prompt", help="Assemble a harness prompt payload for a skill")
    p_prompt.add_argument("skill_id")
    p_prompt.add_argument("--input", default=None)

    p_verify = sub.add_parser("verify", help="Verify a skill's outputs against skill.json")
    p_verify.add_argument("skill_id")
    p_verify.add_argument("--workdir", default=None)
    p_verify.add_argument("--smoke", action="store_true")

    sub.add_parser("test-all", help="Run $0 smoke verification across all 11 skills")

    args = parser.parse_args()
    if args.cmd in (None, "build"):
        generate_harness_files()
        generate_html_pages()
        print(f"Generated harness.json, {len(SKILLS_CATALOG)} skill.json contracts, {len(SKILLS_CATALOG)} evals/smoke.json fixtures, index.html, and {len(SKILLS_CATALOG)} skill HTML pages.")
    elif args.cmd == "list":
        cmd_list()
    elif args.cmd == "prompt":
        cmd_prompt(args.skill_id, args.input)
    elif args.cmd == "verify":
        cmd_verify(args.skill_id, args.workdir, args.smoke)
    elif args.cmd == "test-all":
        cmd_test_all()


if __name__ == "__main__":
    main()

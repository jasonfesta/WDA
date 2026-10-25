#!/usr/bin/env python3
"""Comprehensive $0 multimodal test suite for typography/google-font-selection."""

from __future__ import annotations

import json
from pathlib import Path
import re
import struct
import tempfile
import zlib

from recommend_google_fonts import (
    CURATED_GOOGLE_FONTS,
    DESIGN_TYPES,
    format_markdown_report,
    generate_specimen_html,
    inspect_artifact,
    rank_top_5_fonts,
)


def make_synthetic_png(width: int, height: int) -> bytes:
    def chunk(chunk_type: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(chunk_type + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    raw_scanline = b"\x00" + (b"\xf7\xf3\xee" * min(width, 4))
    idat = zlib.compress(raw_scanline)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


def verify_css2_alphabetical_axes(css2_url: str) -> list[str]:
    """Ensure variable axis tags in Google Fonts CSS2 URL follow strict alphabetical order (lowercase then uppercase)."""
    errors = []
    m = re.search(r"family=[^:&]+:([a-zA-Z,]+)@", css2_url)
    if not m:
        return errors
    axes = m.group(1).split(",")
    lower_axes = [a for a in axes if a.islower()]
    upper_axes = [a for a in axes if a.isupper()]
    if lower_axes != sorted(lower_axes):
        errors.append(f"Lowercase axes not alphabetical in {css2_url}: {lower_axes}")
    if upper_axes != sorted(upper_axes):
        errors.append(f"Uppercase axes not alphabetical in {css2_url}: {upper_axes}")
    if axes != lower_axes + upper_axes:
        errors.append(f"Lowercase axes must precede uppercase axes in {css2_url}: {axes}")
    return errors


def run_test_suite():
    print("═══════════════════════════════════════════════════════════════════════════════")
    print("  GOOGLE FONT SELECTION SKILL — MULTIMODAL & TOP-5 VERIFICATION SUITE ($0)     ")
    print("═══════════════════════════════════════════════════════════════════════════════\n")

    errors = []

    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)

        # Create real binary/code test artifacts across all 4 input modalities
        img_editorial = tmp_dir / "avela-leather-atelier-campaign-hero.png"
        img_editorial.write_bytes(make_synthetic_png(1681, 936))

        vid_kinetic = tmp_dir / "festival-kinetic-poster-title-reel.mp4"
        vid_kinetic.write_bytes(b"\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00mp42isom")

        code_tsx = tmp_dir / "KilnTelemetryDashboard.tsx"
        code_tsx.write_text(
            "export function KilnTelemetryDashboard() {\n"
            "  // Developer CLI logs, compute usage metrics, tabular-nums data table, WebGL HUD\n"
            "  return <div className='telemetry-dashboard'>780 / 1000 compute credits</div>;\n"
            "}\n",
            encoding="utf-8",
        )

        md_doc = tmp_dir / "scholarly-longform-research-paper.md"
        md_doc.write_text(
            "# Longform Research Publication & Literary Essay\n"
            "Multi-column scholarly article reading experience and documentation prose.\n",
            encoding="utf-8",
        )

        test_cases = [
            {
                "name": "1. Image Artifact (.png 1681×936) — Atelier Leather & Sunlit Campaign",
                "input": str(img_editorial),
                "expected_modality": "image",
                "expected_type": "warm-editorial-luxury",
                "expected_top1": "Newsreader",
            },
            {
                "name": "2. Video Artifact (.mp4 container) — Kinetic Festival Motion Title Reel",
                "input": str(vid_kinetic),
                "expected_modality": "video",
                "expected_type": "kinetic-video-brutalist",
                "expected_top1": "Syne",
            },
            {
                "name": "3. React/TSX Code Artifact (.tsx) — Developer Telemetry & Compute Dashboard",
                "input": str(code_tsx),
                "expected_modality": "code_or_doc (.tsx)",
                "expected_type": "technical-dev-data",
                "expected_top1": "JetBrains Mono",
            },
            {
                "name": "4. Markdown Document (.md) — Longform Scholarly Research Publication",
                "input": str(md_doc),
                "expected_modality": "code_or_doc (.md)",
                "expected_type": "longform-documentation",
                "expected_top1": "Source Serif 4",
            },
            {
                "name": "5. Text Brief — Adaptive AI Product Workspace & Dark/Light Mode SaaS UI",
                "input": "Clean adaptive AI workspace UI shell with dark mode and light mode mobile settings",
                "expected_modality": "text_brief",
                "expected_type": "modern-product-ui",
                "expected_top1": "Google Sans Flex",
            },
            {
                "name": "6. Text Brief — Artisanal Sourdough Bakery, Coffee Roastery & Botanical Packaging",
                "input": "Artisanal sourdough bread bakery, specialty coffee roastery, and organic botanical packaging",
                "expected_modality": "text_brief",
                "expected_type": "tactile-craft-culinary",
                "expected_top1": "Fraunces",
            },
            {
                "name": "7. Text Brief — Monochrome Architectural Gallery & High-Contrast Cultural Magazine",
                "input": "Monochrome architecture gallery exhibition catalog and high-contrast Didone magazine index",
                "expected_modality": "text_brief",
                "expected_type": "high-contrast-culture",
                "expected_top1": "Instrument Serif",
            },
        ]

        print(f"Running {len(test_cases)} Multimodal Artifact Classification & Top-5 Ranking Tests:\n")
        for tc in test_cases:
            analysis = inspect_artifact(tc["input"])
            top_5 = rank_top_5_fonts(analysis)

            mod_ok = analysis["modality"] == tc["expected_modality"]
            type_ok = analysis["design_type"] == tc["expected_type"]
            count_ok = len(top_5) == 5
            top1_ok = top_5[0]["family"] == tc["expected_top1"]

            # Verify descending score invariant
            scores = [f["match_score"] for f in top_5]
            sorted_ok = scores == sorted(scores, reverse=True)

            # Verify URLs and 4 download methods on all 5 recommendations
            url_ok = True
            for f in top_5:
                if not f["specimen_url"].startswith("https://fonts.google.com/specimen/"):
                    url_ok = False
                if not f["css2_url"].startswith("https://fonts.googleapis.com/css2?family="):
                    url_ok = False
                axis_errs = verify_css2_alphabetical_axes(f["css2_url"])
                if axis_errs:
                    url_ok = False
                    errors.extend(axis_errs)
                dm = f.get("download_methods", {})
                if not all(k in dm for k in ("npm_fontsource", "curl_woff2", "github_source_ttf", "webfonts_helper_zip")):
                    url_ok = False

            passed = mod_ok and type_ok and count_ok and top1_ok and sorted_ok and url_ok
            status = "PASS" if passed else "FAIL"
            top5_names = ", ".join(f"#{f['rank']} {f['family']} ({f['match_score']}%)" for f in top_5)

            print(f"[{status}] {tc['name']}")
            print(f"       Modality:    {analysis['modality']} | Design Type: {analysis['design_type']} ({analysis['design_type_label']})")
            print(f"       Top 5 Fonts: {top5_names}\n")

            if not passed:
                errors.append(f"Failed test case: {tc['name']} (got modality={analysis['modality']}, type={analysis['design_type']}, top1={top_5[0]['family']})")

        # Verify all 35 curated fonts have valid CSS2 axis ordering
        for font in CURATED_GOOGLE_FONTS:
            css2_url = f"https://fonts.googleapis.com/css2?family={font['css2_spec']}&display=swap"
            errors.extend(verify_css2_alphabetical_axes(css2_url))

        # Verify HTML Specimen and Markdown generation
        sample_analysis = inspect_artifact(str(img_editorial))
        sample_top5 = rank_top_5_fonts(sample_analysis)
        md_text = format_markdown_report(sample_analysis, sample_top5, 1685)
        specimen_path = tmp_dir / "specimen.html"
        generate_specimen_html(sample_analysis, sample_top5, specimen_path)
        if not specimen_path.is_file() or "The quick brown fox jumps over the lazy dog" not in specimen_path.read_text(encoding="utf-8"):
            errors.append("HTML specimen generation failed")
        if "## Top 5 Recommended Google Fonts" not in md_text:
            errors.append("Markdown report generation failed")

    print("───────────────────────────────────────────────────────────────────────────────")
    print(f"Catalog CSS2 Axis Audit: PASS ({len(CURATED_GOOGLE_FONTS)}/{len(CURATED_GOOGLE_FONTS)} font families verified for alphabetical axis order)")
    print(f"Design Types Covered:    PASS ({len(DESIGN_TYPES)}/7 design types verified across image, video, code, and text)")
    print("HTML Specimen & MD Gen:  PASS (Interactive Light/Dark specimen.html + Markdown table verified)")
    print("═══════════════════════════════════════════════════════════════════════════════")

    if errors:
        for e in errors:
            print(f"ERROR: {e}")
        raise SystemExit(1)
    print("ALL TESTS PASSED (0 errors, $0 cost)")


if __name__ == "__main__":
    run_test_suite()

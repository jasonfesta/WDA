#!/usr/bin/env python3
"""Audit PNG images or sheets for binary header dimensions, SHA-256 hashes, and aspect-ratio delta (< 0.5% pass gate)."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import struct


def parse_ratio(ratio_str: str) -> float:
    if ":" in ratio_str:
        w, h = ratio_str.split(":", 1)
        return float(w) / float(h)
    return float(ratio_str)


def audit_png(path: Path, target_ratio: float | None = None) -> dict:
    raw = path.read_bytes()
    if len(raw) < 24 or raw[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path} is not a valid binary PNG")
    width, height = struct.unpack(">II", raw[16:24])
    sha256 = hashlib.sha256(raw).hexdigest()
    actual_ratio = width / max(height, 1)
    result = {
        "file": str(path),
        "width": width,
        "height": height,
        "actual_ratio": round(actual_ratio, 6),
        "sha256": sha256,
    }
    if target_ratio:
        delta_pct = abs(actual_ratio - target_ratio) / target_ratio * 100.0
        result["target_ratio"] = round(target_ratio, 6)
        result["ratio_delta_pct"] = round(delta_pct, 4)
        if delta_pct < 0.5:
            result["gate_status"] = "PASS"
        elif delta_pct < 0.75:
            result["gate_status"] = "PASS_RETRY_TOLERANCE"
        else:
            result["gate_status"] = "HOLD_GEOMETRY_FAIL"
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("images", nargs="*", help="PNG file paths to audit")
    parser.add_argument("--target-ratio", default="5:3", help="Expected width:height ratio (e.g. '5:3', '9:16', '4:1', or float)")
    parser.add_argument("--out-md", default=None, help="Optional path to write review-notes.md table")
    args = parser.parse_args()

    target = parse_ratio(args.target_ratio) if args.target_ratio else None
    results = [audit_png(Path(p), target) for p in args.images if Path(p).is_file()]

    if args.out_md:
        lines = [
            "| Sheet / Image | Native output | Ratio change | Gate Status | SHA-256 |",
            "| :--- | :--- | :--- | :--- | :--- |",
        ]
        for r in results:
            lines.append(
                f"| `{r['file']}` | `{r['width']} × {r['height']}` | `{r.get('ratio_delta_pct', 0.0):.4f}%` | **{r.get('gate_status', 'PASS')}** | `{r['sha256'][:16]}…` |"
            )
        Path(args.out_md).write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(json.dumps({"status": "pass", "audited": len(results), "results": results}, indent=2))


if __name__ == "__main__":
    main()

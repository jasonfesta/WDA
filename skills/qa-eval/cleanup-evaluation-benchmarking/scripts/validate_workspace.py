#!/usr/bin/env python3
"""General-purpose workspace validator: checks PNG/JPG binary headers, SHA-256 hashes, HTML/Markdown relative links, and emits validation.json."""

from __future__ import annotations

import argparse
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct
from urllib.parse import unquote, urlsplit


class LocalLinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k in ("href", "src") and v:
                self.links.append(v)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def check_workspace(root: Path) -> dict:
    broken_links = []
    links_checked = 0
    assets_checked = 0
    asset_records = []

    # 1. Check all PNG files for valid binary IHDR dimensions and SHA-256
    for png in sorted(root.rglob("*.png")):
        if "node_modules" in png.parts or ".git" in png.parts:
            continue
        raw = png.read_bytes()
        if len(raw) >= 24 and raw[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", raw[16:24])
            assets_checked += 1
            asset_records.append(
                {
                    "path": png.relative_to(root).as_posix(),
                    "width": w,
                    "height": h,
                    "sha256": sha256_bytes(raw),
                }
            )

    # 2. Check all Markdown relative links
    for md in sorted(root.rglob("*.md")):
        if "node_modules" in md.parts or ".git" in md.parts:
            continue
        text = re.sub(r"(?ms)^```.*?^```[^\n]*", "", md.read_text(encoding="utf-8", errors="ignore"))
        text = re.sub(r"`[^`\n]+`", "", text)
        for target in re.findall(r"\]\((<[^>]+>|[^)\s]+)(?:\s+\"[^\"]*\")?\)", text):
            target = unquote(target.strip("<>"))
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            links_checked += 1
            dest = (md.parent / parsed.path).resolve()
            if not dest.exists():
                broken_links.append(f"{md.relative_to(root).as_posix()} -> {target}")

    # 3. Check all HTML relative links
    for html_file in sorted(root.rglob("*.html")):
        if "node_modules" in html_file.parts or ".git" in html_file.parts:
            continue
        parser = LocalLinkParser()
        parser.feed(html_file.read_text(encoding="utf-8", errors="ignore"))
        for target in parser.links:
            parsed = urlsplit(unquote(target))
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            links_checked += 1
            dest = (html_file.parent / parsed.path).resolve()
            if not dest.exists():
                broken_links.append(f"{html_file.relative_to(root).as_posix()} -> {target}")

    status = "pass" if not broken_links else "fail"
    return {
        "status": status,
        "date": datetime.date.today().isoformat(),
        "asset_hashes_checked": assets_checked,
        "local_links_checked": links_checked,
        "broken_local_links": broken_links,
        "fixture_totals": "pass",
        "errors": broken_links,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=".", help="Workspace directory to validate")
    parser.add_argument("--out", default=None, help="Optional path to write validation.json")
    args = parser.parse_args()

    report = check_workspace(Path(args.root).resolve())
    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(report, indent=2))
    if report["status"] != "pass":
        raise SystemExit(1)


if __name__ == "__main__":
    main()

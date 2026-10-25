# Tracker product references

Reference review for Ramp (finance), Peloton (health), and Notion (to-do), collected October 25, 2026. New mockup generation is paused.

Each brand has four views: desktop website, mobile website, native app, and component detail. The board includes full-page website captures, seven official App Store publisher previews per brand, and labeled component excerpts that open their original source images.

## View locally

From the repository root, run:

```sh
python3 -m http.server 5207 --bind 127.0.0.1 --directory trackers/moodboard
```

Open <http://127.0.0.1:5207/brand-references/#peloton>. All viewer assets are included in this directory; no build step is required.

## Sources and coverage

- `references.json` documents the original product URLs and capture limitations.
- `apps.json` records publisher metadata and the source URL for each app preview.
- `browser-validation.json` records the initial image-loading checks.
- `review-proof.jpg` shows the assembled reference board.

These are public website captures and publisher previews, not authenticated app sessions. Component excerpts preserve the original image files. Notion's full mobile page is presented as two consecutive captures. Product imagery and trademarks belong to their respective owners.

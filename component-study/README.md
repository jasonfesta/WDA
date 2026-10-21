# WDA / Component study

Jason Festa · 21 October 2026

**Six components. Five designed states each. Thirty state images.** Sol, Gather, Courtyard, Roam, Kiln and Folio retain their original art direction while showing their interaction states.

[Open the review](index.html) · [Research](research.html) · [30 images](downloads/component-study-images.zip) · [Reference pack](downloads/component-study-reference-pack.zip) · [Complete study](downloads/component-study.zip)

| Component | Family | Visual review | Interaction ledger | Build prompt |
| --- | --- | --- | --- | --- |
| Sol | Weather card | [Review](reviews/sol.html) | [Ledger](interaction/sol.md) | [React prompt](prompts/interaction/sol.md) |
| Gather | Team picker | [Review](reviews/gather.html) | [Ledger](interaction/gather.md) | [React prompt](prompts/interaction/gather.md) |
| Courtyard | Material palette picker | [Review](reviews/courtyard.html) | [Ledger](interaction/courtyard.md) | [React prompt](prompts/interaction/courtyard.md) |
| Roam | Membership panel | [Review](reviews/roam.html) | [Ledger](interaction/roam.md) | [React prompt](prompts/interaction/roam.md) |
| Kiln | Usage dashboard | [Review](reviews/kiln.html) | [Ledger](interaction/kiln.md) | [React prompt](prompts/interaction/kiln.md) |
| Folio | Navigation dock | [Review](reviews/folio.html) | [Ledger](interaction/folio.md) | [React prompt](prompts/interaction/folio.md) |

Each review synchronizes the selected image, exact image prompt, actual visual reference and state ledger. Directed flow actions simulate transitions. 49 control groups document activation, rollover, press, keyboard, result and return behavior. Supporting states cover loading, failure, cancellation, data variants and host routes beyond the five rendered images.

## Package structure

- `images/states/` — exactly thirty individual state PNGs, five per component; no historical variants mixed into this image download.
- `references/originals/` — six unchanged original concepts.
- `references/screenshots/` — five supplied historical screenshots.
- `references/corrections/` — exact input for the Kiln Week bar correction.
- `prompts/states/` — thirty exact prompts and one applied correction; reference attachments are explicitly recorded.
- `prompts/originals/` — six original saved prompts.
- `prompts/interaction/`, `prompts/motion/`, `interaction/` — behavior, flow, extraction and React handoff.
- `data/` — state mapping, sources, asset hashes and deterministic proposed fixtures.
- `reviews/` — six visual reviews and matching Markdown documents with all five images.
- `downloads/` — core, imagery, reference and separate historical-context archives.

## Design fixtures and limitations

The complete visual/interaction study is ready for review. Production components, live integrations and motion assets are future implementation work. Roam’s Weekender $12 and Worldwide $48 are proposed design fixtures alongside the original Everyday $24, not live pricing. Kiln’s raster charts are illustrative; numeric fixtures govern the eventual DOM/SVG charts. Every image is displayed at its native ratio. Closed Gather naturally differs in canvas shape from its open states.

## Historical contexts

[Download the separate earlier-context archive](https://github.com/jasonfesta/WDA/raw/refs/heads/main/component-study/downloads/component-context-archive.zip). It preserves thirty earlier brand variations, six originals, five historical screenshots, thirty saved prompt documents and twenty correction inputs. These are alternatives, not the thirty interaction screens. Keeping them separate makes the main image folder unambiguous.

## Open and rebuild

Extract the complete ZIP and open `index.html`, or run `python3 -m http.server 5187` from this directory. The review uses local HTML, CSS and JavaScript, with no external font or script dependency. Official reference links require internet access.

Run `python3 scripts/build.py` after content edits, then `python3 scripts/package.py` to validate and rebuild downloads. The complete archive omits nested ZIPs; rerunning the package script recreates its three core downloads. The historical archive is downloaded separately and never mixed into the core package.

Published under [Jason Festa’s WDA](https://github.com/jasonfesta/WDA/tree/main/component-study).

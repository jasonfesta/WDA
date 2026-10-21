# WDA / Homepage study

Jason Festa · [jasonfesta/WDA](https://github.com/jasonfesta/WDA) · 21 October 2026

Five homepage concepts, each presented as one desktop image and one continuous mobile image. The reviews show them side by side. The specifications describe all 50 touts, their references, scroll, hover, tap, keyboard behavior and React implementation plan.

## Open the study

- [Visual gallery](index.html)
- [Download the ten final images](downloads/homepage-study-images.zip)
- [Download the complete study](downloads/homepage-study.zip)
- [Desktop research](research/desktop.md) · [Mobile research](research/mobile.md)
- [Desktop React contract](specs/react-interaction-contract.md) · [Mobile React contract](specs/react-mobile-contract.md)

## The five homepages

| Homepage | Review | Tout and interaction spec | Mobile adaptation |
| --- | --- | --- | --- |
| Avela / Soft Form | [Desktop + mobile](reviews/01-avela.html) | [Markdown](specs/01-avela.md) | [Markdown](specs/mobile-01-avela.md) |
| Room & Ritual | [Desktop + mobile](reviews/02-room-and-ritual.html) | [Markdown](specs/02-room-and-ritual.md) | [Markdown](specs/mobile-02-room-and-ritual.md) |
| Oriel | [Desktop + mobile](reviews/03-oriel.html) | [Markdown](specs/03-oriel.md) | [Markdown](specs/mobile-03-oriel.md) |
| Sundrop | [Desktop + mobile](reviews/04-sundrop.html) | [Markdown](specs/04-sundrop.md) | [Markdown](specs/mobile-04-sundrop.md) |
| Serein | [Desktop + mobile](reviews/05-serein.html) | [Markdown](specs/05-serein.md) | [Markdown](specs/mobile-05-serein.md) |

## Folder structure

```text
images/
  desktop/     Five final desktop PNGs
  mobile/      Five continuous mobile JPGs
reviews/       Visual comparisons and review Markdown
specs/         Tout, mobile and React specifications
research/      Reference notes, approved headers and evidence captures
prompts/       Desktop and mobile prompt text
data/          Structured content and behavior specification
downloads/     Clean image-only and complete-study ZIPs
```

The image-only download contains exactly ten files in `images/desktop` and `images/mobile`. Earlier drafts and intermediate mobile section images are excluded from this study.

## View locally

From the repository root, run `python3 -m http.server 5187` and open `/homepage-study/`. The gallery also works when `index.html` is opened directly; normal links are relative.

Run `python3 homepage-study/scripts/package.py` to validate local links and rebuild both downloads.

## Implementation status

These are static design concepts. Mobile preserves the desktop content and chapter order while reflowing composition and crops. Generated imagery and fine text are illustrative. Build production type and controls as HTML using approved individual assets. The specification, rather than raster text size, governs exact spacing, accessibility and interaction behavior.

Secondary products, prices, stories and routes remain design proposals where identified. Reference-site claims are not transferred to these concepts. No depicted commerce, newsletter or inquiry service is connected.

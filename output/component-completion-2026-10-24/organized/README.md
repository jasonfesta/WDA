# Images and interaction documentation

24 October 2026 · Documentation revision 3.2 · 6 studies · 93 visual states · 41 control groups

Each study folder contains the final PNG images, editable SVG images, the full interaction guide in Markdown and HTML, and the corresponding state data. Start with the study README or open its interaction guide.

| Study | States | Folder | Interaction guide |
| --- | ---: | --- | --- |
| Sol · Weather card | 20 | [01-sol-weather](01-sol-weather/README.md) | [Read guide](01-sol-weather/INTERACTIONS.md) |
| Gather · Team picker | 16 | [02-gather-team-picker](02-gather-team-picker/README.md) | [Read guide](02-gather-team-picker/INTERACTIONS.md) |
| Courtyard · Material picker | 17 | [03-courtyard-material-picker](03-courtyard-material-picker/README.md) | [Read guide](03-courtyard-material-picker/INTERACTIONS.md) |
| Roam · Plan selector | 15 | [04-roam-plan-selector](04-roam-plan-selector/README.md) | [Read guide](04-roam-plan-selector/INTERACTIONS.md) |
| Kiln · Usage & limits | 15 | [05-kiln-usage-and-limits](05-kiln-usage-and-limits/README.md) | [Read guide](05-kiln-usage-and-limits/INTERACTIONS.md) |
| Folio · Navigation dock | 10 | [06-folio-navigation](06-folio-navigation/README.md) | [Read guide](06-folio-navigation/INTERACTIONS.md) |

[Rebuild reference](REBUILD.md) · [Final audit and state coverage](AUDIT.md) · [Reusable artwork](shared-assets/README.md)

## Folder contents

- `images/` — final PNGs, one file per rendered state.
- `editable-svg/` — matching editable vector images.
- `INTERACTIONS.md` and `INTERACTIONS.html` — the full existing guide, including control behavior, state transitions, keyboard/focus, persistence, async recovery, responsive rules and acceptance checks.
- `interactions.json` — the same authored specifications as structured data.
- `state-data/` — the fixture and visible text for each rendered state.
- `design-reference.json` — native measurements and typography extracted from every final SVG.
- `shared-assets/` — two decorative PNG accents, 20 icons and 10 material SVGs.
- `manifest.json`, `audit.json` and `checksums.sha256` — package inventory, audit and file integrity checks.

The 93 rendered states are the defined visual set. Additional behavior and data combinations are described in the guides. All image bytes are unchanged from the final exports. Guide content includes the final audit clarifications, with links adjusted for this folder layout. Original working files remain in `../quality-revision/`.

# Visuals version 4 — Peloton redo

Finalized October 25, 2026 as a static image release. The five saved FORM health concepts are now published under stable filenames. Ramp and Notion are carried forward unchanged. The earlier Peloton images are available under `previous-v3/` and from the viewer's Previous health section.

## Open

From the repository root:

```sh
python3 -m http.server 5207 --bind 127.0.0.1 --directory trackers/moodboard
```

Open <http://127.0.0.1:5207/visuals-v4.html#peloton/mobile>.

## Included health screens

| Surface | Image |
| --- | --- |
| Native mobile app | [mobile.png](mobile.png) |
| Native desktop app | [desktop.png](desktop.png) |
| Full desktop website homepage | [web-desk.png](web-desk.png) |
| Browser tracker | [web-app.png](web-app.png) |
| Centered tracker component | [component.png](component.png) |

The viewer provides three directions and five surfaces each, plus a desktop/mobile/component comparison. No functional trackers are implemented.

## Design and provenance

The health direction combines a graphite interface, violet completion markers, open activity rows, native navigation, and a photographic next session. The same fictional week is used throughout: three completed workouts, 140 minutes, three active days, and a planned 20-minute mobility session.

- [Product study](study.json): observations, sources, decisions, and limitations.
- [Mobile prompt](mobile-prompt.json) and [remaining prompts](variant-prompts.json): original built-in image_gen prompts retained for provenance. Historical prompt wording is not a record of user approval.
- [Release metadata](release.json): selected files and SHA-256 hashes.
- [Manifest](manifest.json): all fifteen visible screen assets.

Images were generated earlier using the built-in image_gen tool and are reused in this release. They are original concepts, not official Peloton screenshots. People and activity data are fictional; charts are illustrative. Previous local v1–v3 pages and the paused draft files are preserved.

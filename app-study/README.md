# WDA / App study

Jason Festa · 21 October 2026

Six app directions, five mobile screens each: **Afterglow, Pocket Garden, Home Note, Soul, Petal and Daybook**. Soul continues the earlier Sol weather concept. All 30 current exports are full-bleed mobile rectangles with square outer corners, no device shell, no exterior presentation margin and no OS clock, Wi-Fi, signal, battery or home indicator. In-app dates, time pickers and navigation remain intact.

[Open the gallery](index.html) · [Research and handoff](research.html) · [30-screen download](downloads/app-study-images.zip) · [MD and reference download](downloads/app-study-reference-pack.zip) · [Complete study](downloads/app-study.zip)

## Review each experience

| App | Visuals and action explorer | Markdown control ledger |
| --- | --- | --- |
| Afterglow | [Review](reviews/afterglow.html) | [Interaction notes](interaction/afterglow.md) |
| Pocket Garden | [Review](reviews/pocket-garden.html) | [Interaction notes](interaction/pocket-garden.md) |
| Home Note | [Review](reviews/home-note.html) | [Interaction notes](interaction/home-note.md) |
| Soul | [Review](reviews/soul.html) | [Interaction notes](interaction/soul.md) |
| Petal | [Review](reviews/petal.html) | [Interaction notes](interaction/petal.md) |
| Daybook | [Review](reviews/daybook.html) | [Interaction notes](interaction/daybook.md) |

Each review has the five-screen sequence, an action explorer, control-specific behavior, back/cancel/error routes, scroll and hover notes, a proposed alternative, original art reference, research findings and exact screen prompts. The [React handoff](interaction/react-handoff.md) defines state, routing, accessibility, persistence and later implementation checks.

Each review now also includes a **motion direction**, five screen-specific interaction prompts, per-control rollover/press/focus feedback, an asset extraction prompt and a motion production prompt, with linked primary references. [Browse all six motion briefs](research/motion-references.md). Afterglow uses a light shader; Pocket Garden and Home Note use illustration motion studies; Soul uses reconstructed 3D objects; Petal and Daybook use programmatic animation. These are specifications for the next production pass, not completed video or animation assets. “VO” is interpreted as Veo for visual motion studies, with no voiceover planned.

The five images are representative states, not every possible state in the product. Additional dialogs, errors, permission choices, editors and return paths are documented in Markdown. The review tool is interactive; the app images are visual specifications. Authentication, storage, live weather, audio and calendar services are later implementation work.

## Package structure

- `images/mobile/<app>/` — exactly five final PNGs per app; no source screenshots or contact sheets.
- `interaction/` — six app ledgers and shared React handoff.
- `interaction/motion/` — six motion briefs, covering all 30 screens and all 182 control/navigation entries.
- `research/` — saved WDA excerpts, official reference findings and access notes.
- `references/originals/` — the six original concept images; these intentionally retain their historical framing.
- `references/images/` — the six earlier supplied reference screenshots.
- `references/edit-inputs/` — the exact 21 pre-cleanup inputs, retained for reproducibility; these historical references are excluded from the screen-only ZIP.
- `prompts/screens/` — thirty prompts with applied revision notes; root prompt files preserve earlier concept prompts.
- `prompts/interaction/` — six app-level and 30 screen-level implementation prompts.
- `prompts/motion/` — six asset preparation and six motion direction prompts; assets remain to be produced.
- `data/flows.json` — the complete route/control inventory, fixed review data, actual native dimensions and SHA-256 hashes.
- `reviews/` — one visual review and a Markdown copy per app.

The image-only ZIP contains only `images/mobile/`. The reference ZIP contains the docs, prompt files and original reference images; extract alongside the image ZIP to resolve screen links. The complete study ZIP contains both, plus the review pages. Extracted HTML can be opened directly, or serve the directory with `python3 -m http.server 5187` and open its index page.

The complete ZIP excludes nested download ZIPs. Run `python3 scripts/package.py` after extracting to enable the local download buttons. Historical prompts preserve their original wording; the final OS-free export requirement supersedes earlier status-area instructions. Exact cleanup prompts and inputs are recorded per screen in `data/flows.json`.

## Research and validation

The [research index](research/README.md) distinguishes observed product features from proposed behaviors. The official product pages were read; this is not a hands-on audit of every native competitor flow. Mobbin results were unavailable and are not used. The Apple onboarding article was partially accessible and supports no attributed behavior here.

All screen pixels were reviewed for composition, edge treatment, labels and selected states. Corrections include Daybook’s 35-to-40-minute edit, consistent Home Note ownership imagery, invitation count/status, reminder switches, Petal progress and screen proportions. Native dimensions are recorded individually; images are displayed without stretching or CSS cropping. Minor raster icon and illustration variation must be normalized into shared components and assets during implementation. In particular, Petal must use one continuous source illustration for all puzzle strips.

Run `python3 scripts/build-notes.py`, then `python3 scripts/build-motion.py`, then `python3 scripts/build.py` to rebuild documentation and HTML. Run `python3 scripts/package.py` to validate assets/routes/links, interaction prompt coverage and motion briefs, then rebuild downloads. [Validation report](validation.json) records structural checks; browser checks cover the gallery, six review pages, action routing and narrow layouts.

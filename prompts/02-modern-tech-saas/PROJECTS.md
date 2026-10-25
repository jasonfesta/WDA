# 02 · Modern Tech / SaaS — Projects & Spawn Instructions

This document organizes the four distinct project directions for **02 · Modern Tech / SaaS**, based on the Version 6 production scaffolding (`commit 4f5df60` / `da35529` from [wda](http://127.0.0.1:8782/tech/moodboard-v6/)), mapped directly to the four pillars of [HD-02.md](HD-02.md) and [HD-02-vague.md](HD-02-vague.md).

---

## The Four Projects & Folders

Each project has its dedicated asset directory under both `images/02-modern-tech-saas/<pillar>/` and `prompts/02-modern-tech-saas/images/<pillar>/`, containing 4 complete raster views:
- `desktop-homepage.png` (Full long scroll with full footer)
- `mobile-homepage.png` (390px mobile viewport)
- `app.png` (Core product interface / workspace)
- `component.png` (Isolated interactive card / control state)
- `prompts/` (Exact prompts used for generating each view)

```
images/02-modern-tech-saas/
├── 01-corporate/      # Project 1: Avenor (Release Coordination)
├── 02-organic/        # Project 2: Neral (Evaluation Review)
├── 03-expressive/     # Project 3: Rillset (Dataset Publication)
└── 04-premium/        # Project 4: Oriel (Changelog & Updates)
```

---

## Project Breakdown & Chat Spawn Titles

When spawning the four dedicated chats for each project, use the exact titles and context instructions below:

### Project 1: Corporate — Avenor
- **Chat Title:** `02 - Modern Tech / SaaS: 01 - Corporate (Avenor)`
- **Folder:** `images/02-modern-tech-saas/01-corporate/`
- **Brand / Company:** **Avenor**
- **Product Domain:** Release coordination for infrastructure teams (environments, deployment checks, release windows, approval controls).
- **Aesthetic Direction:**
  - Entirely light surfaces (`#F5F5F5` surface, `#111111` ink, `#8A8A8A` muted).
  - Anchors: Factory & Attio.
  - High clarity, enterprise credibility, sticky header, platform pipeline walkthrough, and structured tabular data.
- **Typography:** Geist & Geist Mono.
- **Local Review Companion:** [Avenor Gallery](http://127.0.0.1:8782/tech/moodboard-v6/)

### Project 2: Organic — Neral
- **Chat Title:** `02 - Modern Tech / SaaS: 02 - Organic (Neral)`
- **Folder:** `images/02-modern-tech-saas/02-organic/`
- **Brand / Company:** **Neral**
- **Product Domain:** Model evaluation review workspace (design evaluations, compare benchmark experiments, approve evidence).
- **Aesthetic Direction:**
  - Quiet, humanist warmth (`#FCFCFC` surface, `#111111` ink, `#888888` muted) — user-rated 3/5 organic warmth.
  - Anchors: Granola, Claude, Wispr Flow, Cognition.
  - Left-aligned editorial serif typography, approachable language, layered textured cards and evaluation tables.
- **Typography:** Inter, Source Serif 4, IBM Plex Mono.
- **Local Review Companion:** [Neral Gallery](http://127.0.0.1:8782/tech/moodboard-v6/)

### Project 3: Expressive — Rillset
- **Chat Title:** `02 - Modern Tech / SaaS: 03 - Expressive (Rillset)`
- **Folder:** `images/02-modern-tech-saas/03-expressive/`
- **Brand / Company:** **Rillset**
- **Product Domain:** Dataset publication workspace (prepare uploaded tables, schema review, versioned dataset publishing).
- **Aesthetic Direction:**
  - Crisp white with vibrant accent (`#FAFAF8` surface, `#171717` ink, `#F15B28` accent orange, `#D9D9D9` rules).
  - Anchors: Firecrawl, Clay, Notion, Browserbase.
  - Dithered accents, dot-matrix textures, clear schema transformations, and energetic developer-centric UI touts.
- **Typography:** Geist & IBM Plex Mono.
- **Local Review Companion:** [Rillset Gallery](http://127.0.0.1:8782/tech/moodboard-v6/)

### Project 4: Premium — Oriel
- **Chat Title:** `02 - Modern Tech / SaaS: 04 - Premium (Oriel)`
- **Folder:** `images/02-modern-tech-saas/04-premium/`
- **Brand / Company:** **Oriel**
- **Product Domain:** Product update publishing workspace (draft, review, and schedule customer-facing changelogs).
- **Aesthetic Direction:**
  - High-end dark & dimensional (`#000000` surface, `#121212` raised, `#F2F2F2` ink, `#7B9C88` muted green status).
  - Anchors: Resend, Linear, Framer, Replit.
  - Generous negative space ("more air"), dramatic ray of light, static high-clarity typography, and dimensional preview cards.
- **Typography:** Instrument Serif & Inter.
- **Local Review Companion:** [Oriel Gallery](http://127.0.0.1:8782/tech/moodboard-v6/)

---

## Skills Integration & Pinned Chat Reference

When working in each of the four project chats, reference our **pinned chat** that has access to all project skills and tools:

1. **`generative_ui`** (`builtin/skills/generative_ui/`):
   - Use for rendering interactive prototypes, live React/HTML component previews, side-by-side comparison sliders, and visual code boards.
2. **`agy-customizations`** & **`antigravity-guide`** (`builtin/skills/agy-customizations/`):
   - Reference for loading project rules, sidecars, and MCP tools.
3. **`automation`** (`builtin/skills/automation/`):
   - Use for automated image batch intakes, verification pipelines, and manifest updates.
4. **`plugin`** (`builtin/skills/plugin/`):
   - Use if bundling these 4 tech projects into a reusable design plugin package.

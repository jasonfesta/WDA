# Avenor · Release Coordination for Infrastructure Teams

Production-grade, highly interactive, fully responsive React + TypeScript web application for **Project 01: Corporate (Avenor)**, created as part of the Modern Tech / SaaS design study.

---

## Brand & Visual System

- **Brand:** Avenor (Release coordination for infrastructure teams)
- **Aesthetic Direction:** Corporate / Clean SaaS (anchors: Factory & Attio)
- **Palette (100% Light Surfaces):**
  - Ground canvas: `#F5F5F5`
  - High-clarity cards & dialogs: `#FFFFFF`
  - Subtle secondary ground: `#F7F8F5`
  - Sidebar & panels: `#F3F5F1`
  - Primary ink: `#111111` / `#273028`
  - Secondary & muted text: `#555555` / `#8A8A8A`
  - Fine borders & hairlines: `#E5E5E5` / `#D7DDD4`
  - Muted light sage accent (reserved windows & active states): `#E3EDE0` (border `#B8CBB4`, ink `#1B3621`)
  - Verified green: `#1F7A3E` (background `#E8F5EB`, border `#C3E6CC`)
  - Pending amber: `#8C6512` (background `#FEF6E7`, border `#F7DEAF`)
  - Emergency / critical terra-cotta: `#A83232` (background `#FCE8E8`, border `#F5BEBE`)
- **Typography:** Geist & Geist Mono with precise technical hierarchy.
- **Corners:** Refined 4–6px radii with fine 1px borders (Attio/Factory restrained aesthetic).

---

## Key Interactive Features

1. **Interactive Deployment & Release Coordination Pipeline**:
   - Multi-phase flow across `stage-eu-west`, `prod-canary-01`, `prod-eu-west`, and `prod-us-east`.
   - Real-time canary traffic slider (5% to 100%) dynamically adjusting simulated P99 latency, 5xx error rate, and worker node allocations.
2. **Release Checks Gate**:
   - 10 automated pre-flight checks (`Image signed`, `Change reviewed`, `Staging smoke`, `Backout plan`, `On-call coverage`, `Window conflict`, `Canary Health`, `Unit/Integration`, `Schema Lock`, `Soak Time`).
   - Clickable drawer to inspect latency sparklines, validator engines (`sigstore-cosign`, `argo-rollouts`, `datadog-slo-agent`), and live terminal stdout traces.
   - Interactive toggle to switch any check between `PASS` and `HOLD` with real-time gate recalculation.
3. **Interactive Rollback Simulation Trigger**:
   - Full emergency drill simulator: inject synthetic P99 spikes (> 420ms) or 5xx surges (> 2.8%).
   - Automated controller response: triggers canary circuit breaker, progressively drains ingress traffic, and reverts production to stable baseline `REL-213 (v2.8.0)` in 3.4 seconds.
4. **Tabbed Environment Tour**:
   - Environment switcher across all 4 environments with animated transitions, live health scores, P99 metrics, cluster versions, and node counts.
5. **Sticky Collapsing Responsive Navigation**:
   - Sticky navbar that tightens padding and increases border definition on scroll.
   - Responsive mobile slide-down drawer with expandable accordions and quick view switcher.
6. **Isolated 1100×1250 Release Window Approval Card**:
   - Faithful recreation of the target 1100×1250 Release Window Approval Card.
   - Includes side-by-side comparison mode with the generated reference raster `component.png`.
7. **Interactive Rowan Park Approval Workflow**:
   - Authorize release window with cryptographic Ed25519 signature generation and Rekor transparency recording.
8. **Command Palette (`Cmd+K`)**:
   - Keyboard accessible quick search across releases, checks, environments, and emergency actions.

---

## Build & Preview

Run the production build:
```bash
npm run build
```

This compiles and bundles all TypeScript/React components and stylesheets into `dist/`.

---

## File Structure

```
projects/01-corporate-avenor/
├── dist/                          # Production build output
│   ├── assets/
│   │   ├── app.css                # Bundled responsive CSS (66 KB)
│   │   └── src/                   # Transpiled ES modules
│   ├── reference/                 # Reference PNG mockups
│   └── index.html                 # Production entrypoint
├── public/                        # Static assets & concept PNGs
├── scripts/
│   └── build.mjs                  # Fast zero-dependency build script
├── src/
│   ├── components/
│   │   ├── interactive/           # Pipeline tour, checks drawer, rollback drill, modals
│   │   ├── layout/                # Collapsing navbar & custom contact-led footer
│   │   ├── sections/              # Homepage hero, calendar, promises, workflow, readiness
│   │   └── ui/                    # Buttons, badges, tooltips, dialogs, icons
│   ├── data/                      # Initial state models & coherent mock data
│   ├── lib/                       # React / Virtual DOM runtime engine
│   ├── styles/                    # High-end Corporate SaaS stylesheet
│   ├── types/                     # TypeScript data contracts & interfaces
│   ├── App.js / App.tsx           # Root application component
│   └── main.js / main.ts          # Entry point
├── index.html                     # Root index for preview
└── package.json
```

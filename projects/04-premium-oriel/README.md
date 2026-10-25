# Oriel — Collaborative Product Update Publishing Workspace
**Project 04: Premium (Modern Tech SaaS)**

> Built with React + TypeScript, featuring dark dimensional surfaces, dynamic 3D glass prism lighting, interactive changelog studio, air-filled publication drawer, and responsive multi-column architecture.

---

## Brand & Aesthetic Specifications
- **Brand Name:** Oriel (`/oriel`)
- **Product Domain:** Product update publishing workspace (draft, review, and schedule customer-facing changelogs).
- **Aesthetic Direction:** High-end Dark & Dimensional (Resend, Linear, Framer, Nocturne anchors).
- **Palette:**
  - Background Surface: Deep Black `#000000` / `#090909`
  - Elevated Panels: `#121212` / `#161616`
  - Crisp Ink: `#F4F4F2` / `#F2F2F2`
  - Status Sage Accent: `#7B9C88` (with delicate rgba glow)
  - Subtle Border Rules: `#1F1F1F` / `#222222` / `#2A2A2A`
- **Typography:**
  - Headlines & Titles: **Instrument Serif**
  - UI Controls & Copy: **Inter**
  - Telemetry & Tags: **JetBrains Mono**

---

## Interactive Features
1. **Dimensional Hero Object & Light Ray:**
   - 3D CSS perspective container with real-time mouse tracking and caustics.
   - Refractive glass card showcasing public changelog view (`upd_072`).
2. **Interactive Changelog Studio Feed:**
   - Filterable update stream (`All`, `Scheduled`, `Draft`, `In review`).
   - Split-pane layout with live update inspection, author avatars, and status badges.
   - Search bar filtering across tags, titles, and team members.
3. **Interactive Scheduling & Publication Drawer:**
   - Air-filled drawer with date/time pickers (`28 Oct 2026 · 09:00 UTC`).
   - Distribution channel selection (Public Changelog, Customer Email, In-app Banner).
   - Real-time responsive device switcher toggling between Desktop and Mobile (390px) rendering.
4. **Command Palette (`Cmd+K`):**
   - Global keyboard listener with quick actions and fast search across all changelog updates.
5. **Three-Stage Typographic Workflow:**
   - Interactive step explorer (`01 Shape`, `02 Review`, `03 Share`) with pipeline schema visualization.
6. **Responsive Layout:**
   - Collapsing sticky navigation with mobile sheet menu.
   - Custom deep multi-column architectural footer.

---

## Production Build & Preview
To run a production build:
```bash
npm run build
```
Build outputs are generated in `dist/` (`dist/bundle.js`, `dist/bundle.css`, `dist/index.html`).

To run the local preview server:
```bash
npm run preview
# Serves at http://127.0.0.1:3004
```

# Warm Theme Explorer — Structured Build Brief

**Current direction, October 15, 2026:** Build authorized. The user instructed us to proceed with the selected imagery, split React areas among subagents, and include a real, heavily textured WebGL area. This supersedes the earlier collection gate. The original wording is preserved in `warm-moodboard-original-prompt.md`.

**Working implementation:** `warm/moodboard/`. **Reusable execution prompt:** `original-image-prompt.md`. **Selected imagery:** `warm-moodboard-images.zip`, now 42 PNGs. This brief is a complete build instruction with reference-specific appendices below.

## 1. The result

Build a single, full-width React moodboard on a stable off-white canvas. Compact controls float directly above the workspace without an enclosing panel, border, or rounded container. The board contains live website compositions, live UI and mobile components, color ranges, a floating headline, selected texture and object artwork, and a genuine WebGL material area. Let the visual examples occupy the page without dashboard chrome or explanatory cards around every object.

Use **“Build me a warm landing page.”** as the headline. Render it as very large live Google Sans Flex text with a strong warm-to-near-white gradient. Use generous baseline padding and line height so no letter descenders are clipped. It is the central focal point of the mosaic, with natural spacing around it. The point is to show warmth beyond beige through ten distinct color directions: Terracotta, Orchard, Rosette, Moss, Honey, Citron, Apricot, Burgundy, Cocoa, and Coral. These ten directions are authored implementation palettes grounded in the selected imagery, not claims that the supplied PNGs contained original design tokens. There are 42 references, not 42 separate themes.

The source images are visual targets. Keep their selected stories and characteristic compositions. The UI shell is quiet and modern. The top control bar uses **Google Sans Flex**, hosted locally from the official Google Fonts release. Use unboxed floating controls with only Tonal range and Directions. Tonal range opens sliders plus image recoloring and native-text font choices; Directions selects a family. Palette strips themselves are clickable. Remove decorative dials, scale controls, downloads, exports, the brief modal, and the page footer. Reference typography may be serif, heavy sans-serif, condensed, or italic as appropriate. Exact font identities were not available; implementations use close system or available font interpretations.

## 2. Four implementation areas

| Area | References | Deliverable |
|---|---|---|
| Website layouts | REF-001–006 | Six native React hero/page compositions, real text/navigation/actions, image layers for photography |
| UI and mobile | REF-007–018 | Six interactive components and six interactive mobile screen compositions |
| Texture and object specimens | REF-019–030, REF-037–042 | Twelve texture images and six transparent rendered objects in independently inspectable React specimens |
| Textured WebGL | REF-031–036 | One reusable Three.js area with six real cube/sphere/pyramid arrangements and selectable material finishes |

Use parallel agents for independent areas, with one owner integrating registry, theme controls, navigation, state, asset mapping, and verification. Share a small prop contract rather than building four unrelated applications.

## 3. Image-to-code rules

- Preserve all 42 source PNGs and existing reference IDs. Add the newer textures as REF-037–042. The former 36-image archive is an older snapshot.
- Rebuild interface typography, surfaces, buttons, tabs, switches, selectors, counters, and navigation as React DOM. A complete screenshot with an invisible click target does not meet this requirement.
- Keep photography, fine illustration, and material detail as assets. Use clean photographic crops when available. Where interface text is baked across a necessary photograph, create a clean derivative and rebuild the text above it. Preserve originals and record derivative prompts.
- Use the transparent object PNGs honestly as rendered artwork. They do not contain meshes or hidden views. Keep artwork upright and preserve its full source aspect ratio. Clicking the artwork opens its full-size view.
- Reconstruct the geometric studies with real meshes and textured materials. The WebGL view must respond to camera input, finish changes, and shared color controls. Use image thumbnails while idle; hover or keyboard focus starts the live board renderer. Opening one adds material/camera controls.
- Inspect the images individually. Each reference gets its own reconstruction instructions, including its defining composition, copy, asset layers, interaction, theme behavior, and limitations. Do not treat a contact sheet alone as sufficient.

## 4. Shared color controls

Keep simple, flat Hue, Warmth, and Depth sliders in the Tonal range popover. Provide visible labels and values, pointer/touch adjustment, and keyboard arrows. Defaults are zero offsets. Hue ranges from −20 to +20, Warmth from −30 to +30, and Depth from −25 to +25. Hue stays within warm material families: warm accents are clamped to red/clay/amber/honey, olive changes are small, and existing cool accents move minimally. Raster hue rotation is bounded to ±7°. Reset restores the baseline offsets.

Apply offsets relative to each example's authored palette, rather than replacing all examples with one palette. Derive `surface`, `surface-raised`, `ink`, `muted`, `accent`, `accent-alt`, `on-accent`, and `border`. Keep text readable and choose contrasting foregrounds for accents. The stable off-white outer canvas keeps the study easy to compare. The floating headline responds to the shared controls too.

Show all ten compact dark-to-light direction ranges in the overview. The dropdown selects a direction and expands its actual palette. UI swatches consume all eight semantic tokens used by the live components, with duplicate values removed. Material swatches consume the same helper as the meshes, including selected finish and amber glass tint. Baked artwork and photo banks each contain up to 16 distinct actual source pixels per direction, sampled from the texture/object sources and visible photographic regions. Their swatches receive the same CSS color filter as those images. Reproducible Pillow scripts are saved in `warm/moodboard/scripts/`. Coral contains artwork only, so it does not display unrelated unused UI tokens. Palette labels distinguish material base colors from source pixels because lighting and maps affect final rendered appearance.

An independent Recolor images switch applies subtle grading once to each photo, illustration, texture, and rendered-object layer, including SVG image crops and isolated background imagery. Native text and controls retain their shared CSS colors. Turning image recoloring off restores the original pixels. Font choices apply only to live study text; raster lettering remains part of the source image. Color and font edits are always active; Reset style restores the original settings. The actual WebGL materials and light/exposure change in the scene. Describe these differences accurately in the prompts.

## 5. Moodboard and focus

Use an upright, varied-scale mosaic with natural row heights, a floating headline, website panels, mobile proportions, small controls, texture fields, and transparent objects. No tilted cards or rotated board items. Preserve the full composition and prevent overlaps, clipped controls, stretched photos, or oval circles. Continue below with the entire collection and use responsive reflow on narrow screens.

The board contains the actual objects without reference IDs, small category/title captions, or arrows underneath. A discrete open control appears on hover or keyboard focus; touch keeps it available. Internal controls remain usable on the board. Focus replaces the board within the same page, leaving the global controls in place. Show the same component at readable scale on an appropriate surface, with a return action and previous/next study navigation. Provide a View reference comparison action for the original still image. Restore the original board filter, scroll position, and per-example state on return.

Examples have local demonstration behavior, such as a bag count, reservation panel, plan selection, tabbed usage, team checkboxes, onboarding steps, timer settings, local email validation, puzzle alignment, forecast settings, and planner tasks. These do not send messages, process orders, or imply external subscriptions. No backend or accounts are required.

## 6. WebGL material area

Create a cube, square pyramid, and sphere for each geometric study. Preserve the relative arrangements and warm material relationships described in the appendix. Use a softly lit seamless ground, grounding shadows, visible pores or aggregate, and actual physical material properties. Amber glass uses transmission, thickness, and environment reflections. Do not claim physically accurate ray-traced caustics or recovered geometry.

Offer Original, Stone, Glaze, and Linen finishes. Original uses seeded procedural texture to preserve authored palette relationships. Additional finishes use selected travertine, glaze, and linen imagery as creative color/bump sources; those images are not calibrated seamless PBR scans. Preserve that limitation in the handoff.

Support pointer/touch orbit, keyboard orbit, zoom, reset, and optional rotation. Motion is opt-in, respects reduced motion, and stops in hidden tabs. Preserve material and camera choices between views. Mount a renderer only for an active hovered/focused tile or open study, render on demand, resize correctly, and dispose resources on close. If WebGL fails, identify the still as a reference fallback and offer retry.

## 7. Minimal architecture

Use React + TypeScript + Vite, scoped CSS, and Three.js for WebGL. Keep registry data and semantic palettes separate from rendering. `AreaProps` carries `id`, `focused`, `state`, `onState`, and `knobs`. Parent state owns color offsets, the image-recoloring toggle, chosen study typeface, direction, focused ID, and a keyed state record for each example. Preserve these values in browser-local storage when available; controls still work in memory if storage is blocked.

Scale reference compositions for the overview and render the same definitions in focus. Use the source-proportioned website stages of 900 × 501 (REF-001/002/004) and 900 × 563 (REF-003/005/006), documented card/mobile sizes, and a 660 × 660 WebGL stage. A fixed reference stage may scale for fidelity; surrounding controls and board navigation must reflow at narrow viewport sizes.

Source implementation map:

- `warm/moodboard/src/App.tsx`: board, focus, persistent state, specimens, source comparison.
- `warm/moodboard/src/Header.tsx`: simple sliders, direction dropdown, and actual palettes.
- `warm/moodboard/src/theme.ts`: ten authored palettes and color transformations.
- `warm/moodboard/src/registry.json`: all 42 reference IDs, asset paths, categories, natural sizes, and theme associations.
- `warm/moodboard/src/areas/Websites.tsx`: REF-001–006.
- `warm/moodboard/src/areas/Interfaces.tsx`: REF-007–018.
- `warm/moodboard/src/areas/MaterialScene.tsx`: REF-031–036.

## 8. Asset package conventions

The ZIP contains only the 42 original selected PNGs. Its texture directory remains `images/texture-studies/` to preserve existing prompt paths. The application copies those identical texture pixels to `warm/moodboard/public/assets/textures/`; other category names remain unchanged. Additional clean photographic derivatives live under `warm/moodboard/public/assets/website-layers/` and are documented in the website appendix. Original files and transparency must not be overwritten.

The original three-file repository handoff was a prompt/image snapshot. The later instruction authorizes the working React project and the reusable area briefs alongside it. Keep the archive and the matching indexes synchronized. Do not confuse intermediate drafts, source inspiration, or obsolete approval ZIPs with this final selected set.

## 9. Verification and honest fidelity

Verify 42 unique reference IDs and exact archive membership, source/app hash agreement, six alpha-bearing object PNGs, and the six added textures. Build TypeScript and Vite. Inspect the board and focused examples in the browser. Exercise the three sliders, live palette agreement, filtering, state preservation, source comparison, and return navigation. Check the narrow layout for page overflow. Verify meaningful local actions in each area and actual canvas/material changes in WebGL.

Compare visual composition with selected imagery. A correct implementation preserves the distinctive hierarchy and image content while acknowledging substituted fonts, clean photographic derivatives, repeated photo crops, and approximate 3D material reconstruction. Do not claim pixel-perfect matching, original mesh recovery, or functionality that was not tested.

## 10. Current reference inventory

The table below retains all existing IDs and adds only REF-037–042. Paths are exact paths inside `warm-moodboard-images.zip`.

| Reference | Selected imagery | Category | Dimensions | Archive path |
|---|---|---|---|---|
| REF-001 | Avela — The Arc bag | Websites | 1681 × 936 | `images/websites/01-avela-arc-bag.png` |
| REF-002 | Rill & Rye — Orchard bakery | Websites | 1681 × 936 | `images/websites/02-rill-and-rye-bakery.png` |
| REF-003 | Room & Ritual — The courtyard house | Websites | 1586 × 992 | `images/websites/03-room-and-ritual-interiors.png` |
| REF-004 | Oriel — Spaces for gathering | Websites | 1681 × 936 | `images/websites/04-oriel-spatial-practice.png` |
| REF-005 | Sundrop — Apricot aperitif | Websites | 1586 × 992 | `images/websites/05-sundrop-aperitif.png` |
| REF-006 | Serein — Daily botanical care | Websites | 1586 × 992 | `images/websites/06-serein-botanical-care.png` |
| REF-007 | Sol — Weather card | UI components | 1254 × 1254 | `images/ui-components/07-sol-weather-clean.png` |
| REF-008 | Gather — Team picker | UI components | 1122 × 1402 | `images/ui-components/08-gather-team-clean.png` |
| REF-009 | Courtyard — Material palette picker | UI components | 1536 × 1024 | `images/ui-components/09-courtyard-palette-clean.png` |
| REF-010 | Roam — Membership panel | UI components | 1122 × 1402 | `images/ui-components/10-roam-membership-clean.png` |
| REF-011 | Kiln — Usage dashboard | UI components | 1448 × 1086 | `images/ui-components/11-kiln-usage-clean.png` |
| REF-012 | Folio — Navigation dock | UI components | 1536 × 1024 | `images/ui-components/12-folio-navigation-dock.png` |
| REF-013 | Home Note — Family handover | Mobile screens | 928 × 1695 | `images/mobile-screens/13-home-note-onboarding.png` |
| REF-014 | Afterglow — Evening rhythm | Mobile screens | 928 × 1695 | `images/mobile-screens/14-afterglow-bedtime.png` |
| REF-015 | Pocket Garden — Early access | Mobile screens | 928 × 1695 | `images/mobile-screens/15-pocket-garden-waitlist.png` |
| REF-016 | Petal — Botanical puzzle | Mobile screens | 941 × 1672 | `images/mobile-screens/16-petal-puzzle.png` |
| REF-017 | Sol — Hourly forecast | Mobile screens | 966 × 1629 | `images/mobile-screens/17-sol-forecast.png` |
| REF-018 | Daybook — Daylight planner | Mobile screens | 965 × 1629 | `images/mobile-screens/18-daybook-daylight.png` |
| REF-019 | Apricot and citron — Soft light field | Texture studies | 1122 × 1402 | `images/texture-studies/19-apricot-citron-light.png` |
| REF-020 | Canyon lines — Handcrafted surface | Texture studies | 941 × 1672 | `images/texture-studies/20-canyon-lines-craft.png` |
| REF-021 | Rosette and moss — Grain field | Texture studies | 941 × 1672 | `images/texture-studies/21-rosette-moss-grain.png` |
| REF-022 | Courtyard light — Optical texture | Texture studies | 1025 × 1534 | `images/texture-studies/22-courtyard-light-bokeh.png` |
| REF-023 | Woven light — Translucent fabric | Texture studies | 1122 × 1402 | `images/texture-studies/23-woven-light.png` |
| REF-024 | Mineral impressions — Clay relief | Texture studies | 1122 × 1402 | `images/texture-studies/24-mineral-impressions.png` |
| REF-025 | Amber arc | 3D objects | 1254 × 1254 | `images/3d-objects/25-amber-arc.png` |
| REF-026 | Moss glazed sphere | 3D objects | 1254 × 1254 | `images/3d-objects/26-moss-sphere.png` |
| REF-027 | Citron folded ribbon | 3D objects | 1254 × 1254 | `images/3d-objects/27-citron-fold.png` |
| REF-028 | Rosette ceramic discs | 3D objects | 1254 × 1254 | `images/3d-objects/28-rosette-discs.png` |
| REF-029 | Coral translucent ribbon | 3D objects | 1254 × 1254 | `images/3d-objects/29-coral-ribbon.png` |
| REF-030 | Amber sun disc | 3D objects | 1254 × 1254 | `images/3d-objects/30-amber-sun.png` |
| REF-031 | Apricot balance | Geometric studies | 1254 × 1254 | `images/geometric-studies/01-apricot-balance.png` |
| REF-032 | Citron courtyard | Geometric studies | 1254 × 1254 | `images/geometric-studies/02-citron-courtyard.png` |
| REF-033 | Rosette tilt | Geometric studies | 1254 × 1254 | `images/geometric-studies/03-rosette-tilt.png` |
| REF-034 | Honey translucence | Geometric studies | 1254 × 1254 | `images/geometric-studies/04-honey-translucence.png` |
| REF-035 | Clay triad | Geometric studies | 1254 × 1254 | `images/geometric-studies/05-clay-triad.png` |
| REF-036 | Quiet monument | Geometric studies | 1254 × 1254 | `images/geometric-studies/06-quiet-monument.png` |
| REF-037 | Sienna silk | Texture studies | 1254 × 1254 | `images/texture-studies/07-sienna-silk.png` |
| REF-038 | Moss linen | Texture studies | 1254 × 1254 | `images/texture-studies/08-moss-linen.png` |
| REF-039 | Peach travertine | Texture studies | 1254 × 1254 | `images/texture-studies/09-peach-travertine.png` |
| REF-040 | Honey caustics | Texture studies | 1254 × 1254 | `images/texture-studies/10-honey-caustics.png` |
| REF-041 | Coral paper | Texture studies | 1254 × 1254 | `images/texture-studies/11-coral-paper.png` |
| REF-042 | Cream glaze | Texture studies | 1254 × 1254 | `images/texture-studies/12-cream-glaze.png` |

## Latest verification

Production build passes. Browser checks covered all ten clickable palette directions and matching study sets, photo/artwork grading, live font switching, original-style comparison, zero board captions, round decorative circles, and a 390px layout without horizontal page overflow. A boundary sweep of 270 color-control combinations keeps every primary accent in the warm hue range. The headline retains Google Sans Flex and a live gradient independent of study font selection. The latest floating-control revision removes the enclosing panel, enlarges the headline with safe descender padding and a near-white gradient endpoint, and bakes 113 artwork plus 80 photo samples. Browser checks confirmed the enlarged headline at desktop and 390px widths, no page overflow, the expanded Orchard palette (16 photo samples plus live UI colors), and return to all 42 studies.

## 11. Reference-specific reconstruction briefs

Shared-control updates above supersede older per-reference notes about natural photography or fixed fonts.

# Website image-to-React briefs

These six briefs interpret the selected final imagery as small, live React compositions. Every navigation item, headline, caption, button, selector, counter, and detail panel is DOM. Photography remains raster. Each composition uses the same React component in the moodboard and focused view; local state is supplied by the parent so an interaction survives view changes.

Implementation: `src/areas/Websites.tsx` and `src/areas/websites.css`. Natural stages: **900 × 501** for REF-001/002/004 and **900 × 563** for REF-003/005/006, following their source aspect ratios. The parent scales the complete stage; typography within the stage uses container-relative units. Styles inherit `--surface`, `--surface-raised`, `--ink`, `--muted`, `--accent`, `--accent-alt`, `--on-accent`, and `--border`. Photos keep their natural colors.

## REF-001 — Avela / The Arc

**Structured build prompt:** Reconstruct the selected Avela campaign as an image-led React hero. Use a full-bleed, sunlit campaign photograph with the model and oxblood bag at center-right. Place a thin, widely spaced AVELA wordmark upper-left, centered atelier navigation, and a live bag count at upper-right. Place the editorial copy on the left and three leather selectors on the right. Anchor the composition with the oversized, tightly fitted SOFT FORM line across the lower edge. Keep the oversized type and quiet spacing; all lettering must be actual DOM text.

**Exact core copy:** “A softer shape. / A longer story.”; “Cut by hand. Carried for years.”; “OBJECT 01 / THE ARC”; “Meet the Arc ↗”; “SOFT FORM”.

**Typography and structure:** Narrow geometric brand lettering; book-serif headline and navigation; wide heavy sans-serif bottom line. Header, left story, right product selector, and bottom display line are separate layout regions.

**Assets:** Source `public/assets/websites/01-avela-arc-bag.png`. React background `public/assets/website-layers/avela-clean-photo.png`. The latter is a built-in ImageGen edit of the source that removes baked interface lettering and fills the underlying scene, preserving subject, pose, bag, architecture, and light.

**Local interaction:** Leather selection updates the selected swatch and product label; product details can be opened and an item added to the local bag. Workshop and care links open relevant information. Bag can be emptied.

**Theme:** Live surfaces, type, buttons, and swatches use semantic theme variables. The selected photographic bag remains oxblood when another finish is selected; this prototype does not fabricate alternate product photography.

**Verification/limits:** All source imagery was inspected before implementation. Background edit was visually inspected for removed lettering. TypeScript strict check passed. Photograph is an inpainted derivative, not a pixel-identical original.

## REF-002 — Rill & Rye / Orchard bakery

**Structured build prompt:** Build a relaxed two-column bakery homepage in React. Begin with a thin contrasting announcement strip. Put the soft serif brand and short navigation into a generous header. Set the large three-line serif headline on the left, followed by a short paragraph, primary reservation button, orchard link, and ruled next-bake note. Put the selected orchard bakery photograph in the right half with a small italic caption beneath it. Use warm paper colors, generous left margins, and compact controls.

**Exact core copy:** “FERMENTED SLOWLY. SHARED EARLY.”; “The long way / to a good / morning.”; “Our orchard oven wakes at six. Stone-milled sourdough, apricot buns, and something warm for the walk home.”; “Reserve tomorrow’s loaf”; “NEXT BAKE / SATURDAY · 06:30”.

**Typography and structure:** Serif logo, headline, navigation and body; tracked small sans-serif labels. Announcement strip → header → text/photo split.

**Assets:** Source `public/assets/websites/02-rill-and-rye-bakery.png`. A CSS image window exposes normalized crop `[0.466, 0.198, 0.518, 0.718]`, isolating the real bakery photograph from the baked interface. The awning and signs remain part of the photograph.

**Local interaction:** Reservation panel has a real loaf select and local confirmation. The reservation can be changed. Navigation exposes bake, orchard, and visit details. No order is transmitted.

**Theme:** Paper background, announcement strip, accents, buttons, text, and rules use shared tokens. Photographic orchard light remains natural.

**Verification/limits:** Source and crop coordinates visually reviewed; TypeScript strict check passed. The reservation is explicitly identified as a local preview. Opening-time copy represents the fictional reference brand.

## REF-003 — Room & Ritual / The courtyard house

**Structured build prompt:** Recreate the interior studio as a pink-toned typographic masthead above a full-width interior photograph. Give the live ROOM & RITUAL wordmark almost the full width with a large, contrasting italic ampersand. Keep a small doorway monogram and understated navigation above it. Pair the serif home statement at lower-left with a compact scene index and circular next control at lower-right. Let the selected olive-sofa courtyard photograph fill the lower 63%.

**Exact core copy:** “ROOM & RITUAL”; “A home should hold / more than furniture.”; “01 — THE COURTYARD HOUSE”; “Walnut, wool, and late afternoon.”

**Typography and structure:** Very heavy geometric sans-serif wordmark; italic serif ampersand; book-serif caption; small sans-serif navigation. CSS doorway monogram is live geometry.

**Assets:** Source `public/assets/websites/03-room-and-ritual-interiors.png`. Default photo crop `[0, 0.37, 1, 0.63]`. Two additional uniform SVG crops explore the gathering room and material details within the same selected photograph.

**Local interaction:** Next control cycles three details of the same house. Homes, Objects, and Field notes open short relevant panels. Discuss a space provides local room choices and a response; it does not send a form.

**Theme:** Masthead surface, lettering, outline controls, and all panel colors inherit the shared palette. The home photograph is unchanged.

**Verification/limits:** Source/crop boundary inspected; TypeScript strict check passed. Three views are crops of one project, not three separate projects. System fonts approximate the custom reference lettering.

## REF-004 — Oriel / Spatial practice

**Structured build prompt:** Reconstruct the architectural hero using the selected rammed-earth hall as a clean full-bleed photograph. Add the monumental lowercase oriel wordmark in live heavy sans-serif near the upper-left. Keep the small studio signature, minimal top-right navigation, short two-line project story, bottom-left progress marks, and compact bottom-right material card. Preserve the oval opening, natural textures, and precise sunlight.

**Exact core copy:** “ORIEL / SPATIAL PRACTICE”; “oriel”; “An old foundry. / A new place to gather.”; “WILLOW HALL — CULTURE & COMMUNITY”; “Built around belonging”; “Step inside ↗”.

**Typography and structure:** Heavy lowercase sans-serif wordmark; serif story; tracked small labels. The materials card is a DOM surface containing three separately cropped photographic samples.

**Assets:** Source `public/assets/websites/04-oriel-spatial-practice.png`. Background `public/assets/website-layers/oriel-clean-photo.png`, made with built-in ImageGen by removing all overlaid type, progress marks, and the material card while preserving architecture and light. Material crops are taken from the original card at approximately x=`0.7847 + index × 0.063`, y=`0.7179`, width=`0.0595`, height=`0.108`.

**Local interaction:** Four progress marks reveal four story chapters about the same hall. Three material buttons select rust plaster, honey oak, and brushed brass. Step inside opens the selected material description. Practice/project navigation opens context panels.

**Theme:** Interface text, cards, outlines, and controls use semantic variables. Photographic building and real material samples retain their source colors.

**Verification/limits:** Both original and clean image were visually inspected; TypeScript strict check passed. Four chapters share one building photograph. Background is an inpainted derivative with reconstructed pixels beneath the original wordmark.

## REF-005 — Sundrop / Apricot aperitif

**Structured build prompt:** Build a spacious, sunlight-filled aperitif hero. Use a slim light header with widely tracked SUNDROP brand, small sun mark, three navigation links, and a live basket count. Place the tall, condensed-looking three-line headline left, followed by serif description, rounded primary action, underlined ingredients link, and small taste profile. Use a cleaned version of the selected full-bleed glass/can still life beneath the live text, with the series index tucked into the lower-left.

**Exact core copy:** “A SLOWER SIP. / A BRIGHTER / AFTERNOON.”; “Apricot, bitter orange, and a little sparkle. Made for the hour you keep for yourself.”; “Find your first pour”; “FRUIT FORWARD · GENTLY BITTER · READY TO POUR”; “THE AFTERNOON SERIES / 01”.

**Typography and structure:** Wide light sans-serif brand, horizontally compressed display sans-serif headline, serif body/link text, small tracked taste labels.

**Assets:** Source `public/assets/websites/05-sundrop-aperitif.png`. Clean background `public/assets/website-layers/sundrop-clean-photo.png`, created with built-in ImageGen by removing only overlaid interface elements while preserving the printed can label. CSS photo window `[0, 0.072, 1, 0.928]` aligns the full photograph beneath the live header.

**Local interaction:** Pack-size selector supports 4, 8, or 12 cans. Add updates local basket count; basket can be cleared. Other links open ingredients, serving, or gathering notes. No checkout or transaction occurs.

**Theme:** The live header, type, buttons, and panels inherit tokens; the full-bleed photograph, including glass refraction and product colors, stays natural.

**Verification/limits:** Source/crop inspected; TypeScript strict check passed. The cleaned photo reconstructs the wall and tabletop beneath the baked text. System display typography approximates the reference’s custom condensed face.

## REF-006 — Serein / Daily botanical care

**Structured build prompt:** Reconstruct the selected three-part editorial skincare hero. Use a slim off-white navigation bar. Divide the main region into a soft left copy panel, narrow botanical macro strip, and large portrait on the right. Set the headline in a refined serif with an italic second line. Place the Daily Oil product photo across the left/botanical boundary, keep its tiny caption separate, and finish with a three-step strip at the bottom. Recreate all navigation, headline, copy, button, caption, and step labels in DOM.

**Exact core copy:** “A little care, / every day.”; “Soft textures. Botanical oils. A quieter moment at the sink.”; “Build your daily ritual”; “Daily Oil · A soft finish”; “01 / CLEANSE”; “02 / NOURISH”; “03 / PAUSE”.

**Typography and structure:** Tracked serif wordmark, roman/italic serif headline, serif body and navigation. Three separately clipped image layers plus a floating product window.

**Assets:** Source `public/assets/websites/06-serein-botanical-care.png`. Botanical crop `[0.365, 0.068, 0.164, 0.85]`, portrait crop `[0.53, 0.068, 0.47, 0.85]`, bottle crop `[0.243, 0.526, 0.172, 0.354]`. The product window covers the product fragment present inside the botanical crop, matching the source overlap. Product label remains photographic.

**Local interaction:** Three ritual steps change the short care description and selected state. Build your daily ritual opens a panel with step selection and local Add Daily Oil action. Bag count persists and can be emptied. Ingredient/approach links open relevant information.

**Theme:** Copy panel, navigation, bottom strip, text, and controls derive from semantic palette variables. Skin tone, botanical photography, and amber bottle keep natural source color.

**Verification/limits:** Source/layer bounds inspected; TypeScript strict check passed. Botanical and bottle windows overlap intentionally. The source has a pale-blue lower strip; the implementation uses a shared palette-derived strip so the knobs control it consistently.

## Image-layer preparation prompts

All three image edits used the **built-in ImageGen tool**; the selected input files were viewed first. Original imagery remains unchanged. Outputs are saved in `public/assets/website-layers/` and are consumed directly by the React examples.

### Avela clean photograph

Use case: precise-object-edit. Asset type: clean photographic background plate for a React fashion website. Input 1 is the edit target. Primary request: remove ALL overlaid website typography and UI marks from this image, including AVELA brand at top left, navigation across top, Bag (0), OBJECT 01 / THE ARC, both left middle headline lines and supporting line, all three color circles and all right side copy/link, and the huge SOFT FORM lettering across the bottom. Inpaint those areas with the exact naturally continuing photographic scene. Preserve the adult model, her pose/crop, face, linen jumpsuit, oxblood bag, clasp, terracotta wall, coast, sky, shadows, original composition, color, and aspect ratio. Do not redesign, add, reposition, or change anything else. The result must be a pure photograph with no lettering, no logo, no UI and no watermark.

### Oriel clean photograph

Use case: precise-object-edit. Asset type: clean photographic background plate for a React architecture website. Input 1 is the edit target. Primary request: remove ALL overlaid website typography and UI from this image, including tiny ORIEL SPATIAL PRACTICE at top left, Projects/Approach/menu square at top right, huge white oriel letters, the two headline lines and project label below the wordmark, the tiny project counter and progress lines at bottom left, and the ENTIRE rectangular white materials/card at bottom right. Inpaint all those areas with the exact naturally continuing architectural photograph. Preserve the rammed earth walls, giant oval doorway, skylight, leafy plants, oak meeting area, hanging lights, stone bench and bowl, sunlight/shadows, photographic detail, composition, colors, and aspect ratio. Do not redesign or reposition architectural elements. No text, logo, UI, card, or watermark remains. Pure photograph only.


### Sundrop clean photograph

Use case: precise-object-edit. Asset type: clean photographic plate for a React aperitif website. Input 1 is the edit target. Remove ONLY overlaid website UI and lettering: the top header brand and sun, navigation, basket count and icon; the large left headline A SLOWER SIP / A BRIGHTER / AFTERNOON; the left body paragraph; the burgundy button and its text; the What's inside link; the taste-profile row; the small bottom-left series index and line. Inpaint the blank left wall/table naturally so it continues the original photograph. Preserve the entire still life EXACTLY: the glowing amber spritz in ribbed stemmed glass, blood-orange slice, coral can, ALL PHYSICAL TEXT AND SUN LOGO PRINTED ON THE CAN, apricots, olive leaves, original soft shadows and sunlight, blush limestone texture, exact placement/framing, aspect ratio and colors. The printed SUNDROP/APRICOT APERITIF/200 ml/8% ALC/VOL product label on the can MUST remain. No website lettering or interface controls remain. No redesign, no new objects, no watermark.

## Browser verification

All six focused routes (`#REF-001` through `#REF-006`) were opened in the Codex browser and visually inspected as complete pages. The photographic layers render without duplicated interface text. Oversized Avela, Room & Ritual, and Oriel typography was refined after comparing browser output with the selected source images. Sundrop received a clean full-bleed plate after the initial cropped split produced a visible seam.

Verified live controls: Avela finish selection, product panel, add/empty bag; Rill & Rye loaf selection, reservation confirmation, change reservation; Room & Ritual scene cycling and local room choices; Oriel story chapters and material details; Sundrop pack selection and add/clear basket; Serein step selection and add/empty bag. Controls were returned to a neutral display after testing. The full application production build passed.


Latest proportion audit: photographic regions use a uniform SVG viewBox crop, avoiding independent horizontal/vertical stretching. Circular swatches and arrow buttons cannot flex-shrink. Rill & Rye includes its search icon and a working local bread-search/reservation flow.


# Interface reconstruction briefs — REF-007 to REF-018

These twelve studies were reconstructed after individually viewing all twelve selected PNGs and reading their matching generation prompts. React owns the layout, labels, buttons, forms, charts, selection state, and navigation. The supplied PNGs remain visual references; three screens reuse isolated decorative illustration regions, with no screenshot-sized click targets. All durable demo state is supplied through `AreaProps.state` and `onState`. The host scales the exact natural dimensions below and supplies semantic color tokens. No API keys, subscriptions, messages, payments, or external requests are required.

## Shared implementation prompt

Build one straightforward React example from the selected reference. Preserve its visual hierarchy, characteristic geometry, spacing, type contrast, copy, and illustration placement. Rebuild the actual interface with semantic HTML, CSS, small SVG icons, and native form controls. Use supplied transparent objects only as decoration. Bind interface surfaces, ink, muted copy, accent, secondary accent, and borders to the host's CSS tokens. Keep artwork's original color and material variation; never filter an entire interface screenshot. Every visible control must produce the described local behavior. Persist changes in host-owned state so opening a study and returning to the board preserve progress. Keep the board's separate inspection control independent of the example's own interactions.

## REF-007 — Sol weather card

- **Source:** `public/assets/ui-components/07-sol-weather-clean.png`; source prompt `../output/reference-remixes/warm-moodboard-handoff/prompts/ui-components/07-sol-weather-clean.txt`.
- **Natural size:** 400 × 420.
- **Reconstruction prompt:** Build one rounded weather card with a left-aligned city/date header, oversized satin orange sun contained behind a frosted lower panel, a large temperature with adjacent C/F controls, sunset detail, and four equal day tabs. Reuse `3d-objects/30-amber-sun.png` for the sun; keep all copy and controls native.
- **Interactions:** C/F performs a temperature conversion; day tabs update the date and temperature; the ellipsis opens a three-city picker. Use illustrative forecast values.
- **Visual checks:** Disc stays inside the card, lower glass follows both rounded corners, no labels overlap, all four dates fit. Browser-verified 29°C → 84°F on Friday.

## REF-008 — Gather team picker

- **Source:** `public/assets/ui-components/08-gather-team-clean.png`; matching `prompts/ui-components/08-gather-team-clean.txt` under the handoff directory above.
- **Natural size:** 400 × 485.
- **Reconstruction prompt:** Keep the connected dark trigger and dark cocoa panel. Build four generous rows with tactile rose, amber, moss, and burgundy spheres, collaborator name/role, and circular checked states. Use CSS material spheres with a light mineral grain overlay from `textures/24-mineral-impressions.png`.
- **Interactions:** Trigger opens/closes the list; each row toggles membership; trigger count and footer update together. Initial selection is Lena, Noah, and Amara.
- **Visual checks:** Trigger and panel share the dark treatment, avatars are circles, role copy is subdued, and the full footer remains inside the natural height. Browser-verified adding/removing Eli updates both counts.

## REF-009 — Courtyard material palette

- **Source:** `public/assets/ui-components/09-courtyard-palette-clean.png`; matching `prompts/ui-components/09-courtyard-palette-clean.txt`.
- **Natural size:** 460 × 180.
- **Reconstruction prompt:** Build a single horizontal porcelain tray with a spaced uppercase caption, five tactile material spheres, small captions, a selected ring, and an integrated shuffle action divided by a thin rule. Preserve Rose, Apricot, Citron, Moss, and Burgundy.
- **Interactions:** Swatches select a material; shuffle rotates the sequence and advances the active material. Announce selection with a hidden live label.
- **Visual checks:** All six control groups fit one row. Apricot is initially selected; the ring remains visible and captions remain separate. Browser-verified shuffle moves the order and active state.

## REF-010 — Roam membership panel

- **Source:** `public/assets/ui-components/10-roam-membership-clean.png`; matching `prompts/ui-components/10-roam-membership-clean.txt`.
- **Natural size:** 400 × 680.
- **Reconstruction prompt:** Keep the editorial serif title, three pill tabs, price hero with large cropped coral ribbon, and four feature cells. Populate the feature cells with transparent amber arc, moss sphere, citron fold, and rose discs (`3d-objects/25`–`28`); use the separate coral ribbon (`29`) in the hero. Every cell has a plain token-owned fill and native caption.
- **Interactions:** Weekender/Everyday/Worldwide change plan and price. Annual billing applies the displayed discounted monthly equivalent. Choose saves a local demo selection and displays the billing total; it does not purchase anything.
- **Visual checks:** Title is on one line, artwork stays inside its cells, billing switch, primary action, and billing caption all fit within 680px. Browser-verified Worldwide annual → $38.40/month equivalent, $460.80/year demo total (exact 20% discount).

## REF-011 — Kiln usage dashboard

- **Source:** `public/assets/ui-components/11-kiln-usage-clean.png`; matching `prompts/ui-components/11-kiln-usage-clean.txt`.
- **Natural size:** 460 × 410.
- **Reconstruction prompt:** Rebuild the entire compact credit dashboard: heading and period pills, 6,240/8,000 credit hierarchy, segmented meter, two-column category legend, daily bar chart, three resource meters, and footer action. Draw all charts with native elements and CSS.
- **Interactions:** Period pills update amounts, percent, average, remaining balance, and number of daily bars. Legend buttons isolate a category and can toggle it off. Daily bars select a point. Manage plan opens a reversible inline summary.
- **Visual checks:** Footer fully visible; resource bars do not collide; legend values align; chart points are individually accessible. Browser-verified Week changes to 1,623 credits and seven bars; plan details open/close.

## REF-012 — Folio navigation dock

- **Source:** `public/assets/ui-components/12-folio-navigation-dock.png`; matching `prompts/ui-components/12-folio-navigation-dock.txt`.
- **Natural size:** 460 × 180.
- **Reconstruction prompt:** Build an elongated ivory dock with four equally weighted items. Use a raised selected capsule, colored house accent, thin compass/bookmark/profile icons, labels, and small selection dot. Keep shadow shallow and corners generous.
- **Interactions:** Studio, Explore, Saved, and Profile update the active icon/capsule and a concise contextual line below the dock.
- **Visual checks:** All labels center below their icons and no item changes the dock width. Browser-verified Saved changes both selection and the contextual line.

## REF-013 — Home Note onboarding

- **Source:** `public/assets/mobile-screens/13-home-note-onboarding.png`; matching `prompts/mobile-screens/13-home-note-onboarding.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Preserve the layered tilted cards, household-symbol backing card, caregiver and child portraits, three household tasks, step markers, serif reassurance headline, and stacked actions. Rebuild cards, labels, icons, and all text natively. Use tightly bounded circular crops from the selected image only for the adult/child illustration.
- **Interactions:** Three working steps; final step names and creates a local home note. The invitation path validates a six-character demo code and joins the preview. Step dots and restart provide a reversible flow.
- **Visual checks:** Both portrait crops stay in their own card regions. The third-step name field and validation fit without clipping. Browser-verified all three steps and successful local named-note completion.

## REF-014 — Afterglow evening rhythm

- **Source:** `public/assets/mobile-screens/14-afterglow-bedtime.png`; matching `prompts/mobile-screens/14-afterglow-bedtime.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Build the luminous negative space with token-colored localized blooms, header/progress strokes, rounded humanist heading, central 10:45 pm time, tiny moon, translucent three-column picker, and bottom back/primary controls. Use native select controls inside the styled picker.
- **Interactions:** Hour, quarter-hour minute, and AM/PM update the large time. Set my evening stores the next occurrence of the selected time and shows a live remaining-time calculation. Adjust unlocks the picker; reset restores 10:45 pm.
- **Visual checks:** Time remains centered, neighboring values are subdued, and bottom actions are fully visible. Browser-verified 11:15 pm selection, persisted target/countdown, and reset.

## REF-015 — Pocket Garden early access

- **Source:** `public/assets/mobile-screens/15-pocket-garden-waitlist.png`; matching `prompts/mobile-screens/15-pocket-garden-waitlist.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Isolate the supplied gardener illustration above the native title and action area. Crop out the raster status bar and all raster copy; softly mask the artwork into the token-owned surface. Rebuild status bar, title, body, badge, button, secondary action, and home indicator.
- **Interactions:** Primary opens a native email form with local validation. Valid submission stores a demo confirmation only; no email is sent or subscription created. Plant notes opens three local checklist items; back restores the garden view.
- **Visual checks:** Only one status bar is present, illustration fades before native copy, and form/notes remain readable against a solid local surface. Browser-verified a valid local-only email flow.

## REF-016 — Petal botanical puzzle

- **Source:** `public/assets/mobile-screens/16-petal-puzzle.png`; matching `prompts/mobile-screens/16-petal-puzzle.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Preserve the editorial title, five staggered botanical strips, small grips, compact progress line, coral action, and understated restart link. Use five individually cropped illustration regions from the selected source inside five separate native strip controls. Keep the actual heading, progress, controls, and status native.
- **Interactions:** Tap, drag horizontally, or press an arrow key on a strip to align it. Hint aligns the next outstanding strip. Pause blocks moves and offers Resume. Completion changes the status/action; restart scrambles four strips.
- **Visual checks:** Exactly five strips, separate native grips, moving offsets, full primary/restart/help region visible. Browser-verified two hints take the initial 3/5 state to completion.

## REF-017 — Sol hourly forecast

- **Source:** `public/assets/mobile-screens/17-sol-forecast.png`; matching `prompts/mobile-screens/17-sol-forecast.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Keep a pale blue hero, SOL wordmark, city selector, oversized temperature, isolated orange sun/cream cloud, rounded lower data panel, six-point temperature chart, two metrics, golden-hour message, and three-item navigation. Use the transparent amber sun, a CSS cloud, and a native SVG chart.
- **Interactions:** Hourly points update the main temperature; city control cycles locations. Places selects a location. Settings changes C/F and golden-hour visibility. Message toggles a short golden-hour note. Values remain illustrative.
- **Visual checks:** Chart points follow the curve; hour labels are readable; golden-hour message ends above the navigation. Browser-verified hourly selection, unit conversion, and hiding/restoring golden-hour content.

## REF-018 — Daybook daylight planner

- **Source:** `public/assets/mobile-screens/18-daybook-daylight.png`; matching `prompts/mobile-screens/18-daybook-daylight.txt`.
- **Natural size:** 320 × 650.
- **Reconstruction prompt:** Keep uppercase monospaced utility copy, a generous italic serif title, thin sun arc, two evening schedule rows, outlined add action, and quiet bottom navigation. Rebuild the arc, hills, small village shapes, and horizon with lightweight SVG and token-owned colors.
- **Interactions:** Schedule rows toggle completion. Add opens a title/time form and appends a local 30-minute plan. The plan list scrolls when needed. Week selects a day and displays its status. Places updates the chosen city and returns to Today.
- **Visual checks:** Sun is clipped at the horizon, plans have comfortable targets, new rows scroll inside the list rather than pushing the bottom tabs. Browser-verified adding “Read on the balcony” at 20:15.

## Verification record

All twelve live studies were opened individually at their registered natural proportions in the integrated app. Layout issues found during review were corrected in Gather, Roam, Kiln, Home Note, Pocket Garden, Petal, and Sol forecast. Rechecked the corrected membership and dashboard bounds programmatically through visible DOM geometry: no controls extend beneath the card. The full project TypeScript check and production Vite build passed. These are intentional frontend demonstrations with illustrative content; they do not imply an external service connection.


# Texture and object image-to-React briefs

These 18 references were inspected individually. Preserve the selected pixels and alpha. Render textures and object artwork through the shared React `Specimen` component. Do not mistake a PNG render for mesh geometry: actual WebGL reconstruction belongs to REF-031–036. The native specimen view supports shared color adjustment and full-size inspection. Keep the artwork upright, preserve its aspect ratio, and omit scale and rotation controls. Filters apply only to these deliberate material/color studies, never to skin or website photography. The baseline is unchanged.

The compositions below are visual observations. Interactive behavior and theme associations are implementation choices. Original material parameters, exact cameras, and hidden geometry cannot be recovered from a single image.

| ID | Source and visual details | React instructions and verification |
|---|---|---|
| REF-019 | `textures/19-apricot-citron-light.png`. Portrait light field with broad overlapping folds, peach/coral at right, pale citron at left, and milky bright boundaries. Fine grain softens every transition. | Preserve the full portrait ratio. Use the raster as the accurate grain layer. Theme grading may change hue, saturation, and lightness. Keep the luminous edges soft; avoid replacing it with a generic two-stop gradient. |
| REF-020 | `textures/20-canyon-lines-craft.png`. Close-up hand and sharpened pencil above fine cream contour lines engraved/drawn over rough terracotta paper. Top-right pencil is the focal point; lines fill the lower two thirds. | Keep the hand and pencil together in the full image. This is a craft photograph, not a seamless texture map. Offer full-view inspection; never tile it onto a 3D object. |
| REF-021 | `textures/21-rosette-moss-grain.png`. Grainy soft diagonal swaths of rosette, blush, coral, burgundy, and moss/citron. Burgundy anchors upper-right and lower-left. | Preserve granular detail and diagonal balance. Grade moderately without flattening the dark and bright fields. Use as a color study, not as fabricated interface content. |
| REF-022 | `textures/22-courtyard-light-bokeh.png`. Golden blurred sunlight through foliage and a sheer fabric edge. Deep olive shadows left; white-gold light upper-right; coral glow lower-right. | Preserve portrait crop, bokeh, and source softness. No invented moving particles. Color knobs grade the study while maintaining highlight structure. |
| REF-023 | `textures/23-woven-light.png`. Translucent orange fabric sweeps diagonally across a bright warm field. Fine weave, overlapping folds, and a small pale-blue opening are visible. | Maintain diagonal sweep and fabric translucency in the raster. Do not assert physically simulated cloth. Full-view zoom exposes the weave. |
| REF-024 | `textures/24-mineral-impressions.png`. Pinkish clay relief with curved channels, aggregate chips, rough broken edges, and shadows that show depth. | Preserve the original aspect ratio and actual shadow direction. Use as a relief study; do not claim its image provides calibrated displacement. |
| REF-025 | `3d-objects/25-amber-arc.png`. Transparent-background thick amber U-shaped glass arch; rounded rectangular section; strong white studio reflections and darker refracted inner edges. | Contain the whole silhouette against the board; preserve alpha. Local artwork rotation is a 2D transform. Real refraction is baked into this PNG. |
| REF-026 | `3d-objects/26-moss-sphere.png`. Olive ceramic sphere with dense mineral flecks, pale pinholes, strong upper-left rectangular reflection, and a dark lower-right volume. | Preserve round outline, clean alpha, and gloss. Keep generous space around it. Theme grading changes color while the photographic lighting remains fixed. |
| REF-027 | `3d-objects/27-citron-fold.png`. Thin yellow/citron ribbon forms a wide open loop; raised curved center, turned tips, fine dry texture, and lit inner surface. | Use contain rather than cover. Do not crop the tips or thicken the shape. Treat as artwork; no hidden mesh is implied. |
| REF-028 | `3d-objects/28-rosette-discs.png`. One rose aggregate disc stands tilted atop another horizontal disc. Visible thickness, soft bevels, burgundy/cream inclusions, and contact shadow establish weight. | Preserve both discs and alpha. Avoid flattening the pale and deep aggregate colors under grading. Live material geometry is demonstrated separately in the WebGL studies. |
| REF-029 | `3d-objects/29-coral-ribbon.png`. Sculptural folded coral shell/ribbon with glossy cream inner surfaces, fine stipple, and repeated curling lips. | Maintain the full folded silhouette and clean cutout. Keep it loose in the board composition. Do not rotate it as if new 3D viewpoints were available. |
| REF-030 | `3d-objects/30-amber-sun.png`. Golden-orange round disc with soft translucent bands and a bright upper-right zone. | Preserve contained circular silhouette and luminous sweep. It may decorate the weather cards; those cards' type and controls remain DOM. |
| REF-037 | `textures/07-sienna-silk.png`. Square rust/sienna silk study, fine weave, a broad diagonal fold, and low-contrast sheen. | Add as the seventh texture without renumbering existing references. Preserve diagonal fold; use a single image rather than visibly tiled cloth. |
| REF-038 | `textures/08-moss-linen.png`. Square olive linen macro with visibly intersecting fibers, knots, and shallow ripples. | Preserve weave scale. Available as a creative color/bump source for the WebGL Linen finish; it is not a calibrated seamless PBR set. |
| REF-039 | `textures/09-peach-travertine.png`. Square pale peach stone with horizontally layered mineral bands and irregular pores. | Keep the fine holes and horizontal strata. Available as WebGL Stone finish; original image contains baked light. |
| REF-040 | `textures/10-honey-caustics.png`. Cream surface crossed by sharply branching warm light from an amber glass form at upper-right. | Preserve source highlights. Use as a still optical study, not as evidence of real-time ray-traced caustics. |
| REF-041 | `textures/11-coral-paper.png`. Square coral handmade paper with irregular dark fibers, flat warm tone, raised flecks, and subtle depressions. | Keep fibers visible during grading. Preserve its square format; useful for color/material comparison, not UI background everywhere. |
| REF-042 | `textures/12-cream-glaze.png`. Square cream ceramic glaze with hairline golden cracks, small pits, and a glossy upper-right reflection. | Use the natural glazed surface as a study and as the optional WebGL Glaze color/bump reference. Do not call its single light-bearing image a full PBR scan. |

Paths in this table are relative to `warm/moodboard/public/assets/`. Inside the portable image ZIP the texture folder is named `images/texture-studies/`; preserve that archive convention. The application copies those same files to `public/assets/textures/`.


# Material studies — image to React brief

## Intent

Build six warm geometric studies as one reusable React + Three.js area, on the off-white moodboard. Preserve each selected composition as a source image while its board tile is idle. Hovering or focusing the tile mounts a real interactive WebGL scene containing a cube, square pyramid, and sphere. The focused study uses the same geometry and adds material controls. This is an interpretation of the image, not an image presented as a 3D model. The source PNGs remain intact.

## Selected imagery and composition

All six supplied images were inspected at full view before implementation.

| ID | Selected source in `public/assets/geometric-studies` | Arrangement and material cues |
|---|---|---|
| REF-031 | `01-apricot-balance.png` | Large apricot cube at left; smaller cream pyramid on top; terracotta sphere on the floor at right. Subtle, dense pores and a quiet ceramic finish. |
| REF-032 | `02-citron-courtyard.png` | Moss sphere on a small cream stone cube at left; larger citron pyramid beside it. Porous stone and slightly glossy moss. |
| REF-033 | `03-rosette-tilt.png` | Cream sphere atop a rose aggregate cube at back right; terracotta pyramid at front left. Large aggregate reads against finer ceramic texture. |
| REF-034 | `04-honey-translucence.png` | Clay pyramid on cream aggregate cube at back right; amber translucent sphere at front left. Glass uses physical transmission, thickness, refraction, and environment reflections. |
| REF-035 | `05-clay-triad.png` | Large pale clay cube at back; terracotta pyramid front left; smaller peach sphere front right. Aggregate is shared across all three surfaces. |
| REF-036 | `06-quiet-monument.png` | Rose aggregate cube left, a small citron pyramid on top, and a large moss sphere right. Warm side light and low, grounding shadows. |

## Supporting material references

All twelve files in `public/assets/textures` were visually inspected. `09-peach-travertine.png`, `12-cream-glaze.png`, and `08-moss-linen.png` are loaded as real image color maps with separately configured non-color bump maps when Stone, Glaze, or Linen is selected. These are creative material studies from photographic references, not scanned calibrated PBR texture sets; baked lighting and seams can remain visible.

`07-sienna-silk.png`, `10-honey-caustics.png`, `11-coral-paper.png`, `19-apricot-citron-light.png`, `20-canyon-lines-craft.png`, `21-rosette-moss-grain.png`, `22-courtyard-light-bokeh.png`, `23-woven-light.png`, and `24-mineral-impressions.png` inform warmth, light, material grain, and tactile detail. They are not indiscriminately projected as full photographs onto the geometry. The original finish uses neutral, seeded procedural pore and aggregate maps so all three global color knobs can affect actual PBR material colors. Amber glass does not claim ray-traced caustics; it uses the physically based transmission available in Three.js.

## Structured implementation prompt

Create a 660 × 660 natural-size material study surface, inheriting its container size. Use a warm seamless floor and backdrop. Light from high left with a soft environmental fill. Use a gently beveled cube, a four-sided pyramid, and a smooth sphere, with visible pores and aggregate detail. Match the arrangement table above. Keep the board surface purely visual: an upright square canvas with no miniature titles or controls. In the focused view only, show a small serif study title at the upper left, live 3D status at upper right, and compact material/camera controls along the lower edge. Use uniform scaling for the sphere, and update camera aspect from actual canvas dimensions so spheres remain round.

The focused React view must render actual mesh geometry with Three.js. Use mesh physical materials with roughness, bump maps, clearcoat, and transmission where appropriate. Preserve the source image as the idle board thumbnail. Mount a renderer when the board tile receives pointer hover or keyboard focus, and dispose it when the tile becomes idle. The board canvas supports direct orbit; wheel events continue to scroll the page. Opening the study gives the full focused renderer with camera and finish controls.

Support pointer and touch orbit, wheel or pinch zoom, keyboard arrow orbit, plus/minus zoom, R to reset, and visible zoom/reset buttons. Expose four material options: Original, Stone, Glaze, and Linen. Persist selected material, camera orbit, distance, and optional rotation through the supplied `state` / `onState` interface. The shared hue, warmth, and depth sliders update rendered material color, lighting, and exposure in place. Rotation is opt-in and pauses when the document is hidden; reduced-motion preferences disable automatic rotation. Dispose GPU resources and observers on close.

## Integration contract

- Component: default export `MaterialScene` from `src/areas/MaterialScene.tsx`.
- Input: the shared `AreaProps`; IDs REF-031 through REF-036 select the six studies.
- The parent card mounts `MaterialScene` for hover/focus activity and unmounts it when idle. `focused=false` renders only the interactive canvas; `focused=true` adds the study heading and material/camera controls.
- State keys: `material`, `orbitTheta`, `orbitPhi`, `orbitDistance`, `autoRotate`.
- Shared colors: `src/material-palettes.ts` exports the source mesh tuples and `materialBaseColors(id, knobs, finish)`. Both the meshes and the direction palette consume its exact cube, pyramid, sphere, backdrop, and optional amber attenuation colors. The header labels these as base colors because lighting, roughness, transmission, and image maps affect displayed pixels. Three.js remains lazily loaded; the palette helper has no Three dependency.
- The interactive area uses one canvas and one WebGL renderer. `ResizeObserver` handles the scene dimensions. Rendering is on demand unless the user turns on rotation.
- A WebGL failure preserves the selected image, explains that it is a reference fallback, and offers retry. Texture load failures retain the interactive geometry and show a precise message.

## Technical references researched

- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html): physical transmission, clearcoat, sheen, and environment maps.
- [Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html): pointer orbit, zoom, constraints, update, and disposal.
- [Three.js Texture](https://threejs.org/docs/pages/Texture.html): color-space handling, bump data, wrapping, anisotropy, and explicit GPU disposal.

## Verification

The integration production build passes. Browser review covered all six arrangements: REF-031–034 as live board tiles and REF-035–036 as focused scenes. All three forms are present and upright. The active board canvas measured 377 × 377 CSS pixels with no internal control buttons; the focused canvas measured 720 × 720 with an equally proportioned drawing buffer. Keyboard orbit visibly changes the geometry, and Reset restores the camera. Moving between board tiles disposes the previous canvas and mounts only the active scene.

Stone, Glaze, and Linen were each selected and visually checked on the live Honey scene: travertine, cracked ceramic, and woven texture maps loaded successfully. Changing Hue from 0 to 30 changed mesh/backdrop colors and the direction palette together; values were returned to baseline afterward. No material-scene warnings or errors were logged during those checks. Reduced-motion handling, context-loss fallback, and narrow-screen controls are implemented but were not independently forced in this pass.

Visual fidelity remains an interactive reconstruction of the selected stills; the images are not mesh assets, and no photogrammetry or physically accurate caustic reconstruction is claimed.

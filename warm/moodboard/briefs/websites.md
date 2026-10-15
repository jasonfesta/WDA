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

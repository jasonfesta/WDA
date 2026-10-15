# Warm Theme Explorer — Reusable Build Brief

**Status:** Requirements captured; awaiting the complete inspiration collection. Implementation has not started.

**Source:** [Original prompt and follow-up instructions](./warm-moodboard-original-prompt.md).

**Working title:** Warm Theme Explorer. Replace this with the user's exact title when supplied.

**Current layout direction:** A persistent control bar above a workspace that switches between the moodboard and a focused example. This is the preferred interpretation of the latest follow-up; the earlier requirement to place isolation below the board is superseded. Horizontal and vertical moodboard arrangements are required. Separate page routing remains optional.

## 1. Purpose

Build a full-width, interactive React moodboard that demonstrates **10 distinct warm color theme code examples**. The experience should help someone explore the visual possibilities behind the prompt:

> Build me a warm landing page.

The source also describes this as “Build with me a warm landing page.” Preserve the exact wording the user ultimately selects for visible copy.

The central design problem is excessive convergence on beige. Show how warmth can come from a diverse combination of color, typography, photography, gradients, and composition. Beige, off-white, autumn colors, and light browns belong in the palette, but the collection must demonstrate a broader range of warm identities.

## 2. Rule language and decision status

- **MUST** identifies a required outcome from the user's request.
- **SHOULD** identifies an expanded recommendation that supports the request.
- **MAY** identifies an optional enhancement.
- User-supplied titles, copy, references, and later instructions take precedence over provisional choices in this brief.
- Sections labeled **proposed** describe recommendations to revisit after the reference collection is complete.

## 3. Build gate and reference intake

### Required sequence

1. **MUST** save both the original source prompt and this structured brief before implementation.
2. **MUST** accept inspiration incrementally: images, websites, layouts, components, fonts, copy, and other examples.
3. **MUST** wait until the user explicitly indicates that the inspiration collection is complete before starting the React build.
4. **MUST** append supplied references after the prompt text in both the original source document and this brief. Use matching IDs and preserve the source and the user's explanation of what matters about each one.
5. **MUST** turn each reference into an independently usable React example appropriate to its form: a component, website composition, landing page, or visual specimen. Then attach it to the shared explorer and theme state, subject to later user direction.
6. **SHOULD** update this brief as requirements become more specific, keeping the original source intact.

During collection, documentation and analysis of supplied references are appropriate. The ten final theme identities, fonts, compositions, and implementation choices remain open until the collection is complete.

### Proposed reference record

Use one record per inspiration:

| Field | What to record |
| --- | --- |
| Reference ID | Stable identifier for linking the reference to its implementation |
| Source | URL, local file, or supplied image |
| Category | Landing page, homepage tout, button, component, card, mobile UI, swatch, photography, gradient, headline, or font |
| User direction | Exact details the user asks to preserve or explore |
| Visual qualities | Relevant composition, color relationships, type, spacing, imagery, and material qualities |
| Interaction | Observable hover, press, toggle, tab, selection, or motion behavior |
| Moodboard contribution | The object, composition, or visual treatment this reference informs |
| Standalone React form | Component, website composition, landing page, mobile screen, or visual specimen |
| Theme role | Candidate base, surface, accent, text, or photographic palette |
| Shared integration | Theme token bindings, knob response, moodboard entry, and focused-view selection |
| Progress | Collected, analyzed, implemented independently, or integrated; code stages begin only after the collection gate |
| Open details | Information still needed; distinguish observation from inference |

### Reference-to-React contract

After the user finishes supplying inspiration, apply this sequence to each reference:

1. Identify what the reference should become and which qualities must carry through.
2. Build its own working React component or page composition with appropriate local interactions.
3. Make the example render independently, including its own background and layout needs.
4. Bind its theme-owned colors to the shared palette and global control values.
5. Register it in the moodboard and focused view with a stable ID and source mapping.
6. Verify that it works alone and as part of the shared explorer.

The reference is the starting point for a coded example. Photography and other image assets may remain images inside React compositions. A full interface reference should become interactive React UI. Keep each example's local interaction state distinct from shared color and navigation state.

## 4. Required deliverable

- **MUST** provide one full-width React explorer containing ten distinct warm theme code examples.
- **MUST** provide global controls, horizontal and vertical moodboard arrangements, and a standalone focused view for every object.
- **MUST** include a large floating headline within the moodboard that communicates the overall brief, with a soft orange-to-white or soft orange-to-beige gradient applied to the text.
- **SHOULD** use one page with a persistent top control bar and a main workspace that switches between the moodboard and the selected example.
- **MUST** use working React components for the interface examples.
- **MUST** connect the global color controls to both the moodboard and the isolated detail view.
- **MUST** keep the documentation reusable so the experience can be regenerated from the same rules and references.
- **SHOULD** use shared explorer infrastructure and reusable components while preserving the identity of each example.

The number ten refers to distinct warm theme examples. The moodboard may contain more than ten individual objects to represent all of the requested categories. Final packaging and the distribution of objects across themes should follow the supplied inspiration.

## 5. Page structure

### Persistent top controls and swatches

- **MUST** place tactile, knob-style controls above the active workspace.
- **MUST** provide controls for adjusting hue, warmth, and lightness/darkness.
- **MUST** include a horizontal/vertical layout toggle alongside the knobs.
- **MUST** include live swatches that communicate the active palette and its color ranges.
- **MUST** apply color changes immediately across all themed layouts and objects, including the currently isolated item.
- **MUST** keep the controls visible at the top and usable while browsing, scrolling, or inspecting an individual example.
- **SHOULD** use a sticky or fixed control surface with enough content clearance to avoid covering the examples.
- **SHOULD** label controls and show their current values so adjustments are understandable and repeatable.

### Workspace mode A — Moodboard overview

- **MUST** span the available page width.
- **MUST** provide horizontal and vertical arrangements of the same objects, selected through the top controls.
- **MUST** preserve a scattered, visually interesting composition in both arrangements.
- **MUST** mix object scales and aspect ratios to convey the complete feel of a theme.
- **MUST** make each displayed object individually selectable for its own focused view.
- **MUST** retain usable hover, tap, and component interactions within the arrangement.
- **MUST** allow scrolling as needed to browse all examples.
- **MUST** preserve the active palette and component states when switching orientation.
- **SHOULD** use intentional spacing and layering so the composition feels curated and remains legible.
- **SHOULD** adapt the arrangement to narrower screens while preserving access to every object.

**Proposed orientation behavior:** The horizontal view spreads the composition broadly across the available width. The vertical view rearranges it into a downward browsing flow with varied sizes and spacing. Orientation changes the arrangement, not the identity or functionality of the examples. Horizontal overflow is optional; vertical scrolling is available wherever the content needs it.

### Large floating headline

- **MUST** include a prominent, oversized headline as part of the moodboard composition, with open space around it so it feels like floating typography among the examples.
- **MUST** use headline copy that reflects the original request and the goal of exploring diverse warm themes.
- **SHOULD** use **“Build me a warm landing page.”** as the working headline, taken directly from the original request. Replace it if the user supplies different exact titling.
- **MAY** include a short supporting brief. Proposed copy: “Explore ten distinct warm themes through interactive React examples.”
- **MUST** apply the gradient to the headline letterforms, transitioning from **soft orange to white** or **soft orange to beige**.
- **MUST** leave exact color values and the final gradient treatment open until the user's forthcoming color direction is supplied.
- **MUST** connect the headline's gradient colors to the shared theme state so the knobs affect this object too.
- **MUST** render the headline as live text in its own React component and make it available through the same focused-view selection as the other moodboard objects.
- **SHOULD** use the minimal sans-serif direction established for the explorer, with responsive scale and line breaks suited to both moodboard orientations.
- **SHOULD** preserve legibility across the entire gradient, including its pale end, without obstructing neighboring examples or controls.

“Text area” refers to prominent display typography. “Floating” describes the headline's visual placement within the moodboard; animation remains optional under the existing restrained-motion rules. This requirement belongs in both the casual source addendum and the structured brief.

### Workspace mode B — Focused example

- **MUST** display the selected object on its own background, with the global knobs still visible above it.
- **MUST** replace the current isolated object when another moodboard object is selected.
- **MUST** show the complete selected object at a useful, readable scale appropriate to its type.
- **MUST** retain the selected object's working interactions.
- **MUST** continue responding to the global knobs while visible.
- **SHOULD** replace the overview within the same workspace when an example is opened, making it feel like a dedicated page.
- **SHOULD** provide an obvious return-to-moodboard action that restores the previous orientation, scroll position, and component states.
- **SHOULD** clearly identify the selected object and its theme.
- **MUST** preserve global control values when entering focus, changing the selected object, or returning to the board.
- **SHOULD** use an off-white background by default, while allowing reference-led backgrounds appropriate to individual examples.
- **MAY** provide dedicated URLs for focused examples if useful; they must retain the same controls and shared theme behavior.

For a landing page, isolation should reveal the full composition and allow scrolling through it. For a button, card, swatch group, or headline, isolation should give that smaller object suitable space without stretching it into a page layout. The preferred one-page approach avoids requiring a scroll past the entire moodboard to reach the selected example; it does not prohibit scrolling through long content.

### Interface style and typography

- **MUST** keep the explorer interface very minimal, with a clean sans-serif font and restrained controls.
- **SHOULD** use compact labels, generous whitespace, and simple selected states to keep attention on the examples.
- **SHOULD** evaluate Google Sans, IBM Plex Sans, or Roboto Flex as candidate interpretations of the user's font direction. The final family is not yet selected.
- **SHOULD** distinguish the explorer's consistent interface typography from the reference-led typography inside individual examples.

## 6. Content coverage

The overall collection **MUST** cover the following categories. Their exact content and visual direction will be driven by the forthcoming references.

| Category | Expected representation |
| --- | --- |
| Landing pages | Complete, coded landing page compositions with meaningful interactive controls |
| Homepage touts and tiles | Promotional or editorial modules with clear hierarchy and actionable elements |
| Buttons | Distinct visual treatments and working hover, focus, and press behavior |
| Components | Functional controls such as tabs, toggles, switches, or selectors where appropriate |
| Cards | Standalone content, product, or other reference-led card compositions |
| Mobile cards | Compact compositions designed for mobile proportions |
| Mobile applications | Mobile screen compositions with usable example interactions |
| Color swatches | Live representations of the active theme palette and its color ranges |
| Visual photography | Reference-led imagery integrated into the theme and its compositions |
| Visual gradients | Color fields that respond to the global palette; motion where useful |
| Headlines | A large floating headline expressing the overall brief, with soft orange-to-white or soft orange-to-beige gradient text, plus reference-led headline specimens |
| Fonts | Reference-led type choices that contribute to each example's identity |

Not every individual theme needs every category. The collection as a whole must demonstrate the requested range.

## 7. Warmth and theme diversity

- **MUST** deliver ten perceptibly distinct warm theme examples.
- **MUST** avoid making beige the dominant answer across the entire collection.
- **MUST** preserve a warm overall character while exploring different dominant colors, accents, surface depths, and contrasts.
- **MUST** treat color as a relationship among backgrounds, surfaces, typography, accents, imagery, and gradients.
- **MUST** preserve the distinct identity of each example when shared knobs are adjusted.
- **SHOULD** compare the themes side by side during review to confirm that their differences remain apparent.
- **SHOULD** maintain readable text and recognizable interactive states throughout the useful control range.

### Proposed palette exploration

Possible directions include clay and terracotta, amber and honey, rust and autumn red, saffron and ochre, warm rose, cocoa and caramel, olive paired with warm accents, and deep brown with cream. These are exploration territories, not final theme names or an approved list of ten themes.

Warm beige, off-white, and light brown can serve as foundations, supporting tones, or dominant colors in selected examples. Their role should vary across the collection.

## 8. Global color behavior

### Required behavior

- **MUST** derive theme-owned colors from a shared, controllable color system.
- **MUST** propagate knob changes to backgrounds, surfaces, text, buttons, borders, cards, accents, gradients, and relevant interaction states.
- **MUST** include the floating headline's text gradient in the shared color updates; its authored baseline follows the forthcoming orange-to-white or orange-to-beige color direction.
- **MUST** keep the swatch area synchronized with the rendered examples.
- **MUST** show color ranges as swatches so the tonal progression of the active palette can be inspected.
- **MUST** apply the same active color settings to an object in the moodboard and in isolation.
- **SHOULD** preserve each theme's color relationships through controlled transformations or interpolation.
- **SHOULD** keep text, surface, and accent roles distinct as warmth or darkness changes.
- **SHOULD** keep each focused background appropriate to its example and responsive to the theme where relevant; off-white remains the default viewing canvas.
- **SHOULD** display compact light-to-dark swatch sequences for relevant color families, using the same derived values as the examples.

### Proposed control set

| Control | Intended effect | Status |
| --- | --- | --- |
| Layout toggle | Switch the moodboard between horizontal and vertical arrangements | Required; segmented toggle suggested |
| Hue | Adjust the palette's hue relationships within its intended warm theme direction | Required; range provisional |
| Warmth | Adjust the warmth of each theme while preserving its identity | Required |
| Depth | Move the palette between lighter and darker expressions | Required; label provisional |
| Chroma | Adjust the richness or restraint of the colors | Recommended |
| Contrast | Adjust the separation between surfaces, text, and accents within usable limits | Recommended |
| Reset | Restore the selected theme's authored baseline | Recommended |

The live swatch ranges sit alongside these controls. Keep the primary control bar minimal; recommended controls may be grouped into a compact secondary area. Additional controls should earn their place by making the color exploration easier to understand. Control count and ranges should be finalized after reviewing the references.

### Proposed token structure

Use semantic color roles such as:

`canvas`, `background`, `surface`, `surfaceRaised`, `text`, `textMuted`, `border`, `accent`, `accentAlt`, `onAccent`, and `gradientStops`.

Include hover, pressed, selected, and focus colors where needed. Keep the underlying palette values reusable as plain data so the same color definitions can support React Native styles. The requested deliverable is a React page; a separate native application is not specified.

Photography should participate through surrounding surfaces, overlays, and carefully chosen imagery. Live image color grading may be added when it serves the reference; whether the knobs should alter the photographs themselves remains a design choice to resolve from the supplied examples.

## 9. Selection and component interaction

- **MUST** make each moodboard object's isolated view reachable with a clear selection action.
- **MUST** let tabs switch their content, switches change their state, and other interactive controls perform meaningful visible actions appropriate to the example.
- **MUST** ensure selecting an object does not prevent using the controls inside it.
- **MUST** keep isolated examples interactive as well.
- **MUST** keep global theme settings shared across horizontal browsing, vertical browsing, and focused examples.
- **SHOULD** provide a distinct selection target, such as an object label or inspect action, when the object contains its own controls.
- **SHOULD** reuse the same underlying React component for miniature and isolated presentations.
- **SHOULD** preserve relevant local component state when moving between the two presentations.
- **SHOULD** expose visible selected, hover, focus, and pressed states as appropriate.
- **SHOULD** support keyboard and touch input for knobs and selection, with accessible labels and equivalent control behavior.

The interaction model should make it easy to do two things: explore the example itself and inspect it in the larger view.

## 10. Motion and atmosphere

- **MUST** prioritize structure, color, and usability over animation.
- **SHOULD** make the page feel alive through restrained hover feedback, smooth palette updates, and subtle entrance or selection transitions.
- **MAY** use gently animated gradients or shaders where they add value to the visual example.
- **SHOULD** avoid continuous movement that makes the arrangement difficult to inspect or interact with.
- **SHOULD** respect reduced-motion preferences and provide static equivalents for animated treatments.

Shader use is optional. The essential outcome is an engaging, responsive moodboard whose objects remain easy to study.

## 11. Proposed implementation organization

After the inspiration collection is complete:

1. Define the ten theme directions and their source references.
2. Create a theme registry with authored color values, semantic roles, and knob defaults.
3. Implement each reference as its own independently usable React component or page composition, then create an object registry with stable IDs, categories, theme associations, reference links, and React renderers.
4. Bind each example to shared color state and transformations that drive the controls, swatch ranges, moodboard, and focused view.
5. Compose horizontal and vertical arrangements of the full-width moodboard from the registered objects.
6. Implement selection, the focused workspace, and return-to-board behavior using the same component definitions and persistent top controls.
7. Add component behaviors, responsive arrangements, and restrained motion.
8. Verify the resulting experience against the acceptance checklist and update the documentation.

These are organizational recommendations. Select frameworks, packages, rendering techniques, and file structure to fit the actual workspace and the collected references.

## 12. Acceptance checklist

### Collection and documentation

- [ ] The user has explicitly finished supplying inspiration before implementation begins.
- [ ] The original prompt is preserved in its own Markdown source file.
- [ ] The structured brief reflects subsequent user direction.
- [ ] Each supplied inspiration is appended after the prompt text in both documents with a matching reference ID.
- [ ] Each reference has a traceable, independently usable React implementation attached to the shared explorer, or an explicitly recorded disposition from the user.
- [ ] Exact titles and copy supplied by the user are used in the appropriate places.

### Structure and visual range

- [ ] The page uses the full available width.
- [ ] A minimal control bar and live swatch ranges remain above the active workspace.
- [ ] The layout toggle provides horizontal and vertical arrangements of the same moodboard objects.
- [ ] A large floating headline expresses the original brief and fits both moodboard orientations.
- [ ] The headline uses live text with a soft orange-to-white or soft orange-to-beige gradient; exact colors follow the user's supplied palette direction.
- [ ] Each focused example appears on its own background with the global knobs still visible.
- [ ] The preferred same-page focus view opens without requiring a scroll past the moodboard.
- [ ] The explorer uses clean sans-serif typography while individual examples retain their reference-led identity.
- [ ] The collection contains ten distinct warm theme code examples.
- [ ] The collection covers all requested object categories.
- [ ] The themes demonstrate visible diversity beyond beige.

### Behavior

- [ ] Hue, warmth, and darkness adjustments update every theme-driven example and the live swatch ranges.
- [ ] The floating headline's gradient responds to the knobs, remains readable, and can be inspected in the focused view.
- [ ] Controls remain accessible while viewing the isolated object.
- [ ] Switching orientation preserves palette values and component states.
- [ ] Every moodboard object can be selected and shown in isolation.
- [ ] Selecting a new object replaces the previous isolated content and preserves the active color settings.
- [ ] Returning to the board preserves the palette and restores the previous browsing context.
- [ ] Buttons and other controls perform meaningful example interactions.
- [ ] Component interactions and object selection both work without interfering with each other.
- [ ] Desktop and narrower layouts remain usable.
- [ ] Text and interactive states remain readable across the intended control range.
- [ ] Any motion stays subtle and supports reduced-motion preferences.

## 13. Reuse instructions

Use this file as the build prompt together with the collected reference records and supplied assets. Preserve the source prompt as historical context. Update the structured brief with resolved theme names, exact copy, reference mappings, and implementation instructions as the project develops.

### Repository handoff

- **MUST** use the new repository named **WDA** for this handoff.
- **MUST** keep the repository contents to these three files:
  - `warm-moodboard-original-prompt.md`
  - `warm-moodboard-build-brief.md`
  - `warm-moodboard-images.zip`
- **MUST** package the generated image set from the other chat into the single ZIP and index those images in both prompts.
- Extract the ZIP beside the Markdown files to create the `images/` folders referenced in the index below.
- Each image is a source for its own React example under the reference-to-React contract in Section 3. The existing build gate still applies.

**Current next step:** Receive and document the user's inspiration, one item at a time. Wait for their explicit completion signal before building.

## 14. Reference log — append incoming inspiration below

Append each new reference here and at the end of the source prompt. Use matching IDs such as `REF-001`, preserve the source and user notes, and fill in the reference record from Section 3. Record its intended standalone React form and connection to shared state before implementation. Update its progress as it is later built independently and integrated into the explorer.

### Generated imagery from the parallel chat

[Download the image ZIP](./warm-moodboard-images.zip). The archive contains 36 PNG files: six websites, six UI components, six mobile screens, six texture studies, six individual 3D objects, and six geometric arrangements. Files preserve their original pixels and transparency. The first 30 come from the current review set; the final six are the geometric studies.

The paths below are relative to the repository after extracting the ZIP. Each image becomes the indicated standalone React example, then connects to the shared theme state, knobs, swatches, orientation modes, and focused view. Reference IDs match between the two prompt documents.

| Reference ID | Image | React form | Extracted path |
| --- | --- | --- | --- |
| REF-001 | Avela — The Arc bag | Landing page / website | `images/websites/01-avela-arc-bag.png` |
| REF-002 | Rill & Rye — Orchard bakery | Landing page / website | `images/websites/02-rill-and-rye-bakery.png` |
| REF-003 | Room & Ritual — The courtyard house | Landing page / website | `images/websites/03-room-and-ritual-interiors.png` |
| REF-004 | Oriel — Spaces for gathering | Landing page / website | `images/websites/04-oriel-spatial-practice.png` |
| REF-005 | Sundrop — Apricot aperitif | Landing page / website | `images/websites/05-sundrop-aperitif.png` |
| REF-006 | Serein — Daily botanical care | Landing page / website | `images/websites/06-serein-botanical-care.png` |
| REF-007 | Sol — Weather card | Interactive component | `images/ui-components/07-sol-weather-clean.png` |
| REF-008 | Gather — Team picker | Interactive component | `images/ui-components/08-gather-team-clean.png` |
| REF-009 | Courtyard — Material palette picker | Interactive component | `images/ui-components/09-courtyard-palette-clean.png` |
| REF-010 | Roam — Membership panel | Interactive component | `images/ui-components/10-roam-membership-clean.png` |
| REF-011 | Kiln — Usage dashboard | Interactive component | `images/ui-components/11-kiln-usage-clean.png` |
| REF-012 | Folio — Navigation dock | Interactive component | `images/ui-components/12-folio-navigation-dock.png` |
| REF-013 | Home Note — Family handover | Mobile screen component | `images/mobile-screens/13-home-note-onboarding.png` |
| REF-014 | Afterglow — Evening rhythm | Mobile screen component | `images/mobile-screens/14-afterglow-bedtime.png` |
| REF-015 | Pocket Garden — Early access | Mobile screen component | `images/mobile-screens/15-pocket-garden-waitlist.png` |
| REF-016 | Petal — Botanical puzzle | Mobile screen component | `images/mobile-screens/16-petal-puzzle.png` |
| REF-017 | Sol — Hourly forecast | Mobile screen component | `images/mobile-screens/17-sol-forecast.png` |
| REF-018 | Daybook — Daylight planner | Mobile screen component | `images/mobile-screens/18-daybook-daylight.png` |
| REF-019 | Apricot and citron — Soft light field | Texture / gradient specimen | `images/texture-studies/19-apricot-citron-light.png` |
| REF-020 | Canyon lines — Handcrafted surface | Texture / gradient specimen | `images/texture-studies/20-canyon-lines-craft.png` |
| REF-021 | Rosette and moss — Grain field | Texture / gradient specimen | `images/texture-studies/21-rosette-moss-grain.png` |
| REF-022 | Courtyard light — Optical texture | Texture / gradient specimen | `images/texture-studies/22-courtyard-light-bokeh.png` |
| REF-023 | Woven light — Translucent fabric | Texture / gradient specimen | `images/texture-studies/23-woven-light.png` |
| REF-024 | Mineral impressions — Clay relief | Texture / gradient specimen | `images/texture-studies/24-mineral-impressions.png` |
| REF-025 | Amber arc | 3D visual specimen | `images/3d-objects/25-amber-arc.png` |
| REF-026 | Moss glazed sphere | 3D visual specimen | `images/3d-objects/26-moss-sphere.png` |
| REF-027 | Citron folded ribbon | 3D visual specimen | `images/3d-objects/27-citron-fold.png` |
| REF-028 | Rosette ceramic discs | 3D visual specimen | `images/3d-objects/28-rosette-discs.png` |
| REF-029 | Coral translucent ribbon | 3D visual specimen | `images/3d-objects/29-coral-ribbon.png` |
| REF-030 | Amber sun disc | 3D visual specimen | `images/3d-objects/30-amber-sun.png` |
| REF-031 | Apricot balance | Geometric 3D specimen | `images/geometric-studies/01-apricot-balance.png` |
| REF-032 | Citron courtyard | Geometric 3D specimen | `images/geometric-studies/02-citron-courtyard.png` |
| REF-033 | Rosette tilt | Geometric 3D specimen | `images/geometric-studies/03-rosette-tilt.png` |
| REF-034 | Honey translucence | Geometric 3D specimen | `images/geometric-studies/04-honey-translucence.png` |
| REF-035 | Clay triad | Geometric 3D specimen | `images/geometric-studies/05-clay-triad.png` |
| REF-036 | Quiet monument | Geometric 3D specimen | `images/geometric-studies/06-quiet-monument.png` |

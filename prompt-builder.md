# Prompt Builder — Jetski

## Purpose and scope

Jetski, build a researched, project-specific prompt package for expanding WDA's selected website, mobile application, and component images into complete designs. The image model for the downstream generation work is **Nano Banana 2**, using its documented **1K output setting**.

This is the master instruction for prompt building. It is not a set of finished image-generation prompts. You are responsible for inspecting the images, researching the appropriate product and layout patterns, deciding the missing content and interactions, and writing the individual generation prompts. Nano Banana 2 execution belongs to your downstream workflow, after the prompt package is complete. Keep that execution separate from this prompt-building stage; do not skip directly to rendering images or implementing React.

The person preparing this file is only authoring these instructions. No per-concept research, individual generation prompts, image generation, or application implementation is being performed by writing this file.

The eventual result is five completed images per distinct website, mobile app, or component, with enough information to rebuild the designs as working React interfaces. Preserve the selected concept's identity and art direction while extending and finishing it. Five images means five related pages, screens, or states—not five arbitrary restyles of the same screenshot.

## 1. Read the project before making decisions

Read these sources in this order:

1. This file, which defines the current expansion task.
2. [Image inventory](images/manifest.json) and the category manifests under `images/`.
3. [Original image prompt](original-image-prompt.md).
4. [Structured build brief](warm-moodboard-build-brief.md), including its reference-specific website, UI, and mobile briefs.
5. [Original project request and history](warm-moodboard-original-prompt.md).
6. Existing briefs and implementation under `warm/moodboard/`, where useful for understanding already established behavior. Treat proposed and implemented behavior separately from what is visible in the source image.

Inspect every selected image individually at readable size. Do not rely only on folder names, thumbnails, or a contact sheet. Record the exact source path and original reference ID. Use the current files under `images/`; older documents refer to archive paths such as `images/websites/`, `images/ui-components/`, and `images/mobile-screens/`. Those map to the current `images/website/`, `images/components/`, and `images/mobile/` folders respectively.

Older instructions describe a compact moodboard and hero-sized examples. Preserve their art direction and product context, but replace their limited scope with this task's complete pages, application tabs, and component states. Instructions to omit the moodboard's footer do not apply to the expanded websites: every website page must have a complete footer. Do not put the moodboard's global theme controls or headline into each fictional product.

## 2. Establish the canonical inventory

Use the following selected concepts as the starting inventory. These identity notes summarize the existing brief; verify them against the actual files before writing prompts.

| Reference | Current source file | Identity and direction to retain |
| --- | --- | --- |
| REF-001 | `images/website/01-avela-arc-bag.png` | Avela / The Arc: leather atelier, oxblood bag, sunlit campaign photography, oversized SOFT FORM typography |
| REF-002 | `images/website/02-rill-and-rye-bakery.png` | Rill & Rye: orchard bakery, expressive serif, spacious split composition, morning bake and collection story |
| REF-003 | `images/website/03-room-and-ritual-interiors.png` | Room & Ritual: interior studio, rosette masthead, monumental wordmark, courtyard house and tactile materials |
| REF-004 | `images/website/04-oriel-spatial-practice.png` | Oriel: spatial practice, monumental lowercase lettering, rammed-earth architecture, belonging and gathering |
| REF-005 | `images/website/05-sundrop-aperitif.png` | Sundrop: apricot aperitif, tall display type, sunlight, glass and can still life, a slower afternoon ritual |
| REF-006 | `images/website/06-serein-botanical-care.png` | Serein: botanical skincare, refined editorial serif, copy / botanical macro / portrait composition |
| REF-007 | `images/components/07-sol-weather-clean.png` | Sol weather card: amber sun, frosted panel, temperature, units, city and day controls |
| REF-008 | `images/components/08-gather-team-clean.png` | Gather: dark cocoa team picker, tactile circular avatars, selection counts and collaborator rows |
| REF-009 | `images/components/09-courtyard-palette-clean.png` | Courtyard: porcelain material tray, five tactile swatches, selection and shuffle |
| REF-010 | `images/components/10-roam-membership-clean.png` | Roam: editorial membership panel, plan and billing choices, sculptural feature imagery |
| REF-011 | `images/components/11-kiln-usage-clean.png` | Kiln: compact usage dashboard, credits, period controls, charts, resources and plan management |
| REF-012 | `images/components/12-folio-navigation-dock.png` | Folio: ivory navigation dock, raised active capsule, four labeled destinations |
| REF-013 | `images/mobile/13-home-note-onboarding.png` | Home Note: family handover, layered cards, household tasks, warm character illustration and reassuring serif |
| REF-014 | `images/mobile/14-afterglow-bedtime.png` | Afterglow: evening rhythm, luminous negative space, translucent time picker and restrained warm blooms |
| REF-015 | `images/mobile/15-pocket-garden-waitlist.png` | Pocket Garden: botanical illustration, welcoming garden narrative and early-access entry point |
| REF-016 | `images/mobile/16-petal-puzzle.png` | Petal: editorial botanical puzzle, movable image strips, progress, hints and completion |
| REF-017 | `images/mobile/17-sol-forecast.png` | Sol forecast: pale blue and warm sun contrast, hourly chart, locations, units and golden-hour information |
| REF-018 | `images/mobile/18-daybook-daylight.png` | Daybook: daylight planning, italic editorial title, sun arc, schedule rows and quiet navigation |

There are currently **18 canonical concepts: six websites, six mobile apps, and six components**. Plan **five final images per concept: 90 images total**, with 30 in each category.

The four files under `images/components/earlier-versions/` document revisions of existing concepts. Analyze them for useful history, but do not count them as four additional products or replace the edited references with them. The 54 files under `images/colors/` provide palette, material, lighting, and texture references; they are not 54 additional five-image jobs. Standalone objects and geometric studies in the older archive may support the art direction, but are not additional deliverables in this task.

If the inventory has changed, report the difference and reconcile concept identities before recalculating the plan. Do not silently multiply jobs because a concept appears in more than one folder.

## 3. Carry forward the specific WDA art direction

Extract a concise style record for each concept from the source image and existing brief, and repeat its essential constraints in all five prompts for that concept.

- **Warmth must remain varied.** Preserve the project's Terracotta, Orchard, Rosette, Moss, Honey, Citron, Apricot, Burgundy, Cocoa, and Coral directions. These are authored color families, not ten additional generation variants per image. Do not flatten everything into beige, sepia, or a generic autumn palette.
- Retain each concept's own dominant surfaces, contrasting ink, accent relationships, and selective cool accents. Pale blue can support the warm composition where it already belongs. Read or sample actual colors; do not claim an exact source hex value or original design token without evidence.
- Preserve characteristic hierarchy, spacing, photographic crop, display typography, material quality, and density. Continue the visual language below the fold and across related pages instead of attaching unrelated template sections.
- Keep the selected fictional brand names, product stories, and recognizable content. Expand them with coherent, specific copy. “Clone” means use the selected generated design as the visual starting point; it does not mean invent a new brand for every screen or revert to the earlier third-party inspiration screenshot.
- Use natural photography and tactile detail: linen, paper, plaster, wood, stone, glaze, soft fabric, subtle grain, and precise light where relevant. Preserve natural skin, food, vegetation, product color, and architectural lighting. Avoid a uniform warm filter over everything.
- Preserve high-quality, restrained 3D where established: amber glass, satin warm surfaces, translucent cream, ceramic forms, soft shadows, and controlled highlights. Decorative objects support the interface; they must not obscure copy or controls.
- Keep individual components centered on clean white or off-white surroundings, without unnecessary room scenes, devices, or presentation props. Intentional imagery inside a component or app remains part of the design.
- Preserve each reference's typographic personality. Google Sans Flex belongs to the original moodboard shell and is not a mandatory replacement for every product's serif, condensed, heavy, italic, or humanist typography. Describe observed qualities when the exact typeface is unknown.
- Keep complete compositions upright, correctly proportioned, and legible. Avoid clipped text, missing controls, stretched photography, accidental ovals, and decorative UI that has no purpose.

The original moodboard phrase, **“Build me a warm landing page.”**, expresses the overall exploration; it is not the headline to paste onto every website or application.

## 4. Analyze and research each concept

For every canonical concept, first produce a short analysis containing:

1. Source path, reference ID, dimensions, category, product purpose, audience, and primary user task.
2. Observed layout, typography, palette, imagery, navigation, controls, and visible content.
3. What is established in the existing project brief or implementation.
4. What is missing and must be designed: below-the-fold sections, secondary pages, application destinations, header behavior, or component states.
5. A clear distinction between source observations, research evidence, and your proposed additions.

Then research appropriate real product patterns for that specific concept. Prefer relevant production websites, actual applications, and authoritative component or accessibility documentation. Cite the useful URLs, the date inspected, and the particular decision each source supports. Do not invent research, cite a source you have not inspected, or substitute generic design trends for product-specific evidence.

Use research to answer concrete questions:

- **Websites:** What must visitors learn or accomplish? Which sections belong below the fold, in what priority order, and why? Which three secondary pages are most necessary for the existing navigation, product story, and primary action?
- **Applications:** What are the four or more meaningful primary destinations? What belongs in the persistent application header and bottom navigation? Which detail or action flow completes the product's main task? If the reference is only onboarding or early access, how does it lead into a coherent application?
- **Components:** What controls and data does the component expose? What are its applicable default, selected, open, hover, focus, pressed, disabled, loading, empty, error, success, and other product-specific states? Which are actually necessary rather than checklist filler?

For website sections, deliver a ranked table with priority, section name, visitor need, intended content, layout treatment, action, and navigation anchor. Rank by the product's user journey and required information, not by an arbitrary number of sections. Write specific section copy and content requirements when constructing the final prompts; do not leave “add relevant sections” as an instruction for the image model to guess.

For application tabs and component states, provide similarly explicit destination and state tables before writing the five prompts.

## 5. Allocate exactly five final images per concept

### Websites: four complete pages plus one interaction variant

| Image | Required result |
| --- | --- |
| 01 | Complete main homepage, from header through all prioritized sections to the bottom of the footer |
| 02 | First researched secondary page, complete from header to footer |
| 03 | Second researched secondary page, complete from header to footer |
| 04 | Third researched secondary page, complete from header to footer |
| 05 | A meaningful interaction or conversion-state variant of one of those four pages, also shown as a complete page |

Choose the secondary pages and fifth image from the research and the actual brand's needs. Name them explicitly and explain the choice. The fifth image is a distinct state of an existing page, not permission to omit one of the three required secondary pages, repeat an unchanged screenshot, or deliver only a small detached modal.

Every website page must read like a real, full-page browser capture: one continuous vertical design, a consistent desktop content width, a complete header, substantial and purposeful below-the-fold content, and the complete footer. Do not deliver a hero-only image, a collage, a browser-window mockup, or tiny scattered page thumbnails. Page length follows the content, with enough vertical space for readable type and intentional pacing. The related pages must share the same brand system and feel like one website.

Map every visible header link, footer link, tab, selector, and primary or secondary action to an actual section anchor, one of the planned pages, or a defined interaction state. A same-page header link must have its corresponding section. A page link must have a corresponding destination. Define any necessary supporting states even when they are not separate final images.

### Mobile applications: at least four tabs plus a completing screen

| Image | Required result |
| --- | --- |
| 01 | First primary tab or destination, with its own complete content |
| 02 | Second primary tab or destination, with its own complete content |
| 03 | Third primary tab or destination, with its own complete content |
| 04 | Fourth primary tab or destination, with its own complete content |
| 05 | The most important detail, action, onboarding, or completion screen needed to connect the application flow |

Provide at least four meaningful primary tabs per app. If research calls for five primary tabs, image 05 may show the fifth tab; document supporting detail flows in the interaction plan. Do not use five differently highlighted navigation bars over the same unchanged content as five screens.

Specify the application header, title, contextual actions, back behavior, persistent bottom navigation, active tab treatment, safe areas, and scroll behavior. Show each screen at a consistent mobile width and scale, without a device mockup. Where content scrolls, distinguish fixed navigation from the scrolling region. Keep buttons, bottom actions, and tab labels visible and usable in the eventual implementation.

Maintain the original app's identity and purpose even when extending a single onboarding, waitlist, or feature screen into a fuller product. Propose the missing destinations deliberately and label them as extensions, not recovered screens that already existed.

### Components: default plus four distinct states

| Image | Required result |
| --- | --- |
| 01 | Complete default or initial component |
| 02–05 | Four distinct, prioritized interaction states or meaningful content configurations of that same component |

Select states according to the component's actual behavior. Preserve the same component anatomy, dimensions, materials, typography, and context across the set so the state changes are easy to understand. Do not turn a state change into a different product or an unrelated restyle.

Document **all applicable interactive states**, not only the five selected for images. Include trigger, prior state, resulting visual/data changes, keyboard or touch behavior, and return/reset behavior. Mark which image illustrates each state and which additional states will be derived from the documented style and behavior during React implementation. Five primary images are the generation budget, not a claim that an unillustrated state was rendered. If five images cannot communicate an essential visual behavior, flag the coverage gap explicitly in the prompt package instead of silently exceeding the count.

## 6. Build the Nano Banana 2 prompts

Before specifying generation parameters, verify the current official documentation for the provider Jetski will use. Record the exact Nano Banana 2 model identifier, reference-image/editing support, documented 1K setting, supported aspect ratios, and any relevant dimensions or reference limits. Do not guess an API endpoint, assume that “1K” means a square image, silently switch to another model, or claim arbitrary tall-image support.

Use the selected WDA image as the primary visual reference for each concept. Use a small, intentional selection from `images/colors/` as secondary references for color, light, texture, or material only. Assign a clear role to every reference so a color study is not mistakenly interpreted as a page layout. Reuse one consistent visual specification across all five prompts for a concept.

Each individual prompt must be ready for Jetski's downstream Nano Banana 2 run and include:

1. Stable concept/reference ID, output number 01–05, output name, category, and source image paths.
2. The image's role in the five-image sequence and its relationship to the other pages, tabs, or states.
3. Explicit reference roles and preservation rules: brand, story, typography, palette, materials, composition, and imagery.
4. The exact page, screen, or state being rendered, including ordered sections or content regions and their relative scale.
5. Final intended visible copy, navigation labels, headings, actions, representative data, and state-specific changes. Avoid lorem ipsum and vague filler. Keep new claims and demonstration data appropriate to the fictional product.
6. Canvas orientation, verified model settings, intended dimensions/aspect ratio, and the full-page or screen-capture framing requirement.
7. What must remain consistent across the set and what changes in this output.
8. Quality exclusions: no missing footer, cropped controls, illegible tiny type, duplicated labels, unrelated sections, watermarks, presentation props, or unintended contact-sheet layout.
9. A concrete acceptance checklist and a targeted revision instruction to use if a required region or state is wrong.
10. Output filename, model/provider record, and the image's mapped React route, tab, or component state.

**Long-page and 1K feasibility:** A very long website must remain legible; do not simply squeeze a desktop page into an unreadable 1K-long canvas. If a complete long page cannot fit within the provider's supported 1K output constraints, specify a documented section-by-section generation and vertical assembly plan. Each generated section uses the model's 1K setting, with consistent width, typography, grid, palette, and carefully matched boundaries. The assembled page may be taller than one native model output. Distinguish native generation dimensions from final assembled dimensions, and report this explicitly rather than calling the assembly a single native 1K image.

The five-image count refers to five final page/screen/state deliverables per concept. Separately count any section renders and model calls required for long-page assembly or revisions; do not hide additional calls inside the 90-image headline count. Include the assembly order and continuity checks in the plan. Preserve the supplied original images and write future outputs into new versioned locations.

## 7. Define how the images become interactive React

Images themselves are static. Alongside the generation prompts, specify the future React behavior so the finished designs can become real, long-form websites, applications, and stateful components.

- Rebuild text, navigation, tabs, buttons, forms, charts, selectors, and component surfaces as semantic React/HTML/CSS. Keep photography, illustration, texture, and decorative rendered artwork as appropriate assets. Do not treat an entire screenshot with invisible click targets as a finished interface.
- For websites, map header navigation to sections or routes, footer navigation to real destinations, and each CTA to a defined action or state. Include all sections shown in every full-page image in the future React page.
- For applications, make every bottom tab, application header action, back control, and screen action change the appropriate content or state. Define persistence across tabs and how scroll positions and selected values behave.
- For components, specify every applicable state transition and the visible result. Include keyboard focus, pointer and touch behavior, readable contrast, and appropriate target sizes. A hover-only effect is not sufficient for touch interaction.
- Describe wide and narrow layout behavior. Do not stretch a desktop screenshot into a mobile layout or let fixed navigation cover content.
- Keep the current project's demonstration scope: local state and illustrative data can support complete interactions without inventing working accounts, messaging, purchases, subscriptions, or backend integrations.

This stage defines the implementation contract; it does not ask you to implement React during prompt building.

## 8. Deliver the prompt package, then hand off generation

Create a clearly organized package, for example under `prompt-build/`, containing:

- An inventory of the canonical concepts, exact source paths, reference IDs, and the reconciled total.
- A shared WDA art-direction summary plus a concise style record for each concept.
- Research notes with inspected source links, findings, and the decisions they support.
- Ranked website section plans and page maps; application tab/header/flow plans; complete component state matrices.
- Exactly five individually usable Nano Banana 2 prompts for each canonical concept, identified 01–05. Do not stop at reusable templates with unresolved placeholders.
- A generation manifest mapping every prompt to its reference images, intended output, verified model settings, final-deliverable count, and any extra section-render requirements.
- A React interaction map connecting visible controls to sections, routes, tabs, state changes, and the corresponding reference images.
- A review checklist for fidelity, completeness, copy, cross-page consistency, full-page assembly, state coverage, and legibility.

For the current inventory, verify **18 concepts × 5 prompts = 90 final-image prompts**. Section subprompts, where required for long pages, must be explicitly linked to their parent final image and counted separately. Keep the four earlier component revisions and the color references out of the concept count.

End the prompt-building stage with the completed package, its location, coverage totals, any documented assumptions, and any unresolved model or layout constraints. Do not present proposed images as already generated or researched facts as observations from the source screenshots.

Nano Banana 2 generation is Jetski's next execution stage using this package; it is not performed by the author of this master instruction. Keep the handoff clear so generation uses the researched, complete prompts rather than improvising missing pages, tabs, or states at render time.

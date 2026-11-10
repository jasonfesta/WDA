# Capture and chat audit

Audited on 2026-11-10 for Jason Festa.

## Reconciled totals

| Milestone | Distinct examples | Images |
| --- | ---: | ---: |
| Earlier documented collection | 13 | 34 |
| At the start of this audit, after five additional dashboard pairs | 18 | 44 |
| Final collection after the owner changed the stopping point to 20 | 20 | 48 |

The final 48 images comprise 40 base screenshots and eight theme alternatives. All 20 folders contain desktop.jpg and mobile.jpg. There are 24 desktop images, 24 mobile images, and 11 source projects. No byte-identical image duplicates were found.

## What was audited

The available chat history was read in full: four returned turns, with no further pages indicated. Its research, browser actions, capture calls, and earlier count claims were reconciled against the saved files. The WDA image tree, former capture location, this chat’s visualization folder, and relevant temporary capture directories were checked for displaced files. No additional current SaaS captures were found in those locations.

The original screen grabs/app-examples folder had been moved into this collection; it was not a separate second collection. Older unrelated WDA reference assets were excluded. Raw chat history and unrelated local inventory are not included in this publication.

## Why the earlier count was confusing

- SYSTEMS.md was still reporting 13 examples / 34 images after five more pairs had been saved.
- The earlier capture plan listed only two image paths and was not a reliable inventory.
- Browser screenshots and repeated image previews were displayed during inspection without always becoming new saved assets.
- Recaptures reused the same filenames. MantiDash’s initial placeholder home view was replaced by its Kanban view.
- Four examples have both light and dark variants. These add eight images, not eight examples.
- The original discovery directory contained 46 public sources, while a separate GitHub search returned 129 candidate repositories. Neither number was a capture count.
- A later in-memory capture-log update omitted existing records. The final manifest was rebuilt by reconciling actual files, the pre-audit snapshot, current records, and saved page evidence.

## Corrections completed

- Restored the original public discovery directory to SYSTEMS.md, clearly separated from captured examples.
- Added individual source/type notes for all seven examples added after the original 13.
- Rebuilt captures.json with exactly one record per image, actual decoded dimensions, file sizes, source URLs, and SHA-256 hashes.
- Replaced four malformed 393 × 207 mobile exports for AdminLTE Operations, AdminLTE Store, Tabler Business, and Tabler Crypto. A similar first export for the newly added Tabler CRM was also replaced.
- Recaptured the issue tracker at the actual 393 × 852 mobile viewport rather than the page’s 562-pixel horizontal overflow width.
- Updated the stopping point to 20 examples and packaged the final collection under SaaS/.

## Remaining source and rendering limitations

| Example | Limitation |
| --- | --- |
| Shadcn Admin | Dark desktop Overview chart is blank. The light desktop variant includes the chart. |
| Shadcnblocks ecommerce | Some revenue charts are partially rendered. |
| Shadcnblocks payments | Large Payment Volume chart is blank; other interface content is visible. |
| Studio Admin | Light desktop activity chart is blank. Dark desktop includes the rendered chart. |
| VisActor | Dark desktop has a partial bar series relative to its light variant. |
| Liveblocks issue tracker | Native horizontal overflow persists on mobile; the screenshot preserves the actual screen width. |
| Liveblocks AI Chats | Native mobile layout leaves a narrow chat area beside the sidebar. |
| MantiDash | Kanban columns extend beyond the visible horizontal viewport. |

Chart recaptures were attempted, but the limitations above remain. They are recorded rather than presented as repaired. No screenshot pixels, CSS, or demo content were edited to manufacture a successful render.

Earlier screenshots use full-page capture, while repaired/new screenshots use the full initial viewport. Every image’s actual dimensions and mode are recorded. This preserves both the existing full-page references and the requested full-screen desktop/mobile examples; the set is not uniformly full-page.

## Scope at the stopping point

Plane, Twenty, Docmost, and DevDojo Wave were researched but did not yield saved authenticated app views. The top-15 repository shortlist is documented, but only AdminLTE, Tabler, and Shadcn Admin from that shortlist have saved captures. The 20-example stop supersedes the earlier 40-example target and further discovery.

Backend behavior, account creation, payments, and AI responses were not tested. Template scope and inferred application uses are documented individually.

Existing image files replaced during audit: 14. Replacements do not increase the example or image totals.

# Rebuild reference

This package specifies the six designs and their behavior. Use the final PNGs for visual comparison, the matching editable SVGs for exact geometry, the state JSON for fixture values, and the interaction guides for behavior. SVGs are artwork sources; their static accessibility labels do not substitute for the semantic structure specified in the guides.

## Source of truth

1. Each study README lists every rendered state and its PNG, SVG and data file.
2. `INTERACTIONS.md` and `INTERACTIONS.html` contain the same full guide, including the final audit clarifications. `interactions.json` holds the corresponding structured requirements.
3. `design-reference.json` records native frame dimensions, typography, colours, corner radii and text measurements extracted from every final SVG. Positions and baseline coordinates use native CSS-pixel units. The SVG remains the precise source for paths, layout, borders, fills and clipping.
4. `shared-assets/` contains both generated accents, all 20 icons and all 10 material samples. Decorative images are embedded in the full-state SVGs as well.
5. `manifest.json` enumerates the 93 rendered states. `checksums.sha256` verifies every delivered file except the checksum file itself.

## Visual foundations

| Property | Existing specification |
| --- | --- |
| Typeface | Arial, Helvetica, sans-serif; tabular numerals |
| Text / muted text | `#292522` / `#756F68` |
| Card background / divider | `#FFFFFF` / `#E6E1DB` |
| Selected tint / action colour | `#FAF0E9` / `#653D41` |
| Weather selection accent | `#DF775C` |
| Outer corner / border | 12 px / 1 px |
| Common action corner | 7 px; use exact per-state SVG values for other shapes |
| Main content inset | 24 px in Sol, Courtyard, Roam and Kiln; Gather and Folio use their own measured insets |
| Icon path system | 24-unit paths, round caps and joins; exact displayed size and stroke are in each SVG |
| Focus | Independent 2 px outline, 2 px offset; selection remains visible |
| Export scale | PNG width and height are exactly 2× the native SVG dimensions |

Arial/Helvetica are system font references; no font binary is bundled. PNGs freeze the approved rendering. Editable text may render slightly differently on a machine with different fonts; keep the specified family and sizes, and compare against PNGs. Do not shrink text or scale the entire design to make a narrow layout fit. The small generated accents remain decorative and do not acquire interaction states.

| Study | Native frame |
| --- | --- |
| Sol | 440 × 344 |
| Gather | 400 × 484 open; 400 × 58 closed |
| Courtyard | 640 × 304 |
| Roam | 400 × 544 |
| Kiln | 640 × 508 |
| Folio | 560 × 96; 560 × 174 with host status/content strip |

## Responsive and input requirements

The native frames define the supplied images, not fixed production heights. At narrower widths allow content-driven height, reflow text and preserve action order. Retain 16 px viewport clearance for floating panels and dialogs; cap their height to the available viewport and scroll their content. Keep close, recovery and primary actions reachable. Long content must not cover adjacent actions or disappear behind a fixed dock.

Sol keeps four equal day columns and a bounded location panel. Gather keeps its search and footer visible while a long people list scrolls. Courtyard wraps tiles in their original order with full names. Roam keeps three tabs in fixed order and a full-width main action. Kiln stacks its summary/resources while keeping the activity table headings aligned with their values. Folio keeps four equal labelled destinations and reserves the safe-area/content space when fixed.

Use at least 44 × 44 px non-overlapping targets for coarse-pointer use. Where a source control is smaller, reserve sufficient layout space for its target instead of overlapping its neighbour or shrinking its label. Preserve zoom, text selection and keyboard access. Validate 320 px and 390 px widths, short viewports, long names, enlarged text and reduced motion when implementing; narrow versions are specified in prose and are not additional rendered exports.

State styling combines rather than replaces independent properties: selection/current stays visible during hover and focus; a focus outline never selects; pending blocks only the documented actions; error adds a persistent message and recovery action. Keep an already focused pending action present with aria-disabled and suppress activation. Reduced motion applies final feedback immediately. Full timings and keyboard contracts are in every guide.

## Data and integration requirements

The JSON values are fictional fixture inputs. Preserve stable IDs separately from labels, represent unknown values distinctly from zero, and commit related labels and numbers atomically. Directory order, plan order, material order and navigation order must stay stable unless an explicitly specified action replaces the set.

| Study | Host responsibilities |
| --- | --- |
| Sol | Location query and forecast data, request IDs, cancellation, freshness and canonical Celsius values |
| Gather | Resolved people directory, acknowledged selection set, revisioned/idempotent writes and uncertain-write reconciliation |
| Courtyard | Valid editable object, material selection callback, replacement palettes and clipboard result |
| Roam | Valid plan records, checkout sessions, stable attempt IDs, verified activation/status reconciliation, account/authentication destinations |
| Kiln | Period usage and independent resources, validated arithmetic, plan details and authenticated billing destination |
| Folio | Real route hrefs, routing/history, destination content and authentication return route |

No live service credentials, API endpoints or application-specific backend schema are implied by the fixtures. The integration must bind these responsibilities to its own services. Success is based on acknowledged results; error, cancellation and uncertain outcomes follow the final guide clarifications. The host owns full destination pages and external checkout/authentication screens.

[Coverage and final audit](AUDIT.md) · [All studies](README.md)

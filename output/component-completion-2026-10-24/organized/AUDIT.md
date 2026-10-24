# Final design and handoff audit

24 October 2026 · Documentation revision 3.2

The six study folders contain all 93 defined visual states, 93 matching editable SVGs, six full interaction guides and contracts for all 41 control groups. Each rendered state has an entry, exit and focus rule. Each control has semantics, pointer, hover, press/touch, keyboard, pending/disabled, result, dismissal and announcement requirements.

## Coverage

| Study | Images | Controls | Rendered coverage | Additional behavior specified in writing |
| --- | ---: | ---: | --- | --- |
| Sol | 20 | 8 | Four days in both units, initial/loading/error, cached refresh/error, location empty/searching/results/no-match/loading/error/success, focus | Hover/press/disabled combinations, query-service retry, invalid data and stale responses |
| Gather | 16 | 6 | Open selection counts and alternate identities, closed counts 0–4, save pending/error, search match/no-match, focus | All identity permutations, disabled Clear, rapid queued edits, closed save outcomes, uncertain-write reconciliation, valid empty directory |
| Courtyard | 17 | 5 | Five original and five shuffled selections, two Undo outcomes, loading/error, copied/copy failure, focus | Hover/press/disabled combinations, clipboard pending and stale results, malformed palette responses, snapshot persistence |
| Roam | 15 | 9 | Three plans, three reviews, three confirmations, pending/error checkout, cancellation, sign-in/account error, focus | Pending/error for each plan, unknown checkout reconciliation, repeated handoffs, malformed plan records, host authentication outcomes |
| Kiln | 15 | 8 | Three periods, four activity details, range loading/error/missing, zero/near-limit, plan management/loading/error | Focus/hover/press/disabled combinations, exactly-full/over-limit, invalid arithmetic, partial resource absence, concurrent detail snapshots, settings handoff |
| Folio | 10 | 5 | Four current routes, separate focus and hover, pending/error navigation, empty Saved, signed-out Profile | Press/repeated navigation, cancellation by current route, stale routes, history restoration, host auth pending/error/return |

The 93 files are the rendered visual set. Documented combinations and exceptional branches are not represented as additional image exports. Host-owned authentication, checkout and full destination pages require the host integration specified in REBUILD.md.

## Changes made in this pass

- Grouped final images, vectors, state data and full guides together by study.
- Added reusable accents, material samples and icons; extracted exact measurements and typography from all 93 SVGs.
- Clarified uncertain selection writes, stale clipboard feedback, checkout reconciliation, invalid data, exact/over-limit usage, dialog snapshots and route cancellation.
- Defined the relationship between rendered states and behavior specified only in text.

## Verification

- All 93 PNG/SVG pairs match their original final export bytes; PNG dimensions are exactly 2× the corresponding native frame.
- Every state in the package is mapped to its interaction contract; no missing or duplicate state IDs.
- All 41 control groups have all nine required interaction fields.
- Full-state SVG image references are embedded or local fragment references; no remote artwork dependency.
- Existing overview and targeted search, save-error, checkout/account and billing contact sheets were visually reviewed in this pass. Earlier text-bounds checks cover the complete 93-state export set. This pass did not run a live component or certify implementation accessibility.
- Package-relative documentation links and every listed file are checked before publishing. `audit.json` records the checks and `checksums.sha256` records file hashes.

[Rebuild reference](REBUILD.md) · [All studies](README.md)

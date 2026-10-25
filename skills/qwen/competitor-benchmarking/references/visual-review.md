# Round 2 — visual review

Reviewed 21 October 2026. Five final long images, original heroes, first-pass images, exact prompts and interaction documents are retained. This is an art-direction and interaction-specification handoff, not a production website.

## Results

| Site | Improvement checked | Remaining implementation detail |
| --- | --- | --- |
| Avela | Unboxed products, larger craft scene, offset community imagery, complete care/signup/footer | Rebuild small navigation and packaging copy as real text; craft/journal links are consolidated in the raster |
| Room & Ritual | Unequal home images, larger tour, materials within story, simple process, complete close | Some lower compositions remain tighter than the documented CSS spacing; implement the chapter gaps from the MD |
| Oriel | Offset project index, restored correct Willow Hall image, one material still life, longer ivory pauses | Keep lower practice/inquiry modules at the documented 192–240 px chapter spacing in React; plans are conceptual, not construction drawings |
| Sundrop | Single selected pack, consistent 4/8/12 options and prices, consolidated flavor and serving scenes | Small can labels need exact approved artwork; 200 ml and 8% ALC/VOL are the authoritative product values |
| Serein | Original bottle inset and blue ritual strip restored, floating products, one active routine portrait, help rows included | Dew Cleanser's generated bottle micro-label reads 50 ml while its caption says 150 ml; 150 ml is the specified concept value. Replace packaging artwork before implementation |

## Corrections made

Oriel’s first round-two candidate mistakenly used a riverside house for Willow Hall. The corrected version uses the approved earth/oak/oval-opening architecture, keeps River Rooms distinct, and removes the false location label. Serein’s first candidate omitted the hero bottle inset and ritual strip; both were restored. Earlier candidates remain in images with before-correction filenames for traceability and are not used in the gallery default.

## Scope of fidelity

All five have complete page bottoms and newsletters/footers. Brand palette, typography direction, product/architectural motifs and hero composition were reviewed visually. Native sizes are recorded per image in manifest.json, approximately 724 × 2170. No upscaling or compositing was performed. The images are not 5K and not pixel-identical restorations of approved headers. Exact original headers are retained separately and should be used in implementation.

The generated images represent default static states, not hover/scroll animations. Precise spacing, state transitions, route behavior, reduced motion, touch and keyboard requirements live in the Markdown documents. Some minor journal/community links are visually consolidated; the full 50-tout register remains the content contract. Product prices, additional products and project stories are concepts rather than verified business data.

## Verification

PNG signatures/dimensions and source hashes are checked in the package audit. The gallery's comparison and inspection controls are checked in the browser. This does not claim that the future five-site React build or its interaction acceptance criteria have been implemented or tested.


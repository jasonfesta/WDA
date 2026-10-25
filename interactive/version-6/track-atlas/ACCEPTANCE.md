# Acceptance

**Two separate gates: review the concept now; validate behavior only after a future implementation is explicitly approved.**

## Current package acceptance

The package contains a linked specification set, a current watercolor art direction, three desktop studies, three portrait studies and a shared control sheet. The review gallery loads all seven images and opens full-size previews. These checks have been performed. This selected package contains the current watercolor images and their manifest.

The art must communicate three distinct modes within one product. Reviewers should recognize the same track, compact type treatment, lower transport and palette across the set. They should also distinguish landscape, typographic poster and personal memory sequence without relying solely on mode labels. Current images are flattened studies, so production typography, interactive hit areas and motion quality are not accepted by this visual review alone.

## Future behavioral acceptance scenarios

| Scenario | Required evidence |
| --- | --- |
| Switch mode during playback | Position, loop and playback continue; no duplicate audio |
| Return to an edited mode | Its composition and notes remain intact |
| Seek repeatedly to the same moment | Deterministic visual output for the same saved state |
| Loop a passage | Audio and visible playhead agree at both boundaries |
| Drag a visual phrase | Artwork changes; the recording is not silently rearranged |
| Correct a tempo estimate | Label and mappings update without deleting personal edits |
| Save a still | File matches the requested mode, time and composition |
| Reopen without source audio | Artwork opens; reconnect guidance accurately describes the limitation |
| Load an unsupported source | Recoverable error; previous good session survives |

These are proposed acceptance tests. None has passed merely because it appears in the art.

## Human evaluation

Ask first-time participants to start the demo, change one visual relationship, switch modes and save a frame. Observe whether they can identify the contribution of the music and their own edit. Ask them what “lift” means: they should understand it as an optional personal annotation, not a detected psychological state. Include a person who wants to listen with minimal movement and someone using only keyboard controls.

For audio specificity, compare three contrasting passages with fixed visual settings. Reviewers should see a meaningful, explainable relationship without every element reacting constantly. A random-looking composition, a misleading emotion label or a mode change that loses work blocks acceptance even if the scene is beautiful.

## Accessibility and resilience

Verify focus order, visible focus, text contrast, keyboard alternatives for dragging, named transport actions and non-color state cues. At portrait widths, controls remain reachable and artwork recomposes without clipping essential labels. Reduced-motion mode preserves all creation tasks while removing decorative continuous movement. The preference is informed by [W3C animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), not evidence of compliance by itself.

Test device interruption, background/resume behavior, slow decoding and memory pressure on named browsers and hardware. Record measured performance beside its conditions. Do not replace those results with a blanket “works on mobile” statement.

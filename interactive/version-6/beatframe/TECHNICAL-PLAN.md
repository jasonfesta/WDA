# Technical plan — future reference only

**Current scope is art and specification. This document does not authorize development.** Magdalena Bay V2 establishes a visual target; no playable prototype is included. The stills are not evidence of working 3D rendering, artist playback, touch accuracy or frame rate.

## Timing and state

A later build should separate transport, chart judgment, input and presentation. A session model would hold recording identity, chart identity, difficulty, transport position, timing offset, score, combo and judgments. Scene cues reference musical positions but cannot modify them. A failed background asset should leave the chart legible; unavailable audio should prevent false progress.

The [Web Audio specification](https://webaudio.github.io/web-audio-api/) describes an audio graph and timing interfaces; its current editor's draft is work in progress. The proposed approach would use an audio-derived clock for both note positions and judgments rather than accumulated animation-frame time. Pause and resume need one saved transport position and an explicit countdown policy. These are planning choices, not tested artist-specific behavior.

## Chart and input

Authored notes would contain time, lane, optional hold duration and phrase membership. Initial difficulty should favor single taps. The art's ribbon is a proposed hold treatment, not a promise that holds belong in the first scope. Judgment should consume each note once and distinguish missed scheduled notes from extra taps.

Keyboard and touch would normalize into lane events. [Pointer Events Level 3](https://www.w3.org/TR/pointerevents3/) defines hardware-agnostic pointer input. A later implementation must handle concurrent contacts, cancellation and focus changes. Target geometry should remain independent of the visible chrome rim, highlight or glow. Decorative parallax cannot move the logical hit zones.

## Visual architecture

The dreamscape could use layered raster artwork, rendered 3D, or a hybrid. Select that approach after measuring the intended devices and motion needs. A full 3D scene is not required merely because the concept looks three-dimensional. Keep the runway, notes, targets and readable controls independent from the background presentation.

Peripheral portal deformation, winged-eye motion and atmosphere should be separate effects with reduced-motion alternatives. A low-detail mode could reduce reflections and scenery while retaining note contrast and timing. Both formats must share centered gameplay constraints even when their environmental layouts differ.

## Validation before any build claim

Agree recording access, chart ownership, target devices and timing tolerances before implementation. Then test sustained clock alignment, repeated pauses, simultaneous touch, interruptions, asset failures and orientation changes. Review keyboard access and readable controls against [WCAG 2.2](https://www.w3.org/TR/WCAG22/) without claiming conformance from concept art. Performance budgets and touch dimensions remain measurements to establish, not facts inferred from these PNGs.

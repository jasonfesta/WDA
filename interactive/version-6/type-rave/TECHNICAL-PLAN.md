# Technical plan — future design reference

**No implementation is included or authorized by this document.** The purpose is to connect the graphic concept to plausible systems and expose decisions before development.

## Typography as a stable subsystem

A future renderer should separate text layout from motion. The project model would store phrase, font identifier, manual line breaks, palette, behavior, layout transform, intensity, mapping choices, seed, and frozen state. A behavior should animate a stable arrangement rather than recompute unrelated line breaks on every frame.

The initial scope should declare supported scripts and phrase length. Font loading must complete before measurement and export. A fallback font should not silently alter a saved composition while claiming exact reproduction. Glyph shaping, punctuation, and accented text need explicit review. A signed-distance-field or cached-glyph approach is one candidate, not an approved dependency choice.

## Input and motion mappings

Use a small set of normalized inputs: audio energy, selected frequency bands, pointer position, and a deliberate trigger. Each mapping should specify range, smoothing, and clamp behavior. Breathe, Stack, and Elastic should share transport but maintain different composition rules. Intensity zero must produce a stable result.

The [Web Audio specification](https://webaudio.github.io/web-audio-api/) is the primary reference for a potential analysis graph. Audio-derived values would still require a designed mapping layer; they do not automatically identify musical meaning. Beat or onset estimates should be labeled as heuristic if used. No emotion inference or automatic lyric transcription is proposed.

## Microphone and lifecycle

A future microphone mode would use an explicit enable action and a visible live state. The [Media Capture and Streams specification](https://www.w3.org/TR/mediacapture-streams/) defines the relevant capture interfaces; the linked document is a draft reference. The planned signal path should analyze input without sending it to speakers by default. Stopping the mode should stop capture, not merely hide its indicator.

The renderer should pause unnecessary work when hidden, handle resize without losing the phrase, and release audio and graphical resources on exit. The browser version and intended devices should guide performance budgets later. No frame-rate claim follows from this concept.

## Freeze and output

Freeze should capture deterministic composition state. Still export should use an explicit output size and the same loaded font. A project file can preserve parameters, but exact replay of unsaved live microphone input cannot be promised. Motion-loop export remains outside the initial scope.

A later technical trial would first prove static type quality and exact freeze/export, then one motion behavior, then audio and optional capture. That sequence is a planning recommendation only and requires separate authorization to develop.

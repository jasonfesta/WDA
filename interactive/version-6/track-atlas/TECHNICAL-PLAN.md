# Technical plan

**Planning only. No renderer, audio engine, analysis pipeline or application code is included or commissioned by this document.**

## Proposed structure

Separate the eventual product into a source layer, transport clock, feature analysis, creative mapping, scene composition, accessible controls and export. The audio clock owns time; the visuals read it. Mode switching selects a different interpretation of the same session rather than creating another player. A dropped visual frame must not move the audio playhead.

The browser's Web Audio platform is a candidate for audio processing and playback. Its analyser facilities expose time-domain and frequency-domain information; they do not supply a finished Track Atlas interpretation. Browser support and the chosen operations need verification during a separately approved feasibility phase. [W3C Web Audio specification](https://www.w3.org/TR/webaudio/).

## Analysis and interpretation

Keep four explicit layers in the data model:

1. **Source facts:** duration, decoded sample rate and available file metadata.
2. **Computed features:** windowed amplitude and chosen frequency-band measures, with documented units and normalization.
3. **Estimates:** candidate onsets, tempo or phrase boundaries, including uncertainty and a way to correct or ignore them.
4. **Authored meaning:** the listener's notes, selected moods, visual placement and palette choices.

An amplitude envelope could influence pigment density; low-band energy could affect current width; onset candidates could suggest ink marks. These are proposed creative mappings, not universal properties of sound. A “brighter” spectral measure must not be described as happiness. Silence, noisy recordings and irregular rhythms require stable fallbacks rather than confident but false BPM labels.

Precompute a compact feature timeline where practical, and use deterministic composition seeds. The same timestamp, mode and edits should reproduce the same still. Real-time movement can interpolate between authored states. Rendering must not require regenerating AI images per frame: the production strategy would use prepared painted elements and restrained compositing or shader treatments.

## Storage and export

Prefer local processing for selected audio. The initial concept requires no account or audio upload. Store a lightweight composition record, with explicit reconnect behavior when a source file is missing. Never assume a saved path remains readable across devices or browser sessions. Export should use a defined output frame independent of the visible UI and preserve the selected timestamp.

## Feasibility questions and gates

First evaluate a single mode with one real track and a few documented mappings. Compare quiet, percussive and sustained passages. Next evaluate whether the production watercolor assets remain convincing when moved. Only then assess all three modes, local-file handling and export.

Proposed targets are smooth 60 fps desktop rendering and a stable 30 fps mobile fallback, subject to named test hardware. Reduce decorative detail before degrading audio timing or control responsiveness. Memory limits, maximum track duration, supported file formats and export sizes remain open engineering decisions. Measure them before publishing compatibility promises. The concept package records these risks; it does not resolve them through an untested technology label.
